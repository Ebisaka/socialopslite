import DemoShell from "./demo-shell";
import { appEnvironment, demoToolsEnabled } from "@/lib/app-env";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  await requireUser();
  return (
    <DemoShell
      initialTab="dashboard"
      appEnv={appEnvironment()}
      demoTools={demoToolsEnabled()}
    />
  );
}
