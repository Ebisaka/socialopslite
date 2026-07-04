import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;
  const user = auth.user;
  const accounts = await prisma.socialAccount.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      platform: true,
      platformAccountId: true,
      displayName: true,
      status: true,
      scopes: true,
      favorite: true,
      groupName: true,
      sortOrder: true,
      tokenExpiresAt: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return NextResponse.json({ accounts });
}
