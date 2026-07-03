"use client";

import { useMemo, useState } from "react";

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
};

function statusLabel(status: string) {
  if (status === "authorized") return "已連線";
  if (status === "expired") return "需重新確認";
  if (status === "insufficient_scope") return "需補齊權限";
  return "需處理";
}

function statusClass(status: string) {
  if (status === "authorized") return "status-dot success";
  if (status === "expired") return "status-dot warning";
  return "status-dot danger";
}

function tagsFromGroup(groupName: string) {
  return groupName.split(",").map((tag) => tag.trim()).filter(Boolean);
}

function tagsToGroup(tags: string[]) {
  return tags.map((tag) => tag.trim()).filter(Boolean).join(", ");
}

async function updateAccount(id: string, payload: Partial<Pick<ManagedAccount, "favorite" | "groupName" | "sortOrder">>) {
  const response = await fetch("/api/accounts/" + id, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("帳戶更新失敗");
  return response.json();
}

async function deleteAccount(id: string) {
  const response = await fetch("/api/accounts/" + id, { method: "DELETE" });
  if (!response.ok) throw new Error("帳戶移除失敗");
}

export default function AccountsClient({ initialAccounts }: Props) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [filter, setFilter] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingTagsId, setEditingTagsId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dragAccountId, setDragAccountId] = useState<string | null>(null);
  const [dragTag, setDragTag] = useState<{ accountId: string; tag: string } | null>(null);

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
    window.setTimeout(() => setNotice(null), 1800);
  }

  function patchLocal(id: string, updates: Partial<ManagedAccount>) {
    setAccounts((current) => current.map((account) => account.id === id ? { ...account, ...updates } : account));
  }

  async function toggleFavorite(account: ManagedAccount) {
    if (!editing) return;
    const next = !account.favorite;
    patchLocal(account.id, { favorite: next });
    try {
      await updateAccount(account.id, { favorite: next });
      showNotice(next ? "已加入我的最愛" : "已移除我的最愛");
    } catch {
      patchLocal(account.id, { favorite: account.favorite });
      showNotice("更新失敗，請稍後再試");
    }
  }

  async function saveTags(account: ManagedAccount, tags: string[]) {
    const groupName = tagsToGroup(tags);
    patchLocal(account.id, { groupName });
    try {
      await updateAccount(account.id, { groupName });
      showNotice("標籤已更新");
    } catch {
      patchLocal(account.id, { groupName: account.groupName });
      showNotice("標籤更新失敗");
    }
  }

  async function addTag(account: ManagedAccount, tag: string) {
    const clean = tag.trim();
    if (!clean) return;
    const tags = tagsFromGroup(account.groupName);
    if (!tags.includes(clean)) await saveTags(account, [...tags, clean]);
    setNewTag("");
  }

  async function removeTag(account: ManagedAccount, tag: string) {
    await saveTags(account, tagsFromGroup(account.groupName).filter((item) => item !== tag));
  }

  async function reorderTag(account: ManagedAccount, targetTag: string) {
    if (!dragTag || dragTag.accountId !== account.id || dragTag.tag === targetTag) return;
    const tags = tagsFromGroup(account.groupName);
    const from = tags.indexOf(dragTag.tag);
    const to = tags.indexOf(targetTag);
    if (from < 0 || to < 0) return;
    const next = [...tags];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setDragTag(null);
    await saveTags(account, next);
  }

  async function reorderAccount(targetId: string) {
    if (!editing || !dragAccountId || dragAccountId === targetId) return;
    const from = accounts.findIndex((account) => account.id === dragAccountId);
    const to = accounts.findIndex((account) => account.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...accounts];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const reordered = next.map((account, index) => ({ ...account, sortOrder: index }));
    setAccounts(reordered);
    setDragAccountId(null);
    try {
      await Promise.all(reordered.map((account) => updateAccount(account.id, { sortOrder: account.sortOrder })));
      showNotice("排序已更新");
    } catch {
      setAccounts(accounts);
      showNotice("排序更新失敗");
    }
  }

  async function confirmDelete() {
    if (!confirmDeleteId) return;
    const original = accounts;
    setAccounts((current) => current.filter((account) => account.id !== confirmDeleteId));
    try {
      await deleteAccount(confirmDeleteId);
      setConfirmDeleteId(null);
      showNotice("帳戶已移除");
    } catch {
      setAccounts(original);
      showNotice("移除失敗，請稍後再試");
    }
  }

  function closeTagEditor() {
    setEditingTagsId(null);
    setNewTag("");
  }

  return (
    <section className={editing ? "panel account-manager editing" : "panel account-manager"}>
      <div className="account-toolbar">
        <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="篩選帳戶">
          <option value="all">全部帳戶</option>
          <option value="favorite">我的最愛</option>
          {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
        </select>
        <button className="icon-btn" type="button" aria-label="搜尋帳戶" onClick={() => setSearchOpen((open) => !open)}>⌕</button>
        <button className={editing ? "icon-btn active" : "icon-btn"} type="button" aria-label="編輯帳戶" onClick={() => { setEditing((value) => !value); closeTagEditor(); }}>✎</button>
        {searchOpen ? (
          <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋帳戶或標籤" autoFocus />
        ) : null}
      </div>

      {visibleAccounts.length === 0 ? (
        <div className="empty">
          <strong>{accounts.length === 0 ? "尚未連線 YouTube" : "沒有符合條件的帳戶"}</strong>
          <p>{accounts.length === 0 ? "點選右上角連線 YouTube，授權完成後會出現在這裡。" : "可以調整篩選條件或搜尋字詞。"}</p>
        </div>
      ) : (
        <div className="account-list">
          {visibleAccounts.map((account) => {
            const tags = tagsFromGroup(account.groupName);
            const tagEditorOpen = editingTagsId === account.id;
            return (
              <div className="account-row" key={account.id} onDragOver={(event) => editing && event.preventDefault()} onDrop={() => reorderAccount(account.id)}>
                {editing ? (
                  <button className="drag-handle" type="button" aria-label="拖曳排序" draggable onDragStart={() => setDragAccountId(account.id)} onDragEnd={() => setDragAccountId(null)}>⋮⋮</button>
                ) : null}
                <article className="account-card-formal">
                  <button className={account.favorite ? "heart filled" : "heart"} type="button" aria-label="我的最愛" onClick={() => toggleFavorite(account)}>{account.favorite || editing ? "♥" : ""}</button>
                  <div className="youtube-mark">▶</div>
                  <div className="account-main">
                    <div className="account-title-row">
                      <strong>{account.displayName}</strong>
                      <button className={statusClass(account.status)} type="button" title={statusLabel(account.status)} aria-label={statusLabel(account.status)} />
                      {account.status !== "authorized" ? <span className="status-action">{statusLabel(account.status)} →</span> : null}
                    </div>
                    {tags.length > 0 ? (
                      <div className="tag-line">
                        <span className="tag-icon">⌁</span>
                        {tags.map((tag, index) => (
                          <span className="tag-text" key={tag} draggable={editing} onDragStart={() => editing && setDragTag({ accountId: account.id, tag })} onDragOver={(event) => editing && event.preventDefault()} onDrop={() => reorderTag(account, tag)}>
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
                      <button className="icon-btn" type="button" aria-label="編輯標籤" onClick={() => setEditingTagsId(tagEditorOpen ? null : account.id)}>⌁</button>
                      <button className="icon-btn danger" type="button" aria-label="移除帳戶" onClick={() => setConfirmDeleteId(account.id)}>⌫</button>
                    </div>
                  ) : null}
                  {tagEditorOpen ? (
                    <div className="tag-editor">
                      <input value={newTag} onChange={(event) => setNewTag(event.target.value)} onKeyDown={(event) => {
                        if (event.key === "Enter") addTag(account, newTag);
                        if (event.key === "Escape") closeTagEditor();
                      }} placeholder="新增標籤" autoFocus />
                      <button className="icon-btn add" type="button" onClick={() => addTag(account, newTag)}>＋</button>
                    </div>
                  ) : null}
                </article>
              </div>
            );
          })}
        </div>
      )}

      {confirmDeleteId ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h2>移除帳戶？</h2>
            <p>這只會移除 SocialOps Lite 中的連線資料，不會刪除你的 YouTube 帳號。</p>
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
