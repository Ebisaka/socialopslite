import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "./ui/app-shell";

export const metadata: Metadata = {
  title: "SocialOps Lite",
  description: "YouTube ????????????????"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body data-resolved-theme="dark">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
