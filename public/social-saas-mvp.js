var cfg=window.SOCIALOPS_CONFIG||{};
var isProduction=cfg.appEnv==="production";
var emptyRangeData={subscribers:"0",subscriberDelta:"",views:"0",viewDelta:"",engagement:"0%",engagementDelta:"",labels:["一","二","三","四","五","六","日"],series:{views:[0,0,0,0,0,0,0],subscribers:[0,0,0,0,0,0,0],engagement:[0,0,0,0,0,0,0]}};
var emptyStats={main:{"7":emptyRangeData,"30":emptyRangeData,"90":emptyRangeData,"custom":emptyRangeData}};
var metricMeta={subscribers:{title:"訂閱者",unit:"人"},views:{title:"觀看次數",unit:"次"},engagement:{title:"平均互動率",unit:"%"}};
var defaultAccounts=[
  {id:"main",name:"YouTube",platform:"YouTube",group:"",favorite:true,status:"已連線",expires:"2026-07-25",color:"transparent",avatar:"play",dataStart:"2026-04-01",dataEnd:"2026-06-30"},
  {id:"studio",name:"工作用 YouTube",platform:"YouTube",group:"",favorite:false,status:"已連線",expires:"2026-08-12",color:"transparent",avatar:"play",dataStart:"2026-05-10",dataEnd:"2026-06-30"}
];
var defaultQueue=[];
var accountHealth={main:[{key:"auth",state:"ok",icon:"✓",title:"連線正常",text:"YouTube 已連線"},{key:"sync",state:"ok",icon:"↻",title:"資料已同步",text:"今天 13:08",action:true}],studio:[{key:"auth",state:"ok",icon:"✓",title:"連線正常",text:"YouTube 已連線"},{key:"sync",state:"warn",icon:"↻",title:"資料稍舊",text:"最後同步：昨天 22:10",action:true}]};
var accountStats={
  main:{
    "7":{subscribers:"18,420",subscriberDelta:"近 7 天 +4.8%",views:"742,980",viewDelta:"近 7 天 +11.2%",engagement:"6.7%",engagementDelta:"近 7 天 +0.9%",labels:["一","二","三","四","五","六","日"],series:{views:[52,67,45,82,74,94,61],subscribers:[31,35,32,41,44,47,52],engagement:[46,50,43,55,59,66,61]}},
    "30":{subscribers:"19,080",subscriberDelta:"近 30 天 +8.6%",views:"2,846,300",viewDelta:"近 30 天 +17.4%",engagement:"6.2%",engagementDelta:"近 30 天 +0.4%",labels:["6/1","6/4","6/7","6/10","6/13","6/16","6/19","6/22","6/25","6/28"],series:{views:[38,44,58,51,69,73,66,82,77,91],subscribers:[24,28,33,36,41,47,52,58,64,70],engagement:[55,52,58,49,61,64,60,68,66,62]}},
    "90":{subscribers:"21,740",subscriberDelta:"近 90 天 +16.8%",views:"8,920,400",viewDelta:"近 90 天 +22.1%",engagement:"5.9%",engagementDelta:"近 90 天 +0.7%",labels:["4/1","4/8","4/15","4/22","5/1","5/8","5/15","5/22","6/1","6/8","6/15","6/22"],series:{views:[42,48,45,52,59,63,68,64,72,79,75,86],subscribers:[20,25,29,34,38,45,49,55,61,66,72,78],engagement:[48,45,51,54,50,57,61,58,64,60,66,63]}},
    "custom":{subscribers:"20,260",subscriberDelta:"自訂範圍 +9.4%",views:"3,420,880",viewDelta:"自訂範圍 +13.2%",engagement:"6.1%",engagementDelta:"自訂範圍 -0.2%",labels:["起始","","","中段","","","","結束"],series:{views:[46,51,49,58,66,71,69,80],subscribers:[30,34,38,43,48,52,57,62],engagement:[58,55,57,52,54,50,48,49]}}
  },
  studio:{
    "7":{subscribers:"6,120",subscriberDelta:"近 7 天 +2.1%",views:"186,440",viewDelta:"近 7 天 +6.3%",engagement:"4.8%",engagementDelta:"近 7 天 +0.2%",labels:["一","二","三","四","五","六","日"],series:{views:[35,44,41,56,49,62,58],subscribers:[22,25,24,28,31,35,38],engagement:[40,44,42,49,45,53,48]}},
    "30":{subscribers:"6,480",subscriberDelta:"近 30 天 +5.4%",views:"694,200",viewDelta:"近 30 天 +9.8%",engagement:"4.5%",engagementDelta:"近 30 天 -0.1%",labels:["6/1","6/4","6/7","6/10","6/13","6/16","6/19","6/22","6/25","6/28"],series:{views:[31,36,39,42,48,51,46,57,62,66],subscribers:[18,21,23,26,30,33,37,40,43,47],engagement:[46,43,44,41,47,45,42,48,46,44]}},
    "90":{subscribers:"7,030",subscriberDelta:"近 90 天 +11.3%",views:"2,108,900",viewDelta:"近 90 天 +14.6%",engagement:"4.6%",engagementDelta:"近 90 天 +0.3%",labels:["4/1","4/8","4/15","4/22","5/1","5/8","5/15","5/22","6/1","6/8","6/15","6/22"],series:{views:[28,31,35,39,37,44,48,51,54,59,57,63],subscribers:[15,18,21,24,27,31,34,37,40,44,46,50],engagement:[42,40,43,45,41,47,49,46,50,52,48,51]}},
    "custom":{subscribers:"6,760",subscriberDelta:"自訂範圍 +6.2%",views:"821,400",viewDelta:"自訂範圍 +8.1%",engagement:"4.4%",engagementDelta:"自訂範圍 -0.3%",labels:["起始","","","中段","","","","結束"],series:{views:[30,34,38,42,47,52,55,60],subscribers:[19,21,24,27,31,34,37,41],engagement:[44,42,43,41,40,39,42,41]}}
  }
};
if(isProduction)accountStats=emptyStats;

