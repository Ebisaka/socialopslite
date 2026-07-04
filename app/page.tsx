import Link from "next/link";

const features = [
  { title: "連線 YouTube 帳號", body: "用自己的會員帳戶管理已授權的 YouTube 頻道。" },
  { title: "查看帳戶表現", body: "集中查看訂閱、觀看與互動資料，減少切換後台的時間。" },
  { title: "準備與排程內容", body: "整理影片標題、說明、封面與 YouTube 發布設定。" },
  { title: "逐步增加平台", body: "先把 YouTube 做穩，再擴充其他常用社群平台。" }
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link className="landing-brand" href="/">
          <img src="/socialops-logo.png" alt="SocialOps Lite" />
          <strong>SocialOps Lite</strong>
        </Link>
        <div className="landing-actions">
          <Link className="btn" href="/login">登入</Link>
          <Link className="btn primary" href="/login">開始使用</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div>
          <h1>一個地方管理 YouTube 內容、帳戶與數據。</h1>
          <p>
            為個人創作者與小型團隊準備的輕量工作台。先從 YouTube 做穩，
            再逐步擴充到更多社群平台。
          </p>
          <div className="landing-cta">
            <Link className="btn primary" href="/login">開始使用</Link>
            <Link className="btn" href="/login">登入</Link>
          </div>
        </div>
        <div className="landing-preview" aria-hidden="true">
          <div className="landing-preview-top">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="landing-metrics">
            <div><span>訂閱</span><strong>18,420</strong></div>
            <div><span>觀看</span><strong>742,980</strong></div>
            <div><span>互動</span><strong>6.7%</strong></div>
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
