import type { Env } from './types';
import { HttpError } from './validation';
import { verifyToken } from './wheeler-review';
import { bingReport, googleReport, providerJson } from './wheeler-analytics-providers';
import type { AnalyticsConfig, AnalyticsOverview, AnalyticsReport, AnalyticsSource } from '../../src/lib/clients/wheeler-analytics-types';

const ROOT = '/clients/wheeler/analytics';
const PREFIX = 'analytics:wheeler:v1:';
const DEFAULT_CONFIG: AnalyticsConfig = { gaProperty: '', gscSite: 'sc-domain:getwheelersteel.com', bingSite: 'https://getwheelersteel.com/' };
const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly';
const activeRefreshes = new Map<string, Promise<AnalyticsOverview>>();
function encode(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)); }
function decode(value: string) { return Uint8Array.from(atob(value), c => c.charCodeAt(0)); }
function random() { return encode(crypto.getRandomValues(new Uint8Array(32))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/, ''); }
async function encryptionKey(env: Env) {
 try { const raw = decode(env.WHEELER_ANALYTICS_ENCRYPTION_KEY || ''); if(raw.length !== 32) throw new Error(); return await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt','decrypt']); }
 catch { throw new HttpError(503, 'Analytics connections need server setup. Contact Miguel.'); }
}
export async function seal(value: string, env: Env) {
 const iv = crypto.getRandomValues(new Uint8Array(12));
 const ciphertext = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, await encryptionKey(env), new TextEncoder().encode(value));
 return JSON.stringify({ iv: encode(iv), ciphertext: encode(new Uint8Array(ciphertext)) });
}
export async function unseal(value: string, env: Env) {
 const data = JSON.parse(value);
 const text = await crypto.subtle.decrypt({ name:'AES-GCM', iv: decode(data.iv) }, await encryptionKey(env), decode(data.ciphertext));
 return new TextDecoder().decode(text);
}
async function configFor(env: Env): Promise<AnalyticsConfig> { return await env.BLOG_POSTS.get<AnalyticsConfig>(PREFIX+'config', 'json') || DEFAULT_CONFIG; }
async function clearSnapshots(env: Env) {
 await Promise.all([7,28,90].map(days => env.BLOG_POSTS.delete(PREFIX+`snapshot:${days}`)));
}
function allowedSite(value: unknown, domainProperty = false): string {
 if(typeof value !== 'string' || value.length > 200) throw new HttpError(400, 'Use Wheeler’s verified website property.');
 if(domainProperty && value === 'sc-domain:getwheelersteel.com') return value;
 try { const url = new URL(value); if(url.protocol !== 'https:' || !['getwheelersteel.com','www.getwheelersteel.com'].includes(url.hostname) || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error(); return url.href; }
 catch { throw new HttpError(400, 'Use https://getwheelersteel.com/ or its verified www property.'); }
}
async function readBody(request: Request) {
 if(request.headers.get('Content-Type')?.split(';')[0] !== 'application/json') throw new HttpError(415, 'Use application/json');
 const text = await request.text(); if(text.length > 12000) throw new HttpError(413, 'Request too large');
 try { const data = JSON.parse(text); if(!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(); return data as Record<string, unknown>; }
 catch { throw new HttpError(400, 'Invalid request'); }
}
async function overview(env: Env, days: number, refresh: boolean, fetcher: typeof fetch): Promise<AnalyticsOverview> {
 const config = await configFor(env);
 const [google, bing, cached] = await Promise.all([env.BLOG_POSTS.get(PREFIX+'google'), env.BLOG_POSTS.get(PREFIX+'bing'), env.BLOG_POSTS.get<{ config: AnalyticsConfig; overview: AnalyticsOverview; checkedAt: number }>(PREFIX+`snapshot:${days}`, 'json')]);
 const secretSetupReady = !!env.WHEELER_ANALYTICS_ENCRYPTION_KEY;
 const googleSetupReady = secretSetupReady && !!env.WHEELER_GOOGLE_CLIENT_ID && !!env.WHEELER_GOOGLE_CLIENT_SECRET;
 const result: AnalyticsOverview = { config, googleConnected: !!google, googleSetupReady, secretSetupReady, sources: { ga4: { connected: !!google && !!config.gaProperty, report: null, error: null }, gsc: { connected: !!google && !!config.gscSite, report: null, error: null }, bing: { connected: !!bing, report: null, error: null } } };
 const sameConfig = cached && JSON.stringify(cached.config) === JSON.stringify(config) && cached.overview.googleConnected === !!google && cached.overview.sources.bing.connected === !!bing;
 // Automatic views reuse one hour; explicit refreshes have a short provider-protection cooldown.
 const conversionReportReady=!result.sources.ga4.connected || !cached?.overview.sources.ga4.report || Object.hasOwn(cached.overview.sources.ga4.report,'conversions');
 if(sameConfig && conversionReportReady && Date.now() - cached.checkedAt < (refresh ? 60000 : 3600000)) return { ...cached.overview, googleSetupReady, secretSetupReady };
 let accessToken: Promise<string> | undefined;
 const googleAccess = () => accessToken ||= (async () => {
  if(!googleSetupReady) throw new Error('Google connection needs server setup. Contact Miguel.');
  const token = await providerJson('https://oauth2.googleapis.com/token', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ client_id:env.WHEELER_GOOGLE_CLIENT_ID!, client_secret:env.WHEELER_GOOGLE_CLIENT_SECRET!, refresh_token:await unseal(google!, env), grant_type:'refresh_token' }).toString() }, fetcher);
  if(!token.access_token) throw new Error('Reconnect Google to renew reporting access.');
  return token.access_token as string;
 })();
 await Promise.all((['ga4','gsc','bing'] as AnalyticsSource[]).map(async source => {
  if(!result.sources[source].connected) return;
  try {
   result.sources[source].report = source === 'bing' ? await bingReport(config, await unseal(bing!, env), days, fetcher) : await googleReport(source, config, await googleAccess(), days, fetcher);
  } catch(error) {
   // Retain the last good report with its original timestamp; never replace a failure with zeroes.
   if(sameConfig) result.sources[source].report = cached.overview.sources[source].report;
   result.sources[source].error = error instanceof Error && ['Bing is limiting requests. Please try again later.','Access denied. Check the connection and property permissions.','The provider could not return this report. Please retry.','Reconnect Google to renew reporting access.','Google connection needs server setup. Contact Miguel.','Bing did not return a traffic report. Check the site and API key.'].includes(error.message) ? error.message : 'Unable to refresh this source. Check its connection and try again.';
  }
 }));
 await env.BLOG_POSTS.put(PREFIX+`snapshot:${days}`, JSON.stringify({ config, overview: result, checkedAt: Date.now() }));
 return result;
}
async function callback(request: Request, env: Env, fetcher: typeof fetch) {
 const url = new URL(request.url), state = url.searchParams.get('state') || '';
 if(!/^[\w-]{43}$/.test(state)) throw new HttpError(400, 'Invalid Google connection. Start again from the dashboard.');
 const saved = await env.BLOG_POSTS.get<{ verifier: string; expires: number }>(PREFIX+'oauth:'+state, 'json');
 if(!saved || saved.expires < Date.now()) throw new HttpError(400, 'Google connection expired. Start again from the dashboard.');
 await env.BLOG_POSTS.delete(PREFIX+'oauth:'+state);
 const redirect = new URL('/clients/wheeler/', env.SITE_ORIGIN);
 redirect.hash = 'analytics';
 if(url.searchParams.has('error')) { redirect.searchParams.set('analytics','cancelled'); return Response.redirect(redirect.href, 302); }
 const code = url.searchParams.get('code'); if(!code || code.length > 4000) throw new HttpError(400, 'Google did not return an authorization code.');
 const token = await providerJson('https://oauth2.googleapis.com/token', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:new URLSearchParams({ code, client_id:env.WHEELER_GOOGLE_CLIENT_ID!, client_secret:env.WHEELER_GOOGLE_CLIENT_SECRET!, code_verifier:saved.verifier, grant_type:'authorization_code', redirect_uri:new URL(ROOT+'/google/callback',url.origin).href }).toString() }, fetcher);
 if(!token.refresh_token) throw new HttpError(400, 'Google did not grant offline reporting access. Reconnect and approve both read permissions.');
 const granted = new Set(String(token.scope || '').split(' '));
 if(!SCOPES.split(' ').every(scope => granted.has(scope))) throw new HttpError(400, 'Approve read access to both Analytics and Search Console, then reconnect.');
 await env.BLOG_POSTS.put(PREFIX+'google', await seal(token.refresh_token, env));
 await clearSnapshots(env); redirect.searchParams.set('analytics','connected');
 return Response.redirect(redirect.href, 302);
}
export async function handleWheelerAnalytics(request: Request, env: Env, fetcher: typeof fetch): Promise<Response> {
 const url = new URL(request.url), origin = request.headers.get('Origin');
 const allowed = [env.SITE_ORIGIN, 'https://www.miguelcasteleiro.com', 'http://localhost:4321', 'http://127.0.0.1:4321'];
 const headers: Record<string,string> = { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'Vary':'Origin', 'Access-Control-Allow-Methods':'GET, POST, OPTIONS', 'Access-Control-Allow-Headers':'Authorization, Content-Type' };
 const json = (value: unknown, status=200) => new Response(JSON.stringify(value), {status, headers});
 if(origin && !allowed.includes(origin)) return json({message:'Origin not allowed'},403);
 if(origin) headers['Access-Control-Allow-Origin'] = origin;
 if(request.method === 'OPTIONS') return new Response(null,{status:204,headers});
 try {
  if(url.pathname === ROOT+'/google/callback' && request.method === 'GET') return await callback(request,env,fetcher);
  if(!env.WHEELER_WORKSPACE_PASSWORD) throw new HttpError(503,'Shared workspace is not configured.');
  await verifyToken(request.headers.get('Authorization'), env.WHEELER_WORKSPACE_PASSWORD);
  if(url.pathname === ROOT && ['GET','POST'].includes(request.method)) {
   const days = Number(url.searchParams.get('days') || 28); if(![7,28,90].includes(days)) throw new HttpError(400,'Choose 7, 28 or 90 days.');
   const refresh = request.method === 'POST';
   const key = new URL(request.url).origin+':'+days;
   let pending = activeRefreshes.get(key);
   if(!pending) { pending = overview(env,days,refresh,fetcher); activeRefreshes.set(key,pending); }
   try { return json(await pending); } finally { if(activeRefreshes.get(key) === pending) activeRefreshes.delete(key); }
  }
  if(url.pathname === ROOT+'/config' && request.method === 'POST') {
   const body = await readBody(request);
   if(typeof body.gaProperty !== 'string' || !/^\d{1,20}$|^$/.test(body.gaProperty)) throw new HttpError(400,'Use the numeric GA4 property ID, not the G- measurement ID.');
   const config: AnalyticsConfig = {gaProperty:body.gaProperty,gscSite:allowedSite(body.gscSite,true),bingSite:allowedSite(body.bingSite)};
   await env.BLOG_POSTS.put(PREFIX+'config',JSON.stringify(config)); await clearSnapshots(env); return json({saved:true});
  }
  if(url.pathname === ROOT+'/google/connect' && request.method === 'POST') {
   if(!env.WHEELER_GOOGLE_CLIENT_ID || !env.WHEELER_GOOGLE_CLIENT_SECRET) throw new HttpError(503,'Google connection needs server setup. Contact Miguel.');
   await encryptionKey(env);
   const state = random(), verifier = random();
   const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
   await env.BLOG_POSTS.put(PREFIX+'oauth:'+state, JSON.stringify({verifier,expires:Date.now()+600000}),{expirationTtl:600});
   const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
   const values = {client_id:env.WHEELER_GOOGLE_CLIENT_ID,redirect_uri:new URL(ROOT+'/google/callback',url.origin).href,response_type:'code',scope:SCOPES,state,access_type:'offline',prompt:'consent',code_challenge:encode(digest).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,''),code_challenge_method:'S256'};
   for(const [key,value] of Object.entries(values)) auth.searchParams.set(key,value);
   return json({url:auth.href});
  }
  if(url.pathname === ROOT+'/bing/connect' && request.method === 'POST') {
   const body = await readBody(request);
   if(typeof body.apiKey !== 'string' || !/^[a-zA-Z0-9_-]{16,256}$/.test(body.apiKey)) throw new HttpError(400,'Enter the Bing Webmaster Tools API key.');
   // Verify this key can read Wheeler before storing it.
   await bingReport(await configFor(env),body.apiKey,28,fetcher);
   await env.BLOG_POSTS.put(PREFIX+'bing',await seal(body.apiKey,env)); await clearSnapshots(env); return json({connected:true});
  }
  if(url.pathname === ROOT+'/disconnect' && request.method === 'POST') {
   const body = await readBody(request); if(!['google','bing'].includes(String(body.source))) throw new HttpError(400,'Unknown connection.');
   await env.BLOG_POSTS.delete(PREFIX+body.source); await clearSnapshots(env); return json({disconnected:true});
  }
  return json({message:'Not found'},404);
 } catch(error) {
  if(error instanceof HttpError) return json({message:error.message},error.status);
  return json({message:'Analytics request failed. Please retry or reconnect the source.'},502);
 }
}
