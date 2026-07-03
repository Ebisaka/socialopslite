import AccountsClient from "./accounts-client";

export default function AccountsPage() {
  return (
    <section className="accounts-page">
      <AccountsClient initialAccounts={[]} connectHref="/api/oauth/youtube/start" />
    </section>
  );
}
