import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;
  const user = auth.user;

  const tasks = await prisma.publishTask.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      socialAccount: {
        select: {
          id: true,
          platform: true,
          displayName: true,
          platformAccountId: true
        }
      }
    }
  });

  return NextResponse.json({ tasks });
}
