import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = {
  params: { id: string };
};

function cleanGroupName(value: unknown) {
  if (typeof value !== "string") return undefined;
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20)
    .join(", ");
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;
  const user = auth.user;
  const body = await request.json().catch(() => null) as null | {
    favorite?: unknown;
    groupName?: unknown;
    sortOrder?: unknown;
  };

  if (!body) {
    return NextResponse.json({ error: "請提供要更新的帳戶資料。" }, { status: 400 });
  }

  const data: { favorite?: boolean; groupName?: string; sortOrder?: number } = {};
  if (typeof body.favorite === "boolean") data.favorite = body.favorite;
  const groupName = cleanGroupName(body.groupName);
  if (groupName !== undefined) data.groupName = groupName;
  if (typeof body.sortOrder === "number" && Number.isInteger(body.sortOrder)) data.sortOrder = body.sortOrder;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "沒有可更新的欄位。" }, { status: 400 });
  }

  const account = await prisma.socialAccount.findFirst({
    where: { id: params.id, userId: user.id },
    select: { id: true }
  });

  if (!account) {
    return NextResponse.json({ error: "找不到帳戶。" }, { status: 404 });
  }

  const updated = await prisma.socialAccount.update({
    where: { id: params.id },
    data,
    select: {
      id: true,
      platform: true,
      platformAccountId: true,
      displayName: true,
      status: true,
      favorite: true,
      groupName: true,
      sortOrder: true,
      tokenExpiresAt: true,
      updatedAt: true
    }
  });

  return NextResponse.json({ account: updated });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;
  const user = auth.user;
  const account = await prisma.socialAccount.findFirst({
    where: { id: params.id, userId: user.id },
    select: { id: true }
  });

  if (!account) {
    return NextResponse.json({ error: "找不到帳戶。" }, { status: 404 });
  }

  await prisma.socialAccount.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
