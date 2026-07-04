"use client";

import { useState } from "react";

type Mode = "login" | "register";

export default function LoginClient() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const body = await response.json().catch(() => ({}));

    setBusy(false);
    if (!response.ok) {
      setMessage(body.error || "登入失敗，請稍後再試。");
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
        <h1>{mode === "login" ? "登入" : "註冊帳戶"}</h1>
        <form className="auth-form" onSubmit={submit}>
          <label>
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
          </label>
          <label>
            <span>密碼</span>
            <div className="password-field">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={8}
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
                title={showPassword ? "隱藏密碼" : "顯示密碼"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.3 5.4A9.3 9.3 0 0 1 12 5c5 0 8.5 4.2 9.6 6.1a1.7 1.7 0 0 1 0 1.8 16.2 16.2 0 0 1-2.2 2.8" />
                    <path d="M6.5 6.7a16.3 16.3 0 0 0-4.1 4.4 1.7 1.7 0 0 0 0 1.8C3.5 14.8 7 19 12 19c1.3 0 2.6-.3 3.7-.8" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2.4 11.1a1.7 1.7 0 0 0 0 1.8C3.5 14.8 7 19 12 19s8.5-4.2 9.6-6.1a1.7 1.7 0 0 0 0-1.8C20.5 9.2 17 5 12 5s-8.5 4.2-9.6 6.1Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>
          {message ? <p className="auth-message">{message}</p> : null}
          <button className="btn primary auth-submit" type="submit" disabled={busy}>
            {busy ? "處理中" : mode === "login" ? "登入" : "註冊"}
          </button>
        </form>
        <a className="auth-google" href="/api/auth/google/start">使用 Google 登入</a>
        <button className="auth-toggle" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "還沒有帳戶？建立一個帳戶" : "已經有帳戶？回到登入"}
        </button>
      </section>
    </main>
  );
}
