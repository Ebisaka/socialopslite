"use client";

import { useEffect, useMemo, useState } from "react";

type ThemeChoice = "system" | "light" | "dark";

type ProfilePayload = {
  user: {
    email: string;
    createdAt: string;
  };
};

const themeOptions: Array<{ value: ThemeChoice; label: string; hint: string }> = [
  { value: "system", label: "跟隨系統", hint: "依照裝置目前外觀" },
  { value: "dark", label: "深色模式", hint: "預設工作區外觀" },
  { value: "light", label: "淺色模式", hint: "明亮環境使用" }
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

  const joinedAt = useMemo(() => {
    if (!profile?.user.createdAt) return "-";
    return new Date(profile.user.createdAt).toLocaleDateString("zh-TW");
  }, [profile?.user.createdAt]);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((response) => response.json())
      .then((body) => setProfile(body))
      .catch(() => setMessage("會員資料讀取失敗。"));

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
      setMessage(body.error || "密碼更新失敗。");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setMessage("密碼已更新。");
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
        message: "使用者從會員中心提出刪除 SocialOps Lite 會員帳戶申請。"
      })
    });
    setBusy(false);
    if (!response.ok) {
      setMessage("刪除帳戶申請送出失敗，請稍後再試。");
      return;
    }
    setDeleteRequested(true);
    setMessage("已收到刪除會員帳戶申請。");
  }

  return (
    <main className="profile-page">
      <section className="profile-panel">
        <div className="profile-header">
          <div>
            <p>會員中心</p>
            <h1>{profile?.user.email || "讀取中"}</h1>
          </div>
          <button className="btn" type="button" onClick={() => window.location.href = "/app"}>回工作區</button>
        </div>

        <div className="profile-section">
          <h2>帳戶</h2>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{profile?.user.email || "-"}</dd>
            </div>
            <div>
              <dt>加入時間</dt>
              <dd>{joinedAt}</dd>
            </div>
          </dl>
        </div>

        <div className="profile-section">
          <h2>偏好設定</h2>
          <div className="profile-setting-row">
            <div>
              <strong>外觀模式</strong>
              <span>此設定會套用到登入後的工作區。</span>
            </div>
            <div className="profile-theme-options" role="group" aria-label="外觀模式">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`profile-theme-option ${theme === option.value ? "active" : ""}`}
                  type="button"
                  onClick={() => updateTheme(option.value)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.hint}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="profile-setting-row compact">
            <div>
              <strong>語言</strong>
              <span>目前預設使用繁體中文。</span>
            </div>
            <span className="profile-static-pill">繁體中文</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>資料與安全</h2>
          <div className="security-list">
            <div className="security-row">
              <div>
                <strong>連線帳號管理</strong>
                <span>管理已連線的 YouTube 帳號，包含重新確認、補齊權限與移除連線。</span>
              </div>
              <button className="btn" type="button" onClick={() => window.location.href = "/accounts"}>前往帳號頁</button>
            </div>
            <div className="security-row">
              <div>
                <strong>登出所有裝置</strong>
                <span>讓其他裝置上的登入狀態一併失效。</span>
              </div>
              <button className="btn" type="button" onClick={logoutAllDevices} disabled={busy}>登出所有裝置</button>
            </div>
            <div className="security-row danger-zone">
              <div>
                <strong>刪除 SocialOps 會員帳戶</strong>
                <span>這不是移除 YouTube 連線；送出後會進入站方處理流程。</span>
              </div>
              <button className="btn danger" type="button" onClick={requestAccountDeletion} disabled={busy || deleteRequested}>
                {deleteRequested ? "已送出申請" : "申請刪除"}
              </button>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>變更密碼</h2>
          <form className="profile-form" onSubmit={changePassword}>
            <label>
              <span>目前密碼</span>
              <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" autoComplete="current-password" />
            </label>
            <label>
              <span>新密碼</span>
              <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" autoComplete="new-password" minLength={8} required />
            </label>
            {message ? <p className="profile-message">{message}</p> : null}
            <div className="profile-actions">
              <button className="btn primary" type="submit" disabled={busy}>{busy ? "處理中" : "儲存"}</button>
              <button className="btn" type="button" onClick={logout}>登出</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
