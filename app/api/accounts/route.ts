import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await ensureDemoUser();
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
