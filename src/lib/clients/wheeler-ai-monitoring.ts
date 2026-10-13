import { engines, type Engine } from './wheeler-visibility';
// Answer HTML is rendered and sanitized at build time; other model text uses textContent.
type Answer = {answer:string;renderedAnswer:string;appears:boolean;rank:number|null;model:string;identity:{verdict:string;reason:string};citations:{url:string;title:string;domain:string}[]};
type Prompt = {prompt:string;recordedAt:string;results:Record<Engine,Answer>};
const root=document.querySelector<HTMLElement>('.ai-monitoring')!;
const prompts=JSON.parse(root.querySelector('#ai-monitoring-data')!.textContent!) as Prompt[];
const rows=Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-ai-prompt]'));
const search=root.querySelector<HTMLInputElement>('#ai-prompt-search')!;
const category=root.querySelector<HTMLSelectElement>('#ai-prompt-category')!;
function closeAnswers(){
 root.querySelectorAll<HTMLElement>('[data-ai-answer-row]').forEach(row=>row.hidden=true);
 root.querySelectorAll<HTMLElement>('[data-ai-open]').forEach(button=>button.setAttribute('aria-expanded','false'));
}
function filter(){
 closeAnswers();let count=0;
 for(const row of rows){const prompt=prompts[Number(row.dataset.aiPrompt)];row.hidden=!(category.value==='all'||category.value===row.dataset.aiCategory)||!prompt.prompt.toLowerCase().includes(search.value.trim().toLowerCase());if(!row.hidden)count++;}
 root.querySelectorAll<HTMLElement>('[data-ai-group]').forEach(group=>group.hidden=!rows.some(row=>!row.hidden&&row.dataset.aiCategory===group.dataset.aiGroup));
 root.querySelector('#ai-prompt-count')!.textContent=`${count} ${count===1?'prompt':'prompts'}`;
 root.querySelector<HTMLElement>('#ai-empty-results')!.hidden=count!==0;
}
search.addEventListener('input',filter);category.addEventListener('change',filter);
root.querySelectorAll<HTMLButtonElement>('[data-ai-open]').forEach(button=>button.addEventListener('click',()=>{
 const wasOpen=button.getAttribute('aria-expanded')==='true';closeAnswers();if(wasOpen)return;
 const index=Number(button.dataset.aiOpen),provider=button.dataset.aiEngine as Engine,prompt=prompts[index],answer=prompt.results[provider];
 const row=root.querySelector<HTMLElement>(`[data-ai-answer-row="${index}"]`)!;row.hidden=false;button.setAttribute('aria-expanded','true');
 const name=engines.find(engine=>engine.id===provider)!.label;
 row.querySelector('[data-ai-answer-title]')!.textContent=`${name} answer`;
 const date=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Lisbon',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(prompt.recordedAt));
 row.querySelector('[data-ai-answer-meta]')!.textContent=`Recorded ${date} · Model: ${answer.model} · ${answer.rank===null?'No comparison rank recorded':`Recorded rank: ${answer.rank}`}`;
 row.querySelector('[data-ai-identity-label]')!.textContent=answer.appears?'Mentioned':'Not mentioned';
 row.querySelector('[data-ai-identity-reason]')!.textContent=answer.identity.reason;
 row.querySelector('[data-ai-answer-text]')!.innerHTML=answer.renderedAnswer;
 const sources=row.querySelector('[data-ai-answer-sources]')!;sources.replaceChildren();
 for(const citation of answer.citations){if(!/^https?:\/\//i.test(citation.url))continue;const li=document.createElement('li'),a=document.createElement('a');a.href=citation.url;a.textContent=citation.title;a.target='_blank';a.rel='noopener noreferrer';li.append(a);sources.append(li);}
 row.querySelector<HTMLElement>('[data-ai-no-sources]')!.hidden=sources.children.length>0;
}));
root.querySelectorAll<HTMLButtonElement>('[data-ai-close]').forEach(button=>button.addEventListener('click',()=>{
 const expanded=root.querySelector<HTMLButtonElement>('[data-ai-open][aria-expanded="true"]');closeAnswers();expanded?.focus({preventScroll:true});
}));
root.addEventListener('keydown',event=>{if(event.key==='Escape'){const expanded=root.querySelector<HTMLButtonElement>('[data-ai-open][aria-expanded="true"]');closeAnswers();expanded?.focus({preventScroll:true});}});

const tabs=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-ai-tab]'));
function selectTab(index:number){
 closeAnswers();
 tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
 root.querySelectorAll<HTMLElement>('[data-ai-view]').forEach(panel=>panel.hidden=Number(panel.dataset.aiView)!==index);
}
tabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>selectTab(index));
 tab.addEventListener('keydown',event=>{
  let next=index;
  if(event.key==='ArrowRight')next=(index+1)%tabs.length;
  else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=tabs.length-1;
  else return;
  event.preventDefault();selectTab(next);tabs[next].focus();
 });
});
root.querySelectorAll<HTMLButtonElement>('[data-ai-trend]').forEach(button=>button.addEventListener('click',()=>{
 root.querySelectorAll<HTMLElement>('[data-ai-trend-panel]').forEach(panel=>panel.hidden=panel.dataset.aiTrendPanel!==button.dataset.aiTrend);
 root.querySelectorAll<HTMLButtonElement>('[data-ai-trend]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
const brandRows=Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-ai-brand]'));
root.querySelectorAll<HTMLButtonElement>('[data-ai-competitor-engine]').forEach(button=>button.addEventListener('click',()=>{
 const engineIndex=engines.findIndex(engine=>engine.id===button.dataset.aiCompetitorEngine);
 const total=engineIndex<0?prompts.length*engines.length:prompts.length;
 const count=(row:HTMLTableRowElement)=>{const counts=JSON.parse(row.dataset.aiBrandCounts!) as number[];return engineIndex<0?counts.reduce((a,b)=>a+b,0):counts[engineIndex];};
 const sorted=[...brandRows].sort((a,b)=>count(b)-count(a));
 sorted.forEach(row=>{
  row.querySelector('[data-ai-brand-rank]')!.textContent=String(sorted.findIndex(item=>count(item)===count(row))+1);
  row.querySelector('[data-ai-brand-mentions]')!.textContent=String(count(row));
  row.querySelector('[data-ai-brand-visibility]')!.textContent=`${Math.round(count(row)/total*1000)/10}%`;
  row.parentElement!.append(row);
 });
 root.querySelectorAll<HTMLButtonElement>('[data-ai-competitor-engine]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
