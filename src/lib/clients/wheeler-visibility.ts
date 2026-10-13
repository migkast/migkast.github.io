import data from './wheeler-visibility.json';
export const engines = [
 {id:'openai', icon:'/platforms/ai/openai.svg', label:'OpenAI', color:'#27649a'},
 {id:'claude', icon:'/platforms/ai/claude.svg', label:'Claude', color:'#9a542d'},
 {id:'gemini', icon:'/platforms/ai/gemini.svg', label:'Gemini', color:'#7555a3'},
 {id:'perplexity', icon:'/platforms/ai/perplexity.svg', label:'Perplexity', color:'#16756c'}
] as const;
export type Engine = typeof engines[number]['id'];
export const visibility = data;
export const categories: Record<string,string> = {BRAND_SPECIFIC:'Brand questions',BEST_TOP:'Best / top providers',HOW_TO_CHOOSE:'Choosing a provider',TECHNICAL_CONSTRAINTS:'Technical questions',BUDGET_PRICE:'Budget & cost',PERSONA_INDUSTRY:'Audience-specific',TASK_WORKFLOW:'Project planning'};
export const percentage = (count:number,total:number) => total ? Math.round(count / total * 1000) / 10 : 0;
export function competitorCounts(run: typeof data.runs[number]) {
 const counts:Record<string,number> = {};
 for (const engine of engines) for (const [name,count] of Object.entries(run.competitors[engine.id])) counts[name] = (counts[name] || 0) + count;
 return counts;
}
export function identifiedCount(run: typeof data.runs[number]) {
 return engines.reduce((total,engine)=>total + run.providers[engine.id].present,0);
}
