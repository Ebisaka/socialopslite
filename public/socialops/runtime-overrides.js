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
    var account = activeAccountSafe();
    var base = account ? (account.name || "YouTube") : "YouTube";
    return [
      { type: "shorts", title: base + " 近期最佳 Shorts", views: "87,400", rate: "7.5%", cover: "S" },
      { type: "video", title: base + " 更新公告", views: "42,800", rate: "5.9%", cover: "V" },
      { type: "shorts", title: base + " 製作流程幕後分享", views: "58,200", rate: "6.8%", cover: "S" }
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



