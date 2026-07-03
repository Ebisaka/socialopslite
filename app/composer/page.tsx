import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ensureDemoUser } from "@/lib/demo-user";
import { YoutubeMark } from "../ui/app-shell";

export const dynamic = "force-dynamic";

export default async function ComposerPage() {
  const user = await ensureDemoUser();
  const accounts = await prisma.socialAccount.findMany({
    where: { userId: user.id, platform: "youtube" },
    orderBy: [{ favorite: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    select: { id: true, displayName: true, status: true, favorite: true }
  });

  return (
    <section className="composer-page">
      <div className="composer-layout">
        <div className="composer-main">
          <div className="panel composer-editor">
            <div className="panel-head"><h2>內容編輯</h2></div>

            <div className="publish-targets">
              <label className="field-label">發布目標</label>
              {accounts.length === 0 ? (
                <Link className="target-empty" href="/accounts">先連線 YouTube 帳戶</Link>
              ) : (
                <div className="target-list">
                  {accounts.map((account, index) => (
                    <label className="target-item" key={account.id}>
                      <input type="checkbox" defaultChecked={index === 0} />
                      <YoutubeMark />
                      <span>{account.displayName}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="form-grid">
              <label className="field">
                <span>標題 <b>*</b></span>
                <input placeholder="輸入影片標題" />
              </label>
              <label className="field">
                <span>內容類型</span>
                <select defaultValue="video">
                  <option value="video">一般影片</option>
                  <option value="shorts">Shorts</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span>說明</span>
              <textarea placeholder="輸入影片說明，可加入連結、章節或補充資訊" rows={7} />
            </label>

            <div className="upload-grid">
              <label className="upload-box">
                <span>上傳影片 <b>*</b></span>
                <input type="file" accept="video/*" />
              </label>
              <label className="upload-box">
                <span>封面圖</span>
                <input type="file" accept="image/*" />
              </label>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>發布方式</span>
                <select defaultValue="schedule">
                  <option value="now">立即發布</option>
                  <option value="schedule">排程發布</option>
                  <option value="draft">儲存草稿</option>
                </select>
              </label>
              <label className="field">
                <span>瀏覽權限</span>
                <select defaultValue="private">
                  <option value="private">私人</option>
                  <option value="unlisted">不公開</option>
                  <option value="public">公開</option>
                </select>
              </label>
            </div>

            <details className="advanced-settings">
              <summary>進階設定</summary>
              <div className="advanced-grid">
                <label className="check-field"><input type="checkbox" defaultChecked />發布時通知訂閱者</label>
                <fieldset>
                  <legend>目標觀眾 <b>*</b></legend>
                  <label><input type="radio" name="kids" />是，這是兒童專屬的影片</label>
                  <label><input type="radio" name="kids" defaultChecked />否，這不是兒童專屬的影片</label>
                </fieldset>
                <label className="field">
                  <span>類別</span>
                  <select defaultValue="entertainment">
                    <option value="film">電影與動畫</option>
                    <option value="autos">汽車與車輛</option>
                    <option value="music">音樂</option>
                    <option value="pets">寵物與動物</option>
                    <option value="sports">體育</option>
                    <option value="travel">旅遊與活動</option>
                    <option value="gaming">遊戲</option>
                    <option value="people">人物與網誌</option>
                    <option value="comedy">喜劇</option>
                    <option value="entertainment">娛樂</option>
                    <option value="education">教育</option>
                    <option value="science">科學與科技</option>
                  </select>
                </label>
                <label className="field">
                  <span>標記</span>
                  <input placeholder="新增標記，每個標記以逗號分隔" />
                </label>
              </div>
            </details>

            <div className="composer-actions">
              <button className="btn primary" type="button">加入佇列</button>
            </div>
          </div>
        </div>

        <aside className="composer-preview panel">
          <h2>預覽</h2>
          <div className="preview-card">
            <div className="preview-cover"></div>
            <strong>未命名影片</strong>
            <p>尚未輸入說明</p>
            <dl>
              <div><dt>瀏覽權限</dt><dd>私人</dd></div>
              <div><dt>播放清單</dt><dd>未加入</dd></div>
              <div><dt>目標觀眾</dt><dd>未選擇</dd></div>
              <div><dt>年齡限制</dt><dd>未限制</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
