"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type IconName = "dashboard" | "accounts" | "composer" | "profile" | "more" | "moon";

function NavIcon({ name }: { name: IconName }) {
  if (name === "dashboard") {
    return <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5v7a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9V20H5.5A1.5 1.5 0 0 1 4 18.5z" /></svg>;
  }
  if (name === "accounts") {
    return <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 19c1.1-3.7 3.2-5.5 6.5-5.5s5.4 1.8 6.5 5.5" /></svg>;
  }
  if (name === "composer") {
    return <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18.5 6.1 14 15.9 4.2a2 2 0 0 1 2.9 2.9L9 16.9z" /><path d="M13.8 6.3 17.7 10.2" /></svg>;
  }
  if (name === "profile") {
    return <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" /><path d="M8 20h8" /><path d="M7 16.5c1.1-2.2 2.8-3.3 5-3.3s3.9 1.1 5 3.3" /></svg>;
  }
  if (name === "moon") {
    return <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8.2 8.2 0 0 1 8.8 4 7.5 7.5 0 1 0 20 15.2Z" /></svg>;
  }
  return <span className="more-icon" aria-hidden="true" />;
}

export function YoutubeMark({ className = "yt-svg" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 23" aria-hidden="true" focusable="false">
      <rect className="yt-play-bg" x="0" y="0" width="32" height="23" rx="6" />
      <path className="yt-play-triangle" d="M13 7.2v8.6l7-4.3z" />
    </svg>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const navItems = [
    { href: "/app", label: "總覽", icon: "dashboard" as const, active: pathname === "/app" },
    { href: "/accounts", label: "帳號", icon: "accounts" as const, active: pathname.startsWith("/accounts") },
    { href: "/composer", label: "發文", icon: "composer" as const, active: pathname.startsWith("/composer") },
    { href: "/profile", label: "會員", icon: "profile" as const, active: pathname.startsWith("/profile") }
  ];

  return (
    <div className="app">
      <aside>
        <Link className="brand" href="/app" aria-label="SocialOps Lite">
          <img className="brand-logo" src="/socialops-logo.png" alt="SocialOps" title="SocialOps" width={38} height={38} />
          <span className="brand-copy"><strong>SocialOps Lite</strong></span>
        </Link>

        <nav className="nav" aria-label="主要功能">
          {navItems.map((item) => (
            <Link className={item.active ? "active" : ""} href={item.href} key={item.href} title={item.label}>
              <span className="nav-icon"><NavIcon name={item.icon} /></span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-controls">
          <div className="more-switch">
            {menuOpen ? (
              <div className="more-menu">
                <button className="more-item-title" type="button" onClick={() => setAppearanceOpen((value) => !value)}>
                  <span className="more-row-icon"><NavIcon name="moon" /></span>
                  <span>切換外觀</span>
                </button>
                {appearanceOpen ? (
                  <div className="appearance-panel">
                    <button className="more-option" type="button"><span>跟隨系統</span><span>◐</span></button>
                    <button className="more-option" type="button"><span>淺色模式</span><span>☀</span></button>
                    <button className="more-option" type="button"><span>深色模式</span><span>☾</span></button>
                  </div>
                ) : null}
                <Link className="more-item-title" href="/profile">
                  <span className="more-row-icon"><NavIcon name="profile" /></span>
                  <span>會員中心</span>
                </Link>
              </div>
            ) : null}
            <button className="more-btn" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="更多">
              <span className="nav-icon"><NavIcon name="more" /></span>
              <span className="nav-label">更多</span>
            </button>
          </div>
        </div>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
