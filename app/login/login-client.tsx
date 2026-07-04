"use client";

import { useState } from "react";

type Mode = "login" | "register";

export default function LoginClient() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

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
        <h1>{mode === "login" ? "登入" : "建立帳戶"}</h1>
        <form className="auth-form" onSubmit={submit}>
          <label>
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
          </label>
          <label>
            <span>密碼</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} />
          </label>
          {message ? <p className="auth-message">{message}</p> : null}
          <button className="btn primary auth-submit" type="submit" disabled={busy}>
            {busy ? "處理中" : mode === "login" ? "登入" : "註冊"}
          </button>
        </form>
        <a className="auth-google" href="/api/auth/google/start">使用 Google 登入</a>
        <button className="auth-toggle" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "還沒有帳戶？建立帳戶" : "已經有帳戶？登入"}
        </button>
      </section>
    </main>
  );
}
