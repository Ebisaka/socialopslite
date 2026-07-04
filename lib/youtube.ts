import type { SocialAccount } from "@prisma/client";
import { decrypt, encrypt } from "./crypto";
import { requiredEnv } from "./env";
import { prisma } from "./prisma";

export const YOUTUBE_UPLOAD_SCOPE = "https://www.googleapis.com/auth/youtube.upload";

export function hasYoutubeUploadScope(account: Pick<SocialAccount, "scopes">) {
  return account.scopes.includes(YOUTUBE_UPLOAD_SCOPE);
}

export async function ensureYoutubeAccessToken(account: SocialAccount) {
  if (!account.refreshTokenEncrypted) return account;

  const expiresAt = account.tokenExpiresAt?.getTime() ?? 0;
  if (expiresAt > Date.now() + 60_000) return account;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: requiredEnv("GOOGLE_CLIENT_ID"),
      client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
      refresh_token: decrypt(account.refreshTokenEncrypted),
      grant_type: "refresh_token"
    })
  });

  if (!response.ok) {
    await prisma.socialAccount.update({
      where: { id: account.id },
      data: { status: "reconnect" }
    });
    throw new Error("Google access token refresh failed.");
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in?: number;
    scope?: string;
  };

  return prisma.socialAccount.update({
    where: { id: account.id },
    data: {
      accessTokenEncrypted: encrypt(data.access_token),
      tokenExpiresAt: new Date(Date.now() + (data.expires_in ?? 3600) * 1000),
      scopes: data.scope ? data.scope.split(" ") : account.scopes,
      status: "authorized"
    }
  });
}

export function decryptYoutubeAccessToken(account: Pick<SocialAccount, "accessTokenEncrypted">) {
  return decrypt(account.accessTokenEncrypted);
}
