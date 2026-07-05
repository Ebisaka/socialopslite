"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    localStorage.setItem("mvp_active_tab", initialTab);
    window.SOCIALOPS_CONFIG = { appEnv, demoTools, initialTab };
    if (!demoTools) {
      document.querySelector("#addDemoAccountBtn")?.remove();
    }
    if (mountedRef.current) return;
    mountedRef.current = true;
    document
      .querySelectorAll('script[data-socialops-runtime="true"]')
      .forEach((node) => node.remove());
    document
      .querySelectorAll('script[data-socialops-demo="true"]')
      .forEach((node) => node.remove());

    const coreScript = document.createElement("script");
    const compatScript = document.createElement("script");
    const overrideScript = document.createElement("script");
    coreScript.src = "/socialops/core.js?v=20260705-cleanup-2";
    compatScript.src = "/socialops/compat-overrides.js?v=20260705-cleanup-2";
    overrideScript.src = "/socialops/runtime-overrides.js?v=20260705-cleanup-2";
    coreScript.dataset.socialopsRuntime = "true";
    compatScript.dataset.socialopsRuntime = "true";
    overrideScript.dataset.socialopsRuntime = "true";
    coreScript.async = false;
    compatScript.async = false;
    overrideScript.async = false;
    coreScript.onload = () => {
      if (!document.body.contains(compatScript)) {
        document.body.appendChild(compatScript);
      }
    };
    compatScript.onload = () => {
      if (!document.body.contains(overrideScript)) {
        document.body.appendChild(overrideScript);
      }
    };
    document.body.appendChild(coreScript);
    return () => {
      coreScript.remove();
      compatScript.remove();
      overrideScript.remove();
    };
  }, [initialTab, appEnv, demoTools]);

  return (
    <div
      data-socialops-build="demo-parity-20260705-cleanup-2"
      data-socialops-env={appEnv}
      data-demo-tools={demoTools ? "true" : "false"}
      dangerouslySetInnerHTML={{ __html: demoMarkup }}
    />
  );
}





