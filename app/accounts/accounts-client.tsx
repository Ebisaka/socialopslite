"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { YoutubeMark } from "../ui/app-shell";

type IconName = "search" | "edit" | "tag" | "trash" | "heart";

export type ManagedAccount = {
  id: string;
  platform: string;
  platformAccountId: string;
  displayName: string;
  status: string;
  favorite: boolean;
  groupName: string;
  sortOrder: number;
  tokenExpiresAt: string | null;
  createdAt: string;
};

type Props = {
  initialAccounts: ManagedAccount[];
  connectHref: string;
};

function Icon({ name, filled = false }: { name: IconName; filled?: boolean }) {
  if (name === "heart") {
    return (
      <svg className="heart-svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.2s-6.8-4.2-9.2-8.2C.8 8.7 2.7 5 6.4 5c2 0 3.3 1 4.1 2.1C11.3 6 12.6 5 14.6 5c3.7 0 5.6 3.7 3.6 7-2.4 4-9.2 8.2-9.2 8.2Z" fill={filled ? "currentColor" : "none"} />
      </svg>
    );
  }

  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className="ui-svg" viewBox="0 0 24 24" aria-hidden="true">
      {name === "search" ? <><circle cx="10.5" cy="10.5" r="5.8" {...common} /><path d="M15 15l4.5 4.5" {...common} /></> : null}
      {name === "edit" ? <><path d="M12 20h9" {...common} /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7.2 18.8 3 20l1.2-4.2 12.3-12.3z" {...common} /></> : null}
      {name === "tag" ? <><path d="M4 6v6.2c0 .5.2 1 .6 1.4l6.8 6.8c.8.8 2 .8 2.8 0l5.2-5.2c.8-.8.8-2 0-2.8L12.6 5.6A2 2 0 0 0 11.2 5H5a1 1 0 0 0-1 1Z" {...common} /><circle cx="8" cy="9" r="1.3" fill="currentColor" /></> : null}
      {name === "trash" ? <><path d="M5 7h14" {...common} /><path d="M9 7V5h6v2" {...common} /><path d="M8 10v8" {...common} /><path d="M12 10v8" {...common} /><path d="M16 10v8" {...common} /><path d="M7 7l1 14h8l1-14" {...common} /></> : null}
    </svg>
  );
}

function tagsFromGroup(groupName: string) {
  return groupName.split(",").map((tag) => tag.trim()).filter(Boolean);
}

function tagsToGroup(tags: string[]) {
  return tags.join(", ");
}

function statusLabel(status: string) {
  if (status === "authorized") return "已連線";
  if (status === "expired") return "重新確認";
  if (status === "insufficient_scope") return "補齊權限";
  return "需處理";
}

function statusClass(status: string) {
  if (status === "authorized") return "status-dot success";
  if (status === "expired") return "status-dot warning";
  return "status-dot danger";
}

