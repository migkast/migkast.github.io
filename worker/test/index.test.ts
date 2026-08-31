import { describe, expect, it } from 'vitest';
import { handleRequest } from '../src/index';
import { sanitizeArticleHtml } from '../src/sanitize';
import type { Env, StoredBlogPost } from '../src/types';

const basePayload = {
  payload_version: 2,
  id: '550e8400-e29b-41d4-a716-446655440000',
  created_at: '2026-05-08T10:00:00.000Z',
  published_at: '2026-05-08T10:05:00.000Z',
  title: 'Example title',
  content_html: '<h1>Opening</h1><p>Article body</p>',
  content_markdown: '# Opening\n\nArticle body',
  content: '<h1>Opening</h1><p>Article body</p>',
  excerpt: 'Short summary',
  slug: 'example-title',
  meta_description: 'Meta description',
  meta_title: 'Meta title',
  tags: ['Growth'],
  keywords: ['e-commerce growth'],
  json_ld: { '@context': 'https://schema.org', '@type': 'BlogPosting' },
  status: 'published',
  timestamp: '2026-05-08T10:05:00.000Z'
} as const;

describe('article sanitizer', () => {
  it('preserves semantic content while removing executable markup', () => {
    const result = sanitizeArticleHtml('<h1>Title</h1><p onclick="bad()">Text <a href="javascript:bad()">bad</a></p><script>alert(1)</script>');
    expect(result).toContain('<h2>Title</h2>');
    expect(result).toContain('<p>Text <a>bad</a></p>');
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('script');
    expect(result).not.toContain('javascript:');
  });

  it('prevents opener access on every link that opens a new tab', () => {
    const result = sanitizeArticleHtml('<a href="/contact/" target="_blank" rel="opener">Contact</a>');
    expect(result).toBe('<a href="/contact/" target="_blank" rel="noopener noreferrer">Contact</a>');
  });
});

describe('webhook handler', () => {
  it('publishes an authenticated SEOforGPT payload and returns its canonical URL', async () => {
    const setup = createSetup();
    const response = await invoke(setup.env, setup.github.fetch, basePayload);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      cms_post_id: basePayload.id,
      cms_url: 'https://miguelcasteleiro.com/blog/example-title/'
    });
    const stored = JSON.parse(setup.github.files.get(`src/content/blog/${basePayload.id}.json`)!.content);
    expect(stored.content_html).toContain('<h2>Opening</h2>');
    expect(stored.json_ld).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: basePayload.title,
      datePublished: basePayload.published_at,
      dateModified: basePayload.timestamp,
      url: 'https://miguelcasteleiro.com/blog/example-title/',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://miguelcasteleiro.com/blog/example-title/' },
      author: { '@type': 'Person', name: 'Miguel Casteleiro' }
    });
  });

  it('keeps a derived slug stable across updates and avoids duplicate commits', async () => {
    const setup = createSetup();
    const first = { ...basePayload, slug: null };
    await invoke(setup.env, setup.github.fetch, first);
    const callsAfterFirst = setup.github.writeCount;
    await invoke(setup.env, setup.github.fetch, { ...first, title: 'A renamed article' });
    const stored = JSON.parse(setup.github.files.get(`src/content/blog/${basePayload.id}.json`)!.content);
    expect(stored.slug).toBe('example-title');
    await invoke(setup.env, setup.github.fetch, { ...first, title: 'A renamed article' });
    expect(setup.github.writeCount).toBe(callsAfterFirst + 1);
  });

  it('uses a deterministic suffix when another post owns the requested slug', async () => {
    const setup = createSetup();
    await setup.env.BLOG_POSTS.put('slug:example-title', 'another-id');
    const response = await invoke(setup.env, setup.github.fetch, basePayload);
    expect(((await response.json()) as { cms_url: string }).cms_url).toContain('/blog/example-title-550e8400/');
  });

  it('stores drafts privately and removes a previously published file', async () => {
    const setup = createSetup();
    await invoke(setup.env, setup.github.fetch, basePayload);
    const response = await invoke(setup.env, setup.github.fetch, { ...basePayload, status: 'draft', published_at: null });
    expect(response.status).toBe(200);
    expect(setup.github.files.has(`src/content/blog/${basePayload.id}.json`)).toBe(false);
    const privatePost = await setup.env.BLOG_POSTS.get<StoredBlogPost>(`post:${basePayload.id}`, 'json');
    expect(privatePost?.status).toBe('draft');
  });

  it('rejects invalid authentication, JSON, version and content type', async () => {
    const setup = createSetup();
    const badSecret = await invoke(setup.env, setup.github.fetch, basePayload, 'wrong');
    expect(badSecret.status).toBe(401);

    const badVersion = await invoke(setup.env, setup.github.fetch, { ...basePayload, payload_version: 1 });
    expect(badVersion.status).toBe(400);

    const malformed = await handleRequest(new Request('https://worker.test/webhook', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': 'test-secret' }, body: '{'
    }), setup.env, setup.github.fetch);
    expect(malformed.status).toBe(400);

    const wrongType = await handleRequest(new Request('https://worker.test/webhook', {
      method: 'POST', headers: { 'Content-Type': 'text/plain', 'X-Webhook-Secret': 'test-secret' }, body: '{}'
    }), setup.env, setup.github.fetch);
    expect(wrongType.status).toBe(415);

    const jsonp = await handleRequest(new Request('https://worker.test/webhook', {
      method: 'POST', headers: { 'Content-Type': 'application/jsonp', 'X-Webhook-Secret': 'test-secret' }, body: '{}'
    }), setup.env, setup.github.fetch);
    expect(jsonp.status).toBe(415);
  });

  it('accepts ISO timestamps with offsets and rejects dates that would break Astro content validation', async () => {
    const setup = createSetup();
    const validOffset = await invoke(setup.env, setup.github.fetch, {
      ...basePayload,
      timestamp: '2026-05-08T12:05:00+02:00'
    });
    expect(validOffset.status).toBe(200);

    for (const timestamp of ['May 8, 2026', '2026-05-08', '2026-02-31T10:05:00.000Z']) {
      const response = await invoke(setup.env, setup.github.fetch, { ...basePayload, timestamp });
      expect(response.status).toBe(422);
    }
  });

  it('accepts complete FAQPage markup that matches the visible FAQ', async () => {
    const setup = createSetup();
    const payload = withFaq(basePayload);
    const response = await invoke(setup.env, setup.github.fetch, payload);
    expect(response.status).toBe(200);
  });

  it('rejects a published post without BlogPosting structured data', async () => {
    const setup = createSetup();
    const response = await invoke(setup.env, setup.github.fetch, { ...basePayload, json_ld: null });
    expect(response.status).toBe(422);
    expect(((await response.json()) as { message: string }).message).toContain('BlogPosting');
  });

  it('rejects a visible FAQ without FAQPage markup', async () => {
    const setup = createSetup();
    const payload = { ...basePayload, content_html: '<h2>FAQ</h2><h3>What is this?</h3><p>A useful answer.</p>' };
    const response = await invoke(setup.env, setup.github.fetch, payload);
    expect(response.status).toBe(422);
    expect(((await response.json()) as { message: string }).message).toContain('FAQPage');
  });

  it('rejects FAQPage answers that are not visible in the article', async () => {
    const setup = createSetup();
    const payload = withFaq(basePayload);
    const faqPage = (payload.json_ld['@graph'] as Array<Record<string, unknown>>)[1]!;
    const question = (faqPage.mainEntity as Array<Record<string, unknown>>)[0]!;
    question.acceptedAnswer = { '@type': 'Answer', text: 'A different hidden answer.' };
    const response = await invoke(setup.env, setup.github.fetch, payload);
    expect(response.status).toBe(422);
    expect(((await response.json()) as { message: string }).message).toContain('visible article');
  });

  it('returns a retryable error when GitHub is unavailable', async () => {
    const setup = createSetup();
    const failedFetch: typeof fetch = async () => new Response(JSON.stringify({ message: 'service unavailable' }), { status: 500 });
    const response = await invoke(setup.env, failedFetch, basePayload);
    expect(response.status).toBe(502);
    expect(((await response.json()) as { message: string }).message).toContain('GitHub');
  });

  it('serves a non-sensitive health endpoint', async () => {
    const setup = createSetup();
    const response = await handleRequest(new Request('https://worker.test/health'), setup.env, setup.github.fetch);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });
});

