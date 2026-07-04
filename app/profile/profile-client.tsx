"use client";

import { useEffect, useState } from "react";

type ProfilePayload = {
  user: {
    email: string;
    createdAt: string;
  };
  stats: {
    socialAccounts: number;
    publishTasks: number;
  };
};

export default function ProfileClient() {
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((response) => response.json())
      .then((body) => setProfile(body))
      .catch(() => setMessage("會員資料讀取失敗。"));
  }, []);

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

        <div className="profile-grid">
          <div className="profile-card">
            <span>已連線帳號</span>
            <strong>{profile?.stats.socialAccounts ?? "-"}</strong>
          </div>
          <div className="profile-card">
            <span>發文任務</span>
            <strong>{profile?.stats.publishTasks ?? "-"}</strong>
          </div>
        </div>

        <div className="profile-section">
          <h2>帳戶資料</h2>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{profile?.user.email || "-"}</dd>
            </div>
            <div>
              <dt>加入時間</dt>
              <dd>{profile?.user.createdAt ? new Date(profile.user.createdAt).toLocaleDateString("zh-TW") : "-"}</dd>
            </div>
          </dl>
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
