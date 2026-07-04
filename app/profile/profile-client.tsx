"use client";

import { useEffect, useMemo, useState } from "react";

type ThemeChoice = "system" | "light" | "dark";

type ProfilePayload = {
  user: {
    email: string;
    createdAt: string;
  };
};

const copy = {
  profileCenter: "\u6703\u54e1\u4e2d\u5fc3",
  loading: "\u8b80\u53d6\u4e2d",
  backToApp: "\u56de\u5de5\u4f5c\u5340",
  account: "\u5e33\u6236",
  joinedAt: "\u52a0\u5165\u6642\u9593",
  preferences: "\u504f\u597d\u8a2d\u5b9a",
  appearance: "\u5916\u89c0\u6a21\u5f0f",
  system: "\u8ddf\u96a8\u7cfb\u7d71",
  dark: "\u6df1\u8272\u6a21\u5f0f",
  light: "\u6dfa\u8272\u6a21\u5f0f",
  language: "\u8a9e\u8a00",
  traditionalChinese: "\u7e41\u9ad4\u4e2d\u6587",
  dataSecurity: "\u8cc7\u6599\u8207\u5b89\u5168",
  linkedAccounts: "\u9023\u7dda\u5e33\u865f\u7ba1\u7406",
  manage: "\u7ba1\u7406",
  logoutAll: "\u767b\u51fa\u6240\u6709\u88dd\u7f6e",
  deleteMemberAccount: "\u522a\u9664 SocialOps \u6703\u54e1\u5e33\u6236",
  requestDeletion: "\u7533\u8acb\u522a\u9664",
  deletionRequested: "\u5df2\u9001\u51fa\u7533\u8acb",
  changePassword: "\u8b8a\u66f4\u5bc6\u78bc",
  currentPassword: "\u76ee\u524d\u5bc6\u78bc",
  newPassword: "\u65b0\u5bc6\u78bc",
  save: "\u5132\u5b58",
  cancel: "\u53d6\u6d88",
  logout: "\u767b\u51fa",
  processing: "\u8655\u7406\u4e2d",
  loadFailed: "\u6703\u54e1\u8cc7\u6599\u8b80\u53d6\u5931\u6557\u3002",
  passwordFailed: "\u5bc6\u78bc\u66f4\u65b0\u5931\u6557\u3002",
  passwordUpdated: "\u5bc6\u78bc\u5df2\u66f4\u65b0\u3002",
  deletionFailed: "\u522a\u9664\u5e33\u6236\u7533\u8acb\u9001\u51fa\u5931\u6557\uff0c\u8acb\u7a0d\u5f8c\u518d\u8a66\u3002",
  deletionSent: "\u5df2\u6536\u5230\u522a\u9664\u6703\u54e1\u5e33\u6236\u7533\u8acb\u3002"
};

const themeOptions: Array<{ value: ThemeChoice; label: string; icon: string }> = [
  { value: "system", label: copy.system, icon: "\u25d0" },
  { value: "dark", label: copy.dark, icon: "\u263e" },
  { value: "light", label: copy.light, icon: "\u2600" }
];

