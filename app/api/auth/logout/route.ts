import { NextResponse } from "next/server";
import { destroyCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  await destroyCurrentSession(response);
  return response;
}
