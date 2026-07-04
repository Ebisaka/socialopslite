import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginClient from "./login-client";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/app");
  return <LoginClient />;
}
