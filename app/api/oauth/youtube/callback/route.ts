import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";
import { requiredEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = request.cookies.get("youtube_oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.json({ error: "OAuth 驗證失敗，請重新連線 YouTube。" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: requiredEnv("GOOGLE_CLIENT_ID"),
      client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
      redirect_uri: new URL("/api/oauth/youtube/callback", request.url).toString(),
      grant_type: "authorization_code"
    })
  });

  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text();
    return NextResponse.json({ error: "Google token 交換失敗。", detail }, { status: 502 });
  }

  const token = await tokenResponse.json() as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  };

  const channelResponse = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
    headers: { authorization: `Bearer ${token.access_token}` },
    cache: "no-store"
  });

  if (!channelResponse.ok) {
    const detail = await channelResponse.text();
    return NextResponse.json({ error: "YouTube 頻道資料讀取失敗。", detail }, { status: 502 });
  }

  const channelData = await channelResponse.json() as {
    items?: Array<{ id: string; snippet?: { title?: string } }>;
  };
  const channel = channelData.items?.[0];

  if (!channel) {
    return NextResponse.json({ error: "找不到可連線的 YouTube 頻道。" }, { status: 404 });
  }

  const expiresAt = token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : null;
  const scopes = token.scope ? token.scope.split(" ") : [];

  await prisma.socialAccount.upsert({
    where: {
      userId_platform_platformAccountId: {
        userId: user.id,
        platform: "youtube",
        platformAccountId: channel.id
      }
    },
    update: {
      displayName: channel.snippet?.title ?? "YouTube",
      status: "authorized",
      scopes,
      accessTokenEncrypted: encrypt(token.access_token),
      refreshTokenEncrypted: token.refresh_token ? encrypt(token.refresh_token) : undefined,
      tokenExpiresAt: expiresAt
    },
    create: {
      userId: user.id,
      platform: "youtube",
      platformAccountId: channel.id,
      displayName: channel.snippet?.title ?? "YouTube",
      status: "authorized",
      scopes,
      accessTokenEncrypted: encrypt(token.access_token),
      refreshTokenEncrypted: token.refresh_token ? encrypt(token.refresh_token) : null,
      tokenExpiresAt: expiresAt
    }
  });

  const response = NextResponse.redirect(new URL("/accounts", request.url));
  response.cookies.delete("youtube_oauth_state");
  return response;
}
