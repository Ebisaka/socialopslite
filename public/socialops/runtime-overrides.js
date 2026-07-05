/* Extracted runtime overrides. Keep this file loaded after /socialops/core.js and /socialops/compat-overrides.js. */
/* 2026-07-05 clean final override.
   This block intentionally runs last and replaces listeners installed by older
   compatibility patches above. */
(function socialOpsRuntimeOverrides20260705(){
  var cfg = window.SOCIALOPS_CONFIG || {};
  function $(selector, root){ return (root || document).querySelector(selector); }
  function $$(selector, root){ return Array.from((root || document).querySelectorAll(selector)); }
  function escapeHtml(value){
    return String(value == null ? "" : value).replace(/[&<>"']/g, function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
    });
  }
  function activeAccountSafe(){
    try {
      if (typeof activeAccount === "function") return activeAccount();
      return Array.isArray(window.accounts) ? window.accounts[0] : null;
    } catch (_) {
      return null;
    }
  }
  function selectedPublishIds(){
    try {
      var stored = JSON.parse(localStorage.getItem("mvp_publish_accounts") || "[]");
      if (Array.isArray(stored) && stored.length) return stored;
    } catch (_) {}
    var account = activeAccountSafe();
    return account ? [account.id] : [];
  }
  function normalizeRemoveButton(inputId, buttonId){
    var input = $("#" + inputId);
    var button = $("#" + buttonId);
    if (!button) return;
    var hasFile = !!(input && input.files && input.files.length);
    var wrap = button.closest(".upload-item") || button.closest(".caption-file-row");
    if (wrap) wrap.classList.toggle("has-file", hasFile);
    button.className = "file-remove" + (hasFile ? "" : " is-hidden");
    button.hidden = !hasFile;
    button.setAttribute("aria-hidden", hasFile ? "false" : "true");
    button.setAttribute("aria-label", "移除檔案");
    button.title = "移除檔案";
    button.innerHTML = "";
    button.style.display = hasFile ? "grid" : "none";
  }
  function normalizeComposerLabels(){
    normalizeRemoveButton("mediaInput", "removeMediaBtn");
    normalizeRemoveButton("coverInput", "removeCoverBtn");
    normalizeRemoveButton("captionInput", "removeCaptionBtn");
    var summary = $(".advanced-summary-title > span");
    if (summary) summary.textContent = "YouTube 設定";
    var info = $(".summary-info");
    if (info) {
      info.dataset.help = "advancedYoutube";
      info.setAttribute("aria-label", "YouTube 設定說明");
      info.title = "YouTube 設定說明";
    }
    try {
      if (window.helpContent && helpContent.advancedYoutube) {
        helpContent.advancedYoutube.title = "YouTube 設定說明";
      }
    } catch (_) {}
  }
  function normalizeChartMode(){
    var chart = $("#viewsChart");
    var bars = $("#chartBars");
    var line = $("#chartLine");
    if (!chart) return;
    var type = localStorage.getItem("mvp_chart_type") || "bar";
    chart.dataset.chartType = type;
    if (bars) {
      bars.hidden = type !== "bar";
      bars.style.display = type === "bar" ? "grid" : "none";
      bars.style.visibility = type === "bar" ? "visible" : "hidden";
    }
    if (line) {
      line.hidden = type !== "line";
      line.style.display = type === "line" ? "block" : "none";
      line.style.visibility = type === "line" ? "visible" : "hidden";
      $$("path", line).forEach(function(path){ path.classList.add("line-stroke"); });
      var circles = $$("circle", line);
      if (circles.length && !line.querySelector(".line-hit-points")) {
        var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", "line-hit-points");
        circles.forEach(function(circle){ group.appendChild(circle); });
        line.appendChild(group);
      }
    }
  }
  function normalizeProductionMetrics(){
    if (cfg.appEnv !== "production") return;
    var account = activeAccountSafe();
    var isDemoAccount = account && (account.id === "main" || account.id === "studio" || String(account.id || "").indexOf("demo") === 0);
    var hasRealStats = !!(account && window.accountStats && accountStats[account.id]);
    if (!account || (!isDemoAccount && hasRealStats)) return;
    var values = { subscriberMetric: "0", viewMetric: "0", engagementMetric: "0%" };
    Object.keys(values).forEach(function(id){
      var el = $("#" + id);
      if (el) el.textContent = values[id];
    });
    ["subscriberDelta", "viewDelta", "engagementDelta"].forEach(function(id){
      var el = $("#" + id);
      if (el) el.textContent = "-";
    });
    var yAxis = $("#chartYAxis");
    var labels = $("#chartLabels");
    var bars = $("#chartBars");
    var line = $("#chartLine");
    if (yAxis) yAxis.innerHTML = ["0","0","0","0"].map(function(v){ return "<span>" + v + "</span>"; }).join("");
    if (labels) labels.innerHTML = "";
    if (bars) bars.innerHTML = "";
    if (line) line.innerHTML = "";
  }
  function normalizeAccountActions(){
    $$(".account-status-action,.status-action").forEach(function(el){
      el.classList.remove("btn");
      el.style.transform = "none";
      el.style.textDecoration = "none";
    });
  }
  function contentRows(){
    if ((window.SOCIALOPS_CONFIG || {}).appEnv === "production") return [];
    var account = activeAccountSafe();
    var base = account ? (account.name || "YouTube") : "YouTube";
    return [
      { type: "shorts", title: base + " ???? Shorts", views: "87,400", rate: "7.5%", cover: "S" },
      { type: "video", title: base + " ????", views: "42,800", rate: "5.9%", cover: "V" },
      { type: "shorts", title: base + " ????????", views: "58,200", rate: "6.8%", cover: "S" }
    ];
  }
  function renderContentInsight(){
    var list = $("#contentRankList");
    if (!list) return;
    var filter = localStorage.getItem("mvp_content_filter") || "all";
    var data = contentRows();
    var shown = data.filter(function(item){ return filter === "all" || item.type === filter; });
    var count = function(type){ return data.filter(function(item){ return item.type === type; }).length; };
    list.innerHTML =
      '<div class="content-type-summary is-filterable">' +
        '<button type="button" class="content-type-filter ' + (filter === "all" ? "active" : "") + '" data-content-filter="all"><span>全部</span><strong>' + data.length + '</strong></button>' +
        '<button type="button" class="content-type-filter ' + (filter === "video" ? "active" : "") + '" data-content-filter="video"><span>一般影片</span><strong>' + count("video") + '</strong></button>' +
        '<button type="button" class="content-type-filter ' + (filter === "shorts" ? "active" : "") + '" data-content-filter="shorts"><span>Shorts</span><strong>' + count("shorts") + '</strong></button>' +
      '</div>' +
      shown.map(function(item, index){
        return '<article class="content-rank-card with-cover">' +
          '<span class="rank-index">' + (index + 1) + '</span>' +
          '<div class="rank-cover">' + escapeHtml(item.cover) + '</div>' +
          '<div class="rank-copy"><strong>' + escapeHtml(item.title) + '</strong><span>' + (item.type === "shorts" ? "Shorts" : "一般影片") + '</span></div>' +
          '<div><strong>' + escapeHtml(item.views) + '</strong><span>觀看</span></div>' +
          '<div><strong>' + escapeHtml(item.rate) + '</strong><span>互動</span></div>' +
        '</article>';
      }).join("");
    $$("[data-content-filter]", list).forEach(function(button){
      button.onclick = function(){
        localStorage.setItem("mvp_content_filter", button.dataset.contentFilter || "all");
        renderContentInsight();
      };
    });
  }
  function openIssueModal(){
    var old = $("#issueModalBackdrop");
    if (old) old.remove();
    var modal = document.createElement("div");
    modal.id = "issueModalBackdrop";
    modal.className = "issue-modal-backdrop";
    modal.innerHTML =
      '<div class="issue-modal" role="dialog" aria-modal="true" aria-label="問題回報">' +
        '<div class="issue-modal-head"><h3>問題回報</h3><button class="issue-modal-close" type="button" aria-label="關閉">×</button></div>' +
        '<form class="issue-modal-body">' +
          '<label><span>類型</span><select name="category"><option value="bug">功能異常</option><option value="ui">畫面顯示</option><option value="account">帳戶連線</option><option value="other">其他</option></select></label>' +
          '<label><span>描述</span><textarea name="message" rows="5" placeholder="請描述你遇到的問題"></textarea></label>' +
          '<div class="issue-modal-actions"><button class="btn" type="button" data-close>取消</button><button class="btn primary" type="submit">送出</button></div>' +
        '</form>' +
      '</div>';
    document.body.appendChild(modal);
    var close = function(){ modal.remove(); };
    modal.onclick = function(event){ if (event.target === modal) close(); };
    $(".issue-modal-close", modal).onclick = close;
    $("[data-close]", modal).onclick = close;
    $("form", modal).onsubmit = async function(event){
      event.preventDefault();
      var form = event.currentTarget;
      var message = form.message.value.trim();
      if (!message) {
        if (typeof toast === "function") toast("請輸入問題描述");
        return;
      }
      try {
        var response = await fetch("/api/reports", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ category: form.category.value, page: location.pathname, message: message })
        });
        if (!response.ok) throw new Error("failed");
        close();
        if (typeof toast === "function") toast("已送出問題回報");
      } catch (_) {
        if (typeof toast === "function") toast("問題回報送出失敗，請稍後再試");
      }
    };
  }
  function bindIssueButton(){
    var button = $("#reportIssueBtn");
    if (!button) {
      button = $$(".more-item-title").find(function(item){
        return (item.textContent || "").replace(/\s+/g, "").indexOf("問題回報") > -1;
      });
    }
    if (!button || button.dataset.cleanIssueBound === "true") return;
    var clone = button.cloneNode(true);
    clone.dataset.cleanIssueBound = "true";
    clone.onclick = function(event){
      event.preventDefault();
      event.stopPropagation();
      openIssueModal();
    };
    button.replaceWith(clone);
  }
  function publishModeValue(){
    var raw = $("#publishMode") ? $("#publishMode").value : "排程發布";
    if (raw === "immediate" || raw.indexOf("立即") > -1) return "immediate";
    if (raw === "draft" || raw.indexOf("草稿") > -1 || raw.indexOf("儲存") > -1) return "draft";
    return "scheduled";
  }
  function bindPublishButton(){
    var button = $("#scheduleBtn");
    if (!button || button.dataset.cleanPublishBound === "true") return;
    var clone = button.cloneNode(true);
    clone.dataset.cleanPublishBound = "true";
    clone.onclick = async function(event){
      event.preventDefault();
      var title = $("#titleInput");
      var media = $("#mediaInput");
      var mode = publishModeValue();
      if (!title || !title.value.trim()) {
        if (typeof setFieldError === "function") setFieldError("title", "請輸入影片標題。");
        if (title) title.focus();
        return;
      }
      if (mode !== "draft" && (!media || !media.files || !media.files[0])) {
        if (typeof setFieldError === "function") setFieldError("media", "請選擇影片檔案。");
        return;
      }
      if (mode === "scheduled" && $("#publishTime") && !$("#publishTime").value) {
        if (typeof toast === "function") toast("請設定排程發布時間。");
        return;
      }
      var form = new FormData();
      selectedPublishIds().forEach(function(id){ form.append("accountIds", id); });
      form.set("title", title.value.trim());
      form.set("description", $("#contentInput") ? $("#contentInput").value : "");
      form.set("contentType", $("#contentType") ? $("#contentType").value : "一般影片");
      form.set("publishMode", mode);
      form.set("visibility", $("#visibilityInput") ? $("#visibilityInput").value : "private");
      if ($("#publishTime") && $("#publishTime").value) form.set("scheduledAt", new Date($("#publishTime").value).toISOString());
      form.set("playlistId", $("#playlistInput") ? $("#playlistInput").value : "");
      form.set("madeForKids", typeof isMadeForKids === "function" && isMadeForKids() ? "true" : "false");
      form.set("paidPromo", $("#paidPromoInput") && $("#paidPromoInput").checked ? "true" : "false");
      form.set("aiDisclosure", $("#aiDisclosureInput") && $("#aiDisclosureInput").checked ? "true" : "false");
      form.set("embedAllowed", $("#embedInput") && $("#embedInput").checked ? "true" : "false");
      form.set("notifySubscribers", $("#notifyInput") && $("#notifyInput").checked ? "true" : "false");
      form.set("categoryId", $("#categoryInput") ? $("#categoryInput").value : "24");
      form.set("tags", $("#tagsInput") ? $("#tagsInput").value : "");
      form.set("license", $("#licenseInput") ? $("#licenseInput").value : "youtube");
      if (media && media.files && media.files[0]) form.set("media", media.files[0]);
      var cover = $("#coverInput");
      var caption = $("#captionInput");
      if (cover && cover.files && cover.files[0]) form.set("cover", cover.files[0]);
      if (caption && caption.files && caption.files[0]) form.set("caption", caption.files[0]);
      var oldText = clone.textContent;
      clone.disabled = true;
      clone.textContent = mode === "draft" ? "儲存中..." : mode === "immediate" ? "發布中..." : "加入中...";
      try {
        var response = await fetch("/api/youtube/publish", { method: "POST", body: form });
        var data = await response.json().catch(function(){ return {}; });
        if (!response.ok) {
          if (typeof toast === "function") toast(data.error || "發布失敗，請稍後再試。");
          return;
        }
        if (typeof toast === "function") toast(mode === "draft" ? "已儲存草稿。" : mode === "immediate" ? "已送出發布任務。" : "已加入排程佇列。");
      } catch (_) {
        if (typeof toast === "function") toast("發布連線失敗，請稍後再試。");
      } finally {
        clone.disabled = false;
        clone.textContent = oldText;
      }
    };
    button.replaceWith(clone);
  }
  function runCleanFinal(){
    normalizeComposerLabels();
    normalizeChartMode();
    normalizeProductionMetrics();
    normalizeAccountActions();
    renderContentInsight();
    bindIssueButton();
    bindPublishButton();
    if (!cfg.demoTools) {
      var demo = $("#addDemoAccountBtn");
      if (demo) demo.remove();
    }
  }
  var previousRenderChart = typeof renderChart === "function" ? renderChart : null;
  if (previousRenderChart) {
    renderChart = function(range){
      previousRenderChart(range);
      runCleanFinal();
    };
  }
  var previousRenderComposer = typeof renderComposer === "function" ? renderComposer : null;
  if (previousRenderComposer) {
    renderComposer = function(){
      previousRenderComposer();
      runCleanFinal();
    };
  }
  var previousRenderAnalytics = typeof renderAnalytics === "function" ? renderAnalytics : null;
  renderAnalytics = function(range){
    if (previousRenderAnalytics) {
      try { previousRenderAnalytics(range); } catch (_) {}
    }
    renderContentInsight();
    runCleanFinal();
  };
  document.addEventListener("click", function(){ setTimeout(runCleanFinal, 0); });
  document.addEventListener("change", function(event){
    if (event.target && event.target.matches && event.target.matches("#mediaInput,#coverInput,#captionInput,#publishMode")) {
      setTimeout(runCleanFinal, 0);
    }
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runCleanFinal, { once: true });
  } else {
    runCleanFinal();
  }
  setTimeout(runCleanFinal, 100);
  setTimeout(runCleanFinal, 700);
})();

