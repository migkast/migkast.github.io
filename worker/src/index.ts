import { publishToGitHub, removeFromGitHub } from './github';
import { sanitizeArticleHtml } from './sanitize';
import type { Env, StoredBlogPost } from './types';
import { HttpError, validatePayload } from './validation';

const MAX_REQUEST_BYTES = 900_000;
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env, fetch);
  }
} satisfies ExportedHandler<Env>;

export async function handleRequest(request: Request, env: Env, fetcher: typeof fetch): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === '/health') {
    if (request.method !== 'GET') return json({ message: 'Method not allowed' }, 405, { Allow: 'GET' });
    return json({ status: 'ok' }, 200);
  }

  if (url.pathname !== '/webhook') return json({ message: 'Not found' }, 404);
  if (request.method !== 'POST') return json({ message: 'Method not allowed' }, 405, { Allow: 'POST' });

  try {
    await authenticate(request.headers.get('X-Webhook-Secret'), env.WEBHOOK_SECRET);
    enforceJsonContentType(request.headers.get('Content-Type'));
    const input = await readJson(request);
    const payload = validatePayload(input);
    const existing = await env.BLOG_POSTS.get<StoredBlogPost>(`post:${payload.id}`, 'json');
    const slug = await resolveSlug(payload.slug, payload.title, payload.id, existing, env.BLOG_POSTS);
    const contentHtml = sanitizeArticleHtml(payload.content_html);
    if (!contentHtml) throw new HttpError(422, 'content_html is empty after removing unsafe markup');

    const post: StoredBlogPost = {
      ...payload,
      slug,
      content_html: contentHtml,
      content: contentHtml
    };

    await persistPost(post, existing, env.BLOG_POSTS);
    if (post.status === 'published') await publishToGitHub(post, env, fetcher);
    else await removeFromGitHub(post.id, env, fetcher);

    const origin = env.SITE_ORIGIN.replace(/\/+$/, '');
    return json({ cms_post_id: post.id, cms_url: `${origin}/blog/${post.slug}/` }, 200);
  } catch (error) {
    if (error instanceof HttpError) return json({ message: error.message }, error.status);
    console.error('Unhandled blog webhook error', error);
    return json({ message: 'The webhook could not be completed' }, 500);
  }
}
async function readJson(request: Request): Promise<unknown> {
  const contentLength = Number(request.headers.get('Content-Length') || '0');
  if (contentLength > MAX_REQUEST_BYTES) throw new HttpError(413, 'Request body is too large');
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) throw new HttpError(413, 'Request body is too large');
  try {
    return JSON.parse(body);
  } catch {
    throw new HttpError(400, 'Request body must contain valid JSON');
  }
}

function enforceJsonContentType(contentType: string | null): void {
  if (!contentType?.toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json');
  }
}

async function authenticate(provided: string | null, expected: string): Promise<void> {
  if (!provided || !expected) throw new HttpError(401, 'Invalid webhook secret');
  const encoder = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected))
  ]);
  const leftBytes = new Uint8Array(left);
  const rightBytes = new Uint8Array(right);
  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) difference |= leftBytes[index]! ^ rightBytes[index]!;
  if (difference !== 0) throw new HttpError(401, 'Invalid webhook secret');
}

async function resolveSlug(
  requestedSlug: string | null,
  title: string,
  id: string,
  existing: StoredBlogPost | null,
  store: KVNamespace
): Promise<string> {
  if (requestedSlug === null && existing?.slug) return existing.slug;
  const base = slugify(requestedSlug || title) || `post-${id.slice(0, 8)}`;
  const owner = await store.get(`slug:${base}`);
  return owner && owner !== id ? `${base}-${id.slice(0, 8)}` : base;
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
    .replace(/-+$/g, '');
}

async function persistPost(post: StoredBlogPost, existing: StoredBlogPost | null, store: KVNamespace): Promise<void> {
  await Promise.all([
    store.put(`post:${post.id}`, JSON.stringify(post)),
    store.put(`slug:${post.slug}`, post.id)
  ]);
  if (existing?.slug && existing.slug !== post.slug) await store.delete(`slug:${existing.slug}`);
}

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...extraHeaders } });
}
