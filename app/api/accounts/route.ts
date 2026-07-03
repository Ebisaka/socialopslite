import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDemoUser } from "@/lib/demo-user";

export async function GET() {
  const user = await ensureDemoUser();
  const accounts = await prisma.socialAccount.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });
  return NextResponse.json({ accounts });
}
