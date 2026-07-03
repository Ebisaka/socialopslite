import { prisma } from "@/lib/prisma";
import { ensureDemoUser } from "@/lib/demo-user";
import AccountsClient, { ManagedAccount } from "./accounts-client";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const user = await ensureDemoUser();
  const accounts = await prisma.socialAccount.findMany({
    where: { userId: user.id, platform: "youtube" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      platform: true,
      platformAccountId: true,
      displayName: true,
      status: true,
      favorite: true,
      groupName: true,
      sortOrder: true,
      tokenExpiresAt: true,
      createdAt: true
    }
  });

  const initialAccounts: ManagedAccount[] = accounts.map((account) => ({
    ...account,
    tokenExpiresAt: account.tokenExpiresAt?.toISOString() ?? null,
    createdAt: account.createdAt.toISOString()
  }));

  return (
    <section className="accounts-page">
      <AccountsClient initialAccounts={initialAccounts} connectHref="/api/oauth/youtube/start" />
    </section>
  );
}
