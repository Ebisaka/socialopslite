import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { hashToken, normalizeEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const RESET_MINUTES = 30;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as null | { email?: string };
  const email = normalizeEmail(body?.email || "");
  const message = "如果這個 Email 已註冊，我們會提供重設密碼的下一步。";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ message });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });

  if (!user) {
    return NextResponse.json({ message });
  }

  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() }
  });

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + RESET_MINUTES * 60 * 1000);
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt
    }
  });

  const resetUrl = new URL("/reset-password", request.url);
  resetUrl.searchParams.set("token", token);

  return NextResponse.json({
    message,
    resetUrl: process.env.SEND_PASSWORD_RESET_EMAIL === "true" ? undefined : resetUrl.toString()
  });
}
