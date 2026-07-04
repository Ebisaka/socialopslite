import { NextResponse } from "next/server";

const cookieName = "socialops_admin";

export async function POST(request: Request) {
  const form = await request.formData();
  const key = String(form.get("key") || "");
  const expected = process.env.ADMIN_ACCESS_KEY || "";

  if (!expected || key !== expected) {
    return NextResponse.redirect(new URL("/admin?error=1", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(cookieName, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return response;
}

export async function DELETE(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.delete(cookieName);
  return response;
}
