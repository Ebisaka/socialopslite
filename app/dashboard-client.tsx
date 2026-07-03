"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { YoutubeMark } from "./ui/app-shell";

type Account = {
  id: string;
  displayName: string;
  status: string;
  favorite?: boolean;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-TW").format(value);
}

export default function DashboardClient() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/accounts", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        if (!alive) return;
        setAccounts(data.accounts ?? []);
      })
      .catch(() => {
        if (alive) setAccounts([]);
      })
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => { alive = false; };
  }, []);

  const activeAccount = accounts[0];
  const hasAccount = accounts.length > 0;
  const pendingCount = accounts.filter((account) => account.status !== "authorized").length;
  const metrics = useMemo(() => hasAccount
    ? [
        { label: "訂閱", value: formatNumber(18420 + accounts.length * 120), delta: "+4.8%" },
        { label: "觀看", value: formatNumber(742980 + accounts.length * 3200), delta: "+11.2%" },
        { label: "互動", value: "6.7%", delta: "+0.9%" }
      ]
    : [
        { label: "訂閱", value: loaded ? "0" : "-", delta: "-" },
        { label: "觀看", value: loaded ? "0" : "-", delta: "-" },
        { label: "互動", value: loaded ? "0%" : "-", delta: "-" }
      ], [accounts.length, hasAccount, loaded]);

  const chart = hasAccount ? [56, 66, 48, 78, 70, 90, 61] : [0, 0, 0, 0, 0, 0, 0];
  const max = Math.max(...chart, 1);

  return (
    <section className="dashboard-page page-narrow">
      <div className="top-controls">
        <div className="topbar-left">
          <button className="report-switch-btn" type="button">
            洞察報告 <strong>帳號</strong>
          </button>
        </div>
        <div className="topbar-right">
          <select className="top-range" aria-label="時間範圍" defaultValue="7">
            <option value="7">近 7 天</option>
            <option value="30">近 30 天</option>
            <option value="90">近 90 天</option>
            <option value="custom">自訂</option>
          </select>
          <button className="platform-icon-button" type="button" aria-label="切換平台">
            <YoutubeMark />
          </button>
          <Link className="top-account" href="/accounts">
            <YoutubeMark />
            <strong>{activeAccount?.displayName ?? (loaded ? "尚未連線帳戶" : "讀取中")}</strong>
          </Link>
        </div>
      </div>

      <div className="dashboard-report">
        <div className="report-title">
          <h2>帳號洞察報告</h2>
        </div>

        <div className="report-metrics">
          {metrics.map((metric) => (
            <article className="report-metric" key={metric.label}>
              <label><span className="badge neutral">{metric.label}</span></label>
              <strong>{metric.value}</strong>
              <small className={metric.delta.startsWith("+") ? "delta-up" : "delta-neutral"}>{metric.delta}</small>
            </article>
          ))}
        </div>

        <div className="chart-panel">
          <div className="chart-heading">
            <h3>觀看次數</h3>
            <div className="chart-toggle" aria-label="圖表類型">
              <span></span>
              <span className="line"></span>
            </div>
          </div>
          <div className="bar-chart" aria-label="近 7 天觀看次數">
            {chart.map((value, index) => (
              <div className="bar-column" key={index}>
                <span style={{ height: `${Math.max(6, (value / max) * 140)}px` }} />
                <small>{["一", "二", "三", "四", "五", "六", "日"][index]}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-summary">
          <div className="summary-item">
            <span>已連線帳戶</span>
            <strong>{loaded ? accounts.length : "-"}</strong>
          </div>
          <div className="summary-item">
            <span>待確認狀態</span>
            <strong>{loaded ? pendingCount : "-"}</strong>
          </div>
        </div>
      </div>

      {loaded && !hasAccount ? (
        <div className="panel empty-state">
          <h2>尚未連線 YouTube</h2>
          <p>連線帳戶後，這裡會顯示帳號資料與近期表現。</p>
          <Link className="btn primary" href="/api/oauth/youtube/start">連線 YouTube</Link>
        </div>
      ) : null}
    </section>
  );
}