var contentAnalytics={
  youtube:{
    main:{
      "7":{content:"12",contentDelta:"近 7 天 +2",views:"742,980",viewsDelta:"近 7 天 +11.2%",engagement:"6.7%",engagementDelta:"近 7 天 +0.9%",items:[{title:"新企劃上線公告",type:"一般影片",views:"128,000",engagement:"9.8%"},{title:"製作流程幕後分享",type:"Shorts",views:"87,400",engagement:"7.5%"},{title:"更新重點快速整理",type:"一般影片",views:"42,600",engagement:"6.1%"}]},
      "30":{content:"48",contentDelta:"近 30 天 +8",views:"2,846,300",viewsDelta:"近 30 天 +17.4%",engagement:"6.2%",engagementDelta:"近 30 天 +0.4%",items:[{title:"30 天企劃回顧",type:"一般影片",views:"360,200",engagement:"8.9%"},{title:"觀眾留言精華",type:"Shorts",views:"214,800",engagement:"8.1%"},{title:"產品更新總整理",type:"一般影片",views:"188,600",engagement:"6.9%"}]},
      "90":{content:"128",contentDelta:"近 90 天 +24",views:"8,920,400",viewsDelta:"近 90 天 +22.1%",engagement:"5.9%",engagementDelta:"近 90 天 +0.7%",items:[{title:"季度代表作合集",type:"一般影片",views:"920,000",engagement:"8.4%"},{title:"Shorts 高光片段",type:"Shorts",views:"614,500",engagement:"7.8%"},{title:"頻道定位調整說明",type:"一般影片",views:"402,300",engagement:"6.4%"}]},
      "custom":{content:"86",contentDelta:"+9",views:"3,420,880",viewsDelta:"+13.2%",engagement:"6.1%",engagementDelta:"-0.2%",items:[{title:"自訂期間最佳內容",type:"一般影片",views:"284,600",engagement:"8.2%"},{title:"自訂期間 Shorts 精選",type:"Shorts",views:"193,100",engagement:"7.1%"},{title:"活動後續整理",type:"一般影片",views:"126,900",engagement:"5.9%"}]}
    },
    studio:{
      "7":{content:"7",contentDelta:"近 7 天 +1",views:"186,440",viewsDelta:"近 7 天 +6.3%",engagement:"4.8%",engagementDelta:"近 7 天 +0.2%",items:[{title:"測試帳號短片 A",type:"Shorts",views:"34,200",engagement:"6.2%"},{title:"測試帳號教學片",type:"一般影片",views:"21,900",engagement:"4.9%"},{title:"測試帳號公告",type:"一般影片",views:"12,400",engagement:"3.8%"}]},
      "30":{content:"26",contentDelta:"近 30 天 +4",views:"694,200",viewsDelta:"近 30 天 +9.8%",engagement:"4.5%",engagementDelta:"近 30 天 -0.1%",items:[{title:"工作帳號月度整理",type:"一般影片",views:"94,700",engagement:"5.8%"},{title:"工作帳號 Shorts 合輯",type:"Shorts",views:"72,500",engagement:"5.1%"},{title:"團隊流程展示",type:"一般影片",views:"45,300",engagement:"4.4%"}]},
      "90":{content:"74",contentDelta:"近 90 天 +13",views:"2,108,900",viewsDelta:"近 90 天 +14.6%",engagement:"4.6%",engagementDelta:"近 90 天 +0.3%",items:[{title:"工作帳號季度內容",type:"一般影片",views:"241,800",engagement:"6.1%"},{title:"幕後短片合集",type:"Shorts",views:"168,200",engagement:"5.6%"},{title:"客戶案例整理",type:"一般影片",views:"103,900",engagement:"4.8%"}]},
      "custom":{content:"38",contentDelta:"+5",views:"821,400",viewsDelta:"+8.1%",engagement:"4.4%",engagementDelta:"-0.3%",items:[{title:"自訂期間工作帳號內容",type:"一般影片",views:"86,400",engagement:"5.2%"},{title:"自訂期間短片",type:"Shorts",views:"54,900",engagement:"4.8%"},{title:"內部公告整理",type:"一般影片",views:"31,200",engagement:"3.9%"}]}
    }
  }
};
if(isProduction)contentAnalytics={youtube:{main:{}}};
function createDemoContentAnalytics(accountId,index){if(isProduction)return;var base=18+index*5;contentAnalytics.youtube[accountId]={"7":{content:String(4+index),contentDelta:"近 7 天 +1",views:(base*8200).toLocaleString("zh-TW"),viewsDelta:"近 7 天 +"+(3+index%5)+".%",engagement:(4.2+index*.3).toFixed(1)+"%",engagementDelta:"近 7 天 +0."+(index%7)+"%",items:[{title:"測試帳號 "+index+" 近期最佳內容",type:"一般影片",views:(base*2100).toLocaleString("zh-TW"),engagement:(5.1+index*.2).toFixed(1)+"%"},{title:"測試帳號 "+index+" Shorts",type:"Shorts",views:(base*1400).toLocaleString("zh-TW"),engagement:(4.8+index*.2).toFixed(1)+"%"},{title:"測試帳號 "+index+" 更新公告",type:"一般影片",views:(base*760).toLocaleString("zh-TW"),engagement:(3.9+index*.2).toFixed(1)+"%"}]},"30":{content:String(15+index*2),contentDelta:"近 30 天 +"+(2+index),views:(base*31000).toLocaleString("zh-TW"),viewsDelta:"近 30 天 +"+(6+index%6)+".%",engagement:(4.5+index*.25).toFixed(1)+"%",engagementDelta:"近 30 天 +0."+(index%6)+"%",items:[{title:"測試帳號 "+index+" 月度代表作",type:"一般影片",views:(base*7200).toLocaleString("zh-TW"),engagement:(5.8+index*.2).toFixed(1)+"%"},{title:"測試帳號 "+index+" 月度短片",type:"Shorts",views:(base*5100).toLocaleString("zh-TW"),engagement:(5.0+index*.2).toFixed(1)+"%"},{title:"測試帳號 "+index+" 內容整理",type:"一般影片",views:(base*3300).toLocaleString("zh-TW"),engagement:(4.2+index*.2).toFixed(1)+"%"}]},"90":{content:String(44+index*6),contentDelta:"近 90 天 +"+(6+index),views:(base*95000).toLocaleString("zh-TW"),viewsDelta:"近 90 天 +"+(10+index%8)+".%",engagement:(4.7+index*.2).toFixed(1)+"%",engagementDelta:"近 90 天 +0."+(index%5)+"%",items:[{title:"測試帳號 "+index+" 季度精選",type:"一般影片",views:(base*18800).toLocaleString("zh-TW"),engagement:(6.0+index*.2).toFixed(1)+"%"},{title:"測試帳號 "+index+" 高互動短片",type:"Shorts",views:(base*12200).toLocaleString("zh-TW"),engagement:(5.4+index*.2).toFixed(1)+"%"},{title:"測試帳號 "+index+" 長片整理",type:"一般影片",views:(base*9400).toLocaleString("zh-TW"),engagement:(4.6+index*.2).toFixed(1)+"%"}]},"custom":{content:String(24+index*3),contentDelta:"+"+(3+index),views:(base*42000).toLocaleString("zh-TW"),viewsDelta:"+"+(7+index%7)+".%",engagement:(4.4+index*.2).toFixed(1)+"%",engagementDelta:"-0."+(index%4)+"%",items:[{title:"測試帳號 "+index+" 自訂期間最佳",type:"一般影片",views:(base*8600).toLocaleString("zh-TW"),engagement:(5.5+index*.2).toFixed(1)+"%"},{title:"測試帳號 "+index+" 自訂短片",type:"Shorts",views:(base*5400).toLocaleString("zh-TW"),engagement:(4.9+index*.2).toFixed(1)+"%"},{title:"測試帳號 "+index+" 自訂整理",type:"一般影片",views:(base*3100).toLocaleString("zh-TW"),engagement:(4.1+index*.2).toFixed(1)+"%"}]}};}
var rangeMeta={"7":{title:"近 7 天觀看",hint:"用來觀察影片發布後的整體趨勢。"},"30":{title:"近 30 天觀看",hint:"用週期切片觀察這段時間的觀看變化。"},"90":{title:"近 90 天觀看",hint:"用較長時間範圍觀察內容走勢。"},"custom":{title:"自訂範圍觀看",hint:"依你選擇的日期範圍查看趨勢。"}};
var accounts=load("mvp_accounts_youtube",isProduction?[{id:"__empty",name:"YouTube",platform:"YouTube",group:"",favorite:false,status:"已連線",color:"transparent",avatar:"play",dataStart:"",dataEnd:""}]:defaultAccounts),queue=load("mvp_queue_youtube",defaultQueue);accounts=accounts.filter(function(a){return a.platform==="YouTube"}).map(function(a,i){a.id=a.id||("account"+i);a.platform="YouTube";a.avatar="play";a.color="transparent";if(a.status==="已串接")a.status="已連線";if(a.status==="需續期")a.status="需重新確認";if(a.status==="權限不足")a.status="需補權限";if(a.group==="影音內容")a.group="";return a});if(!accounts.length)accounts=isProduction?[{id:"__empty",name:"YouTube",platform:"YouTube",group:"",favorite:false,status:"已連線",color:"transparent",avatar:"play",dataStart:"",dataEnd:""}]:defaultAccounts.slice();queue=queue.filter(function(t){return t.title!=="YouTube Shorts 開場測試"});save();var pageCopy={dashboard:"營運總覽",accounts:"帳號管理",composer:"內容發文",analytics:"內容分析"};var activeGroupIndex=null,dragIndex=null,accountEditMode=false;var helpContent={accountConnected:{title:"已連線",description:"這個 YouTube 帳號目前可以正常同步資料與發布內容。",action:"不需要處理。"},accountReconnect:{title:"需重新確認",description:"為了維持資料同步與發布功能，這個帳號需要重新登入 YouTube 確認連線。",action:"點選重新確認，依照 YouTube 畫面完成確認即可。"},accountPermission:{title:"需補權限",description:"這個帳號已連上，但部分功能尚未開啟，例如發布影片或讀取分析資料。",action:"重新連線時開啟需要的功能權限。"},advancedYoutube:{title:"YouTube 設定說明",sections:[{title:"兒童專屬內容",body:"無論所在地區，發布前都需要說明影片是否屬於兒童專屬內容。若設為兒童專屬，部分功能可能會依 YouTube 規則調整。"},{title:"僅限成人觀眾收看",body:"可將影片設為僅限年滿 18 歲的觀眾收看。設有年齡限制的影片不會顯示在 YouTube 的特定版面中，並可能影響廣告顯示。"},{title:"內容包含付費宣傳",body:"如果影片含有第三方提供的有價品，並據以製作相關影片，發布時需要標記，例如置入性行銷、贊助或代言。"},{title:"內容包含需揭露的 AI 內容",body:"若影片使用 AI 生成或編輯，且呈現真人言論、真實事件或地點經過加工，或看似真實但未發生的場景，發布時需要揭露。"},{title:"允許嵌入",body:"允許他人在網站上嵌入你的影片。"},{title:"Shorts 重混",body:"允許他人使用這部影片的內容製作 Shorts。"}]}};var fileState={media:null,cover:null,caption:null};var accountPlaylists=isProduction?{}:{main:["新品 / 新企劃","教學內容","Shorts 精選"],studio:["客戶案例","品牌素材","直播回放"]};
function syncFileInput(id,key){var input=q("#"+id),file=input&&input.files&&input.files[0];if(!file)return;if(fileState[key]&&fileState[key].url)URL.revokeObjectURL(fileState[key].url);fileState[key]={name:file.name,type:file.type,url:URL.createObjectURL(file)}}function clearFileInput(id,key){var input=q("#"+id);if(fileState[key]&&fileState[key].url)URL.revokeObjectURL(fileState[key].url);fileState[key]=null;if(input)input.value="";renderComposer()}function fileEntry(key){return fileState[key]}function previewFileHtml(key,label,emptyText){var entry=fileEntry(key);if(!entry||!entry.url)return '<div class="preview-slot"><span>'+escapeHtml(emptyText)+'</span></div>';var isVideo=entry.type.indexOf("video/")===0,isImage=entry.type.indexOf("image/")===0;if(isVideo)return '<div class="preview-slot"><video src="'+escapeAttr(entry.url)+'" muted controls></video><span class="preview-label">'+escapeHtml(label)+'</span></div>';if(isImage)return '<div class="preview-slot '+(label==="封面"?"cover":"")+'"><img src="'+escapeAttr(entry.url)+'" alt="'+escapeAttr(label)+'"><span class="preview-label">'+escapeHtml(label)+'</span></div>';return '<div class="preview-slot"><span>'+escapeHtml(entry.name)+'</span></div>'}
function selectedPublishAccountIds(){var stored=load("mvp_publish_accounts",null);if(!Array.isArray(stored)||!stored.length){var legacy=localStorage.getItem("mvp_publish_account")||activeAccountId();stored=[legacy]}var valid=stored.filter(function(id){return accounts.some(function(a){return a.id===id})});if(!valid.length)valid=[activeAccountId()];localStorage.setItem("mvp_publish_accounts",JSON.stringify(valid));return valid}function selectedPublishAccounts(){var ids=selectedPublishAccountIds();return ids.map(function(id){return accounts.find(function(a){return a.id===id})}).filter(Boolean)}function selectedPublishAccount(){return selectedPublishAccounts()[0]||activeAccount()}
function load(k,fallback){try{return JSON.parse(localStorage.getItem(k))||fallback}catch(e){return fallback}}function save(){localStorage.setItem("mvp_accounts_youtube",JSON.stringify(accounts));localStorage.setItem("mvp_queue_youtube",JSON.stringify(queue))}function q(s){return document.querySelector(s)}function qa(s){return Array.from(document.querySelectorAll(s))}function escapeHtml(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function escapeAttr(v){return escapeHtml(v).replace(/'/g,"&#39;")}var toastTimer=null;function toast(t){var el=q("#toast");if(!el)return;if(toastTimer)clearTimeout(toastTimer);el.innerHTML="<div class=\"toast-inner\"><span class=\"toast-message\">"+escapeHtml(t)+"</span></div>";el.classList.add("show");toastTimer=setTimeout(function(){el.classList.remove("show")},2600)}function updateReportSwitchLabel(id){qa("[data-report-tab]").forEach(function(b){b.classList.toggle("active",b.dataset.reportTab===id)});var btn=q("#reportSwitchBtn");if(btn){btn.innerHTML="洞察報告 <span class=\"chevron\" aria-hidden=\"true\"></span>"}}function tab(id){if(!pageCopy[id])id="dashboard";localStorage.setItem("mvp_active_tab",id);var main=q("main");if(main)main.dataset.activeTab=id;var topAccountWrap=q(".top-account-wrap");if(topAccountWrap)topAccountWrap.classList.toggle("is-hidden",id!=="dashboard"&&id!=="analytics");qa(".nav button").forEach(function(b){var navId=b.dataset.tab;var active=navId===id||(navId==="dashboard"&&id==="analytics");b.classList.toggle("active",active)});qa(".section").forEach(function(s){s.classList.toggle("active",s.id===id)});var pageTitle=q("#pageTitle");if(pageTitle)pageTitle.textContent=pageCopy[id];qa("[data-report-tab]").forEach(function(b){b.classList.toggle("active",b.dataset.reportTab===id)});updateReportSwitchLabel(id);var menu=q("#reportMenu");if(menu)menu.classList.remove("open")}function cls(s){return s==="已連線"?"ok":s==="需重新確認"?"warn":"bad"}function accountStatusIconHtml(status){var kind=status==="已連線"?"ok":status==="需重新確認"?"warn":"bad";var icon=kind==="ok"?'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M8.3 12.2l2.4 2.4 5-5.3"></path></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.8v5.2"></path><path d="M12 16.4h.01"></path></svg>';return '<button class="account-status-icon status-icon-'+kind+'" type="button" data-status-help="'+escapeAttr(status)+'" title="'+escapeAttr(status)+'" aria-label="'+escapeAttr(status)+'">'+icon+'</button>'}function deltaClass(text){return String(text).indexOf("+")>-1?"delta-up":String(text).indexOf("-")>-1?"delta-down":"delta-neutral"}function compactDelta(text){return String(text||"").replace(/近\s*7\s*天|近\s*30\s*天|近\s*90\s*天|自訂範圍/g,"").trim()}function setDelta(id,text){var el=q("#"+id);el.textContent=compactDelta(text);el.className=deltaClass(text)}
function systemTheme(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function applyThemeMode(mode){var resolved=mode==="system"?systemTheme():mode;document.body.dataset.themeMode=mode;document.body.dataset.resolvedTheme=resolved;localStorage.setItem("mvp_theme_mode",mode);var icon=mode==="system"?"◐":mode==="dark"?"☾":"☀";var label=mode==="system"?"跟隨系統":mode==="dark"?"深色模式":"淺色模式";var themeIcon=q("#themeIcon"),themeBtn=q("#themeBtn");if(themeIcon)themeIcon.textContent=icon;if(themeBtn)themeBtn.title=label;qa("[data-theme-choice]").forEach(function(btn){btn.classList.toggle("active",btn.dataset.themeChoice===mode)})}function toggleTheme(){var current=document.body.dataset.themeMode||"system";applyThemeMode(current==="system"?"light":current==="light"?"dark":"system")}function closeHelpPopover(){var pop=q("#helpPopover");if(pop)pop.classList.remove("open");qa(".info-button").forEach(function(btn){btn.classList.remove("active")})}function closeConfirmDialog(){var pop=q("#confirmPopover");if(pop){pop.classList.remove("open");pop.innerHTML=""}}function showConfirmDialog(options){var pop=q("#confirmPopover");if(!pop)return;var title=options.title||"確認操作",body=options.body||"",confirmText=options.confirmText||"確認";pop.innerHTML="<div class=\"confirm-dialog\" role=\"dialog\" aria-modal=\"true\" aria-label=\""+escapeHtml(title)+"\"><h3>"+escapeHtml(title)+"</h3><div class=\"confirm-body\"><p>"+escapeHtml(body)+"</p></div><div class=\"confirm-actions\"><button class=\"btn confirm-cancel\" type=\"button\">取消</button><button class=\"btn danger confirm-ok\" type=\"button\">"+escapeHtml(confirmText)+"</button></div></div>";pop.onclick=function(event){if(event.target===pop)closeConfirmDialog()};var dialog=pop.querySelector(".confirm-dialog");if(dialog)dialog.onclick=function(event){event.stopPropagation()};var cancel=pop.querySelector(".confirm-cancel"),ok=pop.querySelector(".confirm-ok");if(cancel)cancel.onclick=closeConfirmDialog;if(ok)ok.onclick=function(){closeConfirmDialog();if(options.onConfirm)options.onConfirm()};pop.classList.add("open")}function showHelpPopover(key,button){var data=helpContent[key],pop=q("#helpPopover");if(!data||!pop)return;var body=data.description?"<p class=\"help-dialog-lead\">"+escapeHtml(data.description)+"</p>"+(data.action?"<div class=\"help-dialog-action\"><span>建議動作</span><strong>"+escapeHtml(data.action)+"</strong></div>":""):(data.sections||[]).map(function(section){return "<section class=\"help-dialog-section\"><strong>"+escapeHtml(section.title)+"</strong><p>"+escapeHtml(section.body)+"</p></section>"}).join("");pop.innerHTML="<div class=\"help-dialog\" role=\"dialog\" aria-modal=\"true\" aria-label=\""+escapeHtml(data.title)+"\"><h3>"+escapeHtml(data.title)+"</h3><div class=\"help-dialog-body\">"+body+"</div></div>";pop.onclick=function(event){if(event.target===pop)closeHelpPopover()};var dialog=pop.querySelector(".help-dialog");if(dialog)dialog.onclick=function(event){event.stopPropagation()};pop.classList.add("open");qa(".info-button").forEach(function(btn){btn.classList.toggle("active",btn===button)})}
function activeAccountId(){return localStorage.getItem("mvp_active_account")||accounts[0]?.id||"main"}function closeAccountMenu(){["#accountMenu","#topAccountMenu","#platformMenu"].forEach(function(sel){var menu=q(sel);if(menu)menu.classList.remove("open")})}function setAsideMenuOpen(open){var aside=q("aside");if(aside)aside.classList.toggle("menu-open",!!open)}function closeSideMenus(){closeAccountMenu();["#moreMenu","#appearancePanel"].forEach(function(sel){var el=q(sel);if(el)el.classList.remove("open")});var more=q("#moreBtn"),appearance=q("#appearanceBtn");if(more)more.classList.remove("active");if(appearance)appearance.classList.remove("open");setAsideMenuOpen(false)}function handleGlobalEscape(event){if(event.key!=="Escape")return;var confirm=q("#confirmDialog");if(confirm&&confirm.classList.contains("open")){closeConfirmDialog();event.preventDefault();return}var help=q("#helpPopover");if(help&&help.classList.contains("open")){closeHelpPopover();event.preventDefault();return}if(activeGroupIndex!==null){activeGroupIndex=null;renderAccounts();event.preventDefault();return}var searchWrap=q("#accountSearchWrap"),searchInput=q("#accountSearch");if(searchWrap&&(searchWrap.classList.contains("open")||searchWrap.classList.contains("has-value"))){if(searchInput&&searchInput.value.trim()){searchInput.value="";searchWrap.classList.remove("has-value");renderAccounts()}else{searchWrap.classList.remove("open");searchWrap.classList.remove("has-value")}event.preventDefault();return}closeAccountMenu();closeHelpPopover();closeConfirmDialog()}function formatDateLabel(value){var parts=String(value).split("-");return parts.length===3?Number(parts[1])+"/"+Number(parts[2]):value}function customDateLabels(count){var start=q("#customStart"),end=q("#customEnd");if(!start||!end||!start.value||!end.value)return[];var s=new Date(start.value+"T00:00:00"),e=new Date(end.value+"T00:00:00");if(isNaN(s)||isNaN(e)||e<s)return[];if(count<=1)return[formatDateLabel(start.value)];var span=e.getTime()-s.getTime();return Array.from({length:count},function(_,i){var d=new Date(s.getTime()+span*(i/(count-1)));return (d.getMonth()+1)+"/"+d.getDate()})}function activeAccount(){var id=activeAccountId();return accounts.find(function(a){return a.id===id})||accounts[0]}function youtubeIcon(){return '<svg class="yt-play" viewBox="0 0 32 23" aria-hidden="true" focusable="false"><rect class="yt-play-bg" x="0" y="0" width="32" height="23" rx="6"></rect><path class="yt-play-triangle" d="M13 7.2v8.6l7-4.3z"></path></svg>'}function avatarHtml(a){if(a.avatar==="play")return youtubeIcon();return a.avatar&&a.avatar.indexOf("http")===0?'<img src="'+escapeAttr(a.avatar)+'" alt="">':escapeHtml(a.avatar||a.name.slice(0,1)||"Y")}function updateCustomDateBounds(){var account=activeAccount();var start=q("#customStart"),end=q("#customEnd"),hint=q("#customRangeHint");if(!start||!end)return;start.min=account.dataStart||"2026-01-01";start.max=account.dataEnd||"2026-06-30";end.min=account.dataStart||"2026-01-01";end.max=account.dataEnd||"2026-06-30";if(!start.value||start.value<start.min||start.value>start.max)start.value=start.min;if(!end.value||end.value<end.min||end.value>end.max)end.value=end.max;var rangeText="可選 "+formatDateLabel(start.min)+" - "+formatDateLabel(end.max);start.title=rangeText;end.title=rangeText;if(hint)hint.textContent=""}function renderAccountSwitcher(){var current=activeAccount();updateCustomDateBounds();var topAvatar=q("#topAccountAvatar"),topName=q("#topAccountName"),topBg=current.avatar==="play"?"transparent":(current.color||"#667085");if(topAvatar){topAvatar.style.background=topBg;topAvatar.innerHTML=avatarHtml(current)}if(topName)topName.textContent=current.name;var accountOptions=accounts.map(function(a){var avatarBg=a.avatar==="play"?"transparent":(a.color||"#667085");return '<button class="account-option '+(a.id===current.id?'active':'')+'" data-account-id="'+escapeAttr(a.id)+'"><div class="profile-avatar" style="background:'+escapeAttr(avatarBg)+'">'+avatarHtml(a)+'</div><div><strong>'+escapeHtml(a.name)+'</strong></div></button>'}).join("");if(q("#topAccountMenu"))q("#topAccountMenu").innerHTML=accountOptions;qa(".account-option").forEach(function(btn){btn.onclick=function(){localStorage.setItem("mvp_active_account",btn.dataset.accountId);closeAccountMenu();var topMenu=q("#topAccountMenu");if(topMenu)topMenu.classList.remove("open");renderAccountSwitcher();renderChart(localStorage.getItem("mvp_chart_range")||"7")}})}function activeChartMetric(){return localStorage.getItem("mvp_chart_metric")||"views"}function activeChartType(){return localStorage.getItem("mvp_chart_type")||"bar"}function formatAxisValue(value,metric){if(metric==="engagement")return value.toFixed(1)+"%";return Math.round(value).toLocaleString("zh-TW")}function renderYAxis(values,metric){var max=Math.max.apply(null,values),min=Math.min.apply(null,values),span=Math.max(1,max-min);var ticks=[max,min+span*.66,min+span*.33,min];q("#chartYAxis").innerHTML=ticks.map(function(v){return "<span>"+formatAxisValue(v,metric)+"</span>"}).join("")}function runSync(){var account=activeAccount(),items=accountHealth[account.id]||accountHealth.main,sync=items.find(function(item){return item.key==="sync"});if(sync){sync.state="ok";sync.icon="↻";sync.title="同步中";sync.text="正在更新資料";renderHealth()}setTimeout(function(){var account=activeAccount(),items=accountHealth[account.id]||accountHealth.main,sync=items.find(function(item){return item.key==="sync"});if(sync){sync.state="ok";sync.icon="✓";sync.title="資料已同步";sync.text="剛剛";renderHealth()}toast("同步完成")},700)}function renderHealth(){var items=(accountHealth[activeAccount().id]||accountHealth.main).filter(function(item){return item.state!=="ok"});q("#healthStrip").classList.toggle("is-hidden",items.length===0);q("#healthStrip").innerHTML=items.map(function(item){var tag=item.action?"button":"div";return '<div class="health-item '+(item.state==="warn"?"warn":"")+'"><'+tag+' class="health-icon '+(item.action?"action":"")+'" '+(item.action?'data-health-action="sync" title="同步資料" aria-label="同步資料"':"")+'>'+escapeHtml(item.icon)+'</'+tag+'><div><strong>'+escapeHtml(item.title)+'</strong><span>'+escapeHtml(item.text)+'</span></div></div>'}).join("");qa("[data-health-action=sync]").forEach(function(btn){btn.onclick=runSync})}function renderLine(values){var max=Math.max.apply(null,values),min=Math.min.apply(null,values),span=Math.max(1,max-min);var points=values.map(function(v,i){var x=values.length===1?50:6+i*(88/(values.length-1));var y=88-((v-min)/span)*76;return {x:x,y:y}});var d=points.map(function(p,i){return (i?"L":"M")+p.x.toFixed(2)+" "+p.y.toFixed(2)}).join(" ");q("#chartLine").innerHTML='<path d="'+d+'"></path>'+points.map(function(p,i){return '<circle data-point-index="'+i+'" cx="'+p.x.toFixed(2)+'" cy="'+p.y.toFixed(2)+'" r="1.7"></circle>'}).join("")}function showTooltip(index,x,y){var tip=q("#chartTooltip"),metric=activeChartMetric(),metricInfo=metricMeta[metric]||metricMeta.views,range=localStorage.getItem("mvp_chart_range")||"7",account=activeAccount(),data=(accountStats[account.id]&&accountStats[account.id][range])||accountStats.main[range],values=(data.series&&data.series[metric])||data.series.views;tip.innerHTML="<strong>"+escapeHtml(data.labels[index]||"")+"</strong><span>"+escapeHtml(metricInfo.title)+"："+escapeHtml(formatAxisValue(values[index],metric))+"</span>";tip.style.left=x+"px";tip.style.top=y+"px";tip.classList.add("show")}function hideTooltip(){q("#chartTooltip").classList.remove("show")}function bindChartTooltip(values){var plot=q("#chartPlot"),bars=qa("#chartBars .bar"),circles=qa("#chartLine circle");bars.forEach(function(bar,i){bar.onmouseenter=function(){showTooltip(i,bar.offsetLeft+bar.offsetWidth/2,bar.offsetTop+8)};bar.onmouseleave=hideTooltip});circles.forEach(function(circle,i){circle.onmouseenter=function(){var rect=plot.getBoundingClientRect(),box=circle.getBoundingClientRect();showTooltip(i,box.left-rect.left+box.width/2,box.top-rect.top)};circle.onmouseleave=hideTooltip})}function renderAnalytics(range){var account=activeAccount();var platform="youtube";var platformData=contentAnalytics[platform]||{};if(!platformData[account.id])createDemoContentAnalytics(account.id,accounts.findIndex(function(a){return a.id===account.id})+1);var data=(platformData[account.id]&&platformData[account.id][range])||(platformData[account.id]&&platformData[account.id]["7"])||(platformData.main&&platformData.main[range])||platformData.main["7"];if(!data)return;var content=q("#analyticsContentMetric"),contentDelta=q("#analyticsContentDelta"),views=q("#analyticsViewsMetric"),viewsDelta=q("#analyticsViewsDelta"),eng=q("#analyticsEngagementMetric"),engDelta=q("#analyticsEngagementDelta"),list=q("#contentRankList");if(content)content.textContent=data.content;if(contentDelta){contentDelta.textContent=compactDelta(data.contentDelta);contentDelta.className=deltaClass(data.contentDelta)}if(views)views.textContent=data.views;if(viewsDelta){viewsDelta.textContent=compactDelta(data.viewsDelta);viewsDelta.className=deltaClass(data.viewsDelta)}if(eng)eng.textContent=data.engagement;if(engDelta){engDelta.textContent=compactDelta(data.engagementDelta);engDelta.className=deltaClass(data.engagementDelta)}if(list)list.innerHTML=(data.items||[]).map(function(item,i){return '<article class="content-rank-card"><div class="rank-index">'+(i+1)+'</div><div class="rank-main"><strong>'+escapeHtml(item.title)+'</strong><span>'+escapeHtml(item.type)+'</span></div><div class="rank-stats"><span>'+escapeHtml(item.views)+'</span><small>觀看</small></div><div class="rank-stats"><span>'+escapeHtml(item.engagement)+'</span><small>互動</small></div></article>'}).join("");}
function renderChart(range){renderAnalytics(range);var account=activeAccount();var metric=activeChartMetric();var data=(accountStats[account.id]&&accountStats[account.id][range])||accountStats.main[range]||accountStats.main["7"];var meta=rangeMeta[range]||rangeMeta["7"];var metricInfo=metricMeta[metric]||metricMeta.views;var values=(data.series&&data.series[metric])||data.series.views;q("#viewsChart").dataset.range=range;q("#chartTitle").textContent=metricInfo.title;if(range==="custom"){updateCustomDateBounds();}q("#subscriberMetric").textContent=data.subscribers;setDelta("subscriberDelta",data.subscriberDelta);q("#viewMetric").textContent=data.views;setDelta("viewDelta",data.viewDelta);q("#engagementMetric").textContent=data.engagement;setDelta("engagementDelta",data.engagementDelta);var type=activeChartType();renderYAxis(values,metric);q("#chartBars").style.display=type==="bar"?"grid":"none";q("#chartLine").style.display=type==="line"?"block":"none";q("#chartBars").innerHTML=values.map(function(v,i){return '<div class="bar" data-point-index="'+i+'" style="height:'+v+'%"></div>'}).join("");renderLine(values);var labels=range==="custom"?customDateLabels(values.length):data.labels;q("#chartLabels").innerHTML=labels.map(function(label){return '<span>'+escapeHtml(label)+'</span>'}).join("");bindChartTooltip(values);renderHealth();q("#rangeSelect").value=range;qa("#chartTypeTabs button").forEach(function(btn){btn.classList.toggle("active",btn.dataset.chartType===type)});q("#customRange").classList.toggle("show",range==="custom");qa("[data-chart-metric]").forEach(function(card){card.classList.toggle("active",card.dataset.chartMetric===metric)});localStorage.setItem("mvp_chart_range",range)}
function accountTags(a){var tags=Array.isArray(a.tags)?a.tags.slice():[];if(a.group&&tags.indexOf(a.group)===-1)tags.push(a.group);return tags.map(function(t){return String(t||"").trim()}).filter(function(t,i,arr){return t&&arr.indexOf(t)===i})}function setAccountTags(a,tags){a.tags=tags.map(function(t){return String(t||"").trim()}).filter(function(t,i,arr){return t&&arr.indexOf(t)===i});a.group=a.tags[0]||""}function groups(){var seen={};accounts.forEach(function(a){accountTags(a).forEach(function(t){seen[t]=true})});return Object.keys(seen).sort()}function renderGroupFilter(){var current=q("#groupFilter").value||"all",gs=groups();q("#groupFilter").innerHTML='<option value="all">全部帳號</option><option value="favorites">我的最愛</option>'+gs.map(function(g){return '<option value="tag:'+escapeAttr(g)+'">'+escapeHtml(g)+'</option>'}).join("");var values=["all","favorites"].concat(gs.map(function(g){return "tag:"+g}));q("#groupFilter").value=values.indexOf(current)>-1?current:"all"}
function renderAccounts(){renderGroupFilter();var accountsSection=q("#accounts");if(accountsSection)accountsSection.classList.toggle("account-edit-mode",accountEditMode);var group=q("#groupFilter").value,term=q("#accountSearch").value.trim().toLowerCase();var editToggle=q("#accountEditToggle");if(editToggle){editToggle.classList.toggle("active",accountEditMode);editToggle.setAttribute("aria-pressed",accountEditMode?"true":"false");editToggle.title=accountEditMode?"結束編輯":"編輯帳戶"}if(!accountEditMode)activeGroupIndex=null;var rows=accounts.map(function(a,i){a._index=i;return a}).filter(function(a){var tags=accountTags(a);var gm=group==="all"||(group==="favorites"&&a.favorite)||(group.indexOf("tag:")===0&&tags.indexOf(group.slice(4))>-1);return gm&&(!term||(a.name+" "+tags.join(" ")).toLowerCase().indexOf(term)>-1)});var groupIcon='<svg class="action-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5h6.7l8.3 8.3a2 2 0 0 1 0 2.8l-2.9 2.9a2 2 0 0 1-2.8 0L5.5 11.2V4.5"></path><circle cx="8.3" cy="8.3" r="1.2"></circle></svg>';var removeIcon='<svg class="action-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6.5h15"></path><path d="M9.5 6.5V4.8h5v1.7"></path><path d="M7.2 9.2l.7 9.2a2 2 0 0 0 2 1.8h4.2a2 2 0 0 0 2-1.8l.7-9.2"></path><path d="M10.4 11.5v5"></path><path d="M13.6 11.5v5"></path></svg>';var heartIcon='<svg class="heart-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 5.7c-1.7-1.8-4.4-1.8-6.1 0L12 8.1 9.7 5.7c-1.7-1.8-4.4-1.8-6.1 0-1.8 1.9-1.8 4.9 0 6.8L12 21l8.4-8.5c1.8-1.9 1.8-4.9 0-6.8z"></path></svg>';q("#accountList").innerHTML=rows.map(function(a){var tags=accountTags(a);var badge=tags.length?(accountEditMode?'<div class="account-group-line account-tag-summary editable-tags"><svg class="account-group-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5h6.7l8.3 8.3a2 2 0 0 1 0 2.8l-2.9 2.9a2 2 0 0 1-2.8 0L5.5 11.2V4.5"></path><circle cx="8.3" cy="8.3" r="1.2"></circle></svg><span class="account-tag-list">'+tags.map(function(t,tagIndex){return '<span class="tag-pill account-tag-pill" draggable="true" data-tag-drag="'+a._index+'" data-tag-index="'+tagIndex+'" data-tag-value="'+escapeAttr(t)+'" title="拖曳排序"><span class="tag-pill-name">'+escapeHtml(t)+'</span><button class="tag-remove" type="button" data-tag-remove="'+a._index+'" data-tag-value="'+escapeAttr(t)+'" title="移除標籤 '+escapeAttr(t)+'" aria-label="移除標籤 '+escapeAttr(t)+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10"></path><path d="M17 7L7 17"></path></svg></button></span>'}).join('')+'</span></div>':'<div class="account-group-line account-tag-summary"><svg class="account-group-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5h6.7l8.3 8.3a2 2 0 0 1 0 2.8l-2.9 2.9a2 2 0 0 1-2.8 0L5.5 11.2V4.5"></path><circle cx="8.3" cy="8.3" r="1.2"></circle></svg><span class="account-tag-text">'+tags.map(escapeHtml).join(' , ')+'</span></div>'):"";var panel=accountEditMode&&activeGroupIndex===a._index?(function(){var quick=groups().filter(function(t){return tags.indexOf(t)===-1});return '<div class="group-panel"><div class="current-tags"></div><div class="group-edit-row"><input class="group-editor" data-edit-index="'+a._index+'" placeholder="新增標籤" value=""><div class="group-edit-actions"><button class="group-icon-btn group-save" data-save-index="'+a._index+'" title="新增標籤" aria-label="新增標籤"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg></button><button class="group-icon-btn group-cancel" title="取消" aria-label="取消"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10"></path><path d="M17 7L7 17"></path></svg></button></div></div>'+(quick.length?'<div class="quick-tags">'+quick.map(function(t){return '<button class="quick-tag" type="button" data-tag-add="'+a._index+'" data-tag-value="'+escapeAttr(t)+'"><span>'+escapeHtml(t)+'</span></button>'}).join("")+'</div>':'')+'</div>'})():"";var statusAction=a.status==="需重新確認"?'<button class="btn account-status-action" type="button" data-account-reconnect="'+a._index+'">重新確認</button>':a.status==="需補權限"?'<button class="btn account-status-action" type="button" data-account-permission="'+a._index+'">補齊權限</button>':"";var favoriteButton='<button class="fav-btn account-fav-left '+(a.favorite?'active':'')+'" data-fav="'+a._index+'" title="我的最愛" aria-label="我的最愛">'+heartIcon+'</button>';var outerHandle=accountEditMode?'<button class="account-drag-handle account-action" draggable="true" data-account-drag-handle="'+a._index+'" title="拖曳排序" aria-label="拖曳排序"><svg class="drag-handle-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h.01"></path><path d="M15 6h.01"></path><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M9 18h.01"></path><path d="M15 18h.01"></path></svg></button>':'';var actions=accountEditMode?'<div class="account-actions"><button class="group-btn account-action" data-open-group="'+a._index+'" title="標籤" aria-label="標籤">'+groupIcon+'</button><button class="btn danger account-remove account-action account-action-danger" data-remove-account="'+a._index+'" title="移除帳戶" aria-label="移除帳戶">'+removeIcon+'</button></div>':'<div class="account-actions"></div>';return '<div class="account-row '+(accountEditMode?'is-editing':'')+'" data-index="'+a._index+'"><div class="account-drag-cell">'+outerHandle+'</div><article class="item-card account '+(accountEditMode?'is-editing':'')+'" draggable="false" data-index="'+a._index+'"><div class="account-top"><div class="account-title">'+favoriteButton+'<div class="avatar">'+youtubeIcon()+'</div><div class="account-copy"><div class="account-name-line"><strong>'+escapeHtml(a.name)+'</strong><span class="account-status-inline">'+accountStatusIconHtml(a.status)+statusAction+'</span></div>'+badge+'</div></div>'+actions+'</div>'+panel+'</article></div>'}).join("")||'<div class="hint">目前沒有符合條件的帳號。</div>';bindAccountControls();bindAccountDrag()}
function removeAccountAt(index){if(accounts.length<=1){toast("至少保留一個帳戶");return}var account=accounts[index];if(!account)return;showConfirmDialog({title:"移除帳戶",body:"確定要移除帳戶「"+account.name+"」嗎？",confirmText:"移除",onConfirm:function(){showConfirmDialog({title:"再次確認",body:"這會從目前 demo 中移除此帳戶與相關本機資料。要繼續嗎？",confirmText:"移除",onConfirm:function(){accounts.splice(index,1);delete accountPlaylists[account.id];delete accountHealth[account.id];queue=queue.filter(function(item){var ids=item.accountIds||[item.accountId];return ids.indexOf(account.id)===-1});if(activeAccountId()===account.id)localStorage.setItem("mvp_active_account",accounts[0].id);var publishIds=selectedPublishAccountIds().filter(function(id){return id!==account.id});if(!publishIds.length)publishIds=[accounts[0].id];localStorage.setItem("mvp_publish_accounts",JSON.stringify(publishIds));localStorage.setItem("mvp_publish_account",publishIds[0]);save();renderAccounts();renderAccountSwitcher();renderPublishTargets();renderPlaylistOptions();renderQueue();renderComposer();renderChart(localStorage.getItem("mvp_chart_range")||"7");toast("已移除帳戶")}})}})}function bindAccountControls(){qa(".fav-btn").forEach(function(btn){btn.onclick=function(event){if(!accountEditMode){event.preventDefault();return}var i=Number(btn.dataset.fav);accounts[i].favorite=!accounts[i].favorite;save();renderAccounts();toast(accounts[i].favorite?"已加入我的最愛":"已從我的最愛移除")}});qa(".group-btn").forEach(function(btn){btn.onclick=function(){var i=Number(btn.dataset.openGroup);activeGroupIndex=activeGroupIndex===i?null:i;renderAccounts()}});qa(".group-save").forEach(function(btn){btn.onclick=function(){var i=Number(btn.dataset.saveIndex),input=q('.group-editor[data-edit-index="'+i+'"]'),value=input.value.trim();if(!value){input.focus();return}var tags=accountTags(accounts[i]);if(tags.indexOf(value)===-1)tags.push(value);setAccountTags(accounts[i],tags);save();renderAccounts();toast("已新增標籤："+value)}});qa(".tag-remove").forEach(function(btn){btn.onclick=function(event){event.preventDefault();event.stopPropagation();var i=Number(btn.dataset.tagRemove),value=btn.dataset.tagValue,tags=accountTags(accounts[i]).filter(function(t){return t!==value});setAccountTags(accounts[i],tags);save();renderAccounts();toast("已移除標籤："+value)}});bindTagDragControls();qa(".quick-tag").forEach(function(btn){btn.onclick=function(){var i=Number(btn.dataset.tagAdd),value=btn.dataset.tagValue,tags=accountTags(accounts[i]);if(tags.indexOf(value)===-1)tags.push(value);setAccountTags(accounts[i],tags);save();renderAccounts();toast("已套用標籤："+value)}});qa(".group-cancel").forEach(function(btn){btn.onclick=function(){activeGroupIndex=null;renderAccounts()}});qa(".group-editor").forEach(function(input){input.onkeydown=function(event){if(event.key==="Enter"){event.preventDefault();var i=Number(input.dataset.editIndex),value=input.value.trim();if(!value)return;var tags=accountTags(accounts[i]);if(tags.indexOf(value)===-1)tags.push(value);setAccountTags(accounts[i],tags);save();renderAccounts();toast("已新增標籤："+value)}if(event.key==="Escape"){activeGroupIndex=null;renderAccounts()}}});qa(".account-remove").forEach(function(btn){btn.onclick=function(){removeAccountAt(Number(btn.dataset.removeAccount))}});qa("[data-status-help]").forEach(function(btn){btn.onclick=function(event){event.preventDefault();event.stopPropagation();var status=btn.dataset.statusHelp,key=status==="需重新確認"?"accountReconnect":status==="需補權限"?"accountPermission":"accountConnected";showHelpPopover(key,btn)}});qa("[data-account-reconnect]").forEach(function(btn){btn.onclick=function(){toast("之後會開啟重新確認流程")}});qa("[data-account-permission]").forEach(function(btn){btn.onclick=function(){toast("之後會開啟補齊權限流程")}})}
var tagDragState=null,accountDragState=null;function bindTagDragControls(){qa(".tag-pill").forEach(function(pill){pill.ondragstart=function(event){event.stopPropagation();accountDragState=null;tagDragState={accountIndex:Number(pill.dataset.tagDrag),tagIndex:Number(pill.dataset.tagIndex)};pill.classList.add("dragging")};pill.ondragend=function(){pill.classList.remove("dragging");tagDragState=null};pill.ondragover=function(event){event.preventDefault();event.stopPropagation()};pill.ondrop=function(event){event.preventDefault();event.stopPropagation();if(!tagDragState)return;var accountIndex=Number(pill.dataset.tagDrag),targetIndex=Number(pill.dataset.tagIndex);if(tagDragState.accountIndex!==accountIndex||tagDragState.tagIndex===targetIndex)return;var tags=accountTags(accounts[accountIndex]);var moved=tags.splice(tagDragState.tagIndex,1)[0];tags.splice(targetIndex,0,moved);setAccountTags(accounts[accountIndex],tags);save();renderAccounts();toast("標籤排序已更新")}})}function bindAccountDrag(){qa(".account-drag-handle").forEach(function(handle){handle.ondragstart=function(event){event.stopPropagation();accountDragState=Number(handle.dataset.accountDragHandle);dragIndex=accountDragState;if(event.dataTransfer){event.dataTransfer.effectAllowed="move";event.dataTransfer.setData("text/plain",String(dragIndex))}var row=handle.closest(".account-row");if(row)row.classList.add("dragging")};handle.ondragend=function(event){event.stopPropagation();qa("#accountList .account-row.dragging").forEach(function(row){row.classList.remove("dragging")});accountDragState=null;dragIndex=null}});qa("#accountList .account-row").forEach(function(row){row.ondragover=function(event){if(accountDragState===null)return;event.preventDefault();if(event.dataTransfer)event.dataTransfer.dropEffect="move"};row.ondrop=function(event){if(accountDragState===null)return;event.preventDefault();event.stopPropagation();var target=Number(row.dataset.index);if(dragIndex===null||dragIndex===target)return;var moved=accounts.splice(dragIndex,1)[0];accounts.splice(target,0,moved);save();renderAccounts();toast("排序已更新")}});qa("#accountList .account").forEach(function(card){card.ondragstart=function(event){if(!event.target.closest(".account-drag-handle")){event.preventDefault();return false}}})}
function queueStatusLabel(status){if(status==="排程發文")return "等待中";return status||"等待中"}function formatQueueTime(value){if(!value||value==="未設定")return "未設定";var parts=String(value).split("T");if(parts.length!==2)return value;var d=parts[0].split("-"),t=parts[1];return d.length===3?Number(d[1])+"/"+Number(d[2])+" "+t:t}function renderQueue(){var hasQueue=queue.length>0;q("#queuePanel").classList.toggle("is-hidden",!hasQueue);q("#queueList").innerHTML=queue.map(function(t,i){return '<div class="queue-row"><strong>'+escapeHtml(t.title)+'</strong><div class="meta"><span></span><span>'+escapeHtml(formatQueueTime(t.time))+'</span></div><div class="toolbar"><span class="badge info">'+escapeHtml(queueStatusLabel(t.status))+'</span><button class="btn danger" data-remove-task="'+i+'">移除</button></div></div>'}).join("");renderHealth();qa("[data-remove-task]").forEach(function(b){b.onclick=function(){queue.splice(Number(b.dataset.removeTask),1);save();renderQueue();toast("已移除排程")}})}
function addDemoAccount(){var next=accounts.length+1,id="demo"+Date.now();var statusCycle=["已連線","需重新確認","需補權限"];var status=statusCycle[(next-1)%statusCycle.length];var account={id:id,name:"YouTube 測試帳號 "+next,platform:"YouTube",group:"",favorite:false,status:status,expires:"2026-09-30",color:["#64748b","#475569","#334155","#52525b"][next%4],avatar:String(next),dataStart:"2026-06-01",dataEnd:"2026-06-30"};createDemoContentAnalytics(id,next);accounts.push(account);accountPlaylists[id]=["測試播放清單","Shorts 測試"];accountHealth[id]=[{key:"auth",state:status==="已連線"?"ok":"warn",icon:status==="已連線"?"✓":"!",title:status==="已連線"?"連線正常":status,text:status==="已連線"?"Demo 帳號":"需要處理"},{key:"sync",state:"ok",icon:"↻",title:"資料已同步",text:"剛剛",action:true}];save();renderAccounts();renderAccountSwitcher();renderPublishTargets();renderPlaylistOptions();toast("已新增測試帳戶："+status)}function renderPlaylistOptions(){var select=q("#playlistInput");if(!select)return;var current=select.value,account=selectedPublishAccount(),list=accountPlaylists[account.id]||[];select.innerHTML='<option value=""></option>'+list.map(function(name){return '<option>'+escapeHtml(name)+'</option>'}).join("");select.value=list.indexOf(current)>-1?current:""}function showPlaylistCreate(open){var box=q("#playlistCreate"),input=q("#playlistNameInput");if(box)box.classList.toggle("open",!!open);if(open&&input){input.value="";setTimeout(function(){input.focus()},0)}}function addPlaylistForCurrentAccount(){var input=q("#playlistNameInput"),name=input&&input.value.trim();if(!name){if(input)input.focus();return}var account=selectedPublishAccount(),list=accountPlaylists[account.id]||(accountPlaylists[account.id]=[]);if(list.indexOf(name)===-1)list.push(name);renderPlaylistOptions();q("#playlistInput").value=name;showPlaylistCreate(false);renderComposer();toast("已新增播放清單")}function deleteSelectedPlaylist(){var select=q("#playlistInput"),name=select&&select.value;if(!name){toast("請先選擇播放清單");return}showConfirmDialog({title:"刪除播放清單",body:"確定要刪除播放清單「"+name+"」嗎？",confirmText:"刪除",onConfirm:function(){showConfirmDialog({title:"再次確認",body:"刪除後將從此帳號的播放清單中移除。要繼續嗎？",confirmText:"刪除",onConfirm:function(){var account=selectedPublishAccount(),list=accountPlaylists[account.id]||[];accountPlaylists[account.id]=list.filter(function(item){return item!==name});renderPlaylistOptions();renderComposer();toast("已刪除播放清單")}})}})}
function renderPublishTargets(){var selectedIds=selectedPublishAccountIds();q("#publishTargets").innerHTML=accounts.map(function(a){var active=selectedIds.indexOf(a.id)>-1;return '<button class="target-card target-card-plain '+(active?'active':'')+'" type="button" data-publish-account="'+escapeAttr(a.id)+'" aria-pressed="'+(active?'true':'false')+'"><input class="target-check" type="checkbox" tabindex="-1" '+(active?'checked':'')+' aria-hidden="true"><strong>'+escapeHtml(a.name)+'</strong></button>'}).join("");qa("[data-publish-account]").forEach(function(btn){btn.onclick=function(){var ids=selectedPublishAccountIds(),id=btn.dataset.publishAccount;if(ids.indexOf(id)>-1){if(ids.length===1){toast("至少保留一個發布目標");return}ids=ids.filter(function(item){return item!==id})}else{ids.push(id)}localStorage.setItem("mvp_publish_accounts",JSON.stringify(ids));localStorage.setItem("mvp_publish_account",ids[0]);renderPublishTargets();renderPlaylistOptions();renderComposer()}})}function fieldValue(id,fallback){var el=q("#"+id);return el?el.value:fallback||""}function checkedValue(name,fallback){var el=q('input[name="'+name+'"]:checked');return el?el.value:fallback}function checkedState(id){var el=q("#"+id);return !!(el&&el.checked)}function audienceChoice(){var el=q('input[name="audienceChoice"]:checked');return el?el.value:""}function isMadeForKids(){return audienceChoice()==="kids"}function ageRestrictionChoice(){var el=q('input[name="ageRestrictionChoice"]:checked');return el?el.value:"false"}function visibilityLabel(value){return value==="public"?"公開":value==="unlisted"?"不公開":value==="scheduled"?"排程公開":"私人"}function syncCommentsAvailability(visibility,madeForKids){var select=q("#commentsInput"),field=q("#commentsField"),note=q("#commentsNote");if(!select)return "";var disabled=visibility==="private"||madeForKids;select.disabled=disabled;if(disabled){select.value="off"}if(field){field.classList.toggle("is-disabled",disabled);field.classList.toggle("restricted-control",disabled)}if(note)note.textContent="";var tip=q("#commentsRestrictionTip");if(tip)tip.textContent=madeForKids?"這部影片已設成「兒童專屬」，因此這題不開放選答。":visibility==="private"?"這部影片目前設為私人，因此留言功能不開放選答。":"";return select.value}function syncAudienceRestrictions(madeForKids){var ageInputs=qa('input[name="ageRestrictionChoice"]'),ageDetails=q(".age-settings"),notify=q("#notifyInput"),notifyLine=notify&&notify.closest(".check-line");if(madeForKids){ageInputs.forEach(function(input){input.checked=input.value==="false";input.disabled=false;input.setAttribute("aria-disabled","true")});if(ageDetails)ageDetails.classList.add("is-disabled");if(notify){notify.checked=false;notify.disabled=true}if(notifyLine)notifyLine.classList.add("is-disabled")}else{ageInputs.forEach(function(input){input.disabled=false;input.removeAttribute("aria-disabled")});if(ageDetails)ageDetails.classList.remove("is-disabled");if(notify)notify.disabled=false;if(notifyLine)notifyLine.classList.remove("is-disabled")}}function categoryLabel(value){var el=q("#categoryInput");if(!el)return value||"未設定";var option=[].slice.call(el.options).find(function(item){return item.value===value});return option?option.textContent:value||"未設定"}function setFieldError(id,message){var field=q('[data-field="'+id+'"]'),err=q("#"+id+"Error");if(field)field.classList.toggle("has-error",!!message);if(err)err.textContent=message||""}function validateComposer(mode){setFieldError("title","");setFieldError("media","");setFieldError("audience","");if(mode==="儲存草稿")return true;var title=q("#titleInput").value.trim();if(!title){setFieldError("title","請輸入標題。");q("#titleInput").focus();return false}if(!fileEntry("media")){setFieldError("media","請選擇影片檔案。");var media=q('[data-field="media"]');if(media)media.scrollIntoView({block:"center"});return false}if(!audienceChoice()){setFieldError("audience","請選擇觀眾設定。");var audience=q('[data-field="audience"]');if(audience)audience.scrollIntoView({block:"center"});return false}return true}
function renderComposer(){var title=q("#titleInput").value.trim(),content=q("#contentInput").value.trim(),type=q("#contentType").value,mode=q("#publishMode").value,targets=selectedPublishAccounts(),target=targets[0]||activeAccount();var visibility=fieldValue("visibilityInput","private"),playlist=fieldValue("playlistInput",""),category=fieldValue("categoryInput",""),tags=fieldValue("tagsInput","").trim(),madeForKids=isMadeForKids();syncAudienceRestrictions(madeForKids);var ageRestricted=ageRestrictionChoice()==="true",notify=checkedState("notifyInput"),paidPromo=checkedState("paidPromoInput"),aiDisclosure=checkedState("aiDisclosureInput"),embedAllowed=checkedState("embedInput"),license=fieldValue("licenseInput","youtube"),comments=syncCommentsAvailability(visibility,madeForKids),remix=fieldValue("remixInput","videoAudio");var media=q("#mediaInput"),cover=q("#coverInput"),caption=q("#captionInput");syncFileInput("mediaInput","media");syncFileInput("coverInput","cover");syncFileInput("captionInput","caption");var mediaEntry=fileEntry("media"),coverEntry=fileEntry("cover"),captionEntry=fileEntry("caption");var mediaName=mediaEntry?mediaEntry.name:"尚未選擇影片";var coverName=coverEntry?coverEntry.name:"尚未選擇封面";var captionName=captionEntry?captionEntry.name:"未上傳字幕";var mediaLabel=q("#mediaFileName"),coverLabel=q("#coverFileName"),captionLabel=q("#captionFileName");if(mediaLabel)mediaLabel.textContent=mediaName;if(coverLabel)coverLabel.textContent=coverName;if(captionLabel)captionLabel.textContent=captionEntry?captionName:"";var removeMedia=q("#removeMediaBtn"),removeCover=q("#removeCoverBtn"),removeCaption=q("#removeCaptionBtn");if(removeMedia)removeMedia.classList.toggle("is-hidden",!mediaEntry);if(removeCover)removeCover.classList.toggle("is-hidden",!coverEntry);if(removeCaption)removeCaption.classList.toggle("is-hidden",!captionEntry);var alerts=[];if(title.length>100)alerts.push({text:"標題已超過 YouTube 100 字限制。",type:"warn"});if(content.length>5000)alerts.push({text:"說明已超過 YouTube 5000 字限制。",type:"warn"});if(mode==="排程發布"&&!q("#publishTime").value)alerts.push({text:"排程發布需要設定時間。",type:"warn"});q("#rulesList").innerHTML=alerts.map(function(item){return '<div class="rule"><span>'+escapeHtml(item.text)+'</span><span class="badge '+item.type+'">'+(item.type==="warn"?"提醒":"標記")+'</span></div>'}).join("");q("#scheduleBtn").textContent=mode==="立即發布"?"立即發布":mode==="儲存草稿"?"儲存草稿":"加入佇列";q("#publishTime").closest(".field").classList.toggle("is-hidden",mode!=="排程發布");var previewHero=coverEntry?previewFileHtml("cover","封面","尚未選擇封面"):mediaEntry?previewFileHtml("media","影片","尚未選擇影片"):"";var previewMedia=previewHero?'<div class="preview-media">'+previewHero+'</div>':"";var badges='<div class="preview-badges"><span class="badge neutral">'+escapeHtml(type)+'</span><span class="badge neutral">'+escapeHtml(visibilityLabel(visibility))+'</span></div>';var settings='<div class="preview-settings"><div class="preview-setting"><span>瀏覽權限</span><span>'+escapeHtml(visibilityLabel(visibility))+'</span></div><div class="preview-setting"><span>播放清單</span><span>'+escapeHtml(playlist||"未加入")+'</span></div><div class="preview-setting"><span>目標觀眾</span><span>'+escapeHtml(audienceChoice()?madeForKids?"兒童專屬":"非兒童專屬":"未選擇")+'</span></div><div class="preview-setting"><span>年齡限制</span><span>'+(ageRestricted?"僅限成人":"未限制")+'</span></div><div class="preview-setting"><span>付費宣傳</span><span>'+(paidPromo?"是":"否")+'</span></div><div class="preview-setting"><span>AI 聲明</span><span>'+(aiDisclosure?"是":"否")+'</span></div></div>';var previewTitle=title?'<strong>'+escapeHtml(title)+'</strong>':"";var previewDescription=content?'<p>'+escapeHtml(content.split("\n").slice(0,3).join("\n"))+'</p>':"";var targetLabel=targets.length>1?targets.length+" 個發布目標":target.name;var channel='<div class="youtube-channel"><span>'+escapeHtml(targetLabel)+'</span></div>';var previewHead=previewTitle||previewDescription?'<div class="youtube-preview-head">'+previewTitle+channel+previewDescription+'</div>':channel;q("#previewList").innerHTML='<div class="composer-preview-list">'+previewMedia+'<div class="queue-row preview-summary">'+previewHead+badges+settings+'</div></div>'}

/* Dashboard-only platform switch source. */
function ensureDashboardPlatformSwitch(){
  var existing=document.querySelector('.dashboard-control-row .platform-switch');
  if(existing)return existing;
  var stray=document.querySelector('aside .platform-switch');
  if(stray&&stray.parentElement)stray.parentElement.removeChild(stray);
  var wrap=document.createElement('div');
  wrap.className='platform-switch';
  wrap.innerHTML='<button class="account-current" id="platformSwitchBtn" type="button" title="切換平台" aria-label="切換平台"><div class="profile-avatar" id="currentPlatformIcon"><svg class="yt-play" viewBox="0 0 32 23" aria-hidden="true" focusable="false"><rect class="yt-play-bg" x="0" y="0" width="32" height="23" rx="6"></rect><path class="yt-play-triangle" d="M13 7.2v8.6l7-4.3z"></path></svg></div><div><strong id="currentPlatformName">YouTube</strong><span>平台資料</span></div><span class="chevron" aria-hidden="true"></span></button><div class="account-menu" id="platformMenu"><button class="account-option active" type="button" data-platform-id="youtube"><div class="profile-avatar" style="background:transparent"><svg class="yt-play" viewBox="0 0 32 23" aria-hidden="true" focusable="false"><rect class="yt-play-bg" x="0" y="0" width="32" height="23" rx="6"></rect><path class="yt-play-triangle" d="M13 7.2v8.6l7-4.3z"></path></svg></div><div><strong>YouTube</strong><span>帳號 / 內容數據</span></div></button></div>';
  return wrap;
}
function setupDashboardControls(){var header=q("header");if(!header)return;var host=q("#insightControlHost");if(!host){host=document.createElement("div");host.id="insightControlHost";host.className="insight-control-host";header.insertAdjacentElement("afterend",host)}var row=q("#dashboardControlRow");if(!row){row=document.createElement("div");row.id="dashboardControlRow";row.className="dashboard-control-row"}if(row.parentElement!==host)host.appendChild(row);var platform=ensureDashboardPlatformSwitch(),account=q(".top-account-wrap"),report=q(".report-switch"),range=q("#rangeSelect");if(platform&&platform.parentElement!==row)row.appendChild(platform);if(account&&account.parentElement!==row)row.appendChild(account);if(report&&report.parentElement!==row)row.appendChild(report);if(range&&range.parentElement!==row)row.appendChild(range);}function boot(){setupDashboardControls();var now=new Date();now.setHours(now.getHours()+3);q("#publishTime").value=now.toISOString().slice(0,16);applyThemeMode(localStorage.getItem("mvp_theme_mode")||"system");renderAccountSwitcher();renderChart(localStorage.getItem("mvp_chart_range")||"7");renderAccounts();renderQueue();renderPublishTargets();renderPlaylistOptions();renderComposer();tab(localStorage.getItem("mvp_active_tab")||"dashboard");qa(".nav button").forEach(function(b){b.onclick=function(){tab(b.dataset.tab)}});qa("[data-open-composer]").forEach(function(b){b.onclick=function(){tab("composer")}});if(q("#reportSwitchBtn")){q("#reportSwitchBtn").onclick=function(event){event.stopPropagation();q("#reportMenu").classList.toggle("open")};qa("[data-report-tab]").forEach(function(b){b.onclick=function(event){event.stopPropagation();tab(b.dataset.reportTab)}})}if(q("#moreBtn")){q("#moreBtn").onclick=function(event){event.stopPropagation();var menu=q("#moreMenu"),more=q("#moreBtn"),panel=q("#appearancePanel"),appearance=q("#appearanceBtn");if(menu)menu.classList.toggle("open");var isOpen=!!(menu&&menu.classList.contains("open"));if(more)more.classList.toggle("active",isOpen);if(!isOpen){if(panel)panel.classList.remove("open");if(appearance)appearance.classList.remove("open")}setAsideMenuOpen(isOpen)}}if(q("#appearanceBtn")){q("#appearanceBtn").onclick=function(event){event.stopPropagation();var menu=q("#moreMenu"),panel=q("#appearancePanel"),btn=q("#appearanceBtn"),more=q("#moreBtn");if(menu)menu.classList.add("open");if(more)more.classList.add("active");if(panel)panel.classList.toggle("open");if(btn)btn.classList.toggle("open");setAsideMenuOpen(true)}}qa("[data-theme-choice]").forEach(function(btn){btn.onclick=function(event){event.stopPropagation();applyThemeMode(btn.dataset.themeChoice);closeSideMenus()}});if(window.matchMedia){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(){if((document.body.dataset.themeMode||"system")==="system")applyThemeMode("system")})}if(q("#platformSwitchBtn")){q("#platformSwitchBtn").onclick=function(event){event.stopPropagation();var menu=q("#platformMenu"),moreMenu=q("#moreMenu"),more=q("#moreBtn"),panel=q("#appearancePanel"),appearance=q("#appearanceBtn");if(moreMenu)moreMenu.classList.remove("open");if(more)more.classList.remove("active");if(panel)panel.classList.remove("open");if(appearance)appearance.classList.remove("open");if(menu)menu.classList.remove("open");setAsideMenuOpen(false);localStorage.setItem("mvp_active_platform","youtube");tab("dashboard");renderChart(localStorage.getItem("mvp_chart_range")||"7")};qa("[data-platform-id]").forEach(function(btn){btn.onclick=function(event){event.stopPropagation();localStorage.setItem("mvp_active_platform",btn.dataset.platformId);closeAccountMenu();tab("dashboard");renderChart(localStorage.getItem("mvp_chart_range")||"7")}});q(".platform-switch").onclick=function(event){event.stopPropagation()}}if(q("#topAccount")){q("#topAccount").onclick=function(event){event.stopPropagation();q("#topAccountMenu").classList.toggle("open")};q(".top-account-wrap").onclick=function(event){event.stopPropagation()}}q("aside").onclick=function(event){event.stopPropagation()};q("aside").onmouseleave=function(){var moreMenu=q("#moreMenu");if(!(moreMenu&&moreMenu.classList.contains("open")))closeSideMenus()};document.addEventListener("click",function(){closeSideMenus();closeHelpPopover();var menu=q("#reportMenu");if(menu)menu.classList.remove("open")});document.addEventListener("keydown",handleGlobalEscape);q("#rangeSelect").onchange=function(){renderChart(q("#rangeSelect").value)};qa("#chartTypeTabs button").forEach(function(btn){btn.onclick=function(){localStorage.setItem("mvp_chart_type",btn.dataset.chartType);renderChart(localStorage.getItem("mvp_chart_range")||"7")}});q("#applyCustomRange").onclick=function(){var s=q("#customStart"),e=q("#customEnd");if(s.value>e.value){toast("開始日期不能晚於結束日期");return}renderChart("custom");toast("已套用自訂時間範圍")};qa("[data-chart-metric]").forEach(function(card){card.onclick=function(){localStorage.setItem("mvp_chart_metric",card.dataset.chartMetric);renderChart(localStorage.getItem("mvp_chart_range")||"7")}});q("#groupFilter").onchange=renderAccounts;q("#accountSearch").oninput=function(){var wrap=q("#accountSearchWrap");if(wrap)wrap.classList.toggle("has-value",!!q("#accountSearch").value.trim());renderAccounts()};if(q("#accountSearchToggle")){q("#accountSearchToggle").onclick=function(){var wrap=q("#accountSearchWrap"),input=q("#accountSearch");if(wrap)wrap.classList.toggle("open");if(wrap&&wrap.classList.contains("open")&&input)setTimeout(function(){input.focus()},0)}}if(q("#accountEditToggle"))q("#accountEditToggle").onclick=function(){accountEditMode=!accountEditMode;if(!accountEditMode)activeGroupIndex=null;renderAccounts();toast(accountEditMode?"已進入編輯帳戶":"已結束編輯")};if(q("#addDemoAccountBtn"))q("#addDemoAccountBtn").onclick=addDemoAccount;if(q("#addPlaylistBtn"))q("#addPlaylistBtn").onclick=function(){showPlaylistCreate(true)};if(q("#deletePlaylistBtn"))q("#deletePlaylistBtn").onclick=deleteSelectedPlaylist;if(q("#savePlaylistBtn"))q("#savePlaylistBtn").onclick=addPlaylistForCurrentAccount;if(q("#cancelPlaylistBtn"))q("#cancelPlaylistBtn").onclick=function(){showPlaylistCreate(false)};if(q("#playlistNameInput"))q("#playlistNameInput").onkeydown=function(event){if(event.key==="Enter")addPlaylistForCurrentAccount();if(event.key==="Escape")showPlaylistCreate(false)};qa("[data-help]").forEach(function(btn){btn.onclick=function(event){event.preventDefault();event.stopPropagation();showHelpPopover(btn.dataset.help,btn)}});qa('input[name="audienceChoice"]').forEach(function(el){el.onchange=function(){if(audienceChoice())setFieldError("audience","");renderComposer()}});qa('input[name="ageRestrictionChoice"]').forEach(function(el){el.onclick=function(event){if(isMadeForKids()){event.preventDefault();qa('input[name="ageRestrictionChoice"]').forEach(function(input){input.checked=input.value==="false"});renderComposer();return false}};el.onchange=renderComposer});["contentInput","titleInput","contentType","publishMode","visibilityInput","playlistInput","categoryInput","tagsInput","mediaInput","coverInput","captionInput","publishTime","licenseInput","embedInput","notifyInput","commentsInput","remixInput","paidPromoInput","aiDisclosureInput"].forEach(function(id){var el=q("#"+id);if(el){el.oninput=function(){if(id==="titleInput"&&el.value.trim())setFieldError("title","");renderComposer()};el.onchange=renderComposer}});q("#scheduleBtn").onclick=function(){var mode=q("#publishMode").value;if(!validateComposer(mode))return;var button=q("#scheduleBtn"),originalText=button.textContent;if(mode==="排程發布"){var targets=selectedPublishAccounts();queue.unshift({title:q("#titleInput").value.trim(),platform:"YouTube",accountId:targets[0].id,accountIds:targets.map(function(a){return a.id}),accountName:targets.map(function(a){return a.name}).join("、"),time:q("#publishTime").value||"未設定",status:"排程發布",visibility:fieldValue("visibilityInput","private"),playlist:fieldValue("playlistInput",""),madeForKids:isMadeForKids()});save();renderQueue();toast("已加入發文佇列");return}if(mode==="立即發布"){button.disabled=true;button.textContent="準備發布...";toast("準備發布...");setTimeout(function(){button.disabled=false;renderComposer();toast("目前為預覽模式，尚未送出到 YouTube")},900);return}localStorage.setItem("mvp_youtube_draft",JSON.stringify({title:q("#titleInput").value.trim(),content:q("#contentInput").value,type:q("#contentType").value,accountIds:selectedPublishAccounts().map(function(a){return a.id}),visibility:fieldValue("visibilityInput","private"),playlist:fieldValue("playlistInput",""),madeForKids:isMadeForKids(),category:fieldValue("categoryInput",""),tags:fieldValue("tagsInput","")}));button.textContent="已儲存草稿";toast("已儲存草稿");setTimeout(renderComposer,900)};if(q("#removeMediaBtn"))q("#removeMediaBtn").onclick=function(){clearFileInput("mediaInput","media");setFieldError("media","")};if(q("#removeCoverBtn"))q("#removeCoverBtn").onclick=function(){clearFileInput("coverInput","cover")};if(q("#removeCaptionBtn"))q("#removeCaptionBtn").onclick=function(){clearFileInput("captionInput","caption")};}
boot();
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

/* 2026-07-05 clean final override.
   This block intentionally runs last and replaces listeners installed by older
   compatibility patches above. */
(function socialOpsCleanFinalOverride(){
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


