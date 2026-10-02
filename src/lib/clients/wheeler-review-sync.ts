import { reduceReview, type ReviewChange, type ReviewEvent, type ReviewOperation, type SharedReviewState } from './wheeler-review';

export type SyncStatus = 'loading' | 'saving' | 'saved' | 'offline' | 'locked' | 'unconfigured';
type PendingOperation = ReviewOperation & { queuedAt: string };
export class WheelerReviewSync {
  private events = new Map<string, ReviewEvent>();
  private pending: PendingOperation[] = [];
  private token = '';
  private flushing = false;
  private reading = false;
  private nextAutomaticRefresh = 0;
  private stateSignature = '';
  private cacheKey: string;
  private tokenKey: string;
  constructor(private api: string, version: string, private onState: (state: SharedReviewState) => void, private onStatus: (status: SyncStatus) => void) {
    this.api = api.replace(/\/$/, '');
    // Keep local test decisions and sessions separate from the live workspace.
    this.cacheKey = `wheeler-shared-review-${version}:${this.api}`;
    this.tokenKey = `wheeler-workspace-session-v2:${this.api}`;
    try {
      this.token = sessionStorage.getItem(this.tokenKey) || '';
      const cached = JSON.parse(localStorage.getItem(this.cacheKey) || 'null');
      for (const event of cached?.events || []) this.events.set(event.id, event);
      this.pending = cached?.pending || [];
    } catch { /* Shared saving works even when browser storage is unavailable. */ }
  }
  async start() {
    if (!this.api) { this.onStatus('unconfigured'); return false; }
    if (!this.token) return false;
    return this.refresh();
  }
  async login(password: string) {
    if (!this.api) throw new Error('Shared approvals are not connected yet.');
    const response = await fetch(`${this.api}/session`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }), signal: AbortSignal.timeout(15000)
    });
    const body = await response.json() as { message?: string; token: string };
    if (!response.ok) throw new Error(body.message || 'Could not open the workspace. Please retry.');
    this.token = body.token;
    try { sessionStorage.setItem(this.tokenKey, this.token); } catch { /* Session persistence is optional. */ }
    if (!await this.refresh()) throw new Error('Could not load the shared review. Please retry.');
  }
  lock() {
    this.token = '';
    try { sessionStorage.removeItem(this.tokenKey); } catch { /* Lock still works. */ }
    this.onStatus('locked');
  }
  queue(change: ReviewChange, reviewer: string) {
    this.pending.push({ id: crypto.randomUUID(), reviewer: reviewer.trim() || 'Stacie Morris', change, queuedAt: new Date().toISOString() });
    this.persist();
    this.emitState();
    void this.flush();
  }
  hasPendingDecision(key: string) { return this.pending.some(operation => operation.change.kind === 'decision' && operation.change.key === key); }
  async refresh(force = true) {
    if (this.reading || !this.token) return false;
    if (!force && Date.now() < this.nextAutomaticRefresh) return true;
    this.nextAutomaticRefresh = Date.now() + 5 * 60 * 1000;
    this.reading = true;
    this.onStatus(this.pending.length ? 'saving' : 'loading');
    try {
      const response = await this.request('GET');
      const body = await response.json() as { events: ReviewEvent[] };
      for (const event of body.events as ReviewEvent[]) this.events.set(event.id, event);
      // Keep confirmed local events too: KV reads in another region can briefly lag.
      this.pending = this.pending.filter(operation => !this.events.has(operation.id));
      this.persist(); this.emitState();
      this.onStatus(this.pending.length ? 'saving' : 'saved');
      void this.flush();
      return true;
    } catch {
      this.nextAutomaticRefresh = Date.now() + 15 * 60 * 1000;
      if (this.token) this.onStatus('offline');
      return false;
    }
    finally { this.reading = false; }
  }
  private async flush() {
    if (this.flushing) return;
    if (!this.token || !this.api) { this.onStatus(this.api ? 'locked' : 'unconfigured'); return; }
    this.flushing = true;
    try {
      while (this.pending.length) {
        this.onStatus('saving');
        const operation = this.pending[0]!;
        const response = await this.request('POST', operation);
        const body = await response.json() as { event: ReviewEvent };
        this.events.set(body.event.id, body.event);
        this.pending = this.pending.filter(item => item.id !== operation.id);
        this.persist(); this.emitState();
      }
      this.onStatus('saved');
    } catch { if (this.token) this.onStatus('offline'); }
    finally { this.flushing = false; }
  }
  private async request(method: string, operation?: ReviewOperation) {
    const response = await fetch(`${this.api}/review`, {
      method, headers: { Authorization: `Bearer ${this.token}`, ...(operation ? { 'Content-Type': 'application/json' } : {}) },
      ...(operation ? { body: JSON.stringify(operation) } : {}), signal: AbortSignal.timeout(15000), cache: 'no-store'
    });
    if (response.status === 401) { this.lock(); throw new Error('Session expired'); }
    if (!response.ok) throw new Error('Could not sync review');
    return response;
  }
  private persist() {
    try { localStorage.setItem(this.cacheKey, JSON.stringify({ events: [...this.events.values()], pending: this.pending })); }
    catch { /* Do not claim offline persistence if the browser denies storage. */ }
  }
  private emitState() {
    const latest = Math.max(Date.now(), ...[...this.events.values()].map(event => Date.parse(event.savedAt)));
    const state = reduceReview([
      ...this.events.values(),
      ...this.pending.map((operation, index) => ({ ...operation, savedAt: new Date(latest + index + 1).toISOString() }))
    ]);
    const signature = JSON.stringify(state);
    if (signature !== this.stateSignature) { this.stateSignature = signature; this.onState(state); }
  }
}
