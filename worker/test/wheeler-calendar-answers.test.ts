/// <reference lib="dom" />
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initCalendarAnswers } from '../../src/lib/clients/wheeler-calendar-answers';
import { AnswerDrafts } from '../../src/lib/clients/wheeler-answer-drafts';
import { calendarQuestionKey, calendarQuestionKeys } from '../../src/lib/clients/wheeler-calendar-questions';
import { articles } from '../../src/lib/clients/wheeler-calendar.json';
import type { ReviewChange, SharedReviewState } from '../../src/lib/clients/wheeler-review';
class Field extends EventTarget {
 value='';textContent='';rows=6;open=false;dataset:Record<string,string>={};
 focus=vi.fn();setAttribute=vi.fn();
}
function editor(key:string){
 const fields=Object.fromEntries(['input','status','toggle','save','expand'].map(name=>[`[data-answer-${name}]`,new Field()]));
 const element=Object.assign(new Field(),{dataset:{questionAnswer:key},querySelector:(selector:string)=>fields[selector]});
 return {element,fields,input:fields['[data-answer-input]']!,status:fields['[data-answer-status]']!,save:fields['[data-answer-save]']!,expand:fields['[data-answer-expand]']!};
}
const values=new Map<string,string>();
beforeEach(()=>{
 vi.useFakeTimers();values.clear();
 vi.stubGlobal('localStorage',{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key)});
 vi.stubGlobal('window',new EventTarget());
});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});
function mount(){
 const first=editor('same-question'),second=editor('same-question');
 vi.stubGlobal('document',{querySelectorAll:()=>[first.element,second.element]});
 const queue=vi.fn<(change:ReviewChange)=>void>(),pending=new Set<string>();
 const review=initCalendarAnswers('local-test',queue,key=>pending.has(key),vi.fn());
 const state:SharedReviewState={decisions:{},ideas:[],backlinks:{},answers:{}};
 review.render(state);return{first,second,queue,pending,review,state};
}
describe('calendar answer durability',()=>{
 it('keeps each keystroke before debounce, restores on reload and confirms only a shared acknowledgement',()=>{
  const app=mount(),text='Detailed answer\n\n'+'More project context. '.repeat(500);
  app.first.input.value=text;app.first.input.dispatchEvent(new Event('input'));
  expect([...values.values()]).toContain(text);
  expect(app.second.input.value).toBe(text);
  expect(app.queue).not.toHaveBeenCalled();
  vi.clearAllTimers();const reopened=mount();
  expect(reopened.first.input.value).toBe(text);
  vi.advanceTimersByTime(3000);
  expect(reopened.queue).toHaveBeenLastCalledWith({kind:'answer',key:'same-question',text});
  reopened.pending.add('same-question');
  reopened.state.answers!['same-question']={text,updatedAt:new Date().toISOString(),reviewer:'Stacie'};
  reopened.review.render(reopened.state);
  expect(reopened.first.status.textContent).not.toBe('Saved to shared dashboard');
  reopened.pending.clear();reopened.review.render(reopened.state);
  expect(reopened.first.status.textContent).toBe('Saved to shared dashboard');
  expect(values.size).toBe(0);
 });
 it('keeps newer typing when an earlier save returns and allows manual saving and expansion',()=>{
  const app=mount();app.first.input.value='Newer text';app.first.input.dispatchEvent(new Event('input'));
  app.state.answers!['same-question']={text:'Older saved text',updatedAt:new Date().toISOString(),reviewer:'Stacie'};
  app.review.render(app.state);expect(app.first.input.value).toBe('Newer text');
  app.first.save.dispatchEvent(new Event('click'));
  expect(app.queue).toHaveBeenLastCalledWith({kind:'answer',key:'same-question',text:'Newer text'});
  app.first.expand.dispatchEvent(new Event('click'));expect(app.first.input.rows).toBe(16);
  app.first.expand.dispatchEvent(new Event('click'));expect(app.first.input.rows).toBe(6);
  app.review.status('offline');expect(app.first.status.textContent).toContain('waiting to sync');
 });
 it('reports unavailable browser storage while retaining the edit in memory',()=>{
  const blocked={getItem:()=>{throw Error('blocked')},setItem:()=>{throw Error('blocked')},removeItem:()=>{throw Error('blocked')}};
  const drafts=new AnswerDrafts(blocked,'test:');expect(drafts.set('q','Keep this')).toBe(false);expect(drafts.get('q')).toBe('Keep this');
  vi.stubGlobal('localStorage',blocked);const app=mount();app.first.input.value='Keep this';app.first.input.dispatchEvent(new Event('input'));
  expect(app.first.status.textContent).toContain('keep this page open');
 });
 it('retains saved-answer keys after the natural-language question revision',()=>{
  const article=articles.find(a=>a.id==='21ed2d3d-9c84-430e-820c-c36d2c053586')!;
  const legacyKey=calendarQuestionKey({id:article.id},'What is one insurance concern a homeowner brought to you before deciding how to rebuild?');
  expect(article.questionsForWheeler[0]).toBe('Can you share an example of an insurance concern a homeowner raised with you while planning their rebuild?');
  expect(calendarQuestionKey(article,article.questionsForWheeler[0]!)).toBe(legacyKey);
  expect(calendarQuestionKeys.has(legacyKey)).toBe(true);
  expect(calendarQuestionKeys.size).toBe(43);
 });
 it('shares the reused older-home question without conflating distinct or revised questions',()=>{
  const first=articles.find(a=>a.id==='8ba5c5fd-cfaa-4882-b8b1-277490fd59b2')!,reuse=articles.find(a=>a.id==='4efec579-2af8-43dd-a5df-e970ae5e91fd')!;
  expect(calendarQuestionKey(first,first.questionsForWheeler[0]!)).toBe(calendarQuestionKey(reuse,reuse.questionsForWheeler[0]!));
  expect(calendarQuestionKey(first,'Revised question')).not.toBe(calendarQuestionKey(first,first.questionsForWheeler[0]!));
 });
});
