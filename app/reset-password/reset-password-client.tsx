"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("兩次輸入的密碼不一致。");
      return;
    }
    setBusy(true);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setMessage(body.error || "重設失敗，請重新申請。");
      return;
    }
    window.location.href = "/app";
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <img src="/socialops-logo.png" alt="SocialOps Lite" />
          <strong>SocialOps Lite</strong>
        </div>
        <h1>設定新密碼</h1>
        <form className="auth-form" onSubmit={submit}>
          <label>
            <span>新密碼</span>
            <div className="password-field">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
                onClick={() => setShowPassword((value) => !value)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.4 11.1a1.7 1.7 0 0 0 0 1.8C3.5 14.8 7 19 12 19s8.5-4.2 9.6-6.1a1.7 1.7 0 0 0 0-1.8C20.5 9.2 17 5 12 5s-8.5 4.2-9.6 6.1Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </label>
          <label>
            <span>確認新密碼</span>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
            />
          </label>
          {message ? <p className="auth-message">{message}</p> : null}
          <button className="btn primary auth-submit" type="submit" disabled={busy || !token}>
            {busy ? "處理中" : "更新密碼"}
          </button>
        </form>
      </section>
    </main>
  );
}
