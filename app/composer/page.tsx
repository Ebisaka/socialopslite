import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ensureDemoUser } from "@/lib/demo-user";
import { YoutubeMark } from "../ui/app-shell";

export const dynamic = "force-dynamic";

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

            <div className="composer-block">
              <h3>影片與內容</h3>
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
            </div>

            <div className="composer-block">
              <h3>發布設定</h3>
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
            </div>

            <details className="advanced-settings">
              <summary>進階設定</summary>
              <div className="advanced-stack">
                <section className="advanced-group">
                  <h4>目標觀眾 <b>*</b></h4>
                  <label><input type="radio" name="kids" /> 是，這是兒童專屬的影片</label>
                  <label><input type="radio" name="kids" defaultChecked /> 否，這不是兒童專屬的影片</label>
                  <details className="age-limit" open>
                    <summary>年齡限制</summary>
                    <label><input type="radio" name="adult" /> 是，將影片設為僅限年滿 18 歲的觀眾收看</label>
                    <label><input type="radio" name="adult" defaultChecked /> 否，不要將我的影片設為僅限年滿 18 歲的觀眾收看</label>
                  </details>
                </section>

                <section className="advanced-group">
                  <h4>內容揭露</h4>
                  <label><input type="checkbox" /> 內容包含付費宣傳</label>
                  <label><input type="checkbox" /> 內容包含需揭露的 AI 內容</label>
                </section>

                <section className="advanced-group">
                  <h4>影片設定</h4>
                  <div className="form-grid">
                    <label className="field">
                      <span>類別</span>
                      <select defaultValue="娛樂">
                        {categories.map((category) => <option value={category} key={category}>{category}</option>)}
                      </select>
                    </label>
                    <label className="field">
                      <span>標記</span>
                      <input placeholder="新增標記，每個標記以逗號分隔" />
                    </label>
                    <label className="field">
                      <span>授權</span>
                      <select defaultValue="youtube">
                        <option value="youtube">標準 YouTube 授權</option>
                        <option value="creativeCommon">Creative Commons</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>字幕檔</span>
                      <input type="file" accept=".srt,.vtt,.sbv,.sub,.ttml,.dfxp" />
                    </label>
                  </div>
                  <label className="check-field"><input type="checkbox" defaultChecked /> 允許嵌入</label>
                  <label className="check-field"><input type="checkbox" defaultChecked /> 發布時通知訂閱者</label>
                </section>

                <section className="advanced-group">
                  <h4>互動設定</h4>
                  <div className="form-grid">
                    <label className="field">
                      <span>留言</span>
                      <select defaultValue="all">
                        <option value="all">開放</option>
                        <option value="review">保留待審</option>
                        <option value="off">關閉</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Shorts 重混</span>
                      <select defaultValue="videoAudio">
                        <option value="videoAudio">允許重混影片和音訊</option>
                        <option value="audioOnly">僅允許重混音訊</option>
                      </select>
                    </label>
                  </div>
                </section>
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
