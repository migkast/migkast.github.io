import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import type { AnalyticsOverview, AnalyticsRow, AnalyticsSource } from './wheeler-analytics-types';
Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);
const root = document.querySelector<HTMLElement>('[data-analytics-root]')!;
const workspace = document.querySelector<HTMLElement>('#workspace-content')!;
const section = document.querySelector<HTMLElement>('#workspace-section-analytics')!;
const api = (workspace.dataset.reviewApi || '').replace(/\/$/,'');
const field = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
const refresh = field<HTMLButtonElement>('[data-analytics-refresh]');
const days = field<HTMLElement & {value: string}>('[data-analytics-days]');
const message = field<HTMLElement>('[data-analytics-message]');
const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-analytics-source]'));
let current: AnalyticsOverview | null = null, source: AnalyticsSource = 'ga4', loading = false, lastLoaded = 0;
let chart: Chart<'line'> | undefined;
function refreshState(state: 'idle'|'loading'|'success'|'error') {
 refresh.dataset.state=state;refresh.setAttribute('aria-busy',String(state==='loading'));
 field<HTMLElement>('[data-analytics-refresh-label]').textContent=state==='loading'?'Refreshing…':'Refresh data';
}
const dateLabel = (value: string) => new Date(`${value}T12:00:00Z`).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const number = (value?: number) => value === undefined ? '—' : new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(value);
function tell(text: string, error = false) { message.textContent = text; message.dataset.error = String(error); }
function token() { try { return sessionStorage.getItem(`wheeler-workspace-session-v2:${api}`) || ''; } catch { return ''; } }
async function request(path = '', body?: unknown) {
 const response = await fetch(`${api}/analytics${path}`, { method: body === undefined ? 'GET' : 'POST', headers: {Authorization:`Bearer ${token()}`, ...(body === undefined ? {} : {'Content-Type':'application/json'})}, ...(body === undefined ? {} : {body:JSON.stringify(body)}), cache:'no-store', signal:AbortSignal.timeout(65000) });
 const result = await response.json();
 if(!response.ok) throw new Error(response.status === 401 ? 'Your session expired. Lock and reopen the workspace to reconnect.' : result.message || 'Could not load analytics. Please retry.');
 return result;
}
const values = (row: AnalyticsRow, traffic: boolean) => traffic ? [number(row.users),number(row.views)] : [number(row.clicks),number(row.impressions),row.ctr === undefined ? '—' : `${(row.ctr*100).toFixed(1)}%`,row.position ? row.position.toFixed(1) : '—'];
function table(prefix: 'daily'|'pages'|'queries'|'acquisition', rows: AnalyticsRow[], traffic: boolean) {
 const head = field<HTMLElement>(`[data-analytics-${prefix}-head]`), body = field<HTMLElement>(`[data-analytics-${prefix}-body]`);
 head.replaceChildren(); body.replaceChildren();
 const headings = prefix === 'acquisition' ? ['Source / medium','Users','Sessions'] : [prefix === 'daily' ? 'Date' : prefix === 'pages' ? 'Page' : 'Query', ...(traffic ? ['Users','Page views'] : source === 'bing' ? ['Clicks','Impressions','CTR'] : ['Clicks','Impressions','CTR','Avg. position'])];
 for(const label of headings) { const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th); }
 for(const row of rows) { const tr=document.createElement('tr');const cells=prefix==='acquisition'?[number(row.users),number(row.sessions)]:values(row,traffic);if(source === 'bing')cells.pop();for(const [index,text] of [row.name,...cells].entries()){const td=document.createElement('td');td.textContent=text;
  if(prefix==='acquisition' && index===0 && ['(direct) / (none)','(not set)'].includes(row.name)){
   td.textContent=row.name==='(not set)'?'Source unavailable':'Direct to website';td.title=`GA4: ${row.name}`;
   const note=document.createElement('small');note.className='analytics-source-detail';note.textContent=row.name==='(not set)'?'GA4 did not record the session source.':'No referring source identified by GA4.';td.append(note);
  }
  tr.append(td);}body.append(tr); }
 if(!rows.length) {const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=headings.length;td.textContent='No rows returned for this period.';tr.append(td);body.append(tr);}
}
function paintReport() {
 chart?.destroy(); chart=undefined;
 const traffic=source==='ga4', result=current?.sources[source], report=result?.report;
 field<HTMLElement>('#analytics-report').setAttribute('aria-labelledby',`analytics-tab-${source}`);
 field<HTMLElement>('[data-analytics-report-title]').textContent=traffic?'Website traffic':source==='gsc'?'Google search performance':'Bing search performance';
 field<HTMLElement>('[data-analytics-report-description]').textContent=traffic?'Users and page views reported by GA4.':'Search clicks and impressions reported by the search provider.';
 field<HTMLElement>('[data-analytics-data]').hidden=!report;
 const empty=field<HTMLElement>('[data-analytics-empty]');empty.hidden=!!report;
 if(!report) {empty.textContent=result?.error || (result?.connected?'No report has been loaded yet. Try Refresh data.':`Connect ${traffic?'Google Analytics':source==='gsc'?'Google Search Console':'Bing Webmaster Tools'} to see this report.`);return;}
 const dates=report.daily.map(row=>row.name);
 const primaryColor='#7791c9', secondaryColor='#c983a0';
 const primaryText='#526791', secondaryText='#91576d';
 const datasets = [{label:traffic?'Users':'Impressions',data:report.daily.map(row=>row[traffic?'users':'impressions'] ?? 0),borderColor:primaryColor,backgroundColor:primaryColor,yAxisID:'y'},
  ...(!traffic?[{label:'Clicks',data:report.daily.map(row=>row.clicks ?? 0),borderColor:secondaryColor,backgroundColor:secondaryColor,yAxisID:'clicks'}]:[])];
 chart=new Chart(field<HTMLCanvasElement>('[data-analytics-chart]'),{
  type:'line',data:{labels:dates,datasets},
  options:{responsive:true,maintainAspectRatio:false,animation:false,
   layout:{padding:{top:4,right:4}},interaction:{mode:'index',intersect:false},
   elements:{line:{borderWidth:2.5,cubicInterpolationMode:'monotone',borderCapStyle:'round',borderJoinStyle:'round'},point:{radius:0,hoverRadius:4,hoverBorderWidth:2,hoverBorderColor:'#fff',hitRadius:16}},
   plugins:{
    legend:{position:'top',align:'start',labels:{color:'#26352e',usePointStyle:true,pointStyle:'rectRounded',boxWidth:9,boxHeight:9,padding:20,font:{size:12}}},
    tooltip:{backgroundColor:'#243044',titleColor:'#fff',bodyColor:'#fff',padding:12,cornerRadius:8,displayColors:true,boxWidth:8,boxHeight:8,bodySpacing:8,callbacks:{label:context=>`${context.dataset.label}: ${number(context.parsed.y ?? undefined)}`}}
   },
   scales:{
    y:{beginAtZero:true,grace:'8%',title:{display:true,text:traffic?'Users':'Impressions',color:primaryText,font:{size:11}},border:{display:false},grid:{color:'#e6ebe8'},ticks:{color:primaryText,precision:0,maxTicksLimit:5,padding:8}},
    ...(!traffic?{clicks:{position:'right' as const,beginAtZero:true,grace:'8%',title:{display:true,text:'Clicks',color:secondaryText,font:{size:11}},border:{display:false},grid:{drawOnChartArea:false},ticks:{color:secondaryText,precision:0,maxTicksLimit:5,padding:8}}}:{}),
    x:{border:{display:false},grid:{display:false},ticks:{color:'#58645e',maxTicksLimit:7,maxRotation:0,padding:10,callback:(_value,index)=>new Date(`${dates[index]}T12:00:00Z`).toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:'UTC'})}}
   }
  }
 });
 field<HTMLElement>('[data-analytics-report-note]').textContent=report.note || (traffic?'Users are counted separately per day and page; adding those rows will not give the deduplicated total above.':'Final Google search data. Top page and query rows are limited and may not add up to site totals.');
 table('daily',report.daily,traffic);
 field<HTMLElement>('[data-analytics-acquisition-wrap]').hidden=!traffic;
 if(traffic){table('acquisition',report.acquisition || [],true);if(!report.acquisition)field<HTMLElement>('[data-analytics-acquisition-body] td').textContent='Refresh data to load the traffic-source breakdown.';}
 field<HTMLElement>('[data-analytics-pages-wrap]').hidden=source==='bing';
 field<HTMLElement>('[data-analytics-queries-wrap]').hidden=source!=='gsc';
 if(source!=='bing'){table('pages',report.pages,traffic);field<HTMLElement>('[data-analytics-pages-note]').textContent=traffic?'Top 100 page paths by users. A visitor can appear on more than one page.':'Top 100 reported pages by clicks.';}
 if(source==='gsc')table('queries',report.queries,false);
}
function paint(data: AnalyticsOverview) {
 current=data;
 for(const id of ['ga4','gsc','bing'] as AnalyticsSource[]) {
  const result=data.sources[id],card=field<HTMLElement>(`[data-analytics-card=${id}]`),traffic=id==='ga4';
  card.querySelector('[data-source-status]')!.textContent=result.error?'Needs attention':result.connected?'Connected':'Not connected';
  card.querySelector('[data-source-total]')!.textContent=number(result.report?.totals[traffic?'users':'clicks']);
  card.querySelector('[data-source-secondary]')!.textContent=number(result.report?.totals[traffic?'views':'impressions']);
  const stamp=card.querySelector<HTMLElement>('[data-source-date]')!;stamp.replaceChildren();
  if(result.report){
   const coverage=document.createElement('span');coverage.textContent=result.report.dataThrough?`Data through ${dateLabel(result.report.dataThrough)}`:'No data returned for this period';
   const updated=document.createElement('span'),at=new Date(result.report.fetchedAt);updated.textContent=`Updated ${at.toLocaleDateString('en-GB',{day:'numeric',month:'short'})} at ${at.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}`;updated.title=at.toLocaleString('en-GB',{timeZoneName:'short'});stamp.append(coverage,updated);
  }else stamp.textContent='No report available yet';
  const error=card.querySelector<HTMLElement>('[data-source-error]')!;error.hidden=!result.error;error.textContent=result.error || '';
 }
 const anyReport=Object.values(data.sources).find(result=>result.report)?.report;
 field<HTMLElement>('[data-analytics-window]').textContent=anyReport?`Showing ${new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).formatRange(new Date(`${anyReport.startDate}T12:00:00Z`),new Date(`${anyReport.endDate}T12:00:00Z`))}`:'Same reporting window across all three sources.';
 paintReport();
}
async function load(force=false) {
 if(loading)return;
 const previousStamps=JSON.stringify(Object.values(current?.sources || {}).map(result=>result.report?.fetchedAt || null));
 loading=true;refresh.disabled=true;days.setAttribute('disabled','');refreshState('loading');tell(force?'Checking Google Analytics and search reports…':'Loading analytics…');
 try {
  const data=await request(`?days=${days.value}`,force?{}:undefined) as AnalyticsOverview;
  paint(data);lastLoaded=Date.now();
  const connected=Object.values(data.sources).some(result=>result.connected),failed=Object.values(data.sources).some(result=>result.error);
  const unchanged=previousStamps===JSON.stringify(Object.values(data.sources).map(result=>result.report?.fetchedAt || null));
  if(failed){refreshState('error');tell('Some sources could not refresh. Any earlier figures remain visible with their original timestamps.',true);}
  else if(!connected){refreshState('idle');tell('Reporting sources have not been configured yet.');}
  else if(force){refreshState('success');tell(unchanged?'Checked less than a minute ago. No refresh needed.':`Last checked at ${new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}.`);}
  else{refreshState('idle');tell('');}
 }
 catch(error){refreshState('error');tell(error instanceof Error?error.message:'Unable to load analytics.',true);}
 finally{
  loading=false;refresh.disabled=false;days.removeAttribute('disabled');
 }
}

