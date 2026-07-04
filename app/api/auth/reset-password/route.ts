import { NextResponse } from "next/server";
import { createUserSession, hashPassword, hashToken, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as null | { token?: string; password?: string };
  const token = body?.token || "";
  const password = body?.password || "";

  if (!token) {
    return NextResponse.json({ error: "重設連結無效，請重新申請。" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "密碼至少需要 8 個字元。" }, { status: 400 });
  }

  const reset = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, email: true } } }
  });

  if (!reset || reset.usedAt || reset.expiresAt <= new Date()) {
    return NextResponse.json({ error: "重設連結已失效，請重新申請。" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash: hashPassword(password) }
    }),
    prisma.passwordResetToken.update({
      where: { id: reset.id },
      data: { usedAt: new Date() }
    }),
    prisma.userSession.deleteMany({
      where: { userId: reset.userId }
    })
  ]);

  const session = await createUserSession(reset.userId);
  const response = NextResponse.json({ user: reset.user });
  setSessionCookie(response, session.token, session.expiresAt);
  return response;
}
