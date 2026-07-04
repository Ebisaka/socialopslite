import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  decryptYoutubeAccessToken,
  ensureYoutubeAccessToken,
  hasYoutubeUploadScope
} from "@/lib/youtube";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

type YoutubeVideoResponse = {
  id?: string;
  error?: unknown;
};

function text(form: FormData, key: string, fallback = "") {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function bool(form: FormData, key: string, fallback = false) {
  const value = text(form, key, fallback ? "true" : "false").toLowerCase();
  return value === "true" || value === "1" || value === "yes" || value === "on";
}

function parseAccountIds(form: FormData) {
  const raw = text(form, "accountIds");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return raw.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

function fileFromForm(form: FormData, key: string) {
  const value = form.get(key);
  if (!value || typeof value === "string" || value.size <= 0) return null;
  return value;
}

function normalizedPublishMode(value: string) {
  if (value === "立即發布" || value === "immediate") return "immediate";
  if (value === "儲存草稿" || value === "draft") return "draft";
  return "scheduled";
}

function visibilityForYoutube(visibility: string, publishMode: string) {
  if (publishMode === "scheduled") return "private";
  if (visibility === "public" || visibility === "unlisted") return visibility;
  return "private";
}

function scheduledDate(form: FormData, publishMode: string) {
  if (publishMode !== "scheduled") return null;
  const value = text(form, "scheduledAt");
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function looksLikeYoutubePlaylistId(value: string) {
  return /^(PL|UU|LL|FL|OLAK5uy_|RD)[A-Za-z0-9_-]{10,}$/.test(value);
}

async function uploadVideo(params: {
  accessToken: string;
  file: File;
  title: string;
  description: string;
  visibility: string;
  publishMode: string;
  scheduledAt: Date | null;
  madeForKids: boolean;
  paidPromo: boolean;
  aiDisclosure: boolean;
  categoryId: string;
  tags: string[];
  license: string;
  embedAllowed: boolean;
  notifySubscribers: boolean;
}) {
  const uploadUrl = new URL("https://www.googleapis.com/upload/youtube/v3/videos");
  uploadUrl.searchParams.set("uploadType", "resumable");
  uploadUrl.searchParams.set("part", "snippet,status,paidProductPlacementDetails");
  uploadUrl.searchParams.set("notifySubscribers", params.notifySubscribers ? "true" : "false");

  const metadata = {
    snippet: {
      title: params.title,
      description: params.description,
      categoryId: params.categoryId || "22",
      tags: params.tags
    },
    status: {
      privacyStatus: visibilityForYoutube(params.visibility, params.publishMode),
      selfDeclaredMadeForKids: params.madeForKids,
      containsSyntheticMedia: params.aiDisclosure,
      embeddable: params.embedAllowed,
      license: params.license === "creativeCommon" ? "creativeCommon" : "youtube",
      ...(params.publishMode === "scheduled" && params.scheduledAt
        ? { publishAt: params.scheduledAt.toISOString() }
        : {})
    },
    paidProductPlacementDetails: {
      hasPaidProductPlacement: params.paidPromo
    }
  };

  const init = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": params.file.type || "video/mp4",
      "X-Upload-Content-Length": String(params.file.size)
    },
    body: JSON.stringify(metadata),
    cache: "no-store"
  });

  if (!init.ok) {
    throw new Error(await init.text());
  }

  const location = init.headers.get("location");
  if (!location) {
    throw new Error("YouTube 沒有回傳影片上傳位置。");
  }

  const body = Buffer.from(await params.file.arrayBuffer());
  const upload = await fetch(location, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      "Content-Type": params.file.type || "application/octet-stream",
      "Content-Length": String(body.byteLength)
    },
    body,
    cache: "no-store"
  });

  const result = (await upload.json().catch(async () => ({ error: await upload.text() }))) as YoutubeVideoResponse;
  if (!upload.ok || !result.id) {
    throw new Error(JSON.stringify(result.error ?? result));
  }

  return result.id;
}

async function uploadThumbnail(accessToken: string, videoId: string, file: File) {
  const url = new URL("https://www.googleapis.com/upload/youtube/v3/thumbnails/set");
  url.searchParams.set("uploadType", "media");
  url.searchParams.set("videoId", videoId);

  const body = Buffer.from(await file.arrayBuffer());
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": file.type || "image/jpeg",
      "Content-Length": String(body.byteLength)
    },
    body,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

async function addVideoToPlaylist(accessToken: string, videoId: string, playlistId: string) {
  if (!looksLikeYoutubePlaylistId(playlistId)) return false;

  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
      snippet: {
        playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId
        }
      }
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return true;
}

