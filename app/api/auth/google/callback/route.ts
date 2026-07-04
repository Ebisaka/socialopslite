import { NextRequest, NextResponse } from "next/server";
import { createUserSession, normalizeEmail, setSessionCookie } from "@/lib/auth";
import { requiredEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type GoogleUserInfo = {
  email?: string;
  email_verified?: boolean;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = request.cookies.get("socialops_google_auth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.json({ error: "Google 登入驗證失敗，請重新登入。" }, { status: 400 });
  }

  const redirectUri = new URL("/api/auth/google/callback", request.url).toString();
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: requiredEnv("GOOGLE_CLIENT_ID"),
      client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    })
  });

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: "Google 登入 token 交換失敗。" }, { status: 502 });
  }

  const token = await tokenResponse.json() as { access_token?: string };
  if (!token.access_token) {
    return NextResponse.json({ error: "Google 登入未回傳 access token。" }, { status: 502 });
  }

  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
    cache: "no-store"
  });

  if (!profileResponse.ok) {
    return NextResponse.json({ error: "Google 帳戶資料讀取失敗。" }, { status: 502 });
  }

  const profile = await profileResponse.json() as GoogleUserInfo;
  const email = normalizeEmail(profile.email || "");
  if (!email || profile.email_verified === false) {
    return NextResponse.json({ error: "Google Email 尚未驗證，無法登入。" }, { status: 403 });
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
    select: { id: true, email: true }
  });
  const session = await createUserSession(user.id);
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete("socialops_google_auth_state");
  setSessionCookie(response, session.token, session.expiresAt);
  return response;
}