async function invoke(env: Env, fetcher: typeof fetch, payload: unknown, secret = 'test-secret'): Promise<Response> {
  return handleRequest(new Request('https://worker.test/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': secret },
    body: JSON.stringify(payload)
  }), env, fetcher);
}

function createSetup() {
  const kv = new MemoryKv();
  const github = new MemoryGitHub();
  const env = {
    BLOG_POSTS: kv,
    WEBHOOK_SECRET: 'test-secret',
    GITHUB_TOKEN: 'github-token',
    GITHUB_OWNER: 'migkast',
    GITHUB_REPO: 'migkast.github.io',
    GITHUB_BRANCH: 'main',
    SITE_ORIGIN: 'https://miguelcasteleiro.com'
  } as unknown as Env;
  return { env, github };
}

function withFaq(payload: typeof basePayload) {
  return {
    ...payload,
    content_html: '<h2>FAQ</h2><h3>What is this?</h3><p>A useful answer.</p>',
    json_ld: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'BlogPosting', headline: payload.title },
        {
          '@type': 'FAQPage',
          mainEntity: [{
            '@type': 'Question',
            name: 'What is this?',
            acceptedAnswer: { '@type': 'Answer', text: 'A useful answer.' }
          }]
        }
      ]
    }
  };
}

class MemoryKv {
  private values = new Map<string, string>();

  async get<T = string>(key: string, type?: string): Promise<T | null> {
    const value = this.values.get(key);
    if (value === undefined) return null;
    return (type === 'json' ? JSON.parse(value) : value) as T;
  }

  async put(key: string, value: string): Promise<void> { this.values.set(key, value); }
  async delete(key: string): Promise<void> { this.values.delete(key); }
}

class MemoryGitHub {
  files = new Map<string, { content: string; sha: string }>();
  writeCount = 0;

  fetch: typeof fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    const marker = '/contents/';
    const path = url.pathname.slice(url.pathname.indexOf(marker) + marker.length).split('/').map(decodeURIComponent).join('/');
    const method = init?.method || 'GET';
    const existing = this.files.get(path);

    if (method === 'GET') {
      if (!existing) return jsonResponse({ message: 'Not Found' }, 404);
      return jsonResponse({ sha: existing.sha, encoding: 'base64', content: toBase64(existing.content) }, 200);
    }
    const body = JSON.parse(String(init?.body || '{}'));
    if (method === 'PUT') {
      const content = fromBase64(body.content);
      const sha = `sha-${this.writeCount + 1}`;
      this.files.set(path, { content, sha });
      this.writeCount += 1;
      return jsonResponse({ content: { sha } }, existing ? 200 : 201);
    }
    if (method === 'DELETE') {
      this.files.delete(path);
      this.writeCount += 1;
      return jsonResponse({}, 200);
    }
    return jsonResponse({ message: 'unsupported' }, 500);
  };
}

function toBase64(value: string): string { return Buffer.from(value, 'utf8').toString('base64'); }
function fromBase64(value: string): string { return Buffer.from(value, 'base64').toString('utf8'); }
function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
