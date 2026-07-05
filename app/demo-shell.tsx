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
  const buildVersion = "20260705-runtime-clean-8";
  const runtimeConfig = { appEnv, demoTools, initialTab };
  const loaderScript = `
    window.SOCIALOPS_CONFIG = ${JSON.stringify(runtimeConfig)};
    (function(){
      var version = ${JSON.stringify(buildVersion)};
      var files = ["core.js", "compat-overrides.js", "runtime-overrides.js"];
      var previous = document.querySelectorAll("script[data-socialops-runtime='true']");
      previous.forEach(function(script){ script.remove(); });
      function loadNext(index){
        if(index >= files.length) return;
        var script = document.createElement("script");
        script.src = "/socialops/" + files[index] + "?v=" + version;
        script.dataset.socialopsRuntime = "true";
        script.async = false;
        script.onload = function(){ loadNext(index + 1); };
        script.onerror = function(){ console.error("SocialOps runtime failed to load", script.src); };
        document.body.appendChild(script);
      }
      loadNext(0);
    })();
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
      <div
        data-socialops-build={`demo-parity-${buildVersion}`}
        data-socialops-env={appEnv}
        data-demo-tools={demoTools ? "true" : "false"}
        data-initial-tab={initialTab}
        dangerouslySetInnerHTML={{ __html: demoMarkup }}
      />
      <Script
        id={`socialops-runtime-loader-${buildVersion}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: loaderScript }}
      />
    </>
  );
}





