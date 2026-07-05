/* Extracted compatibility overrides. Load after /socialops/core.js and before /socialops/runtime-overrides.js. */
/* Account search auto collapse when empty. */
(function(){
  var input=document.querySelector('#accountSearch');
  var wrap=document.querySelector('#accountSearchWrap');
  if(!input||!wrap)return;
  function collapseIfEmpty(){
    if(!input.value.trim()){
      wrap.classList.remove('open');
      wrap.classList.remove('has-value');
    }
  }
  input.addEventListener('blur',function(){setTimeout(collapseIfEmpty,120)});
  document.addEventListener('click',function(event){
    if(!wrap.contains(event.target))collapseIfEmpty();
  });
  input.addEventListener('keydown',function(event){
    if(event.key==='Escape'){
      input.value='';
      wrap.classList.remove('open');
      wrap.classList.remove('has-value');
      if(typeof renderAccounts==='function')renderAccounts();
    }
  });
})();

/* 2026-07-05 final regression lock.
   This must stay after every older renderer/bridge above. */
(function socialOpsUltimateRegressionLock(){
  var cfg=window.SOCIALOPS_CONFIG||{};
  var isProduction=cfg.appEnv==="production";
  function $(selector,root){return (root||document).querySelector(selector)}
  function $$(selector,root){return Array.from((root||document).querySelectorAll(selector))}
  function text(value){return String(value==null?"":value)}
  function safe(value){
    return text(value).replace(/[&<>"']/g,function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
    });
  }
  function accountName(account){
    return account?(account.name||account.displayName||"YouTube"):"YouTube";
  }
  function currentAccount(){
    try{
      if(typeof activeAccount==="function")return activeAccount();
      return Array.isArray(accounts)?accounts[0]:null;
    }catch(_){return null}
  }
  function hasStatsForActive(){
    try{
      var account=currentAccount();
      return !!(account&&window.accountStats&&accountStats[account.id]);
    }catch(_){return false}
  }
  function setMetricEmpty(){
    var empty={subscriberMetric:"0",viewMetric:"0",engagementMetric:"0%"};
    Object.keys(empty).forEach(function(id){var el=$("#"+id);if(el)el.textContent=empty[id]});
    ["subscriberDelta","viewDelta","engagementDelta"].forEach(function(id){var el=$("#"+id);if(el)el.textContent="-";});
    var y=$("#chartYAxis"),labels=$("#chartLabels"),bars=$("#chartBars"),line=$("#chartLine"),title=$("#chartTitle");
    if(title)title.textContent="觀看次數";
    if(y)y.innerHTML=["0","0","0","0"].map(function(item){return "<span>"+item+"</span>"}).join("");
    if(labels)labels.innerHTML="";
    if(bars)bars.innerHTML="";
    if(line)line.innerHTML="";
  }
  function normalizeChart(){
    var chart=$("#viewsChart"),bars=$("#chartBars"),line=$("#chartLine");
    if(!chart)return;
    var type=localStorage.getItem("mvp_chart_type")||"bar";
    chart.dataset.chartType=type;
    if(bars){bars.hidden=type!=="bar";bars.style.display=type==="bar"?"grid":"none";}
    if(line){
      line.hidden=type!=="line";
      line.style.display=type==="line"?"block":"none";
      line.querySelectorAll("path").forEach(function(path){path.classList.add("line-stroke")});
      var circles=line.querySelectorAll("circle");
      if(circles.length&&!line.querySelector(".line-hit-points")){
        var group=document.createElementNS("http://www.w3.org/2000/svg","g");
        group.setAttribute("class","line-hit-points");
        circles.forEach(function(circle){group.appendChild(circle)});
        line.appendChild(group);
      }
    }
    if(isProduction&&!hasStatsForActive())setMetricEmpty();
  }
  function normalizeUploadRemove(inputId,buttonId){
    var input=$("#"+inputId),button=$("#"+buttonId);
    if(!button)return;
    var hasFile=!!(input&&input.files&&input.files.length);
    var wrap=button.closest(".upload-item")||button.closest(".caption-file-row");
    if(wrap)wrap.classList.toggle("has-file",hasFile);
    button.hidden=!hasFile;
    button.classList.toggle("is-hidden",!hasFile);
    button.setAttribute("aria-hidden",hasFile?"false":"true");
    button.setAttribute("aria-label","移除檔案");
    button.title="移除檔案";
    button.textContent="";
    button.style.display=hasFile?"grid":"none";
  }
  function normalizeUploads(){
    normalizeUploadRemove("mediaInput","removeMediaBtn");
    normalizeUploadRemove("coverInput","removeCoverBtn");
    normalizeUploadRemove("captionInput","removeCaptionBtn");
  }
  function normalizeYoutubeSettingsLabel(){
    var title=$(".advanced-summary-title > span");
    if(title)title.textContent="YouTube 設定";
    var info=$(".advanced-summary-title [data-help], .summary-info");
    if(info){
      info.dataset.help="advancedYoutube";
      info.setAttribute("aria-label","YouTube 設定說明");
    }
    try{
      if(window.helpContent&&helpContent.advancedYoutube){
        helpContent.advancedYoutube.title="YouTube 設定說明";
      }
    }catch(_){}
  }
  function normalizeStatusActions(){
    $$(".account-status-action,.status-action").forEach(function(el){
      el.classList.remove("btn");
      el.style.transform="none";
      el.style.textDecoration="none";
    });
  }
  function contentItems(){
    if(!demoTools)return [];
    var account=currentAccount();
    var name=accountName(account);
    return [
      {type:"shorts",title:name+" 近期最佳 Shorts",views:"87,400",engagement:"7.5%",cover:"S"},
      {type:"video",title:name+" 更新公告",views:"42,800",engagement:"5.9%",cover:"V"},
      {type:"shorts",title:name+" 製作流程幕後分享",views:"58,200",engagement:"6.8%",cover:"S"}
    ];
  }
  function renderContentAnalyticsFinal(){
    var list=$("#contentRankList");
    if(!list)return;
    var filter=localStorage.getItem("mvp_content_filter")||"all";
    var items=contentItems();
    if(!demoTools&&!items.length){
      list.innerHTML="";
      var contentMetric=$("#analyticsContentMetric"),viewsMetric=$("#analyticsViewsMetric"),engagementMetric=$("#analyticsEngagementMetric");
      if(contentMetric)contentMetric.textContent="0";
      if(viewsMetric)viewsMetric.textContent="0";
      if(engagementMetric)engagementMetric.textContent="0%";
      return;
    }
    var shown=items.filter(function(item){return filter==="all"||item.type===filter});
    var total=items.length;
    var videos=items.filter(function(item){return item.type==="video"}).length;
    var shorts=items.filter(function(item){return item.type==="shorts"}).length;
    list.innerHTML='<div class="content-type-summary is-filterable">'
      +'<button type="button" class="content-type-filter '+(filter==="all"?"active":"")+'" data-content-filter="all"><span>全部</span><strong>'+total+'</strong></button>'
      +'<button type="button" class="content-type-filter '+(filter==="video"?"active":"")+'" data-content-filter="video"><span>一般影片</span><strong>'+videos+'</strong></button>'
      +'<button type="button" class="content-type-filter '+(filter==="shorts"?"active":"")+'" data-content-filter="shorts"><span>Shorts</span><strong>'+shorts+'</strong></button>'
      +'</div>'
      +shown.map(function(item,index){
        return '<article class="content-rank-card with-cover"><span class="rank-index">'+(index+1)+'</span><div class="rank-cover">'+safe(item.cover)+'</div><div class="rank-copy"><strong>'+safe(item.title)+'</strong><span>'+(item.type==="shorts"?"Shorts":"一般影片")+'</span></div><div><strong>'+safe(item.views)+'</strong><span>觀看</span></div><div><strong>'+safe(item.engagement)+'</strong><span>互動</span></div></article>';
      }).join("");
    $$("[data-content-filter]",list).forEach(function(btn){
      btn.onclick=function(){
        localStorage.setItem("mvp_content_filter",btn.dataset.contentFilter||"all");
        renderContentAnalyticsFinal();
      };
    });
  }
  function openIssueModal(){
    $("#issueModalBackdrop")&&$("#issueModalBackdrop").remove();
    var modal=document.createElement("div");
    modal.id="issueModalBackdrop";
    modal.className="issue-modal-backdrop";
    modal.innerHTML='<div class="issue-modal" role="dialog" aria-modal="true" aria-label="問題回報">'
      +'<div class="issue-modal-head"><h3>問題回報</h3><button type="button" class="issue-modal-close" aria-label="關閉">×</button></div>'
      +'<form class="issue-modal-body"><label><span>類型</span><select name="category"><option value="bug">功能異常</option><option value="ui">畫面顯示</option><option value="idea">建議</option><option value="other">其他</option></select></label>'
      +'<label><span>描述</span><textarea name="message" rows="5" placeholder="請描述你遇到的問題"></textarea></label>'
      +'<div class="issue-modal-actions"><button class="btn" type="button" data-close>取消</button><button class="btn primary" type="submit">送出</button></div></form></div>';
    document.body.appendChild(modal);
    var close=function(){modal.remove()};
    modal.addEventListener("click",function(event){if(event.target===modal)close()});
    $(".issue-modal-close",modal).onclick=close;
    $("[data-close]",modal).onclick=close;
    $("form",modal).onsubmit=async function(event){
      event.preventDefault();
      var form=event.currentTarget;
      var payload={category:form.category.value,page:location.pathname,message:form.message.value.trim()};
      if(!payload.message){if(typeof toast==="function")toast("請輸入問題描述");return}
      try{
        var response=await fetch("/api/reports",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
        if(!response.ok)throw new Error("failed");
        close();
        if(typeof toast==="function")toast("已送出問題回報");
      }catch(_){
        if(typeof toast==="function")toast("問題回報送出失敗，請稍後再試");
      }
    };
  }
  function bindIssueButton(){
    var btn=$("#reportIssueBtn");
    if(!btn||btn.dataset.issueBound==="true")return;
    btn.dataset.issueBound="true";
    btn.addEventListener("click",function(event){
      event.preventDefault();
      event.stopPropagation();
      openIssueModal();
    });
  }
  function runAll(){
    normalizeChart();
    normalizeUploads();
    normalizeYoutubeSettingsLabel();
    normalizeStatusActions();
    renderContentAnalyticsFinal();
    bindIssueButton();
    if(!cfg.demoTools){
      var demo=$("#addDemoAccountBtn");
      if(demo)demo.remove();
    }
  }
  var oldRenderChart=typeof renderChart==="function"?renderChart:null;
  if(oldRenderChart){
    renderChart=function(range){
      oldRenderChart(range);
      runAll();
    };
  }
  var oldRenderComposer=typeof renderComposer==="function"?renderComposer:null;
  if(oldRenderComposer){
    renderComposer=function(){
      oldRenderComposer();
      runAll();
    };
  }
  var oldRenderAnalytics=typeof renderAnalytics==="function"?renderAnalytics:null;
  renderAnalytics=function(range){
    if(oldRenderAnalytics)try{oldRenderAnalytics(range)}catch(_){}
    renderContentAnalyticsFinal();
  };
  document.addEventListener("change",function(event){
    if(event.target&&event.target.matches&&event.target.matches("#mediaInput,#coverInput,#captionInput")){
      setTimeout(runAll,0);
    }
  });
  document.addEventListener("click",function(){setTimeout(runAll,0)});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",runAll,{once:true});
  else runAll();
  setTimeout(runAll,80);
  setTimeout(runAll,400);
})();

/* 2026-07-05 final regression fixes. This intentionally runs after every
   previous demo bridge because the legacy script still mutates the DOM. */
(function socialOpsFinalFixes(){
  var cfg=window.SOCIALOPS_CONFIG||{};
  var demoTools=!!cfg.demoTools;
  var contentFilter=localStorage.getItem("mvp_content_filter")||"all";
  function $(sel,root){return (root||document).querySelector(sel)}
  function $$(sel,root){return Array.from((root||document).querySelectorAll(sel))}
  function text(value){return String(value==null?"":value)}
  function html(value){
    return text(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function isShort(item){
    return /shorts/i.test(text(item&&item.type));
  }
  function normalizeType(item){
    return isShort(item)?"Shorts":"一般影片";
  }
  function coverFor(index,type){
    var label=type==="Shorts"?"S":"YT";
    return '<div class="rank-cover" aria-hidden="true"><span>'+label+'</span></div>';
  }
  function activeAccountSafe(){
    try{return typeof activeAccount==="function"?activeAccount():accounts&&accounts[0]}catch(_){return accounts&&accounts[0]}
  }
  function activeRangeSafe(){
    return localStorage.getItem("mvp_chart_range")||($("#rangeSelect")&&$("#rangeSelect").value)||"7";
  }
  function normalizeRemoveButton(inputId,buttonId){
    var input=$("#"+inputId),button=$("#"+buttonId);
    if(!button)return;
    var hasFile=!!(input&&input.files&&input.files.length);
    var wrap=button.closest(".upload-item")||button.closest(".caption-file-row");
    if(wrap)wrap.classList.toggle("has-file",hasFile);
    button.hidden=!hasFile;
    button.classList.toggle("is-hidden",!hasFile);
    button.setAttribute("aria-hidden",hasFile?"false":"true");
    button.setAttribute("aria-label","移除檔案");
    button.title="移除檔案";
    button.textContent="";
    button.style.display=hasFile?"grid":"none";
  }
  function normalizeUploadButtons(){
    normalizeRemoveButton("mediaInput","removeMediaBtn");
    normalizeRemoveButton("coverInput","removeCoverBtn");
    normalizeRemoveButton("captionInput","removeCaptionBtn");
  }
  function normalizeAdvancedLabels(){
    var title=$(".advanced-summary-title > span");
    if(title)title.textContent="YouTube 設定";
    var info=$(".advanced-summary-title .summary-info");
    if(info){
      info.setAttribute("aria-label","YouTube 設定說明");
      info.dataset.help="advancedYoutube";
    }
    try{
      if(typeof helpContent==="object"&&helpContent.advancedYoutube){
        helpContent.advancedYoutube.title="YouTube 設定說明";
      }
    }catch(_){}
  }
  function normalizeAccountStatusActions(){
    $$(".account-status-action,.status-action").forEach(function(el){
      el.style.transform="none";
      el.style.textDecoration="none";
    });
  }
  function normalizeChartMode(){
    var chart=$("#viewsChart"),bars=$("#chartBars"),line=$("#chartLine");
    var type=localStorage.getItem("mvp_chart_type")||"bar";
    if(chart)chart.dataset.chartType=type;
    if(bars){
      bars.hidden=type!=="bar";
      bars.style.display=type==="bar"?"grid":"none";
    }
    if(line){
      line.hidden=type!=="line";
      line.style.display=type==="line"?"block":"none";
      if(type==="line"){
        var path=line.querySelector("path:not(.line-stroke)");
        if(path)path.classList.add("line-stroke");
        var circles=$$("circle",line);
        if(circles.length&&!line.querySelector(".line-hit-points")){
          var group=document.createElementNS("http://www.w3.org/2000/svg","g");
          group.setAttribute("class","line-hit-points");
          circles.forEach(function(circle){group.appendChild(circle)});
          line.appendChild(group);
        }
      }
    }
  }
  function normalizeMetricsWhenNoRealData(){
    if(demoTools)return;
    var hasAccount=Array.isArray(window.accounts?window.accounts:accounts)&&((window.accounts||accounts).length>0);
    if(!hasAccount){
      ["subscriberMetric","viewMetric","engagementMetric"].forEach(function(id){
        var el=$("#"+id); if(el)el.textContent=id==="engagementMetric"?"0%":"0";
      });
      ["subscriberDelta","viewDelta","engagementDelta"].forEach(function(id){
        var el=$("#"+id); if(el)el.textContent="";
      });
    }
  }
  function dataForAnalytics(range){
    try{
      var account=activeAccountSafe();
      var platformData=(contentAnalytics&&contentAnalytics.youtube)||{};
      if(account&&platformData[account.id])return platformData[account.id][range]||platformData[account.id]["7"];
      return platformData.main&&(platformData.main[range]||platformData.main["7"]);
    }catch(_){return null}
  }
  function renderContentAnalytics(range){
    range=range||activeRangeSafe();
    var data=dataForAnalytics(range);
    if(!data)return;
    var items=(data.items||[]).map(function(item,i){return Object.assign({rank:i+1},item,{type:normalizeType(item)})});
    var visible=items.filter(function(item){
      if(contentFilter==="shorts")return item.type==="Shorts";
      if(contentFilter==="video")return item.type!=="Shorts";
      return true;
    });
    var summary=$("#contentRankList");
    if($("#analyticsContentMetric"))$("#analyticsContentMetric").textContent=String(visible.length||items.length||0);
    if($("#analyticsViewsMetric"))$("#analyticsViewsMetric").textContent=data.views||"0";
    if($("#analyticsEngagementMetric"))$("#analyticsEngagementMetric").textContent=data.engagement||"0%";
    if(!summary)return;
    var total=items.length;
    var videos=items.filter(function(item){return item.type!=="Shorts"}).length;
    var shorts=items.filter(function(item){return item.type==="Shorts"}).length;
    summary.innerHTML='<div class="content-type-summary is-filterable">'
      +'<button type="button" class="content-type-filter '+(contentFilter==="all"?"active":"")+'" data-content-filter="all"><span>全部</span><strong>'+total+'</strong></button>'
      +'<button type="button" class="content-type-filter '+(contentFilter==="video"?"active":"")+'" data-content-filter="video"><span>一般影片</span><strong>'+videos+'</strong></button>'
      +'<button type="button" class="content-type-filter '+(contentFilter==="shorts"?"active":"")+'" data-content-filter="shorts"><span>Shorts</span><strong>'+shorts+'</strong></button>'
      +'</div>'
      +visible.map(function(item,i){
        var type=item.type;
        return '<article class="content-rank-card with-cover">'
          +'<div class="rank-index">'+(i+1)+'</div>'
          +coverFor(i,type)
          +'<div class="rank-main"><strong>'+html(item.title||"未命名內容")+'</strong><span>'+html(type)+'</span></div>'
          +'<div class="rank-stats"><span>'+html(item.views||"0")+'</span><small>觀看</small></div>'
          +'<div class="rank-stats"><span>'+html(item.engagement||"0%")+'</span><small>互動</small></div>'
          +'</article>';
      }).join("");
    $$("[data-content-filter]",summary).forEach(function(btn){
      btn.onclick=function(){
        contentFilter=btn.dataset.contentFilter||"all";
        localStorage.setItem("mvp_content_filter",contentFilter);
        renderContentAnalytics(range);
      };
    });
  }
  var oldRenderAnalytics=typeof renderAnalytics==="function"?renderAnalytics:null;
  renderAnalytics=function(range){
    if(oldRenderAnalytics)try{oldRenderAnalytics(range)}catch(_){}
    renderContentAnalytics(range);
  };
  function closeReportModal(){
    var modal=$("#issueReportModal");
    if(modal)modal.remove();
  }
  function openReportModal(){
    closeReportModal();
    var modal=document.createElement("div");
    modal.id="issueReportModal";
    modal.className="issue-modal-backdrop";
    modal.innerHTML='<div class="issue-modal" role="dialog" aria-modal="true" aria-label="問題回報">'
      +'<div class="issue-modal-head"><h3>問題回報</h3><button type="button" class="issue-modal-close" aria-label="關閉">×</button></div>'
      +'<form class="issue-modal-body"><label><span>類型</span><select name="category"><option value="bug">功能異常</option><option value="ui">畫面顯示</option><option value="account">帳戶連線</option><option value="other">其他</option></select></label>'
      +'<label><span>描述</span><textarea name="message" rows="5" placeholder="簡單說明你遇到的問題"></textarea></label>'
      +'<div class="issue-modal-actions"><button type="button" class="btn issue-cancel">取消</button><button type="submit" class="btn primary">送出</button></div></form>'
      +'</div>';
    document.body.appendChild(modal);
    modal.onclick=function(event){if(event.target===modal)closeReportModal()};
    $(".issue-modal-close",modal).onclick=closeReportModal;
    $(".issue-cancel",modal).onclick=closeReportModal;
    $("form",modal).onsubmit=async function(event){
      event.preventDefault();
      var form=event.currentTarget;
      var payload={category:form.category.value,page:location.pathname,message:form.message.value.trim()};
      if(!payload.message){if(typeof toast==="function")toast("請先輸入問題描述");return}
      try{
        var response=await fetch("/api/reports",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
        if(!response.ok)throw new Error("failed");
        closeReportModal();
        if(typeof toast==="function")toast("已送出問題回報");
      }catch(_){
        if(typeof toast==="function")toast("問題回報送出失敗，請稍後再試");
      }
    };
  }
  function installReportButton(){
    var btn=$("#reportIssueBtn");
    if(btn&&!btn.dataset.issueBound){
      btn.dataset.issueBound="true";
      btn.onclick=function(event){
        event.preventDefault();
        event.stopPropagation();
        openReportModal();
      };
    }
  }
  function syncAll(){
    normalizeUploadButtons();
    normalizeAdvancedLabels();
    normalizeAccountStatusActions();
    normalizeChartMode();
    normalizeMetricsWhenNoRealData();
    installReportButton();
    if(($("main")&&$("main").dataset.activeTab)==="analytics")renderContentAnalytics(activeRangeSafe());
  }
  var oldRenderComposer2=typeof renderComposer==="function"?renderComposer:null;
  renderComposer=function(){
    if(oldRenderComposer2)oldRenderComposer2();
    normalizeUploadButtons();
    normalizeAdvancedLabels();
  };
  var oldRenderChart2=typeof renderChart==="function"?renderChart:null;
  renderChart=function(range){
    if(oldRenderChart2)oldRenderChart2(range);
    normalizeChartMode();
    normalizeMetricsWhenNoRealData();
    if(($("main")&&$("main").dataset.activeTab)==="analytics")renderContentAnalytics(range);
  };
  document.addEventListener("change",function(event){
    if(event.target&&/^(mediaInput|coverInput|captionInput)$/.test(event.target.id)){
      setTimeout(normalizeUploadButtons,0);
    }
  },true);
  document.addEventListener("click",function(event){
    var filter=event.target&&event.target.closest&&event.target.closest("[data-content-filter]");
    if(filter){
      event.preventDefault();
      contentFilter=filter.dataset.contentFilter||"all";
      localStorage.setItem("mvp_content_filter",contentFilter);
      renderContentAnalytics(activeRangeSafe());
    }
    setTimeout(syncAll,0);
  },true);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",syncAll,{once:true});
  else syncAll();
  setInterval(syncAll,800);
})();

/* 2026-07-05 regression guard.
   This file still contains older demo code. Keep the stabilizing layer at EOF so
   production/preview flags, chart rendering, target selection, and file buttons
   cannot be overwritten by stale handlers above. */
(function socialOpsStableRuntime(){
  var cfg=window.SOCIALOPS_CONFIG||{};
  var demoTools=!!cfg.demoTools;
  var initialTab=cfg.initialTab||"dashboard";
  var ready=false;
  function $s(sel){return document.querySelector(sel)}
  function $$s(sel){return Array.from(document.querySelectorAll(sel))}
  function safeText(value){return String(value==null?"":value)}
  function statusFromApi(status){
    if(status==="authorized"||status==="connected"||status==="ok")return "已連線";
    if(status==="permission"||status==="missing_scope"||status==="insufficient_scope")return "需補權限";
    return "需重新確認";
  }
  function normalizeBars(values){
    var nums=values.map(function(v){return Number(v)||0});
    var max=Math.max.apply(null,nums),min=Math.min.apply(null,nums);
    var span=Math.max(1,max-min);
    return nums.map(function(v){return 22+((v-min)/span)*58});
  }
  function niceAxis(values,metric){
    var nums=values.map(function(v){return Number(v)||0});
    var max=Math.max.apply(null,nums),min=Math.min.apply(null,nums);
    if(!Number.isFinite(max)||!Number.isFinite(min)){max=100;min=0}
    if(max===min){max=max+1;min=Math.max(0,min-1)}
    var span=max-min;
    var ticks=[max,min+span*.66,min+span*.33,min];
    var y=$s("#chartYAxis");
    if(!y)return;
    y.innerHTML=ticks.map(function(v){
      var text=metric==="engagement"?Number(v).toFixed(1)+"%":Math.round(v).toLocaleString("zh-TW");
      return "<span>"+text+"</span>";
    }).join("");
  }
  function drawLine(values){
    var svg=$s("#chartLine");
    if(!svg)return;
    var nums=values.map(function(v){return Number(v)||0});
    var max=Math.max.apply(null,nums),min=Math.min.apply(null,nums);
    var span=Math.max(1,max-min);
    var points=nums.map(function(v,i){
      var x=nums.length===1?50:6+i*(88/(nums.length-1));
      var y=86-((v-min)/span)*72;
      return {x:x,y:y};
    });
    var d=points.map(function(p,i){return (i?"L":"M")+p.x.toFixed(2)+" "+p.y.toFixed(2)}).join(" ");
    svg.innerHTML='<path class="line-stroke" d="'+d+'"></path><g class="line-hit-points">'+points.map(function(p,i){
      return '<circle data-point-index="'+i+'" cx="'+p.x.toFixed(2)+'" cy="'+p.y.toFixed(2)+'" r="1.35"></circle>';
    }).join("")+'</g>';
  }
  function metricTitle(metric){
    if(metric==="subscribers")return "訂閱者";
    if(metric==="engagement")return "平均互動率";
    return "觀看次數";
  }
  function stableRenderChart(range){
    if(typeof renderAnalytics==="function")try{renderAnalytics(range)}catch(_){}
    var account=typeof activeAccount==="function"?activeAccount():(accounts&&accounts[0]);
    var metric=typeof activeChartMetric==="function"?activeChartMetric():"views";
    var type=typeof activeChartType==="function"?activeChartType():"bar";
    var fallback=accountStats.main&&accountStats.main[range]||accountStats.main&&accountStats.main["7"];
    var data=(account&&accountStats[account.id]&&accountStats[account.id][range])||fallback;
    if(!data)return;
    var values=(data.series&&data.series[metric])||data.series.views||[];
    var chart=$s("#viewsChart"),bars=$s("#chartBars"),line=$s("#chartLine"),title=$s("#chartTitle");
    if(chart)chart.dataset.chartType=type;
    if(title)title.textContent=metricTitle(metric);
    niceAxis(values,metric);
    if($s("#subscriberMetric"))$s("#subscriberMetric").textContent=data.subscribers||"--";
    if($s("#viewMetric"))$s("#viewMetric").textContent=data.views||"--";
    if($s("#engagementMetric"))$s("#engagementMetric").textContent=data.engagement||"--";
    if(typeof setDelta==="function"){
      try{setDelta("subscriberDelta",data.subscriberDelta||"+0.0%");setDelta("viewDelta",data.viewDelta||"+0.0%");setDelta("engagementDelta",data.engagementDelta||"+0.0%")}catch(_){}
    }
    if(bars){
      bars.hidden=type!=="bar";
      bars.style.display=type==="bar"?"grid":"none";
      var heights=normalizeBars(values);
      bars.innerHTML=heights.map(function(h,i){return '<div class="bar" data-point-index="'+i+'" style="height:'+h.toFixed(2)+'%"></div>'}).join("");
    }
    if(line){
      line.hidden=type!=="line";
      line.style.display=type==="line"?"block":"none";
      drawLine(values);
    }
    var labels=(data.labels||[]).map(function(label){return '<span>'+safeText(label)+'</span>'}).join("");
    if($s("#chartLabels"))$s("#chartLabels").innerHTML=labels;
    if(typeof bindChartTooltip==="function")try{bindChartTooltip(values)}catch(_){}
    if(typeof renderHealth==="function")try{renderHealth()}catch(_){}
    if($s("#rangeSelect"))$s("#rangeSelect").value=range;
    $$s("#chartTypeTabs button").forEach(function(btn){btn.classList.toggle("active",btn.dataset.chartType===type)});
    $$s("[data-chart-metric]").forEach(function(card){card.classList.toggle("active",card.dataset.chartMetric===metric)});
    try{localStorage.setItem("mvp_chart_range",range)}catch(_){}
  }
  renderChart=stableRenderChart;
  renderLine=drawLine;

  function selectedIdsStable(){
    try{
      var stored=JSON.parse(localStorage.getItem("mvp_publish_accounts")||"[]");
      if(Array.isArray(stored)&&stored.length)return stored.filter(function(id){return accounts.some(function(a){return a.id===id})});
    }catch(_){}
    return accounts[0]?[accounts[0].id]:[];
  }
  function saveSelectedIds(ids){
    if(!ids.length&&accounts[0])ids=[accounts[0].id];
    localStorage.setItem("mvp_publish_accounts",JSON.stringify(ids));
    if(ids[0])localStorage.setItem("mvp_publish_account",ids[0]);
  }
  function accountLabel(account){
    if(!account)return "未選擇";
    return account.name||account.displayName||"YouTube";
  }
  function closeTargetDialog(){
    var old=$s("#publishTargetDialog");
    if(old)old.remove();
  }
  function openTargetDialog(){
    closeTargetDialog();
    var ids=selectedIdsStable();
    var dialog=document.createElement("div");
    dialog.id="publishTargetDialog";
    dialog.className="target-modal-backdrop open";
    dialog.innerHTML='<div class="target-dialog" role="dialog" aria-modal="true"><div class="target-dialog-head"><h3></h3><button class="target-dialog-close" type="button" aria-label="關閉">×</button></div><div class="target-dialog-list">'+accounts.map(function(a){
      var active=ids.indexOf(a.id)>-1;
      return '<button class="target-dialog-option '+(active?'active':'')+'" type="button" data-target-id="'+a.id+'"><span class="target-option-icon">'+youtubeIcon()+'</span><strong>'+accountLabel(a)+'</strong><span class="target-option-check">'+(active?'✓':'')+'</span></button>';
    }).join("")+'</div><div class="target-dialog-actions"><button class="btn primary target-dialog-done" type="button">完成</button></div></div>';
    document.body.appendChild(dialog);
    dialog.onclick=function(event){if(event.target===dialog)closeTargetDialog()};
    dialog.querySelector(".target-dialog-close").onclick=closeTargetDialog;
    dialog.querySelector(".target-dialog-done").onclick=function(){closeTargetDialog();renderPublishTargets();if(typeof renderComposer==="function")renderComposer()};
    dialog.querySelectorAll("[data-target-id]").forEach(function(btn){
      btn.onclick=function(){
        var id=btn.dataset.targetId;
        var next=selectedIdsStable();
        if(next.indexOf(id)>-1){
          if(next.length===1){if(typeof toast==="function")toast("至少保留一個發布目標");return}
          next=next.filter(function(item){return item!==id});
        }else next.push(id);
        saveSelectedIds(next);
        openTargetDialog();
      };
    });
  }
  renderPublishTargets=function(){
    var host=$s("#publishTargets");
    if(!host)return;
    var selected=selectedIdsStable().map(function(id){return accounts.find(function(a){return a.id===id})}).filter(Boolean);
    var text=selected.length>1?selected.length+" 個帳戶":accountLabel(selected[0]);
    host.innerHTML='<button class="target-summary-button" type="button"><span class="target-summary-icon">'+youtubeIcon()+'</span><strong>'+text+'</strong></button>';
    host.querySelector("button").onclick=openTargetDialog;
  };

  function syncRemoveButton(inputId,buttonId){
    var input=$s("#"+inputId),btn=$s("#"+buttonId);
    if(!btn)return;
    var hasFile=!!(input&&input.files&&input.files.length);
    var wrap=btn.closest(".upload-item")||btn.closest(".caption-file-row");
    if(wrap)wrap.classList.toggle("has-file",hasFile);
    btn.hidden=!hasFile;
    btn.setAttribute("aria-hidden",hasFile?"false":"true");
    btn.classList.toggle("is-hidden",!hasFile);
    btn.textContent="";
    btn.setAttribute("aria-label","移除檔案");
    btn.title="移除檔案";
  }
  var oldRenderComposer=renderComposer;
  renderComposer=function(){
    if(typeof oldRenderComposer==="function")oldRenderComposer();
    syncRemoveButton("mediaInput","removeMediaBtn");
    syncRemoveButton("coverInput","removeCoverBtn");
    syncRemoveButton("captionInput","removeCaptionBtn");
  };

  async function hydrateRealAccounts(){
    try{
      var response=await fetch("/api/accounts",{cache:"no-store"});
      if(!response.ok)return;
      var data=await response.json();
      if(!Array.isArray(data.accounts))return;
      if(data.accounts.length){
        accounts=data.accounts.map(function(a,i){
          return {
            id:a.id,
            name:a.displayName||"YouTube",
            platform:"YouTube",
            group:a.groupName||"",
            favorite:!!a.favorite,
            status:statusFromApi(a.status),
            expires:a.tokenExpiresAt?String(a.tokenExpiresAt).slice(0,10):"",
            color:"transparent",
            avatar:"play",
            dataStart:"2026-06-01",
            dataEnd:"2026-06-30",
            sortOrder:a.sortOrder||i
          };
        });
      }else if(!demoTools){
        accounts=[];
      }
      if(!demoTools&&$s("#addDemoAccountBtn"))$s("#addDemoAccountBtn").remove();
      if(typeof save==="function")save();
      if(typeof renderAccounts==="function")renderAccounts();
      if(typeof renderAccountSwitcher==="function")renderAccountSwitcher();
      renderPublishTargets();
      if(typeof renderPlaylistOptions==="function")renderPlaylistOptions();
    }catch(_){}
  }
  async function hydrateMetrics(){
    try{
      var response=await fetch("/api/youtube/metrics",{cache:"no-store"});
      if(!response.ok)return;
      var data=await response.json();
      if(!Array.isArray(data.accounts))return;
      data.accounts.forEach(function(item){
        var id=item.accountId;
        if(!id||!item.ranges)return;
        accountStats[id]=item.ranges;
        Object.keys(item.ranges).forEach(function(range){
          var r=item.ranges[range];
          if(r&&r.series&&r.series.engagement&&item.metrics&&item.metrics.videoCount!=null){
            r.engagement=r.engagement||String(item.metrics.videoCount);
          }
        });
      });
      renderChart(localStorage.getItem("mvp_chart_range")||"7");
    }catch(_){}
  }

  function installRealPublishBridge(){
    var button=$s("#scheduleBtn");
    if(!button)return;
    button.onclick=async function(event){
      event.preventDefault();
      var title=$s("#titleInput"),media=$s("#mediaInput");
      if(!title||!title.value.trim()){if(typeof setFieldError==="function")setFieldError("title","請輸入標題。");title&&title.focus();return}
      var modeText=$s("#publishMode")?$s("#publishMode").value:"排程發布";
      var mode=modeText.indexOf("立即")>-1?"immediate":modeText.indexOf("草稿")>-1?"draft":"scheduled";
      if(mode!=="draft"&&(!media||!media.files||!media.files[0])){if(typeof setFieldError==="function")setFieldError("media","請選擇影片檔案。");return}
      var form=new FormData();
      selectedIdsStable().forEach(function(id){form.append("accountIds",id)});
      form.set("title",title.value.trim());
      form.set("description",$s("#contentInput")?$s("#contentInput").value:"");
      form.set("contentType",$s("#contentType")?$s("#contentType").value:"一般影片");
      form.set("publishMode",mode);
      form.set("visibility",$s("#visibilityInput")?$s("#visibilityInput").value:"private");
      if($s("#publishTime")&&$s("#publishTime").value)form.set("scheduledAt",new Date($s("#publishTime").value).toISOString());
      form.set("playlistId",$s("#playlistInput")?$s("#playlistInput").value:"");
      form.set("madeForKids",isMadeForKids()?"true":"false");
      form.set("paidPromo",$s("#paidPromoInput")&&$s("#paidPromoInput").checked?"true":"false");
      form.set("aiDisclosure",$s("#aiDisclosureInput")&&$s("#aiDisclosureInput").checked?"true":"false");
      form.set("embedAllowed",$s("#embedInput")&&$s("#embedInput").checked?"true":"false");
      form.set("notifySubscribers",$s("#notifyInput")&&$s("#notifyInput").checked?"true":"false");
      form.set("categoryId",$s("#categoryInput")?$s("#categoryInput").value:"24");
      form.set("tags",$s("#tagsInput")?$s("#tagsInput").value:"");
      form.set("license",$s("#licenseInput")?$s("#licenseInput").value:"youtube");
      if(media&&media.files&&media.files[0])form.set("media",media.files[0]);
      var cover=$s("#coverInput"),caption=$s("#captionInput");
      if(cover&&cover.files&&cover.files[0])form.set("cover",cover.files[0]);
      if(caption&&caption.files&&caption.files[0])form.set("caption",caption.files[0]);
      button.disabled=true;
      var old=button.textContent;
      button.textContent=mode==="draft"?"儲存中":"上傳中";
      try{
        var response=await fetch("/api/youtube/publish",{method:"POST",body:form});
        var result=await response.json().catch(function(){return {}});
        if(!response.ok){if(typeof toast==="function")toast(result.error||"發布失敗，請稍後再試。");return}
        if(typeof toast==="function")toast(mode==="draft"?"已儲存草稿":"已送出發布任務");
      }catch(_){
        if(typeof toast==="function")toast("發布失敗，請稍後再試。");
      }finally{
        button.disabled=false;
        button.textContent=old;
      }
    };
  }

  function install(){
    if(ready)return;
    ready=true;
    if(!demoTools&&$s("#addDemoAccountBtn"))$s("#addDemoAccountBtn").remove();
    if(initialTab&&typeof tab==="function"){tab(initialTab);try{localStorage.setItem("mvp_active_tab",initialTab)}catch(_){}}
    var activeRange=localStorage.getItem("mvp_chart_range")||"7";
    renderChart(activeRange);
    renderPublishTargets();
    renderComposer();
    installRealPublishBridge();
    hydrateRealAccounts().then(hydrateMetrics);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
  setTimeout(install,50);
})();

/* Dashboard platform icon dropdown override */
(function(){
  var btn=document.querySelector('#platformSwitchBtn');
  if(!btn)return;
  btn.onclick=function(event){
    event.stopPropagation();
    var menu=document.querySelector('#platformMenu');
    var moreMenu=document.querySelector('#moreMenu');
    var more=document.querySelector('#moreBtn');
    var panel=document.querySelector('#appearancePanel');
    var appearance=document.querySelector('#appearanceBtn');
    if(moreMenu)moreMenu.classList.remove('open');
    if(more)more.classList.remove('active');
    if(panel)panel.classList.remove('open');
    if(appearance)appearance.classList.remove('open');
    if(menu){var options=menu.querySelectorAll('[data-platform-id]');if(options.length<=1){menu.classList.remove('open');return;}menu.classList.toggle('open');}
    if(typeof setAsideMenuOpen==='function')setAsideMenuOpen(false);
  };
})();


/* 2026-07-05 authenticated app polish and no-fake-content guard. */
(function socialOpsFinalUserFixes20260705(){
  var cfg = window.SOCIALOPS_CONFIG || {};
  function $(sel, root){ return (root || document).querySelector(sel); }
  function $$(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }
  function safe(value){
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function activeRange(){
    return localStorage.getItem("mvp_chart_range") || ($("#rangeSelect") && $("#rangeSelect").value) || "7";
  }
  function currentAccount(){
    try { return typeof activeAccount === "function" ? activeAccount() : (window.accounts && accounts[0]); }
    catch (_) { return window.accounts && accounts[0]; }
  }
  function filterYoutubeHelp(){
    try {
      if (!window.helpContent || !helpContent.advancedYoutube) return;
      helpContent.advancedYoutube.title = "YouTube 設定說明";
      if (!Array.isArray(helpContent.advancedYoutube.sections)) return;
      helpContent.advancedYoutube.sections = helpContent.advancedYoutube.sections.filter(function(section){
        var title = String((section && section.title) || "");
        return title.indexOf("僅限成人") === -1 && title.indexOf("Shorts 重混") === -1;
      });
    } catch (_) {}
  }
  function normalizeYoutubeSettingLabels(){
    var summary = $(".advanced-summary-title > span");
    if (summary) summary.textContent = "YouTube 設定";
    var info = $(".summary-info");
    if (info) {
      info.dataset.help = "advancedYoutube";
      info.setAttribute("aria-label", "YouTube 設定說明");
      info.title = "YouTube 設定說明";
    }
    filterYoutubeHelp();
  }
  function analyticsData(range){
    try {
      var account = currentAccount();
      var platformData = (window.contentAnalytics && contentAnalytics.youtube) || {};
      if (account && platformData[account.id]) return platformData[account.id][range] || platformData[account.id]["7"] || null;
      return null;
    } catch (_) { return null; }
  }
  function itemType(item){
    return /shorts/i.test(String((item && item.type) || "")) ? "Shorts" : "一般影片";
  }
  function rankCover(item, index){
    var url = item && (item.thumbnail || item.coverUrl || item.image || item.coverImage);
    if (url) return '<div class="rank-cover"><img src="' + safe(url) + '" alt=""></div>';
    return '<div class="rank-cover" aria-hidden="true"><span>' + (itemType(item) === "Shorts" ? "S" : "YT") + '</span></div>';
  }
  function renderContentReport(range){
    var list = $("#contentRankList");
    if (!list) return;
    var data = analyticsData(range || activeRange());
    var items = (data && Array.isArray(data.items)) ? data.items : [];
    if (cfg.appEnv === "production" && !items.length) {
      ["analyticsContentMetric", "analyticsViewsMetric", "analyticsEngagementMetric"].forEach(function(id, idx){
        var el = $("#" + id);
        if (el) el.textContent = idx === 2 ? "0%" : "0";
      });
      list.innerHTML = "";
      return;
    }
    if (!items.length) {
      var account = currentAccount();
      var name = account ? (account.name || "YouTube") : "YouTube";
      items = [
        { type: "shorts", title: name + " 近期最佳 Shorts", views: "87,400", engagement: "7.5%" },
        { type: "video", title: name + " 更新公告", views: "42,800", engagement: "5.9%" },
        { type: "shorts", title: name + " 製作流程幕後分享", views: "58,200", engagement: "6.8%" }
      ];
    }
    var filter = localStorage.getItem("mvp_content_filter") || "all";
    var normalized = items.map(function(item){ return Object.assign({}, item, { normalizedType: itemType(item) }); });
    var visible = normalized.filter(function(item){
      if (filter === "shorts") return item.normalizedType === "Shorts";
      if (filter === "video") return item.normalizedType !== "Shorts";
      return true;
    });
    var total = normalized.length;
    var videos = normalized.filter(function(item){ return item.normalizedType !== "Shorts"; }).length;
    var shorts = normalized.filter(function(item){ return item.normalizedType === "Shorts"; }).length;
    if ($("#analyticsContentMetric")) $("#analyticsContentMetric").textContent = String(total);
    if ($("#analyticsViewsMetric")) $("#analyticsViewsMetric").textContent = (data && data.views) || "0";
    if ($("#analyticsEngagementMetric")) $("#analyticsEngagementMetric").textContent = (data && data.engagement) || "0%";
    list.innerHTML =
      '<div class="content-type-summary is-filterable">' +
        '<button type="button" class="content-type-filter ' + (filter === "all" ? "active" : "") + '" data-content-filter="all"><span>全部</span><strong>' + total + '</strong></button>' +
        '<button type="button" class="content-type-filter ' + (filter === "video" ? "active" : "") + '" data-content-filter="video"><span>一般影片</span><strong>' + videos + '</strong></button>' +
        '<button type="button" class="content-type-filter ' + (filter === "shorts" ? "active" : "") + '" data-content-filter="shorts"><span>Shorts</span><strong>' + shorts + '</strong></button>' +
      '</div>' +
      visible.map(function(item, index){
        return '<article class="content-rank-card with-cover">' +
          '<div class="rank-index">' + (index + 1) + '</div>' +
          rankCover(item, index) +
          '<div class="rank-main"><strong>' + safe(item.title || "未命名內容") + '</strong><span>' + safe(item.normalizedType) + '</span></div>' +
          '<div class="rank-stats"><span>' + safe(item.views || "0") + '</span><small>觀看</small></div>' +
          '<div class="rank-stats"><span>' + safe(item.engagement || item.rate || "0%") + '</span><small>互動</small></div>' +
        '</article>';
      }).join("");
    $$("[data-content-filter]", list).forEach(function(button){
      button.onclick = function(event){
        event.preventDefault();
        event.stopPropagation();
        localStorage.setItem("mvp_content_filter", button.dataset.contentFilter || "all");
        renderContentReport(range || activeRange());
      };
    });
  }
  function value(id, fallback){
    var el = $("#" + id);
    return el ? el.value : (fallback || "");
  }
  function checked(id){
    var el = $("#" + id);
    return !!(el && el.checked);
  }
  function labelForSelect(id, fallback){
    var el = $("#" + id);
    if (!el) return fallback || "";
    var option = el.options && el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null;
    return (option && option.textContent.trim()) || el.value || fallback || "";
  }
  function audienceText(){
    var el = document.querySelector('input[name="audienceChoice"]:checked');
    if (!el) return "未選擇";
    return el.value === "kids" ? "兒童專屬" : "非兒童專屬";
  }
  function previewSlot(key, label, emptyText){
    try {
      if (typeof previewFileHtml === "function") return previewFileHtml(key, label, emptyText);
    } catch (_) {}
    return '<div class="preview-slot"><span>' + safe(emptyText) + '</span></div>';
  }
  function targetText(){
    try {
      var targets = typeof selectedPublishAccounts === "function" ? selectedPublishAccounts() : [];
      if (!targets.length) return "未選擇";
      return targets.map(function(account){ return account.name || "YouTube"; }).join("、");
    } catch (_) { return "未選擇"; }
  }
  function renderComposerPreview(){
    var list = $("#previewList");
    if (!list) return;
    var title = value("titleInput", "").trim() || "未命名影片";
    var desc = value("contentInput", "").trim() || "尚未輸入說明";
    var visibilityMap = { private: "私人", unlisted: "不公開", public: "公開" };
    var visibility = visibilityMap[value("visibilityInput", "private")] || "私人";
    var media = previewSlot("media", "影片", "尚未選擇影片");
    var cover = previewSlot("cover", "封面", "尚未選擇封面");
    var playlist = labelForSelect("playlistInput", "").trim() || "未加入";
    var category = labelForSelect("categoryInput", "未選擇");
    var tags = value("tagsInput", "").trim() || "未設定";
    var caption = (function(){
      try {
        var entry = typeof fileEntry === "function" ? fileEntry("caption") : null;
        return entry && entry.name ? entry.name : "未上傳字幕";
      } catch (_) { return "未上傳字幕"; }
    })();
    var settings = [
      ["發布目標", targetText()],
      ["瀏覽權限", visibility],
      ["播放清單", playlist],
      ["目標觀眾", audienceText()],
      ["類別", category],
      ["標記", tags],
      ["字幕", caption],
      ["付費宣傳", checked("paidPromoInput") ? "是" : "否"],
      ["AI 聲明", checked("aiDisclosureInput") ? "是" : "否"],
      ["允許嵌入", checked("embedInput") ? "是" : "否"],
      ["通知訂閱者", checked("notifyInput") ? "是" : "否"]
    ];
    list.innerHTML =
      '<div class="composer-preview-list live-preview">' +
        '<div class="preview-media-grid">' + media + cover + '</div>' +
        '<article class="queue-row preview-summary live-preview-card">' +
          '<div class="youtube-preview-head">' +
            '<strong>' + safe(title) + '</strong>' +
            '<div class="youtube-channel"><span>' + safe(targetText()) + '</span></div>' +
            '<p>' + safe(desc.split("\\n").slice(0, 3).join("\\n")) + '</p>' +
          '</div>' +
          '<div class="preview-badges"><span class="badge neutral">' + safe(labelForSelect("contentType", "一般影片")) + '</span><span class="badge neutral">' + safe(visibility) + '</span></div>' +
          '<div class="preview-settings">' +
            settings.map(function(pair){ return '<div class="preview-setting"><span>' + safe(pair[0]) + '</span><span>' + safe(pair[1]) + '</span></div>'; }).join("") +
          '</div>' +
        '</article>' +
      '</div>';
  }
  function syncComposerFiles(event){
    var target = event && event.target;
    if (!target || !target.matches) return;
    try {
      if (target.matches("#mediaInput") && typeof syncFileInput === "function") syncFileInput("mediaInput", "media");
      if (target.matches("#coverInput") && typeof syncFileInput === "function") syncFileInput("coverInput", "cover");
      if (target.matches("#captionInput") && typeof syncFileInput === "function") syncFileInput("captionInput", "caption");
    } catch (_) {}
  }
  function refreshFinalView(range){
    normalizeYoutubeSettingLabels();
    renderContentReport(range || activeRange());
    renderComposerPreview();
  }
  try {
    renderAnalytics = function(range){ refreshFinalView(range); };
  } catch (_) {
    window.renderAnalytics = function(range){ refreshFinalView(range); };
  }
  if (typeof renderComposer === "function") {
    var previousRenderComposer = renderComposer;
    renderComposer = function(){
      previousRenderComposer();
      refreshFinalView(activeRange());
    };
  }
  document.addEventListener("change", function(event){
    syncComposerFiles(event);
    if (event.target && event.target.matches && event.target.matches("#mediaInput,#coverInput,#captionInput,#publishMode,#visibilityInput,#playlistInput,#categoryInput,#contentType,#paidPromoInput,#aiDisclosureInput,#embedInput,#notifyInput,input[name='audienceChoice']")) {
      setTimeout(refreshFinalView, 0);
    }
  });
  document.addEventListener("input", function(event){
    if (event.target && event.target.matches && event.target.matches("#titleInput,#contentInput,#tagsInput")) {
      setTimeout(refreshFinalView, 0);
    }
  });
  document.addEventListener("click", function(){ setTimeout(refreshFinalView, 0); });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){ refreshFinalView(activeRange()); }, { once: true });
  } else {
    refreshFinalView(activeRange());
  }
  setTimeout(function(){ refreshFinalView(activeRange()); }, 120);
  setTimeout(function(){ refreshFinalView(activeRange()); }, 800);
})();
/* Clean YouTube publish bridge for the Next backend. */
(function(){
  const COPY = {
    noTarget: "\u8acb\u9078\u64c7\u81f3\u5c11\u4e00\u500b\u767c\u5e03\u76ee\u6a19\u3002",
    noTitle: "\u8acb\u8f38\u5165\u5f71\u7247\u6a19\u984c\u3002",
    noMedia: "\u8acb\u9078\u64c7\u5f71\u7247\u6a94\u6848\u3002",
    noSchedule: "\u8acb\u8a2d\u5b9a\u6392\u7a0b\u767c\u5e03\u6642\u9593\u3002",
    uploading: "\u767c\u5e03\u4e2d...",
    saving: "\u5132\u5b58\u4e2d...",
    queuing: "\u52a0\u5165\u4f47\u5217\u4e2d...",
    uploaded: "\u5df2\u767c\u5e03\u5230 YouTube\u3002",
    drafted: "\u5df2\u5132\u5b58\u8349\u7a3f\u3002",
    queued: "\u5df2\u52a0\u5165\u6392\u7a0b\u4f47\u5217\u3002",
    partial: "\u90e8\u5206\u767c\u5e03\u5931\u6557\uff0c\u8acb\u6aa2\u67e5\u4f47\u5217\u72c0\u614b\u3002",
    uploadScope: "YouTube \u9700\u8981\u5f71\u7247\u4e0a\u50b3\u6b0a\u9650\uff0c\u8acb\u91cd\u65b0\u9023\u7dda YouTube\u3002",
    failed: "\u767c\u5e03\u9023\u7dda\u5931\u6557\uff0c\u8acb\u7a0d\u5f8c\u518d\u8a66\u3002",
  };
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const toast = (message, type) => {
    if (typeof window.showToast === "function") window.showToast(message, type || "success");
    else console.log(message);
  };
  const setFieldError = (field, message) => {
    if (!field) return;
    field.classList.add("is-invalid");
    let error = field.parentElement && field.parentElement.querySelector(".field-error");
    if (!error && field.parentElement) {
      error = document.createElement("div");
      error.className = "field-error";
      field.parentElement.appendChild(error);
    }
    if (error) error.textContent = message;
  };
  const clearFieldError = (field) => {
    if (!field) return;
    field.classList.remove("is-invalid");
    const error = field.parentElement && field.parentElement.querySelector(".field-error");
    if (error) error.textContent = "";
  };
  const publishMode = () => {
    const mode = $("#publishMode")?.value || "scheduled";
    if (mode === "immediate" || mode === "\u7acb\u5373\u767c\u5e03") return "immediate";
    if (mode === "draft" || mode === "\u5132\u5b58\u8349\u7a3f") return "draft";
    return "scheduled";
  };
  const selectedIds = () => {
    if (window.socialOpsSelectedPublishTargets instanceof Set && window.socialOpsSelectedPublishTargets.size) {
      return Array.from(window.socialOpsSelectedPublishTargets);
    }
    return $$("[data-target-account][aria-pressed='true'], [data-target-account].is-selected, input[name='publishTarget']:checked")
      .map((el) => el.dataset.targetAccount || el.value)
      .filter(Boolean);
  };
  const scheduleIso = () => {
    const date = $("#scheduleAt")?.value || $("#publishAt")?.value || "";
    if (!date) return "";
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? date : parsed.toISOString();
  };
  const hydratePublishTasks = async () => {
    if (typeof window.renderQueue !== "function") return;
    try {
      const response = await fetch("/api/publish-tasks", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data.tasks)) window.renderQueue(data.tasks);
    } catch (_) {}
  };
  const submitPublish = async (event) => {
    event?.preventDefault?.();
    const titleField = $("#postTitle");
    const mediaField = $("#videoFile");
    const mode = publishMode();
    clearFieldError(titleField);
    clearFieldError(mediaField);
    const accountIds = selectedIds();
    if (!accountIds.length) return toast(COPY.noTarget, "error");
    if (!titleField?.value?.trim()) {
      setFieldError(titleField, COPY.noTitle);
      titleField?.focus?.();
      return;
    }
    if (mode !== "draft" && !mediaField?.files?.[0]) {
      setFieldError(mediaField, COPY.noMedia);
      mediaField?.focus?.();
      return;
    }
    const scheduledAt = scheduleIso();
    if (mode === "scheduled" && !scheduledAt) return toast(COPY.noSchedule, "error");
    const form = new FormData();
    accountIds.forEach((id) => form.append("accountIds", id));
    form.set("title", titleField.value.trim());
    form.set("description", $("#postCaption")?.value || "");
    form.set("contentType", $("#contentType")?.value || "video");
    form.set("publishMode", mode);
    form.set("visibility", $("#visibility")?.value || "private");
    if (scheduledAt) form.set("scheduledAt", scheduledAt);
    form.set("playlistId", $("#playlistSelect")?.value || "");
    form.set("madeForKids", $("input[name='madeForKids']:checked")?.value || "false");
    form.set("paidPromo", $("#paidPromo")?.checked ? "true" : "false");
    form.set("aiDisclosure", $("#aiDisclosure")?.checked ? "true" : "false");
    form.set("embedAllowed", $("#embedAllowed")?.checked === false ? "false" : "true");
    form.set("notifySubscribers", $("#notifySubscribers")?.checked === false ? "false" : "true");
    form.set("categoryId", $("#categoryId")?.value || "24");
    form.set("tags", $("#tags")?.value || "");
    form.set("license", $("#license")?.value || "youtube");
    if (mediaField?.files?.[0]) form.set("media", mediaField.files[0]);
    const cover = $("#coverFile")?.files?.[0];
    if (cover) form.set("cover", cover);
    const caption = $("#captionFile")?.files?.[0];
    if (caption) form.set("caption", caption);
    toast(mode === "draft" ? COPY.saving : mode === "immediate" ? COPY.uploading : COPY.queuing, "info");
    try {
      const response = await fetch("/api/youtube/publish", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data.code === "youtube_upload_scope_required") toast(COPY.uploadScope, "error");
        else toast(data.error || COPY.failed, "error");
        return;
      }
      await hydratePublishTasks();
      const failed = Array.isArray(data.results) && data.results.some((item) => item.status === "failed");
      if (failed) toast(COPY.partial, "error");
      else toast(mode === "draft" ? COPY.drafted : mode === "immediate" ? COPY.uploaded : COPY.queued, "success");
    } catch (_) {
      toast(COPY.failed, "error");
    }
  };
  const install = () => {
    const button = $("#scheduleBtn");
    if (button && !button.dataset.realPublishBridge) {
      button.dataset.realPublishBridge = "true";
      button.onclick = submitPublish;
    }
    hydratePublishTasks();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
  setTimeout(install, 300);
})();

/* 2026-07-05 EOF lock. Nothing that normalizes the demo shell should be placed
   after this block unless it intentionally replaces these guarantees. */
(function socialOpsEofLock(){
  var cfg=window.SOCIALOPS_CONFIG||{};
  function $(selector,root){return (root||document).querySelector(selector)}
  function $$(selector,root){return Array.from((root||document).querySelectorAll(selector))}
  function escapeHtml(value){
    return String(value==null?"":value).replace(/[&<>"']/g,function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
    });
  }
  function active(){
    try{return typeof activeAccount==="function"?activeAccount():(Array.isArray(accounts)?accounts[0]:null)}catch(_){return null}
  }
  function selectedAccountIds(){
    try{
      var stored=JSON.parse(localStorage.getItem("mvp_publish_accounts")||"[]");
      if(Array.isArray(stored)&&stored.length)return stored;
    }catch(_){}
    var account=active();
    return account?[account.id]:[];
  }
  function normalizeRemove(inputId,buttonId){
    var input=$("#"+inputId),button=$("#"+buttonId);
    if(!button)return;
    var hasFile=!!(input&&input.files&&input.files.length);
    var wrap=button.closest(".upload-item")||button.closest(".caption-file-row");
    if(wrap)wrap.classList.toggle("has-file",hasFile);
    button.hidden=!hasFile;
    button.classList.toggle("is-hidden",!hasFile);
    button.setAttribute("aria-hidden",hasFile?"false":"true");
    button.setAttribute("aria-label","移除檔案");
    button.title="移除檔案";
    button.textContent="";
    button.style.display=hasFile?"grid":"none";
  }
  function normalizeComposerUi(){
    normalizeRemove("mediaInput","removeMediaBtn");
    normalizeRemove("coverInput","removeCoverBtn");
    normalizeRemove("captionInput","removeCaptionBtn");
    var title=$(".advanced-summary-title > span");
    if(title)title.textContent="YouTube 設定";
    var info=$(".summary-info");
    if(info){info.dataset.help="advancedYoutube";info.setAttribute("aria-label","YouTube 設定說明");}
    try{if(window.helpContent&&helpContent.advancedYoutube)helpContent.advancedYoutube.title="YouTube 設定說明";}catch(_){}
  }
  function normalizeChart(){
    var chart=$("#viewsChart"),bars=$("#chartBars"),line=$("#chartLine");
    if(!chart)return;
    var type=localStorage.getItem("mvp_chart_type")||"bar";
    chart.dataset.chartType=type;
    if(bars){bars.hidden=type!=="bar";bars.style.display=type==="bar"?"grid":"none";}
    if(line){
      line.hidden=type!=="line";
      line.style.display=type==="line"?"block":"none";
      line.querySelectorAll("path").forEach(function(path){path.classList.add("line-stroke")});
    }
    if(cfg.appEnv==="production"){
      var account=active();
      if(account&&window.accountStats&&!accountStats[account.id]){
        ["subscriberMetric","viewMetric"].forEach(function(id){var el=$("#"+id);if(el)el.textContent="0";});
        var e=$("#engagementMetric");if(e)e.textContent="0%";
        ["subscriberDelta","viewDelta","engagementDelta"].forEach(function(id){var el=$("#"+id);if(el)el.textContent="-";});
      }
    }
  }
  function normalizeAccountStatus(){
    $$(".account-status-action,.status-action").forEach(function(el){
      el.classList.remove("btn");
      el.style.transform="none";
      el.style.textDecoration="none";
    });
  }
  function contentData(){
    var account=active();
    var base=account?(account.name||"YouTube"):"YouTube";
    return [
      {type:"shorts",title:base+" 近期最佳 Shorts",views:"87,400",rate:"7.5%",cover:"S"},
      {type:"video",title:base+" 更新公告",views:"42,800",rate:"5.9%",cover:"V"},
      {type:"shorts",title:base+" 製作流程幕後分享",views:"58,200",rate:"6.8%",cover:"S"}
    ];
  }
  function renderContentTab(){
    var list=$("#contentRankList");
    if(!list)return;
    var filter=localStorage.getItem("mvp_content_filter")||"all";
    var data=contentData();
    var shown=data.filter(function(item){return filter==="all"||item.type===filter});
    var count=function(type){return data.filter(function(item){return item.type===type}).length};
    list.innerHTML='<div class="content-type-summary is-filterable">'
      +'<button type="button" class="content-type-filter '+(filter==="all"?"active":"")+'" data-content-filter="all"><span>全部</span><strong>'+data.length+'</strong></button>'
      +'<button type="button" class="content-type-filter '+(filter==="video"?"active":"")+'" data-content-filter="video"><span>一般影片</span><strong>'+count("video")+'</strong></button>'
      +'<button type="button" class="content-type-filter '+(filter==="shorts"?"active":"")+'" data-content-filter="shorts"><span>Shorts</span><strong>'+count("shorts")+'</strong></button>'
      +'</div>'+shown.map(function(item,index){
        return '<article class="content-rank-card with-cover"><span class="rank-index">'+(index+1)+'</span><div class="rank-cover">'+escapeHtml(item.cover)+'</div><div class="rank-copy"><strong>'+escapeHtml(item.title)+'</strong><span>'+(item.type==="shorts"?"Shorts":"一般影片")+'</span></div><div><strong>'+escapeHtml(item.views)+'</strong><span>觀看</span></div><div><strong>'+escapeHtml(item.rate)+'</strong><span>互動</span></div></article>';
      }).join("");
    $$("[data-content-filter]",list).forEach(function(button){
      button.onclick=function(){
        localStorage.setItem("mvp_content_filter",button.dataset.contentFilter||"all");
        renderContentTab();
      };
    });
  }
  function openIssueModal(){
    var old=$("#issueModalBackdrop");if(old)old.remove();
    var modal=document.createElement("div");
    modal.id="issueModalBackdrop";
    modal.className="issue-modal-backdrop";
    modal.innerHTML='<div class="issue-modal" role="dialog" aria-modal="true" aria-label="問題回報"><div class="issue-modal-head"><h3>問題回報</h3><button class="issue-modal-close" type="button" aria-label="關閉">×</button></div><form class="issue-modal-body"><label><span>類型</span><select name="category"><option value="bug">功能異常</option><option value="ui">畫面顯示</option><option value="account">帳戶連線</option><option value="other">其他</option></select></label><label><span>描述</span><textarea name="message" rows="5" placeholder="請描述你遇到的問題"></textarea></label><div class="issue-modal-actions"><button class="btn" type="button" data-close>取消</button><button class="btn primary" type="submit">送出</button></div></form></div>';
    document.body.appendChild(modal);
    var close=function(){modal.remove()};
    modal.onclick=function(event){if(event.target===modal)close()};
    $(".issue-modal-close",modal).onclick=close;
    $("[data-close]",modal).onclick=close;
    $("form",modal).onsubmit=async function(event){
      event.preventDefault();
      var form=event.currentTarget;
      var message=form.message.value.trim();
      if(!message){if(typeof toast==="function")toast("請輸入問題描述");return}
      try{
        var response=await fetch("/api/reports",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({category:form.category.value,page:location.pathname,message:message})});
        if(!response.ok)throw new Error("failed");
        close();if(typeof toast==="function")toast("已送出問題回報");
      }catch(_){if(typeof toast==="function")toast("問題回報送出失敗，請稍後再試");}
    };
  }
  function bindIssue(){
    var button=$("#reportIssueBtn");
    if(!button||button.dataset.eofIssueBound==="true")return;
    button.dataset.eofIssueBound="true";
    button.addEventListener("click",function(event){
      event.preventDefault();event.stopPropagation();openIssueModal();
    });
  }
  function installPublishBridge(){
    var button=$("#scheduleBtn");
    if(!button)return;
    button.onclick=async function(event){
      event.preventDefault();
      var mode=$("#publishMode")?$("#publishMode").value:"排程發布";
      var title=$("#titleInput"),media=$("#mediaInput");
      if(!title||!title.value.trim()){if(typeof setFieldError==="function")setFieldError("title","請輸入影片標題。");title&&title.focus();return}
      if(mode!=="儲存草稿"&&(!media||!media.files||!media.files[0])){if(typeof setFieldError==="function")setFieldError("media","請選擇影片檔案。");return}
      if(mode==="排程發布"&&$("#publishTime")&&!$("#publishTime").value){if(typeof toast==="function")toast("請設定排程發布時間。");return}
      var form=new FormData();
      selectedAccountIds().forEach(function(id){form.append("accountIds",id)});
      form.set("title",title.value.trim());
      form.set("description",$("#contentInput")?$("#contentInput").value:"");
      form.set("contentType",$("#contentType")?$("#contentType").value:"一般影片");
      form.set("publishMode",mode==="立即發布"?"immediate":mode==="儲存草稿"?"draft":"scheduled");
      form.set("visibility",$("#visibilityInput")?$("#visibilityInput").value:"private");
      if($("#publishTime")&&$("#publishTime").value)form.set("scheduledAt",new Date($("#publishTime").value).toISOString());
      form.set("playlistId",$("#playlistInput")?$("#playlistInput").value:"");
      form.set("madeForKids",typeof isMadeForKids==="function"&&isMadeForKids()?"true":"false");
      form.set("paidPromo",$("#paidPromoInput")&&$("#paidPromoInput").checked?"true":"false");
      form.set("aiDisclosure",$("#aiDisclosureInput")&&$("#aiDisclosureInput").checked?"true":"false");
      form.set("embedAllowed",$("#embedInput")&&$("#embedInput").checked?"true":"false");
      form.set("notifySubscribers",$("#notifyInput")&&$("#notifyInput").checked?"true":"false");
      form.set("categoryId",$("#categoryInput")?$("#categoryInput").value:"24");
      form.set("tags",$("#tagsInput")?$("#tagsInput").value:"");
      form.set("license",$("#licenseInput")?$("#licenseInput").value:"youtube");
      if(media&&media.files&&media.files[0])form.set("media",media.files[0]);
      var cover=$("#coverInput"),caption=$("#captionInput");
      if(cover&&cover.files&&cover.files[0])form.set("cover",cover.files[0]);
      if(caption&&caption.files&&caption.files[0])form.set("caption",caption.files[0]);
      var oldText=button.textContent;
      button.disabled=true;
      button.textContent=mode==="儲存草稿"?"儲存中...":mode==="立即發布"?"發布中...":"加入中...";
      try{
        var response=await fetch("/api/youtube/publish",{method:"POST",body:form});
        var data=await response.json().catch(function(){return {}});
        if(!response.ok){if(typeof toast==="function")toast(data.error||"發布失敗，請稍後再試。");return}
        if(typeof toast==="function")toast(mode==="儲存草稿"?"已儲存草稿。":mode==="立即發布"?"已發布到 YouTube。":"已加入排程佇列。");
      }catch(_){if(typeof toast==="function")toast("發布連線失敗，請稍後再試。");}
      finally{button.disabled=false;button.textContent=oldText;}
    };
  }
  function run(){
    normalizeComposerUi();
    normalizeChart();
    normalizeAccountStatus();
    renderContentTab();
    bindIssue();
    installPublishBridge();
    if(!cfg.demoTools){var demo=$("#addDemoAccountBtn");if(demo)demo.remove();}
  }
  var oldChart=typeof renderChart==="function"?renderChart:null;
  if(oldChart)renderChart=function(range){oldChart(range);run()};
  var oldComposer=typeof renderComposer==="function"?renderComposer:null;
  if(oldComposer)renderComposer=function(){oldComposer();run()};
  var oldAnalytics=typeof renderAnalytics==="function"?renderAnalytics:null;
  renderAnalytics=function(range){if(oldAnalytics)try{oldAnalytics(range)}catch(_){}renderContentTab()};
  document.addEventListener("click",function(){setTimeout(run,0)});
  document.addEventListener("change",function(event){if(event.target&&event.target.matches&&event.target.matches("#mediaInput,#coverInput,#captionInput"))setTimeout(run,0)});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run,{once:true});else run();
  setTimeout(run,100);
  setTimeout(run,600);
})();

