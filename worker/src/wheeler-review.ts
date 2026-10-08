import { articles as calendarArticles } from '../../src/lib/clients/wheeler-calendar.json';
import type { Env } from './types';
import { HttpError } from './validation';
import type { ReviewOperation, ReviewEvent } from '../../src/lib/clients/wheeler-review';

const ROOT = '/clients/wheeler';
const PREFIX = 'workspace:wheeler:2026-09-30-v1:event:';
const CLUSTERS = new Set([
  'la-steel-framing-provider-evaluation', 'wildfire-rebuild-framing-decisions',
  'architect-builder-design-coordination', 'fire-code-and-assembly-evaluation',
  'steel-framing-quote-comparison', 'project-specific-package-handoffs', 'small-developer-framing-evaluation'
]);
const CALENDAR_KEYS = new Set(calendarArticles.map(article => `article:${article.id}`));
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const encoder = new TextEncoder();

export async function handleWheelerReview(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin');
  const allowed = [env.SITE_ORIGIN, 'https://www.miguelcasteleiro.com', 'http://localhost:4321', 'http://127.0.0.1:4321'];
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (origin && !allowed.includes(origin)) return json({ message: 'Origin not allowed' }, 403);
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  const route = new URL(request.url).pathname;
  try {
    if (!env.WHEELER_WORKSPACE_PASSWORD) throw new HttpError(503, 'Shared approvals are not configured yet');
    if (route === `${ROOT}/session` && request.method === 'POST') {
      const input = await readBody(request);
      if (typeof input.password !== 'string' || input.password.length > 200) throw new HttpError(401, 'That password does not match');
      const [actual, expected] = await Promise.all([
        crypto.subtle.digest('SHA-256', encoder.encode(input.password)),
        crypto.subtle.digest('SHA-256', encoder.encode(env.WHEELER_WORKSPACE_PASSWORD))
      ]);
      let difference = 0;
      const a = new Uint8Array(actual), b = new Uint8Array(expected);
      for (let i = 0; i < a.length; i++) difference |= a[i]! ^ b[i]!;
      if (difference) throw new HttpError(401, 'That password does not match');
      return json({ token: await createToken(env.WHEELER_WORKSPACE_PASSWORD) });
    }
    if (route !== `${ROOT}/review`) return json({ message: 'Not found' }, 404);
    if (!['GET', 'POST'].includes(request.method)) return json({ message: 'Method not allowed' }, 405);
    await verifyToken(request.headers.get('Authorization'), env.WHEELER_WORKSPACE_PASSWORD);
    // Authentication is always checked before consulting the shared edge cache.
    const cache = typeof caches === 'undefined' ? undefined : (caches as CacheStorage & { default?: Cache }).default;
    const cacheKey = new Request(`${new URL(request.url).origin}/internal/wheeler-review-cache-v1`);
    if (request.method === 'GET') {
      let cached: Response | undefined;
      try { cached = await cache?.match(cacheKey); } catch { /* Cache is optional; KV remains authoritative. */ }
      if (cached) {
        headers['X-Wheeler-Review-Cache'] = 'HIT';
        return json(await cached.json());
      }
      // Separate immutable records avoid overwriting another person's whole review.
      const events: ReviewEvent[] = [];
      let cursor: string | undefined;
      do {
        const page = await env.BLOG_POSTS.list({ prefix: PREFIX, cursor, limit: 100 });
        for (let index = 0; index < page.keys.length; index += 20) {
          const batch = await Promise.all(page.keys.slice(index, index + 20).map(key => env.BLOG_POSTS.get<ReviewEvent>(key.name, 'json')));
          events.push(...batch.filter((event): event is ReviewEvent => event !== null));
        }
        cursor = page.list_complete ? undefined : page.cursor;
      } while (cursor);
      try {
        await cache?.put(cacheKey, new Response(JSON.stringify({ events }), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=300' }
        }));
      } catch { /* A cache failure must not prevent shared reviews from loading. */ }
      headers['X-Wheeler-Review-Cache'] = 'MISS';
      return json({ events });
    }
    const operation = validateOperation(await readBody(request));
    const key = `${PREFIX}${operation.id}`;
    const previous = await env.BLOG_POSTS.get<ReviewEvent>(key, 'json');
    if (previous) return json({ event: previous });
    const event: ReviewEvent = { ...operation, savedAt: new Date().toISOString() };
    await env.BLOG_POSTS.put(key, JSON.stringify(event));
    try { await cache?.delete(cacheKey); } catch { /* The saved event is durable even if cache invalidation fails. */ }
    return json({ event }, 201);
  } catch (error) {
    if (error instanceof HttpError) return json({ message: error.message }, error.status);
    console.error('Wheeler review request failed', error);
    return json({ message: 'Could not complete the shared review request. Please retry.' }, 500);
  }
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get('Content-Type')?.split(';')[0]?.trim() !== 'application/json') throw new HttpError(415, 'Use application/json');
  if (Number(request.headers.get('Content-Length') || 0) > 10000) throw new HttpError(413, 'Request too large');
  const text = await request.text();
  if (encoder.encode(text).length > 10000) throw new HttpError(413, 'Request too large');
  try {
    const input = JSON.parse(text);
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error();
    return input;
  } catch { throw new HttpError(400, 'Invalid JSON'); }
}
function validateOperation(input: Record<string, unknown>): ReviewOperation {
  if (typeof input.id !== 'string' || !UUID.test(input.id) || typeof input.reviewer !== 'string' || !input.reviewer.trim() || input.reviewer.length > 100) throw new HttpError(400, 'Invalid review identity');
  const change = input.change as Record<string, unknown> | undefined;
  const base = { id: input.id, reviewer: input.reviewer.trim() };
  if (change?.kind === 'decision') {
    if (typeof change.key !== 'string' || (!CLUSTERS.has(change.key) && !CALENDAR_KEYS.has(change.key)) || !['pending', 'approved', 'changes', 'hold'].includes(String(change.status)) || typeof change.note !== 'string' || change.note.length > 1200 || (change.status === 'changes' && !change.note.trim())) throw new HttpError(400, 'Invalid cluster decision');
    return { ...base, change: { kind: 'decision', key: change.key, status: change.status as 'pending' | 'approved' | 'changes' | 'hold', note: change.note.trim() } };
  }
  if (change?.kind === 'backlink') {
    if (typeof change.id !== 'number' || !Number.isInteger(change.id) || change.id < 1 || change.id > 19 || typeof change.done !== 'boolean') throw new HttpError(400, 'Invalid backlink completion');
    return { ...base, change: { kind: 'backlink', id: change.id, done: change.done } };
  }
  if (change?.kind === 'idea') {
    const idea = change.idea as Record<string, unknown> | undefined;
    if (!idea || typeof idea.id !== 'string' || !UUID.test(idea.id) || typeof idea.title !== 'string' || !idea.title.trim() || idea.title.length > 150 || typeof idea.description !== 'string' || idea.description.length > 1500) throw new HttpError(400, 'Invalid cluster idea');
    return { ...base, change: { kind: 'idea', idea: { id: idea.id, title: idea.title.trim(), description: idea.description.trim() } } };
  }
  if (change?.kind === 'removeIdea' && typeof change.id === 'string' && UUID.test(change.id)) return { ...base, change: { kind: 'removeIdea', id: change.id } };
  throw new HttpError(400, 'Unknown review change');
}
function toBase64(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, ''); }
function fromBase64(value: string) { return Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/')), char => char.charCodeAt(0)); }
async function signingKey(secret: string) { return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']); }
async function createToken(secret: string) {
  const body = toBase64(encoder.encode(JSON.stringify({ project: 'wheeler', expires: Date.now() + 12 * 60 * 60 * 1000, nonce: crypto.randomUUID() })));
  const signature = await crypto.subtle.sign('HMAC', await signingKey(secret), encoder.encode(body));
  return `${body}.${toBase64(new Uint8Array(signature))}`;
}
async function verifyToken(authorization: string | null, secret: string) {
  try {
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
    const [body, signature] = token.split('.');
    if (!body || !signature || token.length > 1000 || !await crypto.subtle.verify('HMAC', await signingKey(secret), fromBase64(signature), encoder.encode(body))) throw new Error();
    const data = JSON.parse(new TextDecoder().decode(fromBase64(body)));
    if (data.project !== 'wheeler' || typeof data.expires !== 'number' || data.expires <= Date.now()) throw new Error();
  } catch { throw new HttpError(401, 'Please unlock the workspace again'); }
}
