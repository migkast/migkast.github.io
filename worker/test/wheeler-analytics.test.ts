import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleRequest } from '../src/index';
import { seal, unseal } from '../src/wheeler-analytics';
import { bingDate, reportRange, googleReport, bingReport } from '../src/wheeler-analytics-providers';
import type { Env } from '../src/types';
const PREFIX='analytics:wheeler:v1:';
const origin='https://miguelcasteleiro.com';
function setup() {
 const values=new Map<string,string>([['workspace:existing-answer','untouched']]);
 const env={ SITE_ORIGIN:origin,WHEELER_WORKSPACE_PASSWORD:'workspace-test',WHEELER_GOOGLE_CLIENT_ID:'google-client',WHEELER_GOOGLE_CLIENT_SECRET:'google-secret',WHEELER_ANALYTICS_ENCRYPTION_KEY:btoa('a'.repeat(32)),BLOG_POSTS:{async get(key:string,format?:string){const text=values.get(key);return text===undefined?null:format==='json'?JSON.parse(text):text;},async put(key:string,value:string){values.set(key,value);},async delete(key:string){values.delete(key);}}} as unknown as Env;
 let fetcher: typeof fetch=vi.fn(async()=>new Response('{}',{status:200}));
 const call=async(path='',method='GET',data?:unknown,token?:string,requestOrigin=origin)=>handleRequest(new Request('https://worker.test/clients/wheeler/'+path,{method,headers:{Origin:requestOrigin,...(data===undefined?{}:{'Content-Type':'application/json'}),...(token?{Authorization:'Bearer '+token}:{})},...(data===undefined?{}:{body:JSON.stringify(data)})}),env,fetcher);
 const login=async()=>{const response=await call('session','POST',{password:'workspace-test'});return ((await response.json()) as {token:string}).token;};
 return {values,env,call,login,setFetch(fn:typeof fetch){fetcher=fn;}};
}
afterEach(()=>vi.useRealTimers());
describe('Wheeler analytics',()=>{
 it('requires the existing workspace session, rejects foreign origins and never exposes credentials',async()=>{
  const app=setup();expect((await app.call('analytics')).status).toBe(401);
  const token=await app.login();expect((await app.call('analytics','GET',undefined,token,'https://attacker.test')).status).toBe(403);
  const response=await app.call('analytics','GET',undefined,token);expect(response.status).toBe(200);
  const text=await response.text();expect(text).not.toContain('google-secret');expect(text).not.toContain('refresh_token');
  expect(app.values.get('workspace:existing-answer')).toBe('untouched');
 });
 it('validates reporting windows and limits connections to the current Wheeler website',async()=>{
  const app=setup(),token=await app.login();
  expect((await app.call('analytics?days=365','GET',undefined,token)).status).toBe(400);
  for(const site of ['https://wheelersteelsupply.com/','https://getwheelersteel.com.attacker.test/','https://user:secret@getwheelersteel.com/'])expect((await app.call('analytics/config','POST',{gaProperty:'123',gscSite:site,bingSite:site},token)).status).toBe(400);
  expect((await app.call('analytics/config','POST',{gaProperty:'G-1234',gscSite:'sc-domain:getwheelersteel.com',bingSite:'https://getwheelersteel.com/'},token)).status).toBe(400);
  expect((await app.call('analytics/config','POST',{gaProperty:'123',gscSite:'sc-domain:getwheelersteel.com',bingSite:'https://getwheelersteel.com/'},token)).status).toBe(200);
 });
 it('uses equal-length complete-day windows and parses Bing dates',()=>{
  expect(reportRange(7,new Date('2026-10-22T12:00:00Z'))).toEqual({startDate:'2026-10-13',endDate:'2026-10-19'});
  expect(bingDate('/Date(1316156400000-0700)/')).toBe('2011-09-16');expect(bingDate('invalid')).toBeNull();
 });
 it('keeps missing Bing data separate from a measured zero',async()=>{
  const config={gaProperty:'',gscSite:'sc-domain:getwheelersteel.com',bingSite:'https://getwheelersteel.com/'};
  const empty=await bingReport(config,'test-key',28,vi.fn(async()=>new Response(JSON.stringify({d:[]}))) as typeof fetch);
  expect(empty.totals.clicks).toBeUndefined();expect(empty.dataThrough).toBeNull();
  const date=reportRange(28).endDate;
  const zero=await bingReport(config,'test-key',28,vi.fn(async()=>new Response(JSON.stringify({d:[{Date:date,Clicks:0,Impressions:10}]}))) as typeof fetch);
  expect(zero.totals.clicks).toBe(0);expect(zero.totals.impressions).toBe(10);expect(zero.dataThrough).toBe(date);
 });
 it('gets GA users independently from page totals and does not sum overlapping users',async()=>{
  const bodies:any[]=[];
  const fetcher=vi.fn(async(_url:unknown,init?:RequestInit)=>{const body=JSON.parse(String(init?.body));bodies.push(body);return new Response(JSON.stringify({rows:[{dimensionValues:[{value:body.dimensions?.[0]?.name==='date'?'20261019':body.dimensions?.[0]?.name==='sessionSourceMedium'?'google / organic':'/home'}],metricValues:[{value:body.dimensions?'9':'10'},{value:'25'}]}]}));}) as typeof fetch;
  const report=await googleReport('ga4',{gaProperty:'123',gscSite:'sc-domain:getwheelersteel.com',bingSite:'https://getwheelersteel.com/'},'access',28,fetcher);
  expect(report.totals.users).toBe(10);expect(report.pages[0]!.users).toBe(9);expect(report.daily[0]!.name).toBe('2026-10-19');expect(bodies).toHaveLength(4);
  expect(report.acquisition).toEqual([{name:'google / organic',users:9,sessions:25}]);
  expect(bodies.find(body=>body.dimensions?.[0]?.name==='sessionSourceMedium').metrics).toEqual([{name:'totalUsers'},{name:'sessions'}]);
 });
 it('reports Bing IP throttling without exposing the key',async()=>{
  const config={gaProperty:'123',gscSite:'sc-domain:getwheelersteel.com',bingSite:'https://getwheelersteel.com/'};
  const fetcher=vi.fn(async()=>new Response(JSON.stringify({ErrorCode:17,Message:'ERROR!!! ThrottleIP'}),{status:400})) as typeof fetch;
  await expect(bingReport(config,'private-bing-key',28,fetcher)).rejects.toThrow('Bing is limiting requests. Please try again later.');
  const [url,init]=vi.mocked(fetcher).mock.calls[0]!;
  expect(new URL(String(url)).origin).toBe('https://www.bing.com');
  expect(new Headers(init?.headers).get('Accept')).toBe('application/json');
 });
 it('stores encrypted tokens and leaves snapshots unchanged on authentication failure',async()=>{
  const app=setup();const sealed=await seal('private-refresh-token',app.env);expect(sealed).not.toContain('private-refresh-token');expect(await unseal(sealed,app.env)).toBe('private-refresh-token');
  app.values.set(PREFIX+'google',sealed);const before=[...app.values.entries()];
  expect((await app.call('analytics/disconnect','POST',{source:'google'})).status).toBe(401);expect([...app.values.entries()]).toEqual(before);
 });
 it('uses authenticated, expiring PKCE state and redirects only to the dashboard',async()=>{
  const app=setup(),token=await app.login();
  const response=await app.call('analytics/google/connect','POST',{},token);
  const url=new URL(((await response.json()) as {url:string}).url);expect(url.origin).toBe('https://accounts.google.com');expect(url.searchParams.get('code_challenge_method')).toBe('S256');expect(url.searchParams.get('scope')).toContain('webmasters.readonly');
  const state=url.searchParams.get('state')!;const saved=JSON.parse(app.values.get(PREFIX+'oauth:'+state)!);expect(saved.verifier).not.toBe(url.searchParams.get('code_challenge'));
  expect((await app.call('analytics/google/callback?state=invalid&code=x')).status).toBe(400);
  const scopes='https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly';
  app.setFetch(vi.fn(async()=>new Response(JSON.stringify({refresh_token:'private-refresh',scope:scopes}))) as typeof fetch);
  const callback=await app.call(`analytics/google/callback?state=${state}&code=code`);expect(callback.status).toBe(302);expect(callback.headers.get('Location')).toBe(origin+'/clients/wheeler/?analytics=connected#analytics');
  expect(app.values.get(PREFIX+'google')).not.toContain('private-refresh');expect(app.values.has(PREFIX+'oauth:'+state)).toBe(false);
  expect((await app.call(`analytics/google/callback?state=${state}&code=code`)).status).toBe(400);
 });
 it('rejects expired OAuth state and incomplete read permissions without replacing an existing connection',async()=>{
  const app=setup(),token=await app.login();
  app.values.set(PREFIX+'google',await seal('existing-refresh',app.env));
  const connect=async()=>new URL(((await (await app.call('analytics/google/connect','POST',{},token)).json()) as {url:string}).url).searchParams.get('state')!;
  const state=await connect(),saved=JSON.parse(app.values.get(PREFIX+'oauth:'+state)!);saved.expires=0;app.values.set(PREFIX+'oauth:'+state,JSON.stringify(saved));
  expect((await app.call(`analytics/google/callback?state=${state}&code=code`)).status).toBe(400);
  const next=await connect();app.setFetch(vi.fn(async()=>new Response(JSON.stringify({refresh_token:'replacement',scope:'https://www.googleapis.com/auth/analytics.readonly'}))) as typeof fetch);
  expect((await app.call(`analytics/google/callback?state=${next}&code=code`)).status).toBe(400);
  expect(await unseal(app.values.get(PREFIX+'google')!,app.env)).toBe('existing-refresh');
 });
 it('keeps last good data when one source fails, with its old timestamp and a visible error',async()=>{
  const app=setup(),token=await app.login();
  const config={gaProperty:'123',gscSite:'sc-domain:getwheelersteel.com',bingSite:'https://getwheelersteel.com/'};app.values.set(PREFIX+'config',JSON.stringify(config));app.values.set(PREFIX+'google',await seal('refresh',app.env));
  app.setFetch(vi.fn(async(url:unknown)=>{if(String(url).includes('oauth2'))return new Response(JSON.stringify({access_token:'access'}));if(String(url).includes('analyticsdata'))return new Response(JSON.stringify({rows:[{metricValues:[{value:'12'},{value:'20'}],dimensionValues:[{value:'20261019'}]}]}));return new Response(JSON.stringify({rows:[{keys:['2026-10-19'],clicks:3,impressions:30,ctr:.1,position:4}]}));}) as typeof fetch);
  const first=await (await app.call('analytics','GET',undefined,token)).json() as any;
  expect(first.sources.ga4.report.totals.users).toBe(12);const oldStamp=first.sources.ga4.report.fetchedAt;
  const snapshot=JSON.parse(app.values.get(PREFIX+'snapshot:28')!);snapshot.checkedAt=0;app.values.set(PREFIX+'snapshot:28',JSON.stringify(snapshot));
  app.setFetch(vi.fn(async(url:unknown)=>String(url).includes('oauth2')?new Response(JSON.stringify({access_token:'access'})):String(url).includes('analyticsdata')?new Response('{}',{status:503}):new Response(JSON.stringify({rows:[{keys:['2026-10-19'],clicks:7,impressions:50,ctr:.14,position:3}]}))) as typeof fetch);
  const next=await (await app.call('analytics','POST',{},token)).json() as any;
  expect(next.sources.ga4.report.totals.users).toBe(12);expect(next.sources.ga4.report.fetchedAt).toBe(oldStamp);expect(next.sources.ga4.error).toBeTruthy();expect(next.sources.gsc.report.totals.clicks).toBe(7);
 });
 it('does not repeat API calls while the view cache is fresh',async()=>{
  const app=setup(),token=await app.login();app.values.set(PREFIX+'bing',await seal('test-key',app.env));
  const fetcher=vi.fn(async()=>new Response(JSON.stringify({d:[]}))) as typeof fetch;app.setFetch(fetcher);
  await app.call('analytics','GET',undefined,token);await app.call('analytics','GET',undefined,token);await app.call('analytics','POST',{},token);expect(fetcher).toHaveBeenCalledTimes(1);
 });
});
