import Link from "next/link";

const features = [
  {
    title: "連線 YouTube 帳號",
    body: "透過官方授權連接帳號，不需要共享密碼。"
  },
  {
    title: "查看帳戶表現",
    body: "集中查看訂閱、觀看與互動資料，減少來回切換。"
  },
  {
    title: "準備與排程內容",
    body: "先整理標題、說明、封面與 YouTube 設定，再排程送出。"
  },
  {
    title: "逐步增加平台",
    body: "先把 YouTube 做穩，再依需求擴充其他社群平台。"
  }
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link className="landing-brand" href="/">
          <img src="/socialops-logo.png" alt="" />
          <strong>SocialOps Lite</strong>
        </Link>
        <div className="landing-actions">
          <Link className="btn landing-cta-button landing-cta-secondary" href="/login">
            登入
          </Link>
          <Link className="btn primary landing-cta-button landing-cta-primary" href="/login">
            開始使用
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-copy">
          <h1>一個地方管理 YouTube 內容、帳戶與數據。</h1>
          <p>
            SocialOps Lite 幫你把帳戶連線、內容準備、排程與表現資料集中到同一個工作區，
            先專注把 YouTube 營運流程做得乾淨、省事、可追蹤。
          </p>
        </div>

        <div className="landing-preview" aria-hidden="true">
          <div className="landing-preview-top">
            <span />
            <span />
            <span />
          </div>
          <div className="landing-metrics">
            <div>
              <span>訂閱</span>
              <strong>18,420</strong>
            </div>
            <div>
              <span>觀看</span>
              <strong>742,980</strong>
            </div>
            <div>
              <span>互動</span>
              <strong>6.7%</strong>
            </div>
          </div>
          <div className="landing-bars">
            {[52, 66, 44, 78, 70, 91, 60].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </section>

      <section className="landing-features">
        {features.map((feature) => (
          <article key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
