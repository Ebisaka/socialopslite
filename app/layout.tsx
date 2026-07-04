import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialOps Lite",
  description: "一個地方管理 YouTube 內容、帳戶與數據。",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "96x96" },
      { url: "/socialops-logo-small.png", type: "image/png", sizes: "96x96" }
    ],
    apple: [{ url: "/socialops-logo-small.png", type: "image/png", sizes: "96x96" }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body data-resolved-theme="dark">{children}</body>
    </html>
  );
}
