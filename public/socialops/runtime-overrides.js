/* Final runtime layer for SocialOps Lite.
   Keep this file as the only place that patches the demo shell after core.js. */
(function socialOpsRuntimeOverrides(){
  var cfg = window.SOCIALOPS_CONFIG || {};
  var isPreview = !!cfg.demoTools;
  var isProduction = cfg.appEnv === "production";

  function $(selector, root){ return (root || document).querySelector(selector); }
  function $$(selector, root){ return Array.from((root || document).querySelectorAll(selector)); }
  function html(value){
    return String(value == null ? "" : value).replace(/[&<>"']/g, function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
    });
  }
  function attr(value){ return html(value); }
  function accountList(){
    try { return Array.isArray(accounts) ? accounts : []; } catch (_) { return []; }
  }
  function activeAccountSafe(){
    try { return typeof activeAccount === "function" ? activeAccount() : accountList()[0]; }
    catch (_) { return accountList()[0]; }
  }
  function accountName(account){ return account && account.name ? account.name : "YouTube"; }
  function icon(){
    try { return typeof youtubeIcon === "function" ? youtubeIcon() : '<span class="yt-dot">▶</span>'; }
    catch (_) { return '<span class="yt-dot">▶</span>'; }
  }
  function toastSafe(message){
    if (typeof toast === "function") toast(message);
  }

  function normalizeYoutubeHelp(){
    try {
      if (!window.helpContent || !helpContent.advancedYoutube) return;
      helpContent.advancedYoutube.title = "YouTube 發布設定說明";
      helpContent.advancedYoutube.sections = [
        {
          title: "兒童專屬內容",
          body: "發布前需要說明影片是否屬於兒童專屬內容。若設為兒童專屬，通知等部分功能會依 YouTube 規則調整。"
        },
        {
          title: "內容包含付費宣傳",
          body: "如果影片含有第三方提供的有價品，並據以製作相關影片，發布時需要標記，例如置入性行銷、贊助或代言。"
        },
        {
          title: "內容包含需揭露的 AI 內容",
          body: "若影片使用 AI 生成或編輯，且呈現真人言論、真實事件或看似真實但未發生的場景，發布時需要揭露。"
        },
        {
          title: "允許嵌入",
          body: "允許他人在網站上嵌入你的影片。"
        }
      ];
    } catch (_) {}
    var label = $(".advanced-summary-title > span");
    if (label) label.textContent = "YouTube 發布設定";
    var help = $(".summary-info");
    if (help) {
      help.dataset.help = "advancedYoutube";
      help.title = "YouTube 發布設定說明";
      help.setAttribute("aria-label", "YouTube 發布設定說明");
    }
  }

  function normalizeChartMode(){
    var type = localStorage.getItem("mvp_chart_type") || "bar";
    var chart = $("#viewsChart");
    var bars = $("#chartBars");
    var line = $("#chartLine");
    if (chart) chart.dataset.chartType = type;
    if (bars) {
      bars.hidden = type !== "bar";
      bars.style.display = type === "bar" ? "grid" : "none";
      bars.style.visibility = type === "bar" ? "visible" : "hidden";
    }
    if (line) {
      line.hidden = type !== "line";
      line.style.display = type === "line" ? "block" : "none";
      line.style.visibility = type === "line" ? "visible" : "hidden";
    }
  }

  function selectedIds(){
    try {
      var saved = JSON.parse(localStorage.getItem("mvp_publish_accounts") || "[]");
      if (Array.isArray(saved) && saved.length) return saved.filter(function(id){
        return accountList().some(function(account){ return account.id === id; });
      });
    } catch (_) {}
    var account = activeAccountSafe();
    return account ? [account.id] : [];
  }
  function saveSelectedIds(ids){
    var clean = ids.filter(Boolean);
    localStorage.setItem("mvp_publish_accounts", JSON.stringify(clean));
    if (clean[0]) localStorage.setItem("mvp_publish_account", clean[0]);
  }

  function closeTargetDialog(){
    var modal = $("#publishTargetModal");
    if (modal) modal.remove();
  }
  function openTargetDialog(){
    closeTargetDialog();
    var accountsData = accountList();
    var ids = selectedIds();
    var modal = document.createElement("div");
    modal.id = "publishTargetModal";
    modal.className = "target-modal-backdrop open";
    modal.innerHTML =
      '<div class="target-dialog" role="dialog" aria-modal="true" aria-label="發布目標">' +
        '<div class="target-dialog-head target-dialog-head-plain"><button class="target-dialog-close" type="button" aria-label="關閉">×</button></div>' +
        '<div class="target-dialog-list">' +
          accountsData.map(function(account){
            var active = ids.indexOf(account.id) >= 0;
            return '<button class="target-dialog-option ' + (active ? "active" : "") + '" type="button" data-target-id="' + attr(account.id) + '">' +
              '<span class="target-option-icon">' + icon() + '</span>' +
              '<strong>' + html(accountName(account)) + '</strong>' +
              '<span class="target-option-check" aria-hidden="true">' + (active ? "✓" : "") + '</span>' +
            '</button>';
          }).join("") +
        '</div>' +
        '<div class="target-dialog-actions"><button class="btn primary target-dialog-done" type="button">完成</button></div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function(event){ if (event.target === modal) closeTargetDialog(); });
    $(".target-dialog-close", modal).onclick = closeTargetDialog;
    $(".target-dialog-done", modal).onclick = function(){
      closeTargetDialog();
      renderPublishTargetsClean();
      if (typeof renderPlaylistOptions === "function") renderPlaylistOptions();
      if (typeof renderComposer === "function") renderComposer();
    };
    $$("[data-target-id]", modal).forEach(function(button){
      button.onclick = function(){
        var id = button.dataset.targetId;
        var next = selectedIds();
        if (next.indexOf(id) >= 0) {
          if (next.length === 1) {
            toastSafe("至少保留一個發布目標");
            return;
          }
          next = next.filter(function(item){ return item !== id; });
        } else {
          next.push(id);
        }
        saveSelectedIds(next);
        openTargetDialog();
      };
    });
  }
  function renderPublishTargetsClean(){
    var host = $("#publishTargets");
    if (!host) return;
    var accountsData = accountList();
    if (!accountsData.length) {
      host.innerHTML = "";
      return;
    }
    var selected = selectedIds().map(function(id){
      return accountsData.find(function(account){ return account.id === id; });
    }).filter(Boolean);
    if (!selected.length) selected = [accountsData[0]];
    var label = selected.length > 1 ? selected.length + " 個帳號" : accountName(selected[0]);
    host.innerHTML =
      '<button class="target-summary-button" type="button" id="publishTargetSummaryBtn">' +
        '<span class="target-summary-icon">' + icon() + '</span>' +
        '<strong>' + html(label) + '</strong>' +
      '</button>';
    $("#publishTargetSummaryBtn").onclick = openTargetDialog;
  }

  function realContentData(){
    try {
      var account = activeAccountSafe();
      var range = localStorage.getItem("mvp_chart_range") || "7";
      if (window.realContentAnalytics && account && realContentAnalytics[account.id]) {
        return realContentAnalytics[account.id][range] || realContentAnalytics[account.id]["7"] || null;
      }
    } catch (_) {}
    return null;
  }
  function demoContentData(){
    var account = activeAccountSafe();
    var name = accountName(account);
    return {
      content: 3,
      views: "188,400",
      engagement: "6.7%",
      items: [
        { type: "shorts", title: name + " 近期最佳 Shorts", views: "87,400", engagement: "7.5%", cover: "S" },
        { type: "video", title: name + " 更新公告", views: "42,800", engagement: "5.9%", cover: "V" },
        { type: "shorts", title: name + " 製作流程幕後分享", views: "58,200", engagement: "6.8%", cover: "S" }
      ]
    };
  }
  function setContentMetrics(data){
    var content = $("#analyticsContentMetric");
    var views = $("#analyticsViewsMetric");
    var engagement = $("#analyticsEngagementMetric");
    if (content) content.textContent = data ? data.content : "0";
    if (views) views.textContent = data ? data.views : "0";
    if (engagement) engagement.textContent = data ? data.engagement : "0%";
    ["analyticsContentDelta", "analyticsViewsDelta", "analyticsEngagementDelta"].forEach(function(id){
      var el = $("#" + id);
      if (el) el.textContent = data ? "" : "-";
    });
  }
  function renderContentRanking(){
    var list = $("#contentRankList");
    if (!list) return;
    var data = realContentData() || (isPreview ? demoContentData() : null);
    setContentMetrics(data);
    if (!data || !Array.isArray(data.items) || !data.items.length) {
      list.innerHTML = "";
      return;
    }
    var filter = localStorage.getItem("mvp_content_filter") || "all";
    var all = data.items;
    var shown = all.filter(function(item){ return filter === "all" || item.type === filter; });
    var count = function(type){ return all.filter(function(item){ return item.type === type; }).length; };
    list.innerHTML =
      '<div class="content-type-summary is-filterable">' +
        '<button type="button" class="content-type-filter ' + (filter === "all" ? "active" : "") + '" data-content-filter="all"><span>全部</span><strong>' + all.length + '</strong></button>' +
        '<button type="button" class="content-type-filter ' + (filter === "video" ? "active" : "") + '" data-content-filter="video"><span>一般影片</span><strong>' + count("video") + '</strong></button>' +
        '<button type="button" class="content-type-filter ' + (filter === "shorts" ? "active" : "") + '" data-content-filter="shorts"><span>Shorts</span><strong>' + count("shorts") + '</strong></button>' +
      '</div>' +
      shown.map(function(item, index){
        return '<article class="content-rank-card with-cover">' +
          '<span class="rank-index">' + (index + 1) + '</span>' +
          '<div class="rank-cover">' + html(item.cover || (item.type === "shorts" ? "S" : "V")) + '</div>' +
          '<div class="rank-copy"><strong>' + html(item.title) + '</strong><span>' + (item.type === "shorts" ? "Shorts" : "一般影片") + '</span></div>' +
          '<div><strong>' + html(item.views) + '</strong><span>觀看</span></div>' +
          '<div><strong>' + html(item.engagement) + '</strong><span>互動</span></div>' +
        '</article>';
      }).join("");
    $$("[data-content-filter]", list).forEach(function(button){
      button.onclick = function(){
        localStorage.setItem("mvp_content_filter", button.dataset.contentFilter || "all");
        renderContentRanking();
      };
    });
  }

  function openIssueModal(){
    var existing = $("#issueModalBackdrop");
    if (existing) existing.remove();
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
        toastSafe("請輸入問題描述");
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
        toastSafe("已送出問題回報");
      } catch (_) {
        toastSafe("問題回報送出失敗，請稍後再試");
      }
    };
  }
  function bindIssueButton(){
    var button = $("#reportIssueBtn");
    if (!button) {
      button = $$(".more-item, .more-row, button, a").find(function(item){
        return (item.textContent || "").replace(/\s+/g, "").indexOf("問題回報") >= 0;
      });
    }
    if (!button || button.dataset.runtimeIssueBound === "true") return;
    button.dataset.runtimeIssueBound = "true";
    button.addEventListener("click", function(event){
      event.preventDefault();
      event.stopPropagation();
      openIssueModal();
    });
  }
  document.addEventListener("click", function(event){
    var trigger = event.target && event.target.closest ? event.target.closest("#reportIssueBtn") : null;
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    openIssueModal();
  }, true);

  function normalizeRemoveButtons(){
    [
      ["mediaInput", "removeMediaBtn"],
      ["coverInput", "removeCoverBtn"],
      ["captionInput", "removeCaptionBtn"]
    ].forEach(function(pair){
      var input = $("#" + pair[0]);
      var button = $("#" + pair[1]);
      if (!button) return;
      var hasFile = !!(input && input.files && input.files.length);
      button.className = "file-remove" + (hasFile ? "" : " is-hidden");
      button.hidden = !hasFile;
      button.style.display = hasFile ? "grid" : "none";
      button.textContent = "";
      button.setAttribute("aria-label", "移除檔案");
      button.title = "移除檔案";
    });
  }

  function normalizeProductionDashboard(){
    if (!isProduction) return;
    var account = activeAccountSafe();
    var hasStats = false;
    try { hasStats = !!(account && window.accountStats && accountStats[account.id]); } catch (_) {}
    if (hasStats) return;
    ["subscriberMetric", "viewMetric"].forEach(function(id){
      var el = $("#" + id);
      if (el) el.textContent = "0";
    });
    var engagement = $("#engagementMetric");
    if (engagement) engagement.textContent = "0%";
    ["subscriberDelta", "viewDelta", "engagementDelta"].forEach(function(id){
      var el = $("#" + id);
      if (el) el.textContent = "-";
    });
    var yAxis = $("#chartYAxis");
    var labels = $("#chartLabels");
    var bars = $("#chartBars");
    var line = $("#chartLine");
    if (yAxis) yAxis.innerHTML = "";
    if (labels) labels.innerHTML = "";
    if (bars) bars.innerHTML = "";
    if (line) line.innerHTML = "";
  }

  function normalizeAll(){
    normalizeYoutubeHelp();
    normalizeChartMode();
    normalizeRemoveButtons();
    renderPublishTargetsClean();
    renderContentRanking();
    bindIssueButton();
    normalizeProductionDashboard();
    if (!isPreview) {
      var demo = $("#addDemoAccountBtn");
      if (demo) demo.remove();
    }
  }

  var previousRenderChart = typeof renderChart === "function" ? renderChart : null;
  if (previousRenderChart) {
    renderChart = function(range){
      previousRenderChart(range);
      normalizeAll();
    };
  }
  var previousRenderAnalytics = typeof renderAnalytics === "function" ? renderAnalytics : null;
  renderAnalytics = function(range){
    if (!isProduction && previousRenderAnalytics) {
      try { previousRenderAnalytics(range); } catch (_) {}
    }
    renderContentRanking();
  };
  var previousRenderComposer = typeof renderComposer === "function" ? renderComposer : null;
  if (previousRenderComposer) {
    renderComposer = function(){
      previousRenderComposer();
      normalizeAll();
    };
  }
  var previousRenderPublishTargets = typeof renderPublishTargets === "function" ? renderPublishTargets : null;
  renderPublishTargets = function(){
    if (!previousRenderPublishTargets) return renderPublishTargetsClean();
    renderPublishTargetsClean();
  };

  document.addEventListener("click", function(){ setTimeout(normalizeAll, 0); });
  document.addEventListener("change", function(event){
    if (event.target && event.target.matches && event.target.matches("#mediaInput,#coverInput,#captionInput,#publishMode,#visibilityInput,input[name='audienceChoice'],#playlistInput")) {
      setTimeout(normalizeAll, 0);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", normalizeAll, { once: true });
  } else {
    normalizeAll();
  }
  setTimeout(normalizeAll, 100);
  setTimeout(normalizeAll, 700);
})();
