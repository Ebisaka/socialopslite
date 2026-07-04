import DemoShell from "../demo-shell";
import { appEnvironment, demoToolsEnabled } from "@/lib/app-env";

export default function ComposerPage() {
  return (
    <DemoShell
      initialTab="composer"
      appEnv={appEnvironment()}
      demoTools={demoToolsEnabled()}
    />
  );
}