async function uploadCaption(accessToken: string, videoId: string, file: File) {
  const boundary = `socialops-${randomUUID()}`;
  const metadata = JSON.stringify({
    snippet: {
      videoId,
      language: "zh-TW",
      name: file.name.replace(/\.[^/.]+$/, "") || "字幕",
      isDraft: false
    }
  });
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`),
    fileBuffer,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  const url = new URL("https://www.googleapis.com/upload/youtube/v3/captions");
  url.searchParams.set("uploadType", "multipart");
  url.searchParams.set("part", "snippet");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
      "Content-Length": String(body.byteLength)
    },
    body,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if (auth.response) return auth.response;
  const user = auth.user;

  const form = await request.formData();
  const accountIds = parseAccountIds(form);
  const title = text(form, "title");
  const description = text(form, "description");
  const contentType = text(form, "contentType", "一般影片");
  const publishMode = normalizedPublishMode(text(form, "publishMode", "排程發布"));
  const visibility = text(form, "visibility", "private");
  const scheduledAt = scheduledDate(form, publishMode);
  const media = fileFromForm(form, "media");
  const cover = fileFromForm(form, "cover");
  const caption = fileFromForm(form, "caption");
  const madeForKids = bool(form, "madeForKids");
  const paidPromo = bool(form, "paidPromo");
  const aiDisclosure = bool(form, "aiDisclosure");
  const embedAllowed = bool(form, "embedAllowed", true);
  const notifySubscribers = bool(form, "notifySubscribers", true) && !madeForKids;
  const categoryId = text(form, "categoryId", "22");
  const tags = text(form, "tags").split(",").map((item) => item.trim()).filter(Boolean);
  const license = text(form, "license", "youtube");
  const playlistId = text(form, "playlistId");

  if (!accountIds.length) {
    return NextResponse.json({ error: "請選擇發布目標。" }, { status: 400 });
  }
  if (publishMode !== "draft" && !title) {
    return NextResponse.json({ error: "請輸入影片標題。" }, { status: 400 });
  }
  if (publishMode !== "draft" && !media) {
    return NextResponse.json({ error: "請選擇要上傳的影片。" }, { status: 400 });
  }
  if (publishMode === "scheduled" && !scheduledAt) {
    return NextResponse.json({ error: "請設定排程發布時間。" }, { status: 400 });
  }

  const accounts = await prisma.socialAccount.findMany({
    where: {
      id: { in: accountIds },
      userId: user.id,
      platform: "youtube"
    }
  });

  if (accounts.length !== accountIds.length) {
    return NextResponse.json({ error: "部分發布目標不存在，請重新選擇。" }, { status: 404 });
  }

  const missingUploadScope = accounts.filter((account) => !hasYoutubeUploadScope(account));
  if (publishMode !== "draft" && missingUploadScope.length) {
    await prisma.socialAccount.updateMany({
      where: { id: { in: missingUploadScope.map((account) => account.id) } },
      data: { status: "insufficient_scope" }
    });
    return NextResponse.json({
      error: "這個 YouTube 帳號缺少影片上傳權限，請重新連線 YouTube。",
      code: "youtube_upload_scope_required"
    }, { status: 403 });
  }

  const settings = {
    madeForKids,
    paidPromo,
    aiDisclosure,
    embedAllowed,
    notifySubscribers,
    categoryId,
    tags,
    license,
    playlistId,
    captionFileName: caption?.name ?? null
  };

  const results = [];

  for (const account of accounts) {
    const task = await prisma.publishTask.create({
      data: {
        userId: user.id,
        socialAccountId: account.id,
        platform: "youtube",
        title: title || "未命名影片",
        description,
        contentType,
        publishMode,
        visibility,
        scheduledAt,
        status: publishMode === "draft" ? "draft" : "uploading",
        mediaFileName: media?.name ?? null,
        coverFileName: cover?.name ?? null,
        settings
      }
    });

    if (publishMode === "draft") {
      results.push({ taskId: task.id, status: "draft" });
      continue;
    }

    try {
      const readyAccount = await ensureYoutubeAccessToken(account);
      const accessToken = decryptYoutubeAccessToken(readyAccount);
      const videoId = await uploadVideo({
        accessToken,
        file: media!,
        title,
        description,
        visibility,
        publishMode,
        scheduledAt,
        madeForKids,
        paidPromo,
        aiDisclosure,
        categoryId,
        tags,
        license,
        embedAllowed,
        notifySubscribers
      });

      const sideEffects: string[] = [];
      if (cover) {
        await uploadThumbnail(accessToken, videoId, cover);
        sideEffects.push("thumbnail");
      }
      if (playlistId) {
        const added = await addVideoToPlaylist(accessToken, videoId, playlistId);
        if (added) sideEffects.push("playlist");
      }
      if (caption) {
        await uploadCaption(accessToken, videoId, caption);
        sideEffects.push("caption");
      }

      const status = publishMode === "scheduled" ? "scheduled" : "published";
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      await prisma.publishTask.update({
        where: { id: task.id },
        data: {
          status,
          youtubeVideoId: videoId,
          youtubeUrl,
          errorMessage: null,
          settings: { ...settings, sideEffects }
        }
      });

      results.push({ taskId: task.id, status, youtubeVideoId: videoId, youtubeUrl, sideEffects });
    } catch (error) {
      const message = error instanceof Error ? error.message : "YouTube 發布失敗。";
      await prisma.publishTask.update({
        where: { id: task.id },
        data: {
          status: "failed",
          errorMessage: message.slice(0, 2000)
        }
      });
      results.push({ taskId: task.id, status: "failed", error: message });
    }
  }

  const failed = results.filter((item) => item.status === "failed");
  return NextResponse.json({
    ok: failed.length === 0,
    results
  }, { status: failed.length ? 207 : 200 });
}
