"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { YoutubeMark } from "./ui/app-shell";

type Account = {
  id: string;
  displayName: string;
  status: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-TW").format(value);
}

export default function DashboardClient() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loaded, setLoaded] = useState(false);
  const activeAccount = accounts[0];

  useEffect(() => {
    let alive = true;
    fetch("/api/accounts", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        if (alive) setAccounts(data.accounts ?? []);
      })
      .catch(() => {
        if (alive) setAccounts([]);
      })
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => { alive = false; };
  }, []);

  const metrics = useMemo(() => {
    const bump = accounts.length * 120;
    return [
      { label: "訂閱", value: formatNumber(18420 + bump), delta: "+4.8%" },
      { label: "觀看", value: formatNumber(742980 + accounts.length * 3200), delta: "+11.2%" },
      { label: "互動", value: "6.7%", delta: "+0.9%" }
    ];
  }, [accounts.length]);

  const chart = [56, 66, 48, 78, 70, 90, 61];
  const max = Math.max(...chart);

  return (
    <section className="dashboard-page">
      <div className="dashboard-control-row">
        <button className="platform-icon-button" type="button" aria-label="切換平台"><YoutubeMark /></button>
        <Link className="top-account" href="/accounts">
          <YoutubeMark />
          <strong>{activeAccount?.displayName ?? (loaded ? "尚未連線帳戶" : "載入中")}</strong>
        </Link>
        <button className="report-switch-btn" type="button">洞察報告 <strong>帳號</strong></button>
        <select className="top-range" aria-label="時間範圍" defaultValue="7">
          <option value="7">近 7 天</option>
          <option value="30">近 30 天</option>
          <option value="90">近 90 天</option>
          <option value="custom">自訂</option>
        </select>
      </div>

      <div className="dashboard-report">
        <div className="report-title"><h2>帳號洞察報告</h2></div>
        <div className="report-metrics">
          {metrics.map((metric) => (
            <article className="metric report-metric" key={metric.label}>
              <label><span className="badge neutral">{metric.label}</span></label>
              <strong>{metric.value}</strong>
              <small className="delta-up">{metric.delta}</small>
            </article>
          ))}
        </div>

        <div className="report-chart-panel">
          <div className="panel-head chart-head">
            <h2>觀看次數</h2>
            <div className="segmented" aria-label="圖表類型">
              <button className="chart-icon-btn active" type="button" title="柱狀圖" aria-label="柱狀圖">
                <svg className="chart-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="3" height="8" rx="1" /><rect x="10.5" y="6" width="3" height="13" rx="1" /><rect x="17" y="9" width="3" height="10" rx="1" /></svg>
              </button>
              <button className="chart-icon-btn" type="button" title="線性圖" aria-label="線性圖">
                <svg className="chart-icon" viewBox="0 0 24 24" aria-hidden="true"><polyline points="3,16 8,11 13,13 20,6" /></svg>
              </button>
            </div>
          </div>
          <div className="chart">
            <div className="chart-y-axis"><span>94</span><span>77</span><span>61</span><span>45</span></div>
            <div className="chart-plot">
              <div className="chart-bars">
                {chart.map((value, index) => (
                  <span className="bar" style={{ height: `${Math.max(18, (value / max) * 170)}px` }} key={index} />
                ))}
              </div>
            </div>
            <div className="chart-corner" />
            <div className="chart-labels">
              {["一", "二", "三", "四", "五", "六", "日"].map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>
        </div>

        {loaded && accounts.length === 0 ? (
          <div className="panel empty-state">
            <strong>尚未連線 YouTube</strong>
            <Link className="btn primary" href="/api/oauth/youtube/start">連線 YouTube</Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
