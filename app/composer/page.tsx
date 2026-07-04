import DemoShell from "../demo-shell";
import { appEnvironment, demoToolsEnabled } from "@/lib/app-env";
import { requireUser } from "@/lib/auth";

export default async function ComposerPage() {
  await requireUser();
  return (
    <DemoShell
      initialTab="composer"
      appEnv={appEnvironment()}
      demoTools={demoToolsEnabled()}
    />
  );
}
