"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type IconName = "dashboard" | "accounts" | "composer" | "more" | "moon";

function NavIcon({ name }: { name: IconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {name === "dashboard" ? <path d="M4 11.5 12 5l8 6.5v7A1.5 1.5 0 0 1 18.5 20H15v-5.5H9V20H5.5A1.5 1.5 0 0 1 4 18.5z" {...common} /> : null}
      {name === "accounts" ? <><circle cx="12" cy="8" r="3.2" {...common} /><path d="M5.5 19c1.1-3.7 3.2-5.5 6.5-5.5s5.4 1.8 6.5 5.5" {...common} /></> : null}
      {name === "composer" ? <path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20z" {...common} /> : null}
      {name === "more" ? <><path d="M5 7h14" {...common} /><path d="M5 12h14" {...common} /><path d="M5 17h14" {...common} /></> : null}
      {name === "moon" ? <path d="M20 15.2A8.2 8.2 0 0 1 8.8 4 7.5 7.5 0 1 0 20 15.2Z" {...common} /> : null}
    </svg>
  );
}

export function YoutubeMark() {
  return (
    <svg className="yt-svg" viewBox="0 0 34 24" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="34" height="24" rx="7" fill="#ff0033" />
      <path d="M14 8.2v7.6L21 12l-7-3.8Z" fill="#fff" />
    </svg>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const navItems = [
    { href: "/", label: "總覽", icon: "dashboard" as const, active: pathname === "/" },
    { href: "/accounts", label: "帳戶", icon: "accounts" as const, active: pathname.startsWith("/accounts") },
    { href: "/composer", label: "發文", icon: "composer" as const, active: pathname.startsWith("/composer") }
  ];

  return (
    <div className="app">
      <aside className={menuOpen ? "sidebar menu-open" : "sidebar"}>
        <Link className="brand" href="/" aria-label="SocialOps Lite">
          <img className="brand-logo" src="/socialops-logo-small.png" alt="" width={38} height={38} />
          <span className="brand-copy"><strong>SocialOps Lite</strong></span>
        </Link>

        <nav className="nav" aria-label="主功能">
          {navItems.map((item) => (
            <Link className={item.active ? "active" : ""} href={item.href} key={item.href} title={item.label}>
              <span className="nav-icon"><NavIcon name={item.icon} /></span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-controls">
          {menuOpen ? (
            <div className="more-menu">
              <button className="more-row" type="button" onClick={() => setAppearanceOpen((value) => !value)}>
                <span className="nav-icon"><NavIcon name="moon" /></span>
                <span>切換外觀</span>
              </button>
              {appearanceOpen ? (
                <div className="appearance-panel">
                  <button type="button">跟隨系統</button>
                  <button type="button">淺色模式</button>
                  <button type="button">深色模式</button>
                </div>
              ) : null}
            </div>
          ) : null}
          <button className="more-btn" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="更多">
            <span className="nav-icon"><NavIcon name="more" /></span>
            <span className="nav-label">更多</span>
          </button>
        </div>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
