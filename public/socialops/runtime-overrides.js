/* Runtime glue loaded last.
   This file keeps deployment-sensitive interactions stable without redrawing the whole app. */
(function socialOpsRuntimeGlue20260705Clean(){
  var shell = document.querySelector("[data-socialops-build]");
  var cfg = window.SOCIALOPS_CONFIG || {};
  if (shell && !cfg.appEnv) {
    cfg = {
      appEnv: shell.getAttribute("data-socialops-env") || "production",
      demoTools: shell.getAttribute("data-demo-tools") === "true",
      initialTab: shell.getAttribute("data-initial-tab") || "dashboard"
    };
    window.SOCIALOPS_CONFIG = cfg;
  }

  var isProduction = cfg.appEnv === "production";

  function $(selector, root){ return (root || document).querySelector(selector); }
  function $$(selector, root){ return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }
  function safe(fn, fallback){ try { return fn(); } catch (_) { return fallback; } }
  function html(value){
    return String(value == null ? "" : value).replace(/[&<>"']/g, function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
    });
  }
  function ytIcon(){
    return '<svg class="yt-play" viewBox="0 0 32 23" aria-hidden="true" focusable="false"><rect class="yt-play-bg" x="0" y="0" width="32" height="23" rx="6"></rect><path class="yt-play-triangle" d="M13 7.2v8.6l7-4.3z"></path></svg>';
  }
  function appAccounts(){
    return safe(function(){ return Array.isArray(accounts) ? accounts : []; }, []);
  }
  function availableAccounts(){
    return appAccounts().filter(function(account){
      if (!account || account.platform !== "YouTube") return false;
      if (!isProduction) return true;
      var id = String(account.id || "");
      return id !== "main" && id !== "studio" && id.indexOf("demo") !== 0;
    });
  }
  function selectedTargetIds(list){
    var ids = safe(function(){ return JSON.parse(localStorage.getItem("mvp_publish_accounts") || "[]"); }, []);
    if (!Array.isArray(ids) || !ids.length) {
      var legacy = localStorage.getItem("mvp_publish_account") || "";
      if (legacy) ids = [legacy];
    }
    ids = ids.filter(function(id){ return list.some(function(account){ return account.id === id; }); });
    if (!ids.length && list[0]) ids = [list[0].id];
    localStorage.setItem("mvp_publish_accounts", JSON.stringify(ids));
    if (ids[0]) localStorage.setItem("mvp_publish_account", ids[0]);
    return ids;
  }
  function syncTargetIds(ids){
    localStorage.setItem("mvp_publish_accounts", JSON.stringify(ids));
    if (ids[0]) localStorage.setItem("mvp_publish_account", ids[0]);
  }

  function renderPublishTargetsClean(){
    var host = $("#publishTargets");
    if (!host) return;
    var list = availableAccounts();
    if (!list.length) {
      host.innerHTML = '<a class="publish-target-summary target-empty" href="/accounts">連線 YouTube</a>';
      return;
    }
    var ids = selectedTargetIds(list);
    var selected = list.filter(function(account){ return ids.indexOf(account.id) >= 0; });
    var label = selected.length > 1 ? selected.length + " 個帳戶" : ((selected[0] && selected[0].name) || "YouTube");
    host.innerHTML =
      '<button class="publish-target-summary" id="publishTargetSummaryBtn" type="button">' +
        '<span class="publish-target-summary-icons">' + ytIcon() + '</span>' +
        '<span class="publish-target-summary-text"><strong>' + html(label) + '</strong></span>' +
      '</button>';
  }

  function openPublishTargetModalClean(){
    var list = availableAccounts();
    if (!list.length) return;
    var old = $("#publishTargetModal");
    if (old) old.remove();
    var ids = selectedTargetIds(list);
    var modal = document.createElement("div");
    modal.id = "publishTargetModal";
    modal.className = "issue-modal-backdrop publish-target-modal";
    modal.innerHTML =
      '<div class="issue-modal publish-target-dialog" role="dialog" aria-modal="true">' +
        '<div class="target-modal-list"></div>' +
        '<div class="issue-modal-actions"><button class="btn primary" type="button" data-done>完成</button></div>' +
      '</div>';
    document.body.appendChild(modal);
    var listNode = $(".target-modal-list", modal);

    function draw(){
      listNode.innerHTML = list.map(function(account){
        var active = ids.indexOf(account.id) >= 0;
        return '<button type="button" class="target-modal-row ' + (active ? "active" : "") + '" data-target-id="' + html(account.id) + '">' +
          '<span class="target-modal-avatar">' + ytIcon() + '</span>' +
          '<strong>' + html(account.name || "YouTube") + '</strong>' +
          '<span class="target-modal-check" aria-hidden="true"></span>' +
        '</button>';
      }).join("");
      $$("[data-target-id]", listNode).forEach(function(row){
        row.addEventListener("click", function(){
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
          syncTargetIds(ids);
          draw();
        });
      });
    }
    function close(){
      syncTargetIds(ids);
      modal.remove();
      renderPublishTargetsClean();
      safe(function(){ renderPlaylistOptions(); });
      safe(function(){ renderComposer(); });
    }
    draw();
    modal.addEventListener("click", function(event){ if (event.target === modal) close(); });
    $("[data-done]", modal).addEventListener("click", close);
  }

  function valuesForRange(range){
    return safe(function(){
      var account = typeof activeAccount === "function" ? activeAccount() : null;
      var id = account && account.id ? account.id : "main";
      var stats = accountStats || {};
      var data = (stats[id] && stats[id][range]) || (stats.main && stats.main[range]);
      return data || {
        subscribers:"0", subscriberDelta:"", views:"0", viewDelta:"", engagement:"0%", engagementDelta:"",
        labels:["一","二","三","四","五","六","日"],
        series:{views:[0,0,0,0,0,0,0], subscribers:[0,0,0,0,0,0,0], engagement:[0,0,0,0,0,0,0]}
      };
    }, { labels:[], series:{ views:[] } });
  }
  function setText(id, value){
    var el = $("#" + id);
    if (el) el.textContent = value == null ? "" : String(value);
  }
  function renderChartClean(range){
    range = range || localStorage.getItem("mvp_chart_range") || ($("#rangeSelect") && $("#rangeSelect").value) || "7";
    localStorage.setItem("mvp_chart_range", range);
    var rangeSelect = $("#rangeSelect");
    if (rangeSelect && rangeSelect.value !== range) rangeSelect.value = range;

    var metric = localStorage.getItem("mvp_chart_metric") || "views";
    var type = localStorage.getItem("mvp_chart_type") || "bar";
    var data = valuesForRange(range);
    var values = (data.series && (data.series[metric] || data.series.views)) || [];
    var labels = data.labels || [];
    var allZero = !values.length || values.every(function(value){ return !Number(value); });

    setText("subscribersValue", data.subscribers || "0");
    setText("subscriberDelta", data.subscriberDelta || "-");
    setText("viewsValue", data.views || "0");
    setText("viewDelta", data.viewDelta || "-");
    setText("engagementValue", data.engagement || "0%");
    setText("engagementDelta", data.engagementDelta || "-");

    $$("[data-chart-metric]").forEach(function(card){
      card.classList.toggle("active", card.dataset.chartMetric === metric);
    });
    $$("#chartTypeTabs button[data-chart-type]").forEach(function(button){
      button.classList.toggle("active", button.dataset.chartType === type);
    });

    var labelsNode = $("#chartLabels");
    if (labelsNode) labelsNode.innerHTML = labels.map(function(label){ return "<span>" + html(label) + "</span>"; }).join("");
    var barsNode = $("#chartBars");
    var lineNode = $("#chartLine");
    var yAxisNode = $("#chartYAxis");
    if (!barsNode || !lineNode) return;

    barsNode.innerHTML = "";
    lineNode.innerHTML = "";
    if (allZero) {
      if (yAxisNode) yAxisNode.innerHTML = "";
      return;
    }

    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    var span = Math.max(1, max - min);
    if (yAxisNode) {
      var ticks = [max, min + span * .66, min + span * .33, min];
      yAxisNode.innerHTML = ticks.map(function(value){ return "<span>" + Math.round(value).toLocaleString("zh-TW") + "</span>"; }).join("");
    }

    if (type === "bar") {
      barsNode.innerHTML = values.map(function(value){
        var h = 18 + ((value - min) / span) * 52;
        return '<span class="bar" style="height:' + h.toFixed(2) + '%"></span>';
      }).join("");
      lineNode.innerHTML = "";
    } else {
      var points = values.map(function(value, index){
        var x = values.length === 1 ? 50 : 7 + index * (86 / (values.length - 1));
        var y = 86 - ((value - min) / span) * 70;
        return { x:x, y:y };
      });
      var d = points.map(function(point, index){
        return (index ? "L" : "M") + point.x.toFixed(2) + " " + point.y.toFixed(2);
      }).join(" ");
      lineNode.innerHTML =
        '<path class="chart-polyline" d="' + d + '"></path>' +
        points.map(function(point){
          return '<circle class="chart-point" cx="' + point.x.toFixed(2) + '" cy="' + point.y.toFixed(2) + '" r="1.6"></circle>';
        }).join("");
      barsNode.innerHTML = "";
    }
  }

  function applyAudienceRestriction(){
    var madeForKids = safe(function(){ return isMadeForKids(); }, false);
    var notify = $("#notifyInput");
    if (notify) {
      if (madeForKids) notify.checked = false;
      notify.disabled = !!madeForKids;
      var line = notify.closest(".check-line");
      if (line) line.classList.toggle("is-disabled", !!madeForKids);
    }
  }

  function normalizeUploadRemoveButtons(){
    [
      ["mediaInput", "media", "removeMediaBtn"],
      ["coverInput", "cover", "removeCoverBtn"],
      ["captionInput", "caption", "removeCaptionBtn"]
    ].forEach(function(row){
      var file = safe(function(){ return typeof fileEntry === "function" ? fileEntry(row[1]) : null; }, null);
      var input = $("#" + row[0]);
      var button = $("#" + row[2]);
      var card = input && input.closest(".upload-item, .caption-file-row");
      if (card) card.classList.toggle("has-file", !!file);
      if (button) {
        button.classList.toggle("has-file", !!file);
        button.setAttribute("aria-label", "移除檔案");
        button.setAttribute("title", "移除檔案");
        button.innerHTML = "";
      }
    });
  }

  function normalizeLabels(){
    var advancedSummary = $(".advanced-settings summary");
    if (advancedSummary) {
      advancedSummary.childNodes.forEach(function(node){
        if (node.nodeType === Node.TEXT_NODE) node.nodeValue = node.nodeValue.replace(/進階設定|YT設定|Youtube 設定|YouTube 設定/g, "YouTube 發布設定");
      });
    }
    var helpButton = $(".summary-info");
    if (helpButton) {
      helpButton.dataset.help = "advancedYoutube";
      helpButton.setAttribute("aria-label", "YouTube 發布設定說明");
      helpButton.title = "YouTube 發布設定說明";
    }
    safe(function(){
      if (helpContent && helpContent.advancedYoutube) {
        helpContent.advancedYoutube.title = "YouTube 發布設定說明";
        helpContent.advancedYoutube.sections = [
          { title:"兒童專屬內容", body:"發布前需要說明影片是否屬於兒童專屬內容。若設為兒童專屬，部分功能會依 YouTube 規則調整。" },
          { title:"內容包含付費宣傳", body:"如果影片含有第三方提供的有價品，並據以製作相關影片，發布時需要標記，例如置入性行銷、贊助或代言。" },
          { title:"內容包含需揭露的 AI 內容", body:"如果內容使用 AI 生成或明顯修改，且可能讓觀眾誤以為真實事件或人物，發布時需要揭露。" },
          { title:"允許嵌入", body:"允許他人在網站上嵌入你的影片。" },
          { title:"發布時通知訂閱者", body:"發布影片時是否通知訂閱者。若影片設為兒童專屬，此功能會依 YouTube 規則停用。" }
        ];
      }
    });
  }

  function routeTab(){
    var path = location.pathname;
    if (path.indexOf("/accounts") === 0) return "accounts";
    if (path.indexOf("/composer") === 0) return "composer";
    if (path.indexOf("/app") === 0) return "dashboard";
    return cfg.initialTab || "dashboard";
  }
  function normalizePage(){
    safe(function(){ if (typeof tab === "function") tab(routeTab()); });
    normalizeLabels();
    normalizeUploadRemoveButtons();
    applyAudienceRestriction();
    renderPublishTargetsClean();
    if ($("#viewsChart")) renderChartClean(localStorage.getItem("mvp_chart_range") || ($("#rangeSelect") && $("#rangeSelect").value) || "7");
  }

  function wire(){
    if (window.__socialopsRuntimeCleanBound) return;
    window.__socialopsRuntimeCleanBound = true;

    document.addEventListener("click", function(event){
      var target = event.target && event.target.closest ? event.target.closest(
        "#publishTargetSummaryBtn,#chartTypeTabs button[data-chart-type],#addDemoAccountBtn,#addPlaylistBtn,#deletePlaylistBtn,#savePlaylistBtn,#cancelPlaylistBtn,[data-help],#removeMediaBtn,#removeCoverBtn,#removeCaptionBtn,label.audience-option"
      ) : null;
      if (!target) return;

      if (target.id === "publishTargetSummaryBtn") {
        event.preventDefault(); event.stopPropagation();
        openPublishTargetModalClean();
        return;
      }
      if (target.matches("#chartTypeTabs button[data-chart-type]")) {
        event.preventDefault(); event.stopPropagation();
        localStorage.setItem("mvp_chart_type", target.dataset.chartType);
        renderChartClean(localStorage.getItem("mvp_chart_range") || "7");
        return;
      }
      if (target.id === "addDemoAccountBtn") {
        event.preventDefault(); event.stopPropagation();
        if (cfg.demoTools && typeof addDemoAccount === "function") addDemoAccount();
        return;
      }
      if (target.id === "addPlaylistBtn") {
        event.preventDefault(); event.stopPropagation();
        safe(function(){ showPlaylistCreate(true); });
        return;
      }
      if (target.id === "deletePlaylistBtn") {
        event.preventDefault(); event.stopPropagation();
        safe(function(){ deleteSelectedPlaylist(); });
        return;
      }
      if (target.id === "savePlaylistBtn") {
        event.preventDefault(); event.stopPropagation();
        safe(function(){ addPlaylistForCurrentAccount(); });
        return;
      }
      if (target.id === "cancelPlaylistBtn") {
        event.preventDefault(); event.stopPropagation();
        safe(function(){ showPlaylistCreate(false); });
        return;
      }
      if (target.matches("[data-help]")) {
        event.preventDefault(); event.stopPropagation();
        safe(function(){ showHelpPopover(target.dataset.help, target); });
        return;
      }
      if (target.id === "removeMediaBtn") {
        event.preventDefault(); event.stopPropagation();
        safe(function(){ clearFileInput("mediaInput", "media"); setFieldError("media", ""); renderComposer(); });
        normalizeUploadRemoveButtons();
        return;
      }
      if (target.id === "removeCoverBtn") {
        event.preventDefault(); event.stopPropagation();
        safe(function(){ clearFileInput("coverInput", "cover"); renderComposer(); });
        normalizeUploadRemoveButtons();
        return;
      }
      if (target.id === "removeCaptionBtn") {
        event.preventDefault(); event.stopPropagation();
        safe(function(){ clearFileInput("captionInput", "caption"); renderComposer(); });
        normalizeUploadRemoveButtons();
        return;
      }
      if (target.matches("label.audience-option")) {
        setTimeout(function(){
          applyAudienceRestriction();
          safe(function(){ renderComposer(); });
        }, 0);
      }
    }, true);

    document.addEventListener("change", function(event){
      var target = event.target;
      if (!target || !target.matches) return;
      if (target.id === "rangeSelect") {
        localStorage.setItem("mvp_chart_range", target.value);
        renderChartClean(target.value);
        return;
      }
      if (target.matches("#mediaInput,#coverInput,#captionInput,#publishMode,#visibilityInput,#playlistInput,#categoryInput,#contentType,#paidPromoInput,#aiDisclosureInput,#embedInput,#notifyInput,input[name='audienceChoice']")) {
        if (target.name === "audienceChoice") applyAudienceRestriction();
        safe(function(){ renderComposer(); });
        normalizeUploadRemoveButtons();
      }
    }, true);

    document.addEventListener("input", function(event){
      var target = event.target;
      if (!target || !target.matches) return;
      if (target.matches("#titleInput,#contentInput,#tagsInput,#playlistNameInput")) {
        safe(function(){ renderComposer(); });
      }
    }, true);

    document.addEventListener("keydown", function(event){
      if (event.key === "Escape") {
        var modal = $("#publishTargetModal");
        if (modal) modal.remove();
      }
    }, true);
  }

  window.renderPublishTargets = renderPublishTargetsClean;
  window.openPublishTargetModal = openPublishTargetModalClean;
  window.renderChart = renderChartClean;
  safe(function(){ renderPublishTargets = renderPublishTargetsClean; });
  safe(function(){ openPublishTargetModal = openPublishTargetModalClean; });
  safe(function(){ renderChart = renderChartClean; });

  wire();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", normalizePage);
  } else {
    normalizePage();
  }
  setTimeout(normalizePage, 400);
})();
