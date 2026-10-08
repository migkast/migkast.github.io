import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleRequest } from '../src/index';
import type { Env } from '../src/types';
import { reduceReview, type ReviewEvent } from '../../src/lib/clients/wheeler-review';

const key1 = 'la-steel-framing-provider-evaluation';
const key2 = 'wildfire-rebuild-framing-decisions';
const origin = 'https://miguelcasteleiro.com';
function setup() {
  const values = new Map<string, string>([['post:unrelated-blog', '{"title":"Unchanged"}']]);
  const list = vi.fn(async ({ prefix }: { prefix: string }) => ({ keys: [...values.keys()].filter(key => key.startsWith(prefix)).map(name => ({ name })), list_complete: true }));
  const env = {
    SITE_ORIGIN: origin, WHEELER_WORKSPACE_PASSWORD: 'test-workspace-password',
    BLOG_POSTS: {
      async get(key: string, format?: string) { const value = values.get(key); return value ? format === 'json' ? JSON.parse(value) : value : null; },
      async put(key: string, value: string) { values.set(key, value); },
      list
    }
  } as unknown as Env;
  async function request(path: string, method = 'GET', body?: unknown, token?: string, requestOrigin = origin) {
    return handleRequest(new Request(`https://worker.test/clients/wheeler/${path}`, {
      method, headers: { Origin: requestOrigin, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    }), env, fetch);
  }
  async function login() {
    const result = await request('session', 'POST', { password: 'test-workspace-password' });
    expect(result.status).toBe(200);
    return ((await result.json()) as { token: string }).token;
  }
  return { values, env, request, login, list };
}
afterEach(() => vi.unstubAllGlobals());

function installCache() {
  const entries = new Map<string, { response: Response; expires: number }>();
  vi.stubGlobal('caches', { default: {
    async match(request: Request) {
      const entry = entries.get(request.url);
      return entry && entry.expires > Date.now() ? entry.response.clone() : undefined;
    },
    async put(request: Request, response: Response) {
      entries.set(request.url, { response: response.clone(), expires: Date.now() + 300000 });
    },
    async delete(request: Request) { return entries.delete(request.url); }
  } });
  return entries;
}
function decision(key: string, note = '', status = 'approved') {
  return { id: crypto.randomUUID(), reviewer: 'Stacie Morris', change: { kind: 'decision', key, status, note } };
}

describe('Wheeler shared approvals', () => {
  it('shares calendar feedback and revised approval without changing cluster decisions', async () => {
    const app = setup(), token = await app.login();
    const articleKey = 'article:0737f9c8-d435-4b62-83f1-1b663ae7755d';
    await app.request('review', 'POST', decision(key1), token);
    expect((await app.request('review', 'POST', decision(articleKey, 'Include our project example.', 'changes'), token)).status).toBe(201);
    let read = await app.request('review', 'GET', undefined, await app.login());
    let state = reduceReview((await read.json() as { events: ReviewEvent[] }).events);
    expect(state.decisions[articleKey]?.status).toBe('changes');
    expect(state.decisions[articleKey]?.note).toBe('Include our project example.');
    expect((await app.request('review', 'POST', decision(articleKey, 'Include our project example.', 'approved'), token)).status).toBe(201);
    read = await app.request('review', 'GET', undefined, await app.login());
    state = reduceReview((await read.json() as { events: ReviewEvent[] }).events);
    expect(state.decisions[articleKey]?.status).toBe('approved');
    expect(state.decisions[articleKey]?.note).toBe('Include our project example.');
    expect(state.decisions[key1]?.status).toBe('approved');
    expect((await app.request('review', 'POST', decision('article:' + crypto.randomUUID()), token)).status).toBe(400);
  });

  it('shares backlink completion and reopening while preserving feedback', async () => {
    const app = setup(), token = await app.login();
    await app.request('review', 'POST', decision(key1, 'Keep this feedback.', 'changes'), token);
    for (const done of [true, false]) {
      const operation = { id: crypto.randomUUID(), reviewer: 'Stacie Morris', change: { kind: 'backlink', id: 1, done } };
      expect((await app.request('review', 'POST', operation, token)).status).toBe(201);
      const response = await app.request('review', 'GET', undefined, await app.login());
      const state = reduceReview((await response.json() as { events: ReviewEvent[] }).events);
      expect(state.backlinks['1']).toBe(done);
      expect(state.decisions[key1]?.note).toBe('Keep this feedback.');
    }
    for (const change of [{ kind: 'backlink', id: 20, done: true }, { kind: 'backlink', id: 1, done: 'yes' }]) {
      expect((await app.request('review', 'POST', { id: crypto.randomUUID(), reviewer: 'Miguel', change }, token)).status).toBe(400);
    }
  });
  it('reuses authenticated reads without repeatedly listing KV and expires the cache', async () => {
    const entries = installCache(), app = setup(), token = await app.login();
    const first = await app.request('review', 'GET', undefined, token);
    const second = await app.request('review', 'GET', undefined, await app.login(), 'http://localhost:4321');
    expect(first.headers.get('X-Wheeler-Review-Cache')).toBe('MISS');
    expect(second.headers.get('X-Wheeler-Review-Cache')).toBe('HIT');
    expect(second.headers.get('Cache-Control')).toBe('no-store');
    expect(second.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:4321');
    expect(app.list).toHaveBeenCalledTimes(1);
    expect((await app.request('review')).status).toBe(401);
    for (const entry of entries.values()) entry.expires = 0;
    await app.request('review', 'GET', undefined, token);
    expect(app.list).toHaveBeenCalledTimes(2);
  });
  it('invalidates the cached review after a durable save so another session sees the decision', async () => {
    installCache();
    const app = setup(), token = await app.login();
    await app.request('review', 'GET', undefined, token);
    expect((await app.request('review', 'POST', decision(key1), token)).status).toBe(201);
    const response = await app.request('review', 'GET', undefined, await app.login());
    const { events } = await response.json() as { events: ReviewEvent[] };
    expect(reduceReview(events).decisions[key1]?.status).toBe('approved');
    expect(app.list).toHaveBeenCalledTimes(2);
  });
  it('keeps reads and saves working when the optional cache fails', async () => {
    vi.stubGlobal('caches', { default: {
      async match() { throw new Error('Cache unavailable'); },
      async put() { throw new Error('Cache unavailable'); },
      async delete() { throw new Error('Cache unavailable'); }
    } });
    const app = setup(), token = await app.login();
    expect((await app.request('review', 'GET', undefined, token)).status).toBe(200);
    expect((await app.request('review', 'POST', decision(key1), token)).status).toBe(201);
  });
  it('requires a server-validated password and signed session for both reads and writes', async () => {
    const app = setup();
    expect((await app.request('session', 'POST', { password: 'wrong' })).status).toBe(401);
    expect((await app.request('review')).status).toBe(401);
    expect((await app.request('review', 'POST', decision(key1))).status).toBe(401);
    const token = await app.login();
    expect((await app.request('review', 'GET', undefined, token + 'x')).status).toBe(401);
    expect((await app.request('review', 'GET', undefined, token)).status).toBe(200);
  });
  it('shares independent decisions without replacing the other review or touching blog data', async () => {
    const app = setup(), token = await app.login();
    const responses = await Promise.all([
      app.request('review', 'POST', decision(key1), token),
      app.request('review', 'POST', decision(key2, 'Please include rebuild decisions.', 'changes'), token)
    ]);
    expect(responses.map(response => response.status)).toEqual([201, 201]);
    const read = await app.request('review', 'GET', undefined, await app.login());
    const { events } = await read.json() as { events: ReviewEvent[] };
    const state = reduceReview(events);
    expect(state.decisions[key1]?.status).toBe('approved');
    expect(state.decisions[key2]?.note).toBe('Please include rebuild decisions.');
    expect(state.decisions[key2]?.reviewer).toBe('Stacie Morris');
    expect(app.values.get('post:unrelated-blog')).toBe('{"title":"Unchanged"}');
    expect(events).toHaveLength(2);
    expect(read.headers.get('Cache-Control')).toBe('no-store');
  });
  it('returns the original acknowledgement when a failed connection causes a retry', async () => {
    const app = setup(), token = await app.login(), operation = decision(key1);
    const first = await (await app.request('review', 'POST', operation, token)).json();
    const retry = await (await app.request('review', 'POST', operation, token)).json();
    expect(retry).toEqual(first);
    expect(app.values.size).toBe(2);
  });
  it('keeps additions, edits, removal and restoration of ideas in a recoverable history', async () => {
    const app = setup(), token = await app.login();
    const idea = { id: crypto.randomUUID(), title: 'ADU decisions', description: 'What builders ask.' };
    const operations = [
      { kind: 'idea', idea }, { kind: 'idea', idea: { ...idea, title: 'ADU framing decisions' } },
      { kind: 'removeIdea', id: idea.id }, { kind: 'idea', idea }
    ];
    const events: ReviewEvent[] = [];
    for (const [index, change] of operations.entries()) {
      const response = await app.request('review', 'POST', { id: crypto.randomUUID(), reviewer: 'Miguel', change }, token);
      expect(response.status).toBe(201);
      const { event } = await response.json() as { event: ReviewEvent };
      events.push({ ...event, savedAt: new Date(1000 * index).toISOString() });
    }
    expect(reduceReview(events.slice(0, 2)).ideas[0]?.title).toBe('ADU framing decisions');
    expect(reduceReview(events.slice(0, 3)).ideas).toHaveLength(0);
    expect(reduceReview(events).ideas).toEqual([idea]);
    expect(app.values.size).toBe(5);
  });
  it('rejects unknown clusters, invalid status, empty feedback, and oversized ideas', async () => {
    const app = setup(), token = await app.login();
    for (const operation of [decision('not-a-cluster'), decision(key1, '', 'published'), decision(key1, '', 'changes'), {
      id: crypto.randomUUID(), reviewer: 'Stacie', change: { kind: 'idea', idea: { id: crypto.randomUUID(), title: 'x'.repeat(151), description: '' } }
    }]) expect((await app.request('review', 'POST', operation, token)).status).toBe(400);
    expect(app.values.size).toBe(1);
  });
  it('allows only configured website origins and fails clearly when not configured', async () => {
    const app = setup();
    const preflight = await app.request('review', 'OPTIONS');
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    const foreign = await app.request('session', 'POST', { password: 'test-workspace-password' }, undefined, 'https://another-site.test');
    expect(foreign.status).toBe(403);
    expect(foreign.headers.has('Access-Control-Allow-Origin')).toBe(false);
    delete app.env.WHEELER_WORKSPACE_PASSWORD;
    expect((await app.request('session', 'POST', { password: 'test-workspace-password' })).status).toBe(503);
  });
});
