import { NextResponse } from "next/server";
import { createUserSession, hashPassword, normalizeEmail, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as null | { email?: string; password?: string };
  const email = normalizeEmail(body?.email || "");
  const password = body?.password || "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "請輸入有效的 Email。" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "密碼至少需要 8 個字元。" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) {
    return NextResponse.json({ error: "這個 Email 已經註冊，可以直接登入。" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: { email, passwordHash: hashPassword(password) },
    select: { id: true, email: true }
  });
  const session = await createUserSession(user.id);
  const response = NextResponse.json({ user });
  setSessionCookie(response, session.token, session.expiresAt);
  return response;
}
