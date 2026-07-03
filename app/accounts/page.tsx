import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ensureDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  if (status === "authorized") return "已連線";
  if (status === "expired") return "需重新確認";
  if (status === "insufficient_scope") return "需補齊權限";
  return "需處理";
}

function statusClass(status: string) {
  if (status === "authorized") return "badge success";
  if (status === "expired") return "badge warning";
  return "badge danger";
}

export default async function AccountsPage() {
  const user = await ensureDemoUser();
  const accounts = await prisma.socialAccount.findMany({
    where: { userId: user.id, platform: "youtube" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });

  return (
    <main className="page">
      <div className="header">
        <div>
          <p className="eyebrow">帳戶</p>
          <h1>連線帳戶</h1>
        </div>
        <Link className="btn primary" href="/api/oauth/youtube/start">連線 YouTube</Link>
      </div>

      <section className="panel grid">
        {accounts.length === 0 ? (
          <div className="empty">
            <strong>尚未連線 YouTube</strong>
            <p>點選「連線 YouTube」後，會前往 Google 授權頁。授權完成後，帳戶會顯示在這裡。</p>
          </div>
        ) : (
          accounts.map((account) => (
            <article className="card account-card" key={account.id}>
              <div>
                <strong>{account.displayName}</strong>
                <div className="muted">YouTube / {account.platformAccountId}</div>
              </div>
              <span className={statusClass(account.status)}>{statusLabel(account.status)}</span>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
