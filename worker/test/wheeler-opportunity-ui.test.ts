/// <reference lib="dom" />
import { afterEach, describe, expect, it, vi } from 'vitest';
class Element extends EventTarget {
 dataset:Record<string,string>={};hidden=false;value='';checked=false;tabIndex=-1;textContent='';
 attributes:Record<string,string>={};focus=vi.fn();setAttribute(key:string,value:string){this.attributes[key]=value;}
}
afterEach(()=>vi.unstubAllGlobals());
describe('opportunity dashboard controls',()=>{
 it('switches tabs by keyboard and filters unknown demand without converting it to zero',async()=>{
  vi.resetModules();const tabs=[new Element(),new Element(),new Element()],panels=tabs.map(()=>new Element());
  const search=new Element(),reported=new Element();reported.checked=true;
  const keywordRows=[new Element(),new Element()];keywordRows[0]!.dataset={opportunityKeyword:'home hardening',hasEstimate:'true'};keywordRows[1]!.dataset={opportunityKeyword:'insurance after wildfire rebuild',hasEstimate:'false'};
  const topicSearch=new Element(),priority=new Element();priority.value='all';const topics=[new Element(),new Element()];topics[0]!.dataset={opportunityTopic:'insurance planning',opportunityTopicPriority:'P1'};topics[1]!.dataset={opportunityTopic:'builder checks',opportunityTopicPriority:'P2'};
  const elements:Record<string,Element>={'[data-opportunity-keyword-search]':search,'[data-opportunity-reported-only]':reported,'[data-opportunity-keyword-count]':new Element(),'[data-opportunity-no-keywords]':new Element(),'[data-opportunity-topic-search]':topicSearch,'[data-opportunity-priority]':priority,'[data-opportunity-topic-count]':new Element(),'[data-opportunity-no-topics]':new Element()};
  panels.forEach((panel,index)=>elements[`#opportunity-panel-${index}`]=panel);
  const groups:Record<string,Element[]>={'[data-opportunity-tab]':tabs,'[data-opportunity-keyword]':keywordRows,'[data-opportunity-topic]':topics};
  const root={querySelector:(selector:string)=>elements[selector],querySelectorAll:(selector:string)=>groups[selector]};
  vi.stubGlobal('document',{querySelector:()=>root});await import('../../src/lib/clients/wheeler-opportunity');
  const key=new Event('keydown',{cancelable:true});Object.assign(key,{key:'End'});tabs[0]!.dispatchEvent(key);expect(panels[2]!.hidden).toBe(false);expect(tabs[2]!.attributes['aria-selected']).toBe('true');expect(tabs[2]!.focus).toHaveBeenCalled();
  search.value='rebuild';search.dispatchEvent(new Event('input'));expect(keywordRows.every(row=>row.hidden)).toBe(true);expect(elements['[data-opportunity-no-keywords]']!.hidden).toBe(false);
  reported.checked=false;reported.dispatchEvent(new Event('change'));expect(keywordRows[1]!.hidden).toBe(false);expect(elements['[data-opportunity-keyword-count]']!.textContent).toBe('1 keyword');
  priority.value='P2';priority.dispatchEvent(new Event('change'));expect(topics[0]!.hidden).toBe(true);expect(topics[1]!.hidden).toBe(false);
  topicSearch.value='insurance';topicSearch.dispatchEvent(new Event('input'));expect(topics.every(topic=>topic.hidden)).toBe(true);
 });
});
