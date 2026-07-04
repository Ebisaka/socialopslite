import { cookies } from "next/headers";
import { appEnvironment } from "@/lib/app-env";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isAdminAuthorized() {
  const key = process.env.ADMIN_ACCESS_KEY;
  if (!key) return false;
  return cookies().get("socialops_admin")?.value === key;
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "尚無資料";
  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Taipei"
  }).format(date);
}

function statusLabel(status: string) {
  if (status === "authorized" || status === "connected" || status === "active") return "已連線";
  if (status === "reconnect" || status === "expired") return "需重新確認";
  if (status === "insufficient_scope" || status === "permission") return "需補權限";
  return status || "未知";
}

async function loadAdminData() {
  const today = new Date();
  const taipei = new Date(today.getTime() + 8 * 60 * 60 * 1000);
  const todayStart = new Date(Date.UTC(taipei.getUTCFullYear(), taipei.getUTCMonth(), taipei.getUTCDate()));

  const [
    userCount,
    accountCount,
    youtubeAccountCount,
    accountStatuses,
    todaySnapshots,
    latestSnapshot,
    openReports,
    reports
  ] = await Promise.all([
    prisma.user.count(),
    prisma.socialAccount.count(),
    prisma.socialAccount.count({ where: { platform: "youtube" } }),
    prisma.socialAccount.groupBy({
      by: ["status"],
      _count: { _all: true }
    }),
    prisma.metricSnapshot.count({ where: { date: { gte: todayStart } } }),
    prisma.metricSnapshot.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.issueReport.count({ where: { status: "open" } }),
    prisma.issueReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        category: true,
        page: true,
        message: true,
        status: true,
        email: true,
        createdAt: true
      }
    })
  ]);

  return {
    userCount,
    accountCount,
    youtubeAccountCount,
    accountStatuses,
    todaySnapshots,
    latestSnapshot,
    openReports,
    reports
  };
}

function LoginPanel({ error }: { error?: string }) {
  return (
    <main className="admin-page admin-login-page">
      <section className="admin-login-card">
        <div>
          <p className="admin-eyebrow">站方主控台</p>
          <h1>管理後台</h1>
          <p>這裡只給服務擁有者查看營運狀態。</p>
        </div>
        {!process.env.ADMIN_ACCESS_KEY ? (
          <div className="admin-alert">
            尚未設定 <code>ADMIN_ACCESS_KEY</code>，請先在 Vercel 環境變數新增管理金鑰。
          </div>
        ) : (
          <form className="admin-login-form" method="post" action="/api/admin/session">
            <label>
              管理金鑰
              <input name="key" type="password" autoComplete="current-password" />
            </label>
            {error ? <p className="admin-error">金鑰不正確，請再試一次。</p> : null}
            <button type="submit">進入後台</button>
          </form>
        )}
      </section>
    </main>
  );
}

export default async function AdminPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  if (!isAdminAuthorized()) {
    return <LoginPanel error={searchParams?.error} />;
  }

  const data = await loadAdminData();

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">站方主控台</p>
            <h1>管理後台</h1>
          </div>
          <div className="admin-header-actions">
            <span>{appEnvironment()}</span>
            <form method="post" action="/api/admin/logout">
              <button type="submit">登出</button>
            </form>
          </div>
        </header>

        <section className="admin-grid">
          <article className="admin-stat">
            <span>使用者</span>
            <strong>{data.userCount}</strong>
          </article>
          <article className="admin-stat">
            <span>連線帳號</span>
            <strong>{data.accountCount}</strong>
          </article>
          <article className="admin-stat">
            <span>YouTube</span>
            <strong>{data.youtubeAccountCount}</strong>
          </article>
          <article className="admin-stat">
            <span>待處理回報</span>
            <strong>{data.openReports}</strong>
          </article>
        </section>

        <section className="admin-columns">
          <article className="admin-card">
            <div className="admin-card-head">
              <h2>系統狀態</h2>
            </div>
            <div className="admin-list">
              <div>
                <span>今日同步快照</span>
                <strong>{data.todaySnapshots}</strong>
              </div>
              <div>
                <span>最近同步</span>
                <strong>{formatDate(data.latestSnapshot?.updatedAt)}</strong>
              </div>
              {data.accountStatuses.map((item) => (
                <div key={item.status}>
                  <span>{statusLabel(item.status)}</span>
                  <strong>{item._count._all}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-card">
            <div className="admin-card-head">
              <h2>問題回報</h2>
            </div>
            <div className="admin-report-list">
              {data.reports.length ? (
                data.reports.map((report) => (
                  <article key={report.id} className="admin-report">
                    <div>
                      <strong>{report.category}</strong>
                      <span>{report.status}</span>
                    </div>
                    <p>{report.message}</p>
                    <small>
                      {report.email || "未提供 email"} · {report.page || "未提供頁面"} ·{" "}
                      {formatDate(report.createdAt)}
                    </small>
                  </article>
                ))
              ) : (
                <p className="admin-empty">目前沒有問題回報。</p>
              )}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
