export {};
const root=document.querySelector<HTMLElement>('.market-opportunity')!;
const tabs=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-opportunity-tab]'));
function selectTab(index:number){
 tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;root.querySelector<HTMLElement>(`#opportunity-panel-${i}`)!.hidden=i!==index;});
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
  event.preventDefault();selectTab(next);tabs[next]?.focus();
 });
});
const keywordSearch=root.querySelector<HTMLInputElement>('[data-opportunity-keyword-search]')!;
const reportedOnly=root.querySelector<HTMLInputElement>('[data-opportunity-reported-only]')!;
function filterKeywords(){
 let count=0;const query=keywordSearch.value.trim().toLowerCase();
 root.querySelectorAll<HTMLElement>('[data-opportunity-keyword]').forEach(row=>{row.hidden=!row.dataset.opportunityKeyword!.includes(query)||(reportedOnly.checked&&row.dataset.hasEstimate!=='true');if(!row.hidden)count++;});
 root.querySelector('[data-opportunity-keyword-count]')!.textContent=`${count} ${count===1?'keyword':'keywords'}`;
 root.querySelector<HTMLElement>('[data-opportunity-no-keywords]')!.hidden=count>0;
}
keywordSearch.addEventListener('input',filterKeywords);reportedOnly.addEventListener('change',filterKeywords);
const topicSearch=root.querySelector<HTMLInputElement>('[data-opportunity-topic-search]')!;
const priority=root.querySelector<HTMLElement & { value: string }>('[data-opportunity-priority]')!;
function filterTopics(){
 let count=0;const query=topicSearch.value.trim().toLowerCase();
 root.querySelectorAll<HTMLElement>('[data-opportunity-topic]').forEach(topic=>{topic.hidden=!topic.dataset.opportunityTopic!.includes(query)||(priority.value!=='all'&&priority.value!==topic.dataset.opportunityTopicPriority);if(!topic.hidden)count++;});
 root.querySelector('[data-opportunity-topic-count]')!.textContent=`${count} ${count===1?'question':'questions'}`;
 root.querySelector<HTMLElement>('[data-opportunity-no-topics]')!.hidden=count>0;
}
topicSearch.addEventListener('input',filterTopics);priority.addEventListener('change',filterTopics);
