import { NextResponse } from "next/server";
import { createUserSession, normalizeEmail, setSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as null | { email?: string; password?: string };
  const email = normalizeEmail(body?.email || "");
  const password = body?.password || "";

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true }
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Email 或密碼不正確。" }, { status: 401 });
  }

  const session = await createUserSession(user.id);
  const response = NextResponse.json({ user: { id: user.id, email: user.email } });
  setSessionCookie(response, session.token, session.expiresAt);
  return response;
}
