import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      category?: string;
      page?: string;
      message?: string;
      email?: string;
    };
    const message = String(body.message || "").trim();
    if (!message) {
      return NextResponse.json({ error: "請輸入問題內容。" }, { status: 400 });
    }

    const user = await getCurrentUser();
    const report = await prisma.issueReport.create({
      data: {
        userId: user?.id,
        email: body.email ? String(body.email).slice(0, 160) : user?.email,
        category: body.category ? String(body.category).slice(0, 80) : "general",
        page: body.page ? String(body.page).slice(0, 240) : "",
        message: message.slice(0, 2000)
      },
      select: { id: true, createdAt: true }
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Issue report failed", error);
    return NextResponse.json({ error: "問題回報送出失敗。" }, { status: 500 });
  }
}
