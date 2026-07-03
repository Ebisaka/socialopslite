"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { YoutubeMark } from "./ui/app-shell";

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-TW").format(value);
}

function ChartIcon({ type }: { type: "bar" | "line" }) {
  if (type === "bar") {
    return <svg className="chart-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="3" height="8" rx="1" /><rect x="10.5" y="6" width="3" height="13" rx="1" /><rect x="17" y="9" width="3" height="10" rx="1" /></svg>;
  }
  return <svg className="chart-icon" viewBox="0 0 24 24" aria-hidden="true"><polyline points="3,16 8,11 13,13 20,6" /></svg>;
}

export default function DashboardClient() {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const metrics = useMemo(() => {
    return [
      { label: "訂閱", value: formatNumber(18420), delta: "+4.8%" },
      { label: "觀看", value: formatNumber(742980), delta: "+11.2%", active: true },
      { label: "互動", value: "6.7%", delta: "+0.9%" }
    ];
  }, []);

  const chart = [75, 80, 70, 88, 82, 94, 77];
  const max = 100;
  const yLabels = [94, 77, 61, 45];
  const xLabels = ["一", "二", "三", "四", "五", "六", "日"];
  const linePoints = chart.map((value, index) => {
    const x = 8 + index * 14;
    const y = 100 - ((value - 40) / 60) * 82;
    return x + "," + Math.max(8, Math.min(92, y));
  }).join(" ");

  return (
    <section className="section active dashboard-page" id="dashboard">
      <header>
        <div className="topbar-left" />
        <div className="topbar-right">
          <button className="platform-icon-button" type="button" aria-label="切換平台"><YoutubeMark /></button>
          <Link className="top-account" href="/accounts" aria-label="切換帳戶">
            <div className="profile-avatar" style={{ background: "transparent" }}><YoutubeMark className="yt-play" /></div>
            <div><strong>YouTube 測試帳號 3</strong></div>
          </Link>
          <div className="report-switch">
            <button className="report-switch-btn" type="button">洞察報告 <strong>帳號</strong><span className="chevron" aria-hidden="true" /></button>
          </div>
          <select className="top-range" id="rangeSelect" aria-label="時間範圍" defaultValue="7">
            <option value="7">近 7 天</option>
            <option value="30">近 30 天</option>
            <option value="90">近 90 天</option>
            <option value="custom">自訂</option>
          </select>
        </div>
      </header>

      <div className="dashboard-report">
        <div className="report-title"><h2>帳號洞察報告</h2></div>
        <div className="report-metrics">
          {metrics.map((metric) => (
            <article className={metric.active ? "metric report-metric active" : "metric report-metric"} key={metric.label}>
              <label><span className="badge neutral">{metric.label}</span></label>
              <strong>{metric.value}</strong>
              <small className="delta-up">{metric.delta}</small>
            </article>
          ))}
        </div>

        <div className="dashboard-content">
          <div className="panel report-chart-panel">
            <div className="panel-head">
              <div><h2>觀看次數</h2></div>
              <div className="toolbar">
                <div className="segmented">
                  <button className={chartType === "bar" ? "chart-icon-btn active" : "chart-icon-btn"} type="button" title="柱狀圖" aria-label="柱狀圖" onClick={() => setChartType("bar")}><ChartIcon type="bar" /></button>
                  <button className={chartType === "line" ? "chart-icon-btn active" : "chart-icon-btn"} type="button" title="線性圖" aria-label="線性圖" onClick={() => setChartType("line")}><ChartIcon type="line" /></button>
                </div>
              </div>
            </div>
            <div className="chart" data-range="7">
              <div className="chart-y-axis">{yLabels.map((label) => <span key={label}>{label}</span>)}</div>
              <div className="chart-plot">
                {chartType === "bar" ? (
                  <div className="chart-bars">
                    {chart.map((value, index) => <span className="bar" style={{ height: Math.max(18, (value / max) * 190) + "px" }} key={index} />)}
                  </div>
                ) : (
                  <svg className="chart-line is-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <polyline points={linePoints} />
                    {linePoints.split(" ").map((point, index) => {
                      const [cx, cy] = point.split(",").map(Number);
                      return <circle cx={cx} cy={cy} r="1.2" key={index} />;
                    })}
                  </svg>
                )}
              </div>
              <div className="chart-corner" />
              <div className="chart-labels">{xLabels.map((label) => <span key={label}>{label}</span>)}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
