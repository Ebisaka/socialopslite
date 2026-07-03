# SocialOps Lite Next.js

這是 SocialOps Lite 的 Vercel / Supabase 基礎版本，用來承接正式 OAuth、資料庫與後端 API。

## 目前包含

- Next.js App Router
- YouTube OAuth start / callback API
- Prisma schema
- Supabase PostgreSQL 連線設定
- token AES-256-GCM 加密儲存
- demo user 暫時流程
- 帳戶列表頁 /accounts
- 健康檢查 API /api/health

## 本機設定

請建立 `.env.local`，不要把它上傳 GitHub。

```env
DATABASE_URL="Supabase pooled connection"
DIRECT_URL="Supabase direct connection"
GOOGLE_CLIENT_ID="你的 Google OAuth Client ID"
GOOGLE_CLIENT_SECRET="你的 Google OAuth Client Secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/oauth/youtube/callback"
TOKEN_ENCRYPTION_KEY="請填一組夠長的隨機字串"
DEMO_USER_EMAIL="demo@local.test"
```

本機 Google OAuth callback URL：

```text
http://localhost:3000/api/oauth/youtube/callback
```

## 啟動

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

開啟：

```text
http://localhost:3000/accounts
```

## Vercel 環境變數

到 Vercel 專案後台設定：

- DATABASE_URL
- DIRECT_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI
- TOKEN_ENCRYPTION_KEY
- DEMO_USER_EMAIL

部署到 Vercel 後，Google OAuth callback URL 需要改成：

```text
https://你的-vercel-網址/api/oauth/youtube/callback
```

正式域名接上後，再追加：

```text
https://socialopslite.com/api/oauth/youtube/callback
```

## 注意

- 不要把 `.env`、`.env.local`、Google Client Secret、Supabase service role key 上傳 GitHub。
- Vercel 環境變數才是正式部署時放密鑰的位置。
- 目前是 demo user 流程，正式多使用者登入後需要替換成真正 user session。
