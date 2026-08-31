import type { SeoForGptPayload } from './types';
import { HttpError } from './validation';

export function normalizeBlogStructuredData(
  jsonLd: Record<string, unknown> | null,
  payload: SeoForGptPayload,
  canonicalUrl: string
): Record<string, unknown> | null {
  if (!jsonLd) {
    if (payload.status === 'published') throw new HttpError(422, 'json_ld must include BlogPosting markup for published posts');
    return null;
  }

  const normalized = structuredClone(jsonLd);
  const blogPosts = findTypedNodes(normalized, 'BlogPosting');
  if (payload.status === 'published' && blogPosts.length === 0) {
    throw new HttpError(422, 'json_ld must include BlogPosting markup for published posts');
  }

  normalized['@context'] = 'https://schema.org';
  const publishedAt = payload.published_at || payload.created_at || payload.timestamp;
  const siteUrl = new URL('/', canonicalUrl).href;
  const author = {
    '@type': 'Person',
    name: 'Miguel Casteleiro',
    url: siteUrl
  };

  blogPosts.forEach((post) => {
    post.headline = payload.title;
    post.datePublished = publishedAt;
    post.dateModified = payload.timestamp;
    post.url = canonicalUrl;
    post.mainEntityOfPage = { '@type': 'WebPage', '@id': canonicalUrl };
    post.author = author;
    post.publisher = author;
  });

  return normalized;
}

function findTypedNodes(value: unknown, type: string, matches: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    value.forEach((item) => findTypedNodes(item, type, matches));
    return matches;
  }
  if (!isRecord(value)) return matches;

  const schemaType = value['@type'];
  if (schemaType === type || (Array.isArray(schemaType) && schemaType.includes(type))) matches.push(value);
  Object.values(value).forEach((item) => findTypedNodes(item, type, matches));
  return matches;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
