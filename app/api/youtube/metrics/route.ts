import { NextResponse } from "next/server";
import type { SocialAccount } from "@prisma/client";
import { requireApiUser } from "@/lib/auth";
import { decrypt, encrypt } from "@/lib/crypto";
import { requiredEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type YoutubeChannelResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
    };
    statistics?: {
      viewCount?: string;
      subscriberCount?: string;
      hiddenSubscriberCount?: boolean;
      videoCount?: string;
    };
  }>;
  error?: unknown;
};

const supportedRanges = [7, 30, 90] as const;

function startOfUtcDay(date = new Date()) {
  const taipeiTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return new Date(Date.UTC(taipeiTime.getUTCFullYear(), taipeiTime.getUTCMonth(), taipeiTime.getUTCDate()));
}

function addUtcDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function weekdayLabel(date: Date) {
  return ["日", "一", "二", "三", "四", "五", "六"][date.getUTCDay()];
}

function rangeLabel(date: Date, range: number) {
  if (range === 7) return weekdayLabel(date);
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

function toInt(value: string | undefined | null) {
  if (!value) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function toBigInt(value: string | undefined | null) {
  if (!value) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

function formatNumber(value: number | bigint | null | undefined) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("zh-TW").format(value);
}

function percentDelta(current: number | bigint | null, previous: number | bigint | null) {
  if (current === null || previous === null || previous === BigInt(0) || previous === 0) {
    return "+0.0%";
  }
  const currentNumber = Number(current);
  const previousNumber = Number(previous);
  if (!Number.isFinite(currentNumber) || !Number.isFinite(previousNumber) || previousNumber === 0) {
    return "+0.0%";
  }
  const value = ((currentNumber - previousNumber) / previousNumber) * 100;
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

async function refreshAccessToken(account: SocialAccount) {
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

async function fetchYoutubeStats(account: SocialAccount) {
  const readyAccount = await refreshAccessToken(account);
  const accessToken = decrypt(readyAccount.accessTokenEncrypted);
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("id", readyAccount.platformAccountId);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store"
  });

  const data = (await response.json()) as YoutubeChannelResponse;
  if (!response.ok) {
    await prisma.socialAccount.update({
      where: { id: readyAccount.id },
      data: { status: "reconnect" }
    });
    throw new Error(JSON.stringify(data.error ?? data));
  }

  const item = data.items?.[0];
  if (!item?.statistics) {
    throw new Error("YouTube channel statistics were not returned.");
  }

  const subscriberCount = item.statistics.hiddenSubscriberCount
    ? null
    : toInt(item.statistics.subscriberCount);
  const viewCount = toBigInt(item.statistics.viewCount);
  const videoCount = toInt(item.statistics.videoCount);

  if (item.snippet?.title && item.snippet.title !== readyAccount.displayName) {
    await prisma.socialAccount.update({
      where: { id: readyAccount.id },
      data: { displayName: item.snippet.title }
    });
  }

  return {
    subscriberCount,
    viewCount,
    videoCount
  };
}

function buildRangePayload(
  range: number,
  snapshots: Array<{
    date: Date;
    subscriberCount: number | null;
    viewCount: bigint | null;
    videoCount: number | null;
  }>,
  current: {
    subscriberCount: number | null;
    viewCount: bigint | null;
    videoCount: number | null;
  }
) {
  const today = startOfUtcDay();
  const firstDate = addUtcDays(today, -(range - 1));
  const byDate = new Map(snapshots.map((snapshot) => [dateKey(snapshot.date), snapshot]));
  const labels: string[] = [];
  const subscriberSeries: number[] = [];
  const viewSeries: number[] = [];
  const videoSeries: number[] = [];

  let lastSubscriber = snapshots[0]?.subscriberCount ?? current.subscriberCount ?? 0;
  let lastView = Number(snapshots[0]?.viewCount ?? current.viewCount ?? BigInt(0));
  let lastVideo = snapshots[0]?.videoCount ?? current.videoCount ?? 0;

  for (let index = 0; index < range; index += 1) {
    const day = addUtcDays(firstDate, index);
    const snapshot = byDate.get(dateKey(day));
    labels.push(rangeLabel(day, range));
    if (snapshot) {
      lastSubscriber = snapshot.subscriberCount ?? lastSubscriber;
      lastView = Number(snapshot.viewCount ?? BigInt(lastView));
      lastVideo = snapshot.videoCount ?? lastVideo;
    }
    subscriberSeries.push(lastSubscriber);
    viewSeries.push(lastView);
    videoSeries.push(lastVideo);
  }

  const first = snapshots[0] ?? null;
  return {
    labels,
    subscribers: formatNumber(current.subscriberCount),
    subscriberDelta: percentDelta(current.subscriberCount, first?.subscriberCount ?? current.subscriberCount),
    views: formatNumber(current.viewCount),
    viewDelta: percentDelta(current.viewCount, first?.viewCount ?? current.viewCount),
    engagement: current.videoCount === null ? "—" : `${formatNumber(current.videoCount)} 部`,
    engagementDelta: percentDelta(current.videoCount, first?.videoCount ?? current.videoCount),
    series: {
      subscribers: subscriberSeries,
      views: viewSeries,
      engagement: videoSeries
    }
  };
}

export async function GET() {
  try {
    const auth = await requireApiUser();
    if (auth.response) return auth.response;
    const user = auth.user;
    const accounts = await prisma.socialAccount.findMany({
      where: {
        userId: user.id,
        platform: "youtube"
      },
      orderBy: [{ favorite: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }]
    });

    const today = startOfUtcDay();
    const earliest = addUtcDays(today, -89);

    const payload = [];
    for (const account of accounts) {
      try {
        const current = await fetchYoutubeStats(account);
        await prisma.metricSnapshot.upsert({
          where: {
            socialAccountId_date: {
              socialAccountId: account.id,
              date: today
            }
          },
          create: {
            socialAccountId: account.id,
            platform: account.platform,
            date: today,
            subscriberCount: current.subscriberCount,
            viewCount: current.viewCount,
            videoCount: current.videoCount
          },
          update: {
            subscriberCount: current.subscriberCount,
            viewCount: current.viewCount,
            videoCount: current.videoCount
          }
        });

        const snapshots = await prisma.metricSnapshot.findMany({
          where: {
            socialAccountId: account.id,
            date: { gte: earliest }
          },
          orderBy: { date: "asc" },
          select: {
            date: true,
            subscriberCount: true,
            viewCount: true,
            videoCount: true
          }
        });

        payload.push({
          accountId: account.id,
          platformAccountId: account.platformAccountId,
          displayName: account.displayName,
          metrics: {
            subscriberCount: current.subscriberCount,
            viewCount: current.viewCount?.toString() ?? null,
            videoCount: current.videoCount
          },
          ranges: Object.fromEntries(
            supportedRanges.map((range) => [
              String(range),
              buildRangePayload(range, snapshots, current)
            ])
          )
        });
      } catch (error) {
        console.warn(`YouTube metrics skipped for account ${account.id}`, error);
      }
    }

    return NextResponse.json({
      accounts: payload,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("YouTube metrics failed", error);
    return NextResponse.json(
      { error: "YouTube 指標同步失敗。" },
      { status: 500 }
    );
  }
}