/* 2026-07-05 final production lock.
   This runs after every older renderer and keeps production free of demo rows,
   demo accounts, demo playlists, and the legacy inline publish-target chooser. */
(function socialOpsFinalProductionLock20260705(){
  var cfg = window.SOCIALOPS_CONFIG || {};
  var isProduction = cfg.appEnv === "production";

  function one(selector, root){ return (root || document).querySelector(selector); }
  function all(selector, root){ return Array.from((root || document).querySelectorAll(selector)); }
  function esc(value){
    return String(value == null ? "" : value).replace(/[&<>"']/g, function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
    });
  }
  function ytIcon(){
    return '<svg class="yt-play" viewBox="0 0 32 23" aria-hidden="true" focusable="false"><rect class="yt-play-bg" x="0" y="0" width="32" height="23" rx="6"></rect><path class="yt-play-triangle" d="M13 7.2v8.6l7-4.3z"></path></svg>';
  }
  function accountList(){
    try { return Array.isArray(accounts) ? accounts : []; }
    catch (_) { return []; }
  }
  function isDemoAccount(account){
    var id = String(account && account.id || "");
    var name = String(account && (account.name || account.displayName) || "");
    if (id === "__empty" || id === "main" || id === "studio" || id.indexOf("demo") === 0) return true;
    if (name === "YouTube" || name === "工作用 YouTube") return true;
    return name.indexOf("測試帳號") >= 0;
  }
  function liveAccounts(){
    var list = accountList().filter(function(account){ return account && (account.platform || "YouTube") === "YouTube"; });
    return isProduction ? list.filter(function(account){ return !isDemoAccount(account); }) : list;
  }
  function cleanStoredAccounts(){
    if (!isProduction) return;
    try {
      if (Array.isArray(accounts)) {
        var live = accounts.filter(function(account){ return !isDemoAccount(account); });
        if (live.length !== accounts.length) {
          accounts.length = 0;
          live.forEach(function(account){ accounts.push(account); });
        }
      }
      var stored = JSON.parse(localStorage.getItem("mvp_accounts_youtube") || "[]");
      if (Array.isArray(stored)) {
        var clean = stored.filter(function(account){ return !isDemoAccount(account); });
        if (clean.length !== stored.length) localStorage.setItem("mvp_accounts_youtube", JSON.stringify(clean));
      }
    } catch (_) {}
  }
  function selectedPublishIds(){
    var list = liveAccounts();
    var allowed = list.map(function(account){ return account.id; });
    var ids = [];
    try { ids = JSON.parse(localStorage.getItem("mvp_publish_accounts") || "[]"); } catch (_) {}
    if (!Array.isArray(ids)) ids = [];
    ids = ids.filter(function(id){ return allowed.indexOf(id) >= 0; });
    if (!ids.length && allowed[0]) ids = [allowed[0]];
    try {
      localStorage.setItem("mvp_publish_accounts", JSON.stringify(ids));
      if (ids[0]) localStorage.setItem("mvp_publish_account", ids[0]);
    } catch (_) {}
    return ids;
  }
  function currentAccount(){
    var list = liveAccounts();
    if (!list.length) return null;
    try {
      var active = localStorage.getItem("mvp_active_account");
      return list.find(function(account){ return account.id === active; }) || list[0];
    } catch (_) {
      return list[0];
    }
  }
  function isFakeContent(item){
    var title = String(item && item.title || "");
    return !title || title.indexOf("近期最佳") >= 0 || title.indexOf("更新公告") >= 0 || title.indexOf("製作流程") >= 0 || title.indexOf("測試帳號") >= 0;
  }
  function realContentRows(){
    try {
      var account = currentAccount();
      if (!account || !window.contentAnalytics || !contentAnalytics.youtube) return [];
      var bucket = contentAnalytics.youtube[account.id];
      if (!bucket) return [];
      var range = localStorage.getItem("mvp_chart_range") || "7";
      var report = bucket[range] || bucket["7"] || bucket;
      var rows = Array.isArray(report.items) ? report.items : [];
      return rows.filter(function(item){ return !isFakeContent(item); });
    } catch (_) {
      return [];
    }
  }
  function setMetric(id, value){
    var node = one("#" + id);
    if (node) node.textContent = value;
  }
  function renderEmptyContentReport(){
    var list = one("#contentRankList");
    if (!list) return;
    list.innerHTML = ''
      + '<div class="content-type-summary is-filterable">'
      + '<button type="button" class="content-type-filter active" data-content-filter="all"><span>全部</span><strong>0</strong></button>'
      + '<button type="button" class="content-type-filter" data-content-filter="video"><span>一般影片</span><strong>0</strong></button>'
      + '<button type="button" class="content-type-filter" data-content-filter="shorts"><span>Shorts</span><strong>0</strong></button>'
      + '</div>'
      + '<div class="content-empty">目前沒有可顯示的內容資料</div>';
    setMetric("analyticsContentMetric", "0");
    setMetric("analyticsViewsMetric", "0");
    setMetric("analyticsEngagementMetric", "0%");
    setMetric("analyticsContentDelta", "-");
    setMetric("analyticsViewsDelta", "-");
    setMetric("analyticsEngagementDelta", "-");
  }
  function renderRealContentReport(){
    var list = one("#contentRankList");
    if (!list) return;
    var rows = realContentRows();
    if (!rows.length) {
      renderEmptyContentReport();
      return;
    }
    var filter = localStorage.getItem("mvp_content_filter") || "all";
    var shown = rows.filter(function(item){ return filter === "all" || item.type === filter; });
    function count(type){ return rows.filter(function(item){ return item.type === type; }).length; }
    var filters = ''
      + '<div class="content-type-summary is-filterable">'
      + '<button type="button" class="content-type-filter '+(filter === "all" ? "active" : "")+'" data-content-filter="all"><span>全部</span><strong>'+rows.length+'</strong></button>'
      + '<button type="button" class="content-type-filter '+(filter === "video" ? "active" : "")+'" data-content-filter="video"><span>一般影片</span><strong>'+count("video")+'</strong></button>'
      + '<button type="button" class="content-type-filter '+(filter === "shorts" ? "active" : "")+'" data-content-filter="shorts"><span>Shorts</span><strong>'+count("shorts")+'</strong></button>'
      + '</div>';
    list.innerHTML = filters + (shown.length ? shown.map(function(item, index){
      var label = item.type === "shorts" ? "Shorts" : "一般影片";
      var cover = item.thumbnail ? '<img src="'+esc(item.thumbnail)+'" alt="">' : esc(item.cover || (item.type === "shorts" ? "S" : "V"));
      return '<article class="content-rank-card with-cover">'
        + '<span class="rank-index">'+(index + 1)+'</span>'
        + '<div class="rank-cover">'+cover+'</div>'
        + '<div class="rank-copy"><strong>'+esc(item.title)+'</strong><span>'+label+'</span></div>'
        + '<div><strong>'+esc(item.views || "0")+'</strong><span>觀看</span></div>'
        + '<div><strong>'+esc(item.rate || item.engagement || "0%")+'</strong><span>互動</span></div>'
        + '</article>';
    }).join("") : '<div class="content-empty">目前沒有符合條件的內容資料</div>');
    all("[data-content-filter]", list).forEach(function(button){
      button.onclick = function(){
        localStorage.setItem("mvp_content_filter", button.dataset.contentFilter || "all");
        renderRealContentReport();
      };
    });
  }
  function renderPublishTargetModal(list){
    var old = one("#publishTargetModal");
    if (old) old.remove();
    var ids = selectedPublishIds();
    var modal = document.createElement("div");
    modal.id = "publishTargetModal";
    modal.className = "issue-modal-backdrop publish-target-modal";
    modal.innerHTML = '<div class="issue-modal publish-target-dialog" role="dialog" aria-modal="true" aria-label="發布目標">'
      + '<div class="target-modal-list"></div>'
      + '<div class="issue-modal-actions"><button class="btn primary" type="button" data-done>完成</button></div>'
      + '</div>';
    document.body.appendChild(modal);
    var listNode = one(".target-modal-list", modal);
    function redraw(){
      listNode.innerHTML = list.map(function(account){
        var active = ids.indexOf(account.id) >= 0;
        return '<button class="target-modal-row '+(active ? "active" : "")+'" type="button" data-target-id="'+esc(account.id)+'">'
          + '<span class="target-modal-icon">'+ytIcon()+'</span>'
          + '<strong>'+esc(account.name || account.displayName || "YouTube")+'</strong>'
          + '<span class="target-modal-check" aria-hidden="true"></span>'
          + '</button>';
      }).join("");
      all("[data-target-id]", listNode).forEach(function(row){
        row.onclick = function(){
          var id = row.dataset.targetId;
          if (ids.indexOf(id) >= 0) {
            if (ids.length === 1) {
              if (typeof toast === "function") toast("至少保留一個發布目標");
              return;
            }
            ids = ids.filter(function(item){ return item !== id; });
          } else {
            ids.push(id);
          }
          try {
            localStorage.setItem("mvp_publish_accounts", JSON.stringify(ids));
            if (ids[0]) localStorage.setItem("mvp_publish_account", ids[0]);
          } catch (_) {}
          redraw();
        };
      });
    }
    function close(){
      try {
        localStorage.setItem("mvp_publish_accounts", JSON.stringify(ids));
        if (ids[0]) localStorage.setItem("mvp_publish_account", ids[0]);
      } catch (_) {}
      modal.remove();
      drawPublishTargets();
      drawPlaylists();
      if (typeof renderComposer === "function") {
        try { renderComposer(); } catch (_) {}
      }
    }
    redraw();
    modal.onclick = function(event){ if (event.target === modal) close(); };
    one("[data-done]", modal).onclick = close;
  }
  function drawPublishTargets(){
    var host = one("#publishTargets");
    if (!host) return;
    var list = liveAccounts();
    if (!list.length) {
      host.innerHTML = '<a class="publish-target-summary target-empty" href="/accounts">先連線 YouTube 帳戶</a>';
      return;
    }
    var ids = selectedPublishIds();
    var chosen = list.filter(function(account){ return ids.indexOf(account.id) >= 0; });
    var label = chosen.length === 1 ? (chosen[0].name || chosen[0].displayName || "YouTube") : chosen.length + " 個帳戶";
    host.innerHTML = '<button class="publish-target-summary" id="publishTargetSummaryBtn" type="button">'
      + '<span class="publish-target-summary-icons">'+ytIcon()+'</span>'
      + '<span class="publish-target-summary-text"><strong>'+esc(label)+'</strong></span>'
      + '</button>';
    one("#publishTargetSummaryBtn", host).onclick = function(){ renderPublishTargetModal(list); };
  }
  function drawPlaylists(){
    var select = one("#playlistInput");
    if (!select) return;
    var account = currentAccount();
    var list = account && window.accountPlaylists ? (accountPlaylists[account.id] || []) : [];
    if (isProduction) list = list.filter(function(name){ return name && name.indexOf("測試") < 0 && name.indexOf("新品") < 0 && name.indexOf("教學") < 0 && name.indexOf("Shorts 精選") < 0; });
    var current = select.value;
    select.innerHTML = '<option value=""></option>' + list.map(function(name){ return '<option value="'+esc(name)+'">'+esc(name)+'</option>'; }).join("");
    if (list.indexOf(current) >= 0) select.value = current;
  }
  function removeVisibleDemoAccountCards(){
    if (!isProduction) return;
    var list = one("#accountList");
    if (!list) return;
    all(".account", list).forEach(function(card){
      var text = card.textContent || "";
      if (text.trim() === "YouTube" || text.indexOf("測試帳號") >= 0 || text.indexOf("工作用 YouTube") >= 0) card.remove();
    });
    if (!list.children.length) list.innerHTML = '<div class="hint">目前尚未連線 YouTube 帳戶</div>';
  }
  function normalizeChart(){
    var chart = one("#viewsChart");
    var bars = one("#chartBars");
    var line = one("#chartLine");
    if (!chart) return;
    var type = localStorage.getItem("mvp_chart_type") || "bar";
    chart.dataset.chartType = type;
    if (bars) {
      bars.hidden = type !== "bar";
      bars.style.display = type === "bar" ? "grid" : "none";
    }
    if (line) {
      line.hidden = type !== "line";
      line.style.display = type === "line" ? "block" : "none";
    }
  }
  function normalizeHelpCopy(){
    var title = one(".advanced-summary-title > span");
    if (title) title.textContent = "YouTube 發布設定";
    try {
      if (window.helpContent && helpContent.advancedYoutube) {
        helpContent.advancedYoutube.title = "YouTube 發布設定";
        helpContent.advancedYoutube.sections = [
          { title: "兒童專屬內容", body: "發布前需要說明影片是否屬於兒童專屬內容。若設為兒童專屬，部分功能會依 YouTube 規則調整。" },
          { title: "付費宣傳", body: "如果影片含有第三方提供的有價品、贊助或代言內容，發布時需要標記。" },
          { title: "AI 內容揭露", body: "若影片使用 AI 生成或明顯修改，且可能讓觀眾誤認為真實內容，發布時需要揭露。" },
          { title: "允許嵌入", body: "允許他人在網站上嵌入你的影片。" }
        ];
      }
    } catch (_) {}
  }
  function runLock(){
    cleanStoredAccounts();
    normalizeHelpCopy();
    normalizeChart();
    drawPlaylists();
    drawPublishTargets();
    removeVisibleDemoAccountCards();
    if (isProduction) renderRealContentReport();
    if (!cfg.demoTools) {
      var demo = one("#addDemoAccountBtn");
      if (demo) demo.remove();
    }
  }
  try { renderPublishTargets = drawPublishTargets; } catch (_) { window.renderPublishTargets = drawPublishTargets; }
  try { renderPlaylistOptions = drawPlaylists; } catch (_) { window.renderPlaylistOptions = drawPlaylists; }
  var previousAnalytics = typeof renderAnalytics === "function" ? renderAnalytics : null;
  renderAnalytics = function(){
    if (!isProduction && previousAnalytics) {
      try { previousAnalytics.apply(this, arguments); } catch (_) {}
    }
    if (isProduction) renderRealContentReport();
    runLock();
  };
  ["renderAccounts", "renderComposer", "renderChart"].forEach(function(name){
    var old = window[name];
    if (typeof old === "function") {
      window[name] = function(){
        var result = old.apply(this, arguments);
        runLock();
        return result;
      };
      try { eval(name + " = window[name]"); } catch (_) {}
    }
  });
  document.addEventListener("click", function(event){
    if (event.target && event.target.closest && event.target.closest("[data-content-filter]")) return;
    setTimeout(runLock, 0);
  });
  document.addEventListener("change", function(){ setTimeout(runLock, 0); });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runLock, { once: true });
  } else {
    runLock();
  }
  setTimeout(runLock, 80);
  setTimeout(runLock, 350);
  setTimeout(runLock, 900);
})();

