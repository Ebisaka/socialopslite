"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { demoMarkup } from "./ui/demo-markup";

declare global {
  interface Window {
    SOCIALOPS_CONFIG?: {
      appEnv: "production" | "preview" | "development";
      demoTools: boolean;
      initialTab: "dashboard" | "accounts" | "composer";
    };
  }
}

type DemoShellProps = {
  initialTab?: "dashboard" | "accounts" | "composer";
  appEnv?: "production" | "preview" | "development";
  demoTools?: boolean;
};

export default function DemoShell({
  initialTab = "dashboard",
  appEnv = "production",
  demoTools = false
}: DemoShellProps) {
  const mountedRef = useRef(false);
  const buildVersion = "20260705-runtime-clean-1";
  const configScript = `
    window.SOCIALOPS_CONFIG = ${JSON.stringify({ appEnv, demoTools, initialTab })};
  `;

  useEffect(() => {
    window.SOCIALOPS_CONFIG = { appEnv, demoTools, initialTab };
    if (!demoTools) {
      document.querySelector("#addDemoAccountBtn")?.remove();
    }
    if (mountedRef.current) return;
    mountedRef.current = true;
  }, [initialTab, appEnv, demoTools]);

  return (
    <>
      <Script
        id="socialops-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: configScript }}
      />
      <div
        data-socialops-build={`demo-parity-${buildVersion}`}
        data-socialops-env={appEnv}
        data-demo-tools={demoTools ? "true" : "false"}
        data-initial-tab={initialTab}
        dangerouslySetInnerHTML={{ __html: demoMarkup }}
      />
      <Script
        src={`/socialops/core.js?v=${buildVersion}`}
        strategy="afterInteractive"
        data-socialops-runtime="true"
      />
      <Script
        src={`/socialops/compat-overrides.js?v=${buildVersion}`}
        strategy="afterInteractive"
        data-socialops-runtime="true"
      />
      <Script
        src={`/socialops/runtime-overrides.js?v=${buildVersion}`}
        strategy="afterInteractive"
        data-socialops-runtime="true"
      />
    </>
  );
}