function resolveTheme(choice: ThemeChoice) {
  if (choice !== "system") return choice;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(choice: ThemeChoice) {
  const resolved = resolveTheme(choice);
  document.body.dataset.themeMode = choice;
  document.body.dataset.resolvedTheme = resolved;
  localStorage.setItem("mvp_theme_mode", choice);
}

export default function ProfileClient() {
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [theme, setTheme] = useState<ThemeChoice>("system");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const joinedAt = useMemo(() => {
    if (!profile?.user.createdAt) return "-";
    return new Date(profile.user.createdAt).toLocaleDateString("zh-TW");
  }, [profile?.user.createdAt]);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((response) => response.json())
      .then((body) => setProfile(body))
      .catch(() => setMessage(copy.loadFailed));

    const stored = localStorage.getItem("mvp_theme_mode");
    const nextTheme = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    setTheme(nextTheme);
    applyTheme(nextTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => {
      if ((localStorage.getItem("mvp_theme_mode") || "system") === "system") applyTheme("system");
    };
    media.addEventListener("change", onSystemThemeChange);
    return () => media.removeEventListener("change", onSystemThemeChange);
  }, []);

  function updateTheme(choice: ThemeChoice) {
    setTheme(choice);
    applyTheme(choice);
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setMessage(body.error || copy.passwordFailed);
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setPasswordOpen(false);
    setMessage(copy.passwordUpdated);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    window.location.href = "/login";
  }

  async function logoutAllDevices() {
    setBusy(true);
    await fetch("/api/auth/logout-all", { method: "POST" }).catch(() => null);
    setBusy(false);
    window.location.href = "/login";
  }

  async function requestAccountDeletion() {
    if (deleteRequested) return;
    setBusy(true);
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "account_delete",
        page: "/profile",
        message: "\u4f7f\u7528\u8005\u5f9e\u6703\u54e1\u4e2d\u5fc3\u63d0\u51fa\u522a\u9664 SocialOps Lite \u6703\u54e1\u5e33\u6236\u7533\u8acb\u3002"
      })
    });
    setBusy(false);
    if (!response.ok) {
      setMessage(copy.deletionFailed);
      return;
    }
    setDeleteRequested(true);
    setMessage(copy.deletionSent);
  }

  return (
    <main className="profile-page">
      <section className="profile-panel">
        <div className="profile-header">
          <div>
            <p>{copy.profileCenter}</p>
            <h1>{profile?.user.email || copy.loading}</h1>
          </div>
          <button className="btn" type="button" onClick={() => window.location.href = "/app"}>{copy.backToApp}</button>
        </div>

        <div className="profile-section">
          <h2>{copy.account}</h2>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{profile?.user.email || "-"}</dd>
            </div>
            <div>
              <dt>{copy.joinedAt}</dt>
              <dd>{joinedAt}</dd>
            </div>
          </dl>
        </div>

        <div className="profile-section">
          <h2>{copy.preferences}</h2>
          <div className="profile-setting-row">
            <div className="profile-row-title">
              <span className="profile-row-icon" aria-hidden="true">{"\u25d0"}</span>
              <strong>{copy.appearance}</strong>
            </div>
            <div className="profile-theme-options" role="group" aria-label={copy.appearance}>
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`profile-theme-option ${theme === option.value ? "active" : ""}`}
                  type="button"
                  onClick={() => updateTheme(option.value)}
                >
                  <span className="theme-choice-icon" aria-hidden="true">{option.icon}</span>
                  <strong>{option.label}</strong>
                </button>
              ))}
            </div>
          </div>
          <div className="profile-setting-row compact">
            <div className="profile-row-title">
              <span className="profile-row-icon" aria-hidden="true">{"\u6587"}</span>
              <strong>{copy.language}</strong>
            </div>
            <span className="profile-static-pill">{copy.traditionalChinese}</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>{copy.dataSecurity}</h2>
          <div className="security-list">
            <div className="security-row">
              <div className="profile-row-title">
                <span className="profile-row-icon" aria-hidden="true">{"\u25ce"}</span>
                <strong>{copy.linkedAccounts}</strong>
              </div>
              <button className="btn" type="button" onClick={() => window.location.href = "/accounts"}>{copy.manage}</button>
            </div>
            <div className="security-row">
              <div className="profile-row-title">
                <span className="profile-row-icon" aria-hidden="true">{"\u21aa"}</span>
                <strong>{copy.logoutAll}</strong>
              </div>
              <button className="btn" type="button" onClick={logoutAllDevices} disabled={busy}>{copy.logoutAll}</button>
            </div>
            <div className="security-row danger-zone">
              <div className="profile-row-title">
                <span className="profile-row-icon" aria-hidden="true">{"!"}</span>
                <strong>{copy.deleteMemberAccount}</strong>
              </div>
              <button className="btn danger" type="button" onClick={requestAccountDeletion} disabled={busy || deleteRequested}>
                {deleteRequested ? copy.deletionRequested : copy.requestDeletion}
              </button>
            </div>
          </div>
        </div>

        <div className="profile-section profile-password-section">
          <button className="profile-section-toggle" type="button" onClick={() => setPasswordOpen((open) => !open)}>
            <span>{copy.changePassword}</span>
            <span aria-hidden="true">{passwordOpen ? "\u2303" : "\u2304"}</span>
          </button>
          {passwordOpen ? (
            <form className="profile-form compact-form" onSubmit={changePassword}>
              <label>
                <span>{copy.currentPassword}</span>
                <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" autoComplete="current-password" />
              </label>
              <label>
                <span>{copy.newPassword}</span>
                <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" autoComplete="new-password" minLength={8} required />
              </label>
              <div className="profile-actions">
                <button className="btn" type="button" onClick={() => setPasswordOpen(false)}>{copy.cancel}</button>
                <button className="btn primary" type="submit" disabled={busy}>{busy ? copy.processing : copy.save}</button>
              </div>
            </form>
          ) : null}
        </div>

        {message ? <p className="profile-message global-message">{message}</p> : null}
        <div className="profile-actions bottom-actions">
          <button className="btn" type="button" onClick={logout}>{copy.logout}</button>
        </div>
      </section>
    </main>
  );
}
