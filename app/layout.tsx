import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "./ui/app-shell";

export const metadata: Metadata = {
  title: "SocialOps Lite",
  description: "YouTube 帳戶管理、內容發文與營運洞察工具"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
