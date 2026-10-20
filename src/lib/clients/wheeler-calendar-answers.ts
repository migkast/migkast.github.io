import { AnswerDrafts } from './wheeler-answer-drafts';
import type { ReviewChange, SharedReviewState } from './wheeler-review';
import type { SyncStatus } from './wheeler-review-sync';

export function initCalendarAnswers(api: string, queue: (change: ReviewChange)=>void, pending: (key:string)=>boolean, retry:()=>void) {
 const editors=Array.from(document.querySelectorAll<HTMLDetailsElement>('[data-question-answer]'));
 const keys=[...new Set(editors.map(editor=>editor.dataset.questionAnswer!))];
 let storage: Storage | null=null;
 try { storage=localStorage; } catch { /* Show an explicit warning if browser draft storage is blocked. */ }
 const drafts=new AnswerDrafts(storage,`wheeler-question-draft:${api}:`);
 const timers=new Map<string,ReturnType<typeof setTimeout>>();
 const durable=new Map<string,boolean>();
 let answers: NonNullable<SharedReviewState['answers']>={};
 let syncStatus: SyncStatus='loading';
 const matches=(key:string)=>editors.filter(editor=>editor.dataset.questionAnswer===key);
 function paint(key:string) {
  const draft=drafts.get(key),saved=answers[key];
  let message=saved?.text?'Saved to shared dashboard':'Not answered';
  if(draft!==null || pending(key)) {
   message=durable.get(key)===false?'Not saved yet · keep this page open':syncStatus==='offline' || syncStatus==='locked' || syncStatus==='unconfigured'?'Saved on this browser · waiting to sync':pending(key)?'Saving to shared dashboard…':'Saved on this browser · saving shortly…';
  }
  matches(key).forEach(editor=>{
   editor.querySelector('[data-answer-status]')!.textContent=message;
   editor.querySelector('[data-answer-toggle]')!.textContent=(draft ?? saved?.text)?'Edit answer':'Add answer';
   const value=draft ?? saved?.text ?? '';
   const input=editor.querySelector<HTMLTextAreaElement>('[data-answer-input]')!;
   if(input.value!==value)input.value=value;
  });
 }
 function cancelTimer(key:string){clearTimeout(timers.get(key));timers.delete(key);}
 function save(key:string) {
  cancelTimer(key);
  const text=drafts.get(key);
  if(text===null)return;
  if(answers[key]?.text===text) {
   if(!pending(key)){drafts.clear(key);paint(key);}
   return;
  }
  queue({kind:'answer',key,text});
  paint(key);
 }
 function schedule(key:string){cancelTimer(key);timers.set(key,setTimeout(()=>save(key),3000));}
 editors.forEach(editor=>{
  const key=editor.dataset.questionAnswer!;
  const input=editor.querySelector<HTMLTextAreaElement>('[data-answer-input]')!;
  input.addEventListener('input',()=>{durable.set(key,drafts.set(key,input.value));paint(key);schedule(key);});
  input.addEventListener('blur',()=>save(key));
  editor.addEventListener('toggle',()=>{if(!editor.open)save(key);});
  editor.querySelector('[data-answer-save]')!.addEventListener('click',()=>{save(key);if(syncStatus==='offline')retry();});
  editor.querySelector('[data-answer-expand]')!.addEventListener('click',event=>{
   const expanded=input.dataset.expanded!=='true';
   input.dataset.expanded=String(expanded);input.rows=expanded?16:6;
   const button=event.currentTarget as HTMLButtonElement;
   button.textContent=expanded?'Reduce writing area':'Expand writing area';button.setAttribute('aria-expanded',String(expanded));input.focus();
  });
 });
 keys.forEach(paint);
 // Local drafts are written on every input, before the delayed network save.
 window.addEventListener('pagehide',()=>keys.forEach(save));
 window.addEventListener('beforeunload',event=>{
  if(keys.some(key=>drafts.get(key)!==null || pending(key))){event.preventDefault();}
 });
 return {
  render(state: SharedReviewState){
   answers=state.answers || {};
   keys.forEach(key=>{
    const draft=drafts.get(key);
    if(draft!==null && answers[key]?.text===draft && !pending(key)){cancelTimer(key);drafts.clear(key);}
    else if(draft!==null && !pending(key) && !timers.has(key))schedule(key);
    paint(key);
   });
  },
  status(status:SyncStatus){syncStatus=status;keys.forEach(paint);}
 };
}
