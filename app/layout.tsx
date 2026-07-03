import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialOps Lite",
  description: "YouTube ????????????????"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" style={{ backgroundColor: "#0b0f14" }}>
      <body
        data-resolved-theme="dark"
        style={{ backgroundColor: "#0b0f14" }}
      >
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.style.backgroundColor='#0b0f14';document.body&&document.body.style.setProperty('background-color','#0b0f14','important');"
          }}
        />
        {children}
      </body>
    </html>
  );
}
