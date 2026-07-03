import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero panel">
        <div>
          <p className="eyebrow">SocialOps Lite</p>
          <h1>社群營運工作台</h1>
          <p>
            先專注 YouTube 帳號連線、資料同步與內容排程。等核心流程穩定後，再逐步加入更多平台。
          </p>
        </div>
        <div className="actions">
          <Link className="btn primary" href="/accounts">管理帳戶</Link>
          <Link className="btn" href="/api/health">檢查服務</Link>
        </div>
      </section>

      <section className="panel grid">
        <article className="card">
          <strong>下一步</strong>
          <p>完成 Supabase 與 Vercel 環境變數設定後，就可以測試 YouTube OAuth 連線流程。</p>
        </article>
      </section>
    </main>
  );
}