/* 2026-07-05 production guard.
   Keep this as the final browser-side layer. It prevents production from showing
   demo accounts/content and restores the modal publish-target selector even when
   older demo renderers run again. */
(function socialOpsProductionGuard20260705(){
  var cfg = window.SOCIALOPS_CONFIG || {};
  var isProduction = cfg.appEnv === "production";

  function $(selector, root){ return (root || document).querySelector(selector); }
  function $$(selector, root){ return Array.from((root || document).querySelectorAll(selector)); }
  function html(value){
    return String(value == null ? "" : value).replace(/[&<>"']/g, function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
    });
  }
  function attr(value){ return html(value); }
  function ytIcon(){
    return '<svg class="yt-play" viewBox="0 0 32 23" aria-hidden="true" focusable="false"><rect class="yt-play-bg" x="0" y="0" width="32" height="23" rx="6"></rect><path class="yt-play-triangle" d="M13 7.2v8.6l7-4.3z"></path></svg>';
  }
  function isDemoAccount(account){
    if (!account) return true;
    var id = String(account.id || "");
    var name = String(account.name || account.displayName || "");
    if (id === "__empty" || id === "main" || id === "studio" || id.indexOf("demo") === 0) return true;
    if (name === "YouTube" || name === "工作用 YouTube") return true;
    return /^YouTube 測試帳號/.test(name);
  }
  function allAccounts(){
    try { return Array.isArray(accounts) ? accounts : []; }
    catch (_) { return []; }
  }
  function usableAccounts(){
    var list = allAccounts().filter(function(account){ return account && (account.platform || "YouTube").toLowerCase() !== "facebook"; });
    return isProduction ? list.filter(function(account){ return !isDemoAccount(account); }) : list;
  }
  function activeAccountSafe(){
    var list = usableAccounts();
    if (!list.length) return null;
    try {
      var id = localStorage.getItem("mvp_active_account");
      return list.find(function(account){ return account.id === id; }) || list[0];
    } catch (_) {
      return list[0];
    }
  }
  function savePublishIds(ids){
    try {
      localStorage.setItem("mvp_publish_accounts", JSON.stringify(ids));
      if (ids[0]) localStorage.setItem("mvp_publish_account", ids[0]);
    } catch (_) {}
  }
  function selectedIds(){
    var list = usableAccounts();
    var allowed = list.map(function(account){ return account.id; });
    var ids = [];
    try {
      ids = JSON.parse(localStorage.getItem("mvp_publish_accounts") || "[]");
    } catch (_) {
      ids = [];
    }
    if (!Array.isArray(ids)) ids = [];
    ids = ids.filter(function(id){ return allowed.indexOf(id) >= 0; });
    if (!ids.length && allowed[0]) ids = [allowed[0]];
    savePublishIds(ids);
    return ids;
  }
  function purgeProductionDemoAccounts(){
    if (!isProduction) return;
    try {
      if (Array.isArray(accounts)) {
        var filtered = accounts.filter(function(account){ return !isDemoAccount(account); });
        if (filtered.length !== accounts.length) {
          accounts.length = 0;
          filtered.forEach(function(account){ accounts.push(account); });
        }
      }
      var stored = JSON.parse(localStorage.getItem("mvp_accounts_youtube") || "[]");
      if (Array.isArray(stored)) {
        var cleaned = stored.filter(function(account){ return !isDemoAccount(account); });
        if (cleaned.length !== stored.length) {
          localStorage.setItem("mvp_accounts_youtube", JSON.stringify(cleaned));
        }
      }
    } catch (_) {}
  }

  function renderEmptyProductionMetrics(){
    if (!isProduction) return;
    var account = activeAccountSafe();
    var hasStats = !!(account && window.accountStats && accountStats[account.id]);
    if (hasStats) return;
    [
      ["subscriberMetric", "0"],
      ["viewMetric", "0"],
      ["engagementMetric", "0%"],
      ["analyticsContentMetric", "0"],
      ["analyticsViewsMetric", "0"],
      ["analyticsEngagementMetric", "0%"]
    ].forEach(function(item){
      var el = $("#" + item[0]);
      if (el) el.textContent = item[1];
    });
    ["subscriberDelta", "viewDelta", "engagementDelta", "analyticsContentDelta", "analyticsViewsDelta", "analyticsEngagementDelta"].forEach(function(id){
      var el = $("#" + id);
      if (el) el.textContent = "-";
    });
  }

  function demoContentRows(){
    var account = activeAccountSafe();
    var base = account ? (account.name || account.displayName || "YouTube") : "YouTube";
    return [
      { type: "shorts", title: base + " 近期最佳 Shorts", views: "87,400", rate: "7.5%", cover: "S" },
      { type: "video", title: base + " 更新公告", views: "42,800", rate: "5.9%", cover: "V" },
      { type: "shorts", title: base + " 製作流程幕後分享", views: "58,200", rate: "6.8%", cover: "S" }
    ];
  }
  function realContentRows(){
    try {
      var account = activeAccountSafe();
      if (!account || !window.contentAnalytics || !contentAnalytics.youtube) return [];
      var bucket = contentAnalytics.youtube[account.id];
      if (!bucket) return [];
      var range = localStorage.getItem("mvp_chart_range") || "7";
      var data = bucket[range] || bucket["7"] || bucket;
      var items = Array.isArray(data.items) ? data.items : [];
      return items.filter(function(item){
        var title = String(item && item.title || "");
        return title && !/近期最佳|更新公告|製作流程|測試帳號/.test(title);
      });
    } catch (_) {
      return [];
    }
  }
  function contentRowsForCurrentEnv(){
    if (isProduction) return realContentRows();
    return realContentRows().length ? realContentRows() : demoContentRows();
  }
  function renderContentReportClean(){
    var list = $("#contentRankList");
    if (!list) return;
    var data = contentRowsForCurrentEnv();
    var filter = localStorage.getItem("mvp_content_filter") || "all";
    var shown = data.filter(function(item){ return filter === "all" || item.type === filter; });
    var count = function(type){ return data.filter(function(item){ return item.type === type; }).length; };
    var filters =
      '<div class="content-type-summary is-filterable">'
      + '<button type="button" class="content-type-filter '+(filter==="all"?"active":"")+'" data-content-filter="all"><span>全部</span><strong>'+data.length+'</strong></button>'
      + '<button type="button" class="content-type-filter '+(filter==="video"?"active":"")+'" data-content-filter="video"><span>一般影片</span><strong>'+count("video")+'</strong></button>'
      + '<button type="button" class="content-type-filter '+(filter==="shorts"?"active":"")+'" data-content-filter="shorts"><span>Shorts</span><strong>'+count("shorts")+'</strong></button>'
      + '</div>';
    if (!shown.length) {
      list.innerHTML = filters + '<div class="content-empty">目前沒有可顯示的內容資料</div>';
    } else {
      list.innerHTML = filters + shown.map(function(item, index){
        var label = item.type === "shorts" ? "Shorts" : "一般影片";
        var cover = item.thumbnail
          ? '<img src="'+attr(item.thumbnail)+'" alt="">'
          : html(item.cover || (item.type === "shorts" ? "S" : "V"));
        return '<article class="content-rank-card with-cover">'
          + '<span class="rank-index">'+(index + 1)+'</span>'
          + '<div class="rank-cover">'+cover+'</div>'
          + '<div class="rank-copy"><strong>'+html(item.title)+'</strong><span>'+label+'</span></div>'
          + '<div><strong>'+html(item.views || "0")+'</strong><span>觀看</span></div>'
          + '<div><strong>'+html(item.rate || "0%")+'</strong><span>互動</span></div>'
          + '</article>';
      }).join("");
    }
    $$("[data-content-filter]", list).forEach(function(button){
      button.onclick = function(){
        localStorage.setItem("mvp_content_filter", button.dataset.contentFilter || "all");
        renderContentReportClean();
      };
    });
    if (isProduction && !data.length) {
      [
        ["analyticsContentMetric", "0"],
        ["analyticsViewsMetric", "0"],
        ["analyticsEngagementMetric", "0%"]
      ].forEach(function(item){
        var el = $("#" + item[0]);
        if (el) el.textContent = item[1];
      });
      ["analyticsContentDelta", "analyticsViewsDelta", "analyticsEngagementDelta"].forEach(function(id){
        var el = $("#" + id);
        if (el) el.textContent = "-";
      });
    }
  }

  function renderPlaylistOptionsClean(){
    var select = $("#playlistInput");
    if (!select) return;
    var account = activeAccountSafe();
    var list = account && window.accountPlaylists ? (accountPlaylists[account.id] || []) : [];
    if (isProduction && (!account || isDemoAccount(account))) list = [];
    var current = select.value;
    select.innerHTML = '<option value=""></option>' + list.map(function(item){
      return '<option value="'+attr(item)+'">'+html(item)+'</option>';
    }).join("");
    if (list.indexOf(current) >= 0) select.value = current;
  }

  function renderPublishTargetsClean(){
    var host = $("#publishTargets");
    if (!host) return;
    var list = usableAccounts();
    if (!list.length) {
      host.innerHTML = '<a class="publish-target-summary target-empty" href="/accounts">先連線 YouTube 帳戶</a>';
      return;
    }
    var ids = selectedIds();
    var chosen = list.filter(function(account){ return ids.indexOf(account.id) >= 0; });
    var label = chosen.length === 1 ? (chosen[0].name || chosen[0].displayName || "YouTube") : chosen.length + " 個帳戶";
    host.innerHTML = '<button class="publish-target-summary" id="publishTargetSummaryBtn" type="button">'
      + '<span class="publish-target-summary-icons">'+ytIcon()+'</span>'
      + '<span class="publish-target-summary-text"><strong>'+html(label)+'</strong></span>'
      + '</button>';
    var button = $("#publishTargetSummaryBtn", host);
    if (button) button.onclick = function(event){
      event.preventDefault();
      openPublishTargetModal(list);
    };
  }
  function openPublishTargetModal(list){
    var old = $("#publishTargetModal");
    if (old) old.remove();
    var ids = selectedIds();
    var modal = document.createElement("div");
    modal.id = "publishTargetModal";
    modal.className = "issue-modal-backdrop publish-target-modal";
    modal.innerHTML = '<div class="issue-modal publish-target-dialog" role="dialog" aria-modal="true" aria-label="發布目標">'
      + '<div class="target-modal-list"></div>'
      + '<div class="issue-modal-actions"><button class="btn primary" type="button" data-done>完成</button></div>'
      + '</div>';
    document.body.appendChild(modal);
    var listNode = $(".target-modal-list", modal);
    function draw(){
      listNode.innerHTML = list.map(function(account){
        var active = ids.indexOf(account.id) >= 0;
        return '<button class="target-modal-row '+(active ? "active" : "")+'" type="button" data-target-id="'+attr(account.id)+'">'
          + '<span class="target-modal-icon">'+ytIcon()+'</span>'
          + '<strong>'+html(account.name || account.displayName || "YouTube")+'</strong>'
          + '<span class="target-modal-check" aria-hidden="true"></span>'
          + '</button>';
      }).join("");
      $$("[data-target-id]", listNode).forEach(function(row){
        row.onclick = function(){
          var id = row.dataset.targetId;
          if (ids.indexOf(id) >= 0) {
            if (ids.length === 1) {
              if (typeof toast === "function") toast("至少保留一個發布目標");
              return;
            }
            ids = ids.filter(function(item){ return item !== id; });
          } else {
            ids.push(id);
          }
          savePublishIds(ids);
          draw();
        };
      });
    }
    draw();
    var close = function(){
      savePublishIds(ids);
      modal.remove();
      renderPublishTargetsClean();
      renderPlaylistOptionsClean();
      if (typeof renderComposer === "function") {
        try { renderComposer(); } catch (_) {}
      }
    };
    modal.onclick = function(event){ if (event.target === modal) close(); };
    $("[data-done]", modal).onclick = close;
  }

  function normalizeComposerCopy(){
    var title = $(".advanced-summary-title > span");
    if (title) title.textContent = "YouTube 發布設定";
    var info = $(".summary-info");
    if (info) {
      info.dataset.help = "advancedYoutube";
      info.setAttribute("aria-label", "YouTube 發布設定說明");
    }
    try {
      if (window.helpContent && helpContent.advancedYoutube) {
        helpContent.advancedYoutube.title = "YouTube 發布設定";
        helpContent.advancedYoutube.items = [
          ["兒童專屬內容", "依 YouTube 要求，發布時需說明影片是否屬於兒童專屬內容。"],
          ["付費宣傳", "如果影片含有第三方提供的有償產品或服務，發布時需要揭露。"],
          ["AI 內容揭露", "若內容包含需揭露的 AI 生成或明顯修改內容，發布時需要標示。"],
          ["允許嵌入", "允許他人在網站上嵌入你的影片。"]
        ];
      }
    } catch (_) {}
  }
  function normalizeChartMode(){
    var chart = $("#viewsChart");
    var bars = $("#chartBars");
    var line = $("#chartLine");
    if (!chart) return;
    var type = localStorage.getItem("mvp_chart_type") || "bar";
    chart.dataset.chartType = type;
    if (bars) {
      bars.hidden = type !== "bar";
      bars.style.display = type === "bar" ? "grid" : "none";
    }
    if (line) {
      line.hidden = type !== "line";
      line.style.display = type === "line" ? "block" : "none";
      line.querySelectorAll("path").forEach(function(path){ path.classList.add("line-stroke"); });
    }
  }
  function normalizeAccountRows(){
    if (!isProduction) return;
    var list = $("#accountList");
    if (!list) return;
    $$(".account", list).forEach(function(card){
      var text = card.textContent || "";
      if (/YouTube 測試帳號|工作用 YouTube/.test(text) || text.trim() === "YouTube") {
        card.remove();
      }
    });
    if (!list.children.length) {
      list.innerHTML = '<div class="hint">目前尚未連線 YouTube 帳戶。</div>';
    }
  }
  function runFinalGuard(){
    purgeProductionDemoAccounts();
    renderEmptyProductionMetrics();
    normalizeComposerCopy();
    normalizeChartMode();
    renderContentReportClean();
    renderPublishTargetsClean();
    renderPlaylistOptionsClean();
    normalizeAccountRows();
    if (!cfg.demoTools) {
      var demo = $("#addDemoAccountBtn");
      if (demo) demo.remove();
    }
  }

  try { renderPublishTargets = renderPublishTargetsClean; } catch (_) { window.renderPublishTargets = renderPublishTargetsClean; }
  try { renderPlaylistOptions = renderPlaylistOptionsClean; } catch (_) { window.renderPlaylistOptions = renderPlaylistOptionsClean; }
  var oldRenderChart = typeof renderChart === "function" ? renderChart : null;
  if (oldRenderChart) {
    renderChart = function(range){
      oldRenderChart(range);
      runFinalGuard();
    };
  }
  var oldRenderComposer = typeof renderComposer === "function" ? renderComposer : null;
  if (oldRenderComposer) {
    renderComposer = function(){
      oldRenderComposer();
      runFinalGuard();
    };
  }
  var oldRenderAccounts = typeof renderAccounts === "function" ? renderAccounts : null;
  if (oldRenderAccounts) {
    renderAccounts = function(){
      oldRenderAccounts();
      runFinalGuard();
    };
  }
  renderAnalytics = function(){
    renderContentReportClean();
    runFinalGuard();
  };
  document.addEventListener("click", function(event){
    if (event.target && event.target.closest && event.target.closest("[data-content-filter]")) return;
    setTimeout(runFinalGuard, 0);
  });
  document.addEventListener("change", function(event){
    if (event.target && event.target.matches && event.target.matches("#mediaInput,#coverInput,#captionInput,#publishMode,#playlistInput")) {
      setTimeout(runFinalGuard, 0);
    }
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runFinalGuard, { once: true });
  } else {
    runFinalGuard();
  }
  setTimeout(runFinalGuard, 100);
  setTimeout(runFinalGuard, 500);
  setTimeout(runFinalGuard, 1200);
})();



