import { requireUser } from "@/lib/auth";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  await requireUser();
  return <ProfileClient />;
}
