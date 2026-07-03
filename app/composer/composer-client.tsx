"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { YoutubeMark } from "../ui/app-shell";

type Account = {
  id: string;
  displayName: string;
  status: string;
};

const categories = [
  "人物與網誌",
  "汽車與車輛",
  "非營利組織與社運活動",
  "科學與科技",
  "音樂",
  "娛樂",
  "旅遊與活動",
  "教育",
  "喜劇",
  "新聞與政治",
  "遊戲",
  "電影與動畫",
  "寵物與動物",
  "體育",
  "DIY 教學與生活風格"
];

function ActionIcon({ type }: { type: "addFolder" | "trash" }) {
  if (type === "addFolder") {
    return <svg className="action-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7.5h5.1l1.6 2H19a2 2 0 0 1 2 2v5.8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2Z" /><path d="M12 12.2v4.2" /><path d="M9.9 14.3h4.2" /></svg>;
  }
  return <svg className="action-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6.5h15" /><path d="M9.5 6.5V4.8h5v1.7" /><path d="M7.2 9.2l.7 9.2a2 2 0 0 0 2 1.8h4.2a2 2 0 0 0 2-1.8l.7-9.2" /><path d="M10.4 11.5v5" /><path d="M13.6 11.5v5" /></svg>;
}

export default function ComposerClient() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);

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
        if (alive) setLoaded(true);
      });
    return () => { alive = false; };
  }, []);

  return (
    <section className="section active composer-page" id="composer">
      <div className="composer-layout">
        <div className="composer-main">
          <div className="panel composer-editor">
            <div className="panel-head"><div><h2>內容編輯</h2></div></div>

            <div className="publish-targets">
              <label className="hint">發布目標</label>
              {!loaded ? <div className="target-empty">正在載入帳戶</div> : null}
              {loaded && accounts.length === 0 ? <Link className="target-empty" href="/accounts">先連線 YouTube 帳戶</Link> : null}
              {accounts.length > 0 ? (
                <div className="target-list">
                  {accounts.map((account, index) => (
                    <label className="target-card" key={account.id}>
                      <input type="checkbox" defaultChecked={index === 0} />
                      <YoutubeMark />
                      <strong>{account.displayName}</strong>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="composer-block">
              <h3>影片與內容</h3>
              <div className="form-grid composer-form">
                <div className="field required-field" data-field="title">
                  <label>標題 <span className="required-mark">*</span></label>
                  <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="輸入影片標題" />
                </div>
                <div className="field">
                  <label>內容類型</label>
                  <select defaultValue="video"><option value="video">一般影片</option><option value="shorts">Shorts</option></select>
                </div>
                <div className="field full">
                  <label>說明</label>
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="輸入影片說明，可加入連結、章節或補充資訊" />
                </div>
                <div className="upload-grid full field" data-field="media">
                  <div className="upload-item"><label className="upload-card"><input type="file" accept="video/*" /><span>上傳影片 <span className="required-mark">*</span></span><strong>尚未選擇影片</strong></label></div>
                  <div className="upload-item"><label className="upload-card"><input type="file" accept="image/*" /><span>封面圖</span><strong>尚未選擇封面</strong></label></div>
                </div>
              </div>
            </div>

            <div className="composer-block">
              <h3>發布設定</h3>
              <div className="form-grid composer-form">
                <div className="field"><label>發文方式</label><select defaultValue="schedule"><option value="now">立即發布</option><option value="schedule">排程發布</option><option value="draft">儲存草稿</option></select></div>
                <div className="field"><label>瀏覽權限</label><select defaultValue="private"><option value="private">私人</option><option value="unlisted">不公開</option><option value="public">公開</option></select></div>
                <div className="field"><label>時間</label><input type="datetime-local" /></div>
                <div className="field"><label>播放清單</label><div className="inline-control playlist-control"><select defaultValue=""><option value=""></option></select><button className="btn icon-action" type="button" title="新增播放清單" aria-label="新增播放清單"><ActionIcon type="addFolder" /></button><button className="btn icon-action danger-soft" type="button" title="刪除播放清單" aria-label="刪除播放清單"><ActionIcon type="trash" /></button></div></div>
              </div>
            </div>

            <details className="advanced-settings" open={advancedOpen} onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}>
              <summary><span className="advanced-summary-title"><span>進階設定</span><button className="info-button summary-info" type="button" aria-label="進階設定說明">i</button></span></summary>
              <div className="advanced-groups">
                <section className="advanced-group">
                  <h4>目標觀眾</h4>
                  <div className="audience-block required-choice" data-field="audience">
                    <label className="audience-question">這是兒童專屬的影片嗎？ <span className="required-mark">*</span></label>
                    <div className="choice-row audience-choice-row">
                      <label className="audience-option"><input type="radio" name="audienceChoice" value="kids" /> 是，這是兒童專屬的影片</label>
                      <label className="audience-option"><input type="radio" name="audienceChoice" value="notKids" defaultChecked /> 否，這不是兒童專屬的影片</label>
                    </div>
                  </div>
                  <details className="age-settings" open>
                    <summary><span>年齡限制</span></summary>
                    <label className="audience-question">是否要將影片設為僅限成人觀眾收看？</label>
                    <div className="choice-row audience-choice-row">
                      <label className="audience-option"><input type="radio" name="ageChoice" value="adult" /> 是，將影片設為僅限年滿 18 歲的觀眾收看</label>
                      <label className="audience-option"><input type="radio" name="ageChoice" value="none" defaultChecked /> 否，不要將我的影片設為僅限年滿 18 歲的觀眾收看</label>
                    </div>
                  </details>
                </section>

                <section className="advanced-group">
                  <h4>內容揭露</h4>
                  <label className="check-field"><input type="checkbox" /> 內容包含付費宣傳</label>
                  <label className="check-field"><input type="checkbox" /> 內容包含需揭露的 AI 內容</label>
                </section>

                <section className="advanced-group">
                  <h4>影片設定</h4>
                  <div className="form-grid composer-form">
                    <div className="field"><label>類別</label><select defaultValue="娛樂">{categories.map((category) => <option value={category} key={category}>{category}</option>)}</select></div>
                    <div className="field"><label>標記</label><input placeholder="新增標記，每個標記以逗號分隔" /></div>
                    <div className="field"><label>授權</label><select defaultValue="standard"><option value="standard">標準 YouTube 授權</option><option value="cc">創用 CC 授權</option></select></div>
                    <div className="field"><label>字幕檔</label><input type="file" /></div>
                  </div>
                  <label className="check-field"><input type="checkbox" defaultChecked /> 允許嵌入</label>
                  <label className="check-field"><input type="checkbox" defaultChecked /> 發布時通知訂閱者</label>
                </section>

                <section className="advanced-group">
                  <h4>互動設定</h4>
                  <div className="form-grid composer-form">
                    <div className="field"><label>留言</label><select defaultValue="off"><option value="on">開啟</option><option value="off">關閉</option></select></div>
                    <div className="field"><label>Shorts 重混</label><select defaultValue="video-audio"><option value="video-audio">允許重混影片和音訊</option><option value="audio-only">僅允許重混音訊</option></select></div>
                  </div>
                </section>
              </div>
            </details>

            <div className="composer-actions"><button className="btn primary" type="button">加入佇列</button></div>
          </div>
        </div>

        <div className="composer-preview">
          <div className="panel preview-panel">
            <div className="panel-head"><div><h2>預覽</h2></div></div>
            <div className="preview-summary">
              <div className="preview-card">
                <div className="preview-cover" />
                <div className="youtube-preview-head">
                  <div className="youtube-channel"><span className="youtube-channel-icon">YT</span><span>{accounts[0]?.displayName ?? "YouTube"}</span></div>
                  <strong>{title || "未命名影片"}</strong>
                  <p>{description || "尚未輸入說明"}</p>
                </div>
                <div className="preview-settings">
                  <div className="preview-setting"><span>瀏覽權限</span><strong>私人</strong></div>
                  <div className="preview-setting"><span>播放清單</span><strong>未加入</strong></div>
                  <div className="preview-setting"><span>目標觀眾</span><strong>未選擇</strong></div>
                  <div className="preview-setting"><span>年齡限制</span><strong>未限制</strong></div>
                  <div className="preview-setting"><span>付費宣傳</span><strong>否</strong></div>
                  <div className="preview-setting"><span>AI 聲明</span><strong>否</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
