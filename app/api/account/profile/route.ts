import { NextResponse } from "next/server";
import { hashPassword, requireApiUser, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;
  const user = auth.user;

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    }
  });
}

export async function PATCH(request: Request) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;
  const user = auth.user;

  const body = await request.json().catch(() => null) as null | {
    currentPassword?: string;
    newPassword?: string;
  };
  const currentPassword = body?.currentPassword || "";
  const newPassword = body?.newPassword || "";

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "新密碼至少需要 8 個字元。" }, { status: 400 });
  }

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, passwordHash: true }
  });

  if (record?.passwordHash && !verifyPassword(currentPassword, record.passwordHash)) {
    return NextResponse.json({ error: "目前密碼不正確。" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashPassword(newPassword) }
  });

  return NextResponse.json({ ok: true });
}
