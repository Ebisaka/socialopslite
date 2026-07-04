import DemoShell from "../demo-shell";
import { appEnvironment, demoToolsEnabled } from "@/lib/app-env";

export default function AccountsPage() {
  return (
    <DemoShell
      initialTab="accounts"
      appEnv={appEnvironment()}
      demoTools={demoToolsEnabled()}
    />
  );
}
