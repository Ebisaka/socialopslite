import DemoShell from "./demo-shell";
import { appEnvironment, demoToolsEnabled } from "@/lib/app-env";

export default function DashboardPage() {
  return (
    <DemoShell
      initialTab="dashboard"
      appEnv={appEnvironment()}
      demoTools={demoToolsEnabled()}
    />
  );
}
