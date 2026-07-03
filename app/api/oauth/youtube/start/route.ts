import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { requiredEnv } from "@/lib/env";

const scopes = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.force-ssl"
];

export async function GET() {
  const clientId = requiredEnv("GOOGLE_CLIENT_ID");
  const redirectUri = requiredEnv("GOOGLE_REDIRECT_URI");
  const state = randomBytes(24).toString("hex");

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.cookies.set("youtube_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60
  });
  return response;
}
