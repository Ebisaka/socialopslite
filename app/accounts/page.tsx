import DemoShell from "../demo-shell";
import { appEnvironment, demoToolsEnabled } from "@/lib/app-env";
import { requireUser } from "@/lib/auth";

export default async function AccountsPage() {
  await requireUser();
  return (
    <DemoShell
      initialTab="accounts"
      appEnv={appEnvironment()}
      demoTools={demoToolsEnabled()}
    />
  );
}
