import { NextResponse } from "next/server";
import { clearSessionCookie, requireApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;

  await prisma.userSession.deleteMany({
    where: { userId: auth.user.id }
  });

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
