import Link from "next/link";
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
    <main className="page accounts-page">
      <div className="header compact-header">
        <div>
          <p className="eyebrow">帳戶</p>
          <h1>帳戶管理</h1>
        </div>
        <Link className="btn primary" href="/api/oauth/youtube/start">連線 YouTube</Link>
      </div>

      <AccountsClient initialAccounts={initialAccounts} />
    </main>
  );
}
