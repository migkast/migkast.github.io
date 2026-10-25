import type { AnalyticsConfig, AnalyticsReport, AnalyticsRow } from '../../src/lib/clients/wheeler-analytics-types';

export function reportRange(days: number, now = new Date()) {
 // All three sources use the same complete-day window, allowing for search processing delays.
 const end = new Date(now); end.setUTCDate(end.getUTCDate() - 3);
 const start = new Date(end); start.setUTCDate(start.getUTCDate() - days + 1);
 return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
}
export async function providerJson(url: string, init: RequestInit, fetcher: typeof fetch): Promise<any> {
 const response = await fetcher(url, { ...init, signal: AbortSignal.timeout(20000) });
 if (!response.ok) {
  if(['www.bing.com','ssl.bing.com'].includes(new URL(url).hostname)){
   const fault=await response.json().catch(()=>null) as {ErrorCode?:number}|null;
   if(fault?.ErrorCode===17 || fault?.ErrorCode===4 || fault?.ErrorCode===5)throw new Error('Bing is limiting requests. Please try again later.');
   if(fault?.ErrorCode===3 || fault?.ErrorCode===14)throw new Error('Access denied. Check the connection and property permissions.');
  }
  throw new Error(response.status === 401 || response.status === 403 ? 'Access denied. Check the connection and property permissions.' : 'The provider could not return this report. Please retry.');
 }
 return response.json();
}
const num = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
export async function googleReport(source: 'ga4' | 'gsc', config: AnalyticsConfig, token: string, days: number, fetcher: typeof fetch): Promise<AnalyticsReport> {
 const range = reportRange(days), headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
 const post = (url: string, body: unknown) => providerJson(url, { method: 'POST', headers, body: JSON.stringify(body) }, fetcher);
 let totals: AnalyticsRow, daily: AnalyticsRow[], pages: AnalyticsRow[], queries: AnalyticsRow[] = [], acquisition: AnalyticsRow[] | undefined;
 if (source === 'ga4') {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${config.gaProperty}:runReport`;
  const run = (dimension?: string) => post(url, { dateRanges: [range], metrics: [{ name: 'totalUsers' }, { name: 'screenPageViews' }], ...(dimension ? { dimensions: [{ name: dimension }], orderBys: dimension === 'date' ? [{ dimension: { dimensionName: 'date' } }] : [{ metric: { metricName: 'totalUsers' }, desc: true }], limit: 100 } : {}) });
  const acquisitionRequest = post(url, {dateRanges:[range],dimensions:[{name:'sessionSourceMedium'}],metrics:[{name:'totalUsers'},{name:'sessions'}],orderBys:[{metric:{metricName:'totalUsers'},desc:true}],limit:100});
  const [summary, dates, urls, sources] = await Promise.all([run(), run('date'), run('pagePath'), acquisitionRequest]);
  acquisition = (sources.rows || []).map((row: any): AnalyticsRow => ({name:row.dimensionValues[0].value,users:num(row.metricValues?.[0]?.value),sessions:num(row.metricValues?.[1]?.value)}));
  const parse = (row: any, name: string): AnalyticsRow => ({ name, users: num(row.metricValues?.[0]?.value), views: num(row.metricValues?.[1]?.value) });
  totals = summary.rows?.[0] ? parse(summary.rows[0], 'Total') : { name: 'Total', users: 0, views: 0 };
  daily = (dates.rows || []).map((row: any) => { const date = row.dimensionValues[0].value; return parse(row, `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`); });
  pages = (urls.rows || []).map((row: any) => parse(row, row.dimensionValues[0].value));
 } else {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.gscSite)}/searchAnalytics/query`;
  const run = (dimension?: string) => post(url, { ...range, type: 'web', dataState: 'final', ...(dimension ? { dimensions: [dimension], rowLimit: dimension === 'date' ? 100 : 100 } : {}) });
  const [summary, dates, urls, terms] = await Promise.all([run(), run('date'), run('page'), run('query')]);
  const parse = (row: any, name: string): AnalyticsRow => ({ name, clicks: num(row.clicks), impressions: num(row.impressions), ctr: num(row.ctr), position: num(row.position) });
  totals = summary.rows?.[0] ? parse(summary.rows[0], 'Total') : { name: 'Total', clicks: 0, impressions: 0, ctr: 0, position: 0 };
  daily = (dates.rows || []).map((row: any) => parse(row, row.keys[0])).sort((a: AnalyticsRow, b: AnalyticsRow) => a.name.localeCompare(b.name));
  pages = (urls.rows || []).map((row: any) => parse(row, row.keys[0]));
  queries = (terms.rows || []).map((row: any) => parse(row, row.keys[0]));
 }
 return { ...range, fetchedAt: new Date().toISOString(), totals, daily, pages, queries, ...(acquisition ? {acquisition} : {}), dataThrough: daily.at(-1)?.name || null };
}
export function bingDate(value: string): string | null {
 const match = /\/Date\((\d+)(?:[+-]\d{4})?\)\//.exec(value);
 const date = match ? new Date(Number(match[1])) : new Date(value);
 return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : null;
}
export async function bingReport(config: AnalyticsConfig, apiKey: string, days: number, fetcher: typeof fetch): Promise<AnalyticsReport> {
 const range = reportRange(days);
 const url = new URL('https://www.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats');
 url.searchParams.set('siteUrl', config.bingSite); url.searchParams.set('apikey', apiKey);
 const body = await providerJson(url.href, {headers:{Accept:'application/json','User-Agent':'WheelerDashboard/1.0 (+https://miguelcasteleiro.com)'}}, fetcher);
 if (!Array.isArray(body.d)) throw new Error('Bing did not return a traffic report. Check the site and API key.');
 const daily: AnalyticsRow[] = body.d.map((row: any) => ({ name: bingDate(String(row.Date)), clicks: num(row.Clicks), impressions: num(row.Impressions) })).filter((row: any) => row.name && row.name >= range.startDate && row.name <= range.endDate).sort((a: AnalyticsRow, b: AnalyticsRow) => a.name.localeCompare(b.name));
 const clicks = daily.reduce((sum, row) => sum + (row.clicks || 0), 0), impressions = daily.reduce((sum, row) => sum + (row.impressions || 0), 0);
 return { ...range, fetchedAt: new Date().toISOString(), totals: { name: 'Total', clicks: daily.length ? clicks : undefined, impressions: daily.length ? impressions : undefined, ctr: daily.length ? (impressions ? clicks / impressions : 0) : undefined }, daily, pages: [], queries: [], dataThrough: daily.at(-1)?.name || null, note: 'Bing publishes data on its own schedule. Only returned dates inside this window are counted.' };
}