async function updateAccount(id: string, payload: Partial<Pick<ManagedAccount, "favorite" | "groupName" | "sortOrder">>) {
  if (id.startsWith("demo-")) return;
  await fetch("/api/accounts/" + id, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function deleteAccount(id: string) {
  if (id.startsWith("demo-")) return;
  await fetch("/api/accounts/" + id, { method: "DELETE" });
}

export default function AccountsClient({ initialAccounts, connectHref }: Props) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [loading, setLoading] = useState(initialAccounts.length === 0);
  const [filter, setFilter] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingTagsId, setEditingTagsId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/accounts", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        if (alive) setAccounts(data.accounts ?? []);
      })
      .catch(() => {
        if (alive) setAccounts([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  const allTags = useMemo(() => {
    return Array.from(new Set(accounts.flatMap((account) => tagsFromGroup(account.groupName)))).sort((a, b) => a.localeCompare(b, "zh-Hant"));
  }, [accounts]);

  const visibleAccounts = accounts.filter((account) => {
    const tags = tagsFromGroup(account.groupName);
    const keyword = query.trim().toLowerCase();
    const matchesFilter = filter === "all" || (filter === "favorite" ? account.favorite : tags.includes(filter));
    const matchesQuery = !keyword || account.displayName.toLowerCase().includes(keyword) || tags.some((tag) => tag.toLowerCase().includes(keyword));
    return matchesFilter && matchesQuery;
  });

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 1700);
  }

  function patchLocal(id: string, updates: Partial<ManagedAccount>) {
    setAccounts((current) => current.map((account) => account.id === id ? { ...account, ...updates } : account));
  }

  function addPreviewAccount() {
    const index = accounts.length + 1;
    const statuses = ["authorized", "expired", "insufficient_scope"];
    setAccounts((current) => [...current, {
      id: "demo-" + Date.now(),
      platform: "youtube",
      platformAccountId: "demo-" + index,
      displayName: "YouTube 測試帳號 " + index,
      status: statuses[index % statuses.length],
      favorite: index % 3 === 0,
      groupName: index % 2 === 0 ? "工作用, A廠商" : "",
      sortOrder: current.length,
      tokenExpiresAt: null,
      createdAt: new Date().toISOString()
    }]);
    showNotice("已新增測試帳戶");
  }

  async function toggleFavorite(account: ManagedAccount) {
    if (!editing) return;
    const next = !account.favorite;
    patchLocal(account.id, { favorite: next });
    await updateAccount(account.id, { favorite: next });
  }

  async function addTag(account: ManagedAccount) {
    const clean = newTag.trim();
    if (!clean) return;
    const tags = tagsFromGroup(account.groupName);
    if (!tags.includes(clean)) {
      const groupName = tagsToGroup([...tags, clean]);
      patchLocal(account.id, { groupName });
      await updateAccount(account.id, { groupName });
    }
    setNewTag("");
  }

  async function removeTag(account: ManagedAccount, tag: string) {
    const groupName = tagsToGroup(tagsFromGroup(account.groupName).filter((item) => item !== tag));
    patchLocal(account.id, { groupName });
    await updateAccount(account.id, { groupName });
  }

  async function confirmDelete() {
    if (!confirmDeleteId) return;
    setAccounts((current) => current.filter((account) => account.id !== confirmDeleteId));
    await deleteAccount(confirmDeleteId);
    setConfirmDeleteId(null);
    showNotice("已移除帳戶");
  }

  return (
    <section className={editing ? "panel account-manager editing" : "panel account-manager"}>
      <div className="panel-head">
        <h2>帳號管理</h2>
        <div className="toolbar">
          <button className="btn" type="button" onClick={addPreviewAccount}>新增帳戶</button>
          <Link className="btn primary" href={connectHref}>連線 YouTube</Link>
        </div>
      </div>

      <div className="account-filter-row">
        <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="篩選帳號">
          <option value="all">全部帳號</option>
          <option value="favorite">我的最愛</option>
          {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
        </select>
        <div className="account-filter-actions">
          <button className="account-search-toggle" type="button" aria-label="搜尋帳戶" onClick={() => setSearchOpen((value) => !value)}><Icon name="search" /></button>
          <button className={editing ? "account-edit-toggle active" : "account-edit-toggle"} type="button" aria-label="編輯帳戶" onClick={() => setEditing((value) => !value)}><Icon name="edit" /></button>
        </div>
      </div>
      {searchOpen ? <input className="account-search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋帳戶或標籤" autoFocus /> : null}

      <div className="account-list">
        {loading ? <div className="empty account-empty">正在載入帳戶</div> : null}
        {!loading && visibleAccounts.length === 0 ? <div className="empty account-empty">尚未連線帳戶</div> : null}
        {visibleAccounts.map((account) => {
          const tags = tagsFromGroup(account.groupName);
          const tagEditorOpen = editingTagsId === account.id;
          return (
            <article className="account-card" key={account.id}>
              <button className={account.favorite ? "heart filled" : "heart"} type="button" aria-label="我的最愛" onClick={() => toggleFavorite(account)}>
                {account.favorite || editing ? <Icon name="heart" filled={account.favorite} /> : null}
              </button>
              <div className="youtube-mark"><YoutubeMark /></div>
              <div className="account-main">
                <div className="account-title-row">
                  <strong>{account.displayName}</strong>
                  <button className={statusClass(account.status)} type="button" title={statusLabel(account.status)} aria-label={statusLabel(account.status)} />
                  {account.status !== "authorized" ? <span className="status-action">{statusLabel(account.status)} →</span> : null}
                </div>
                {tags.length > 0 ? (
                  <div className="tag-line">
                    <span className="tag-icon"><Icon name="tag" /></span>
                    {tags.map((tag, index) => (
                      <span className="tag-text" key={tag}>
                        {tag}
                        {editing ? <button type="button" aria-label={"移除 " + tag} onClick={() => removeTag(account, tag)}>×</button> : null}
                        {index < tags.length - 1 ? <span className="comma">,</span> : null}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {editing ? (
                <div className="edit-actions">
                  <button className="icon-btn" type="button" aria-label="編輯標籤" onClick={() => setEditingTagsId(tagEditorOpen ? null : account.id)}><Icon name="tag" /></button>
                  <button className="icon-btn danger" type="button" aria-label="移除帳戶" onClick={() => setConfirmDeleteId(account.id)}><Icon name="trash" /></button>
                </div>
              ) : null}
              {tagEditorOpen ? (
                <div className="tag-editor">
                  <input value={newTag} onChange={(event) => setNewTag(event.target.value)} onKeyDown={(event) => {
                    if (event.key === "Enter") addTag(account);
                    if (event.key === "Escape") setEditingTagsId(null);
                  }} placeholder="新增標籤" autoFocus />
                  <button className="icon-btn add" type="button" onClick={() => addTag(account)}>+</button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {confirmDeleteId ? (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h2>移除帳戶？</h2>
            <p>這只會從 SocialOps Lite 移除連線資料，不會刪除你的 YouTube 帳號。</p>
            <div className="modal-actions">
              <button className="btn" type="button" onClick={() => setConfirmDeleteId(null)}>取消</button>
              <button className="btn danger-fill" type="button" onClick={confirmDelete}>移除</button>
            </div>
          </div>
        </div>
      ) : null}

      {notice ? <div className="toast">{notice}</div> : null}
    </section>
  );
}