/* 2026-07-05 production pre-guard.
   This runs before runtime-overrides.js and prevents a brief flash of demo
   content/accounts while the real account and metric APIs are still loading. */
(function socialOpsProductionPreGuard20260705(){
  var cfg = window.SOCIALOPS_CONFIG || {};
  if (cfg.appEnv !== "production") return;
  function $(selector, root){ return (root || document).querySelector(selector); }
  function $$(selector, root){ return Array.from((root || document).querySelectorAll(selector)); }
  function isDemoAccount(account){
    if (!account) return true;
    var id = String(account.id || "");
    var name = String(account.name || account.displayName || "");
    return id === "__empty" || id === "main" || id === "studio" || id.indexOf("demo") === 0 || name === "YouTube" || name === "工作用 YouTube" || /^YouTube 測試帳號/.test(name);
  }
  function cleanAccounts(){
    try {
      if (!Array.isArray(accounts)) return;
      var filtered = accounts.filter(function(account){ return !isDemoAccount(account); });
      if (filtered.length !== accounts.length) {
        accounts.length = 0;
        filtered.forEach(function(account){ accounts.push(account); });
      }
    } catch (_) {}
  }
  function emptyContentReport(){
    var list = $("#contentRankList");
    if (list) {
      list.innerHTML = '<div class="content-type-summary is-filterable"><button type="button" class="content-type-filter active" data-content-filter="all"><span>全部</span><strong>0</strong></button><button type="button" class="content-type-filter" data-content-filter="video"><span>一般影片</span><strong>0</strong></button><button type="button" class="content-type-filter" data-content-filter="shorts"><span>Shorts</span><strong>0</strong></button></div><div class="content-empty">目前沒有可顯示的內容資料</div>';
    }
    [["analyticsContentMetric","0"],["analyticsViewsMetric","0"],["analyticsEngagementMetric","0%"]].forEach(function(item){
      var el = $("#" + item[0]);
      if (el) el.textContent = item[1];
    });
    ["analyticsContentDelta","analyticsViewsDelta","analyticsEngagementDelta"].forEach(function(id){
      var el = $("#" + id);
      if (el) el.textContent = "-";
    });
  }
  function emptyDemoRows(){
    cleanAccounts();
    emptyContentReport();
    var addDemo = $("#addDemoAccountBtn");
    if (addDemo) addDemo.remove();
    var list = $("#accountList");
    if (list) {
      $$(".account", list).forEach(function(card){
        if (/YouTube 測試帳號|工作用 YouTube/.test(card.textContent || "") || (card.textContent || "").trim() === "YouTube") {
          card.remove();
        }
      });
    }
  }
  var oldAnalytics = typeof renderAnalytics === "function" ? renderAnalytics : null;
  renderAnalytics = function(range){
    if (oldAnalytics) {
      try { oldAnalytics(range); } catch (_) {}
    }
    emptyContentReport();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", emptyDemoRows, { once: true });
  } else {
    emptyDemoRows();
  }
  setTimeout(emptyDemoRows, 80);
  setTimeout(emptyDemoRows, 400);
})();