function visible(){return !section.hidden&&!workspace.hidden;}
function onView(){if(visible()&&(!lastLoaded||Date.now()-lastLoaded>=3600000))void load();}
new MutationObserver(onView).observe(section,{attributes:true,attributeFilter:['hidden']});
new MutationObserver(onView).observe(workspace,{attributes:true,attributeFilter:['hidden']});
window.addEventListener('focus',onView);onView();
refresh.addEventListener('click',()=>void load(true));days.addEventListener('change',()=>void load());
tabs.forEach((tab,index)=>{
 const select=()=>{source=tab.dataset.analyticsSource as AnalyticsSource;tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;});paintReport();};
 tab.addEventListener('click',select);
 tab.addEventListener('keydown',event=>{const next=event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:null;if(next!==null){event.preventDefault();tabs[next]!.click();tabs[next]!.focus();}});
});
const callback=new URL(location.href).searchParams.get('analytics');
if(callback){tell(callback==='connected'?'Google connected. Open Analytics to load your reports.':'Google connection was cancelled.');const clean=new URL(location.href);clean.searchParams.delete('analytics');history.replaceState(null,'',clean);}

// Local setup stays outside the client-facing dashboard and production build.
if(import.meta.env.DEV && new URL(location.href).searchParams.get('connect')==='bing'){
 const dialog=root.querySelector<HTMLDialogElement>('[data-bing-setup]');
 if(dialog){
  const form=dialog.querySelector<HTMLFormElement>('form')!,status=dialog.querySelector<HTMLElement>('[data-bing-setup-status]')!,input=form.elements.namedItem('apiKey') as HTMLInputElement,submit=form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const clean=new URL(location.href);clean.searchParams.delete('connect');history.replaceState(null,'',clean);
  dialog.querySelector<HTMLButtonElement>('[data-bing-setup-close]')!.addEventListener('click',()=>{form.reset();dialog.close();});
  dialog.addEventListener('cancel',()=>form.reset());
  form.addEventListener('submit',async event=>{
   event.preventDefault();if(submit.disabled)return;
   submit.disabled=true;input.readOnly=true;submit.textContent='Connecting…';status.textContent='Verifying access to Wheeler’s Bing reports…';
   try{
    await request('/bing/connect',{apiKey:input.value.trim()});form.reset();status.textContent='Bing connected. Loading the reports…';
    await load(true);dialog.close();tell('Bing Webmaster Tools connected.');
   }catch(error){status.textContent=error instanceof Error?error.message:'Could not connect. Please check the key and try again.';}
   finally{submit.disabled=false;input.readOnly=false;submit.textContent='Connect Bing';}
  });
  dialog.showModal();
 }
}
