/// <reference lib="dom" />
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WheelerReviewSync } from '../../src/lib/clients/wheeler-review-sync';
import type { ReviewOperation } from '../../src/lib/clients/wheeler-review';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-02T10:00:00Z'));
  const values = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (key: string) => values.get(key) || null, setItem: (key: string, value: string) => values.set(key, value) });
  vi.stubGlobal('sessionStorage', { getItem: () => 'test-session', setItem: vi.fn(), removeItem: vi.fn() });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const change = { kind: 'decision' as const, key: 'project-specific-package-handoffs', status: 'approved' as const, note: '' };

describe('Wheeler refresh and saving', () => {
  it('restores saved backlink completion after closing and reopening the dashboard', async () => {
    const events: unknown[] = [];
    vi.stubGlobal('fetch', vi.fn(async (_url: unknown, options: RequestInit) => {
      if (options.method === 'POST') {
        const operation = JSON.parse(options.body as string) as ReviewOperation;
        const event = { ...operation, savedAt: new Date().toISOString() };
        events.push(event);
        return response({ event }, 201);
      }
      return response({ events });
    }));
    const status = vi.fn();
    const first = new WheelerReviewSync('https://worker.test/clients/wheeler', 'test', vi.fn(), status);
    await first.start();
    first.queue({ kind: 'backlink', id: 19, done: true }, 'Stacie Morris');
    await vi.waitFor(() => expect(events).toHaveLength(1));
    await vi.waitFor(() => expect(status).toHaveBeenLastCalledWith('saved'));
    const reopenedState = vi.fn();
    const reopened = new WheelerReviewSync('https://worker.test/clients/wheeler', 'test', reopenedState, vi.fn());
    await reopened.start();
    expect(reopenedState.mock.lastCall?.[0].backlinks['19']).toBe(true);
    reopened.queue({ kind: 'backlink', id: 19, done: false }, 'Stacie Morris');
    await vi.waitFor(() => expect(events).toHaveLength(2));
    expect(reopenedState.mock.lastCall?.[0].backlinks['19']).toBe(false);
  });
  it('throttles automatic reads to five minutes while allowing an explicit refresh', async () => {
    const fetcher = vi.fn(async () => response({ events: [] }));
    vi.stubGlobal('fetch', fetcher);
    const sync = new WheelerReviewSync('https://worker.test/clients/wheeler', 'test', vi.fn(), vi.fn());
    await sync.start();
    for (let i = 0; i < 5; i++) await sync.refresh(false);
    expect(fetcher).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(300000);
    await sync.refresh(false);
    expect(fetcher).toHaveBeenCalledTimes(2);
    await sync.refresh();
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it('saves decisions immediately even when automatic reads are throttled', async () => {
    const state = vi.fn();
    const fetcher = vi.fn(async (_url: unknown, options: RequestInit) => {
      if (options.method === 'POST') {
        const operation = JSON.parse(options.body as string) as ReviewOperation;
        return response({ event: { ...operation, savedAt: new Date().toISOString() } }, 201);
      }
      return response({ events: [] });
    });
    vi.stubGlobal('fetch', fetcher);
    const sync = new WheelerReviewSync('https://worker.test/clients/wheeler', 'test', state, vi.fn());
    await sync.start();
    sync.queue(change, 'Stacie Morris');
    await vi.waitFor(() => expect(sync.hasPendingDecision(change.key)).toBe(false));
    expect(fetcher.mock.calls.filter(([, options]) => options.method === 'POST')).toHaveLength(1);
    expect(state.mock.lastCall?.[0].decisions[change.key].status).toBe('approved');
  });
  it('backs off failed automatic reads but lets the user retry immediately', async () => {
    let online = false;
    const fetcher = vi.fn(async () => online ? response({ events: [] }) : response({}, 503));
    vi.stubGlobal('fetch', fetcher);
    const sync = new WheelerReviewSync('https://worker.test/clients/wheeler', 'test', vi.fn(), vi.fn());
    expect(await sync.start()).toBe(false);
    vi.advanceTimersByTime(300000);
    await sync.refresh(false);
    expect(fetcher).toHaveBeenCalledTimes(1);
    online = true;
    expect(await sync.refresh()).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('retains a failed save and sends it on retry without losing feedback', async () => {
    let online = false;
    const fetcher = vi.fn(async (_url: unknown, options: RequestInit) => {
      if (options.method === 'POST') {
        if (!online) return response({}, 503);
        const operation = JSON.parse(options.body as string) as ReviewOperation;
        return response({ event: { ...operation, savedAt: new Date().toISOString() } }, 201);
      }
      return response({ events: [] });
    });
    vi.stubGlobal('fetch', fetcher);
    const status = vi.fn();
    const sync = new WheelerReviewSync('https://worker.test/clients/wheeler', 'test', vi.fn(), status);
    await sync.start();
    sync.queue({ ...change, status: 'changes', note: 'Please include crew training.' }, 'Stacie Morris');
    await vi.waitFor(() => expect(status).toHaveBeenLastCalledWith('offline'));
    expect(sync.hasPendingDecision(change.key)).toBe(true);
    online = true;
    await sync.refresh();
    await vi.waitFor(() => expect(sync.hasPendingDecision(change.key)).toBe(false));
    const posted = JSON.parse(fetcher.mock.calls.filter(([, options]) => options.method === 'POST').at(-1)![1].body as string);
    expect(posted.change.note).toBe('Please include crew training.');
  });
});
