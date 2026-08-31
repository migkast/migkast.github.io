import type { SeoForGptPayload } from './types';
import { articleText } from './sanitize';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_TITLE_LENGTH = 300;
const MAX_SLUG_LENGTH = 300;
const MAX_EXCERPT_LENGTH = 2_000;
const MAX_ARRAY_ITEMS = 50;
const MAX_ARRAY_ITEM_LENGTH = 120;
const ISO_DATETIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}
export function validatePayload(input: unknown): SeoForGptPayload {
  if (!isRecord(input)) throw new HttpError(400, 'Request body must be a JSON object');
  if (input.payload_version !== 2) throw new HttpError(400, 'payload_version 2 is required');

  const id = requiredString(input.id, 'id', 36);
  if (!UUID_PATTERN.test(id)) throw new HttpError(422, 'id must be a valid UUID');

  const title = requiredString(input.title, 'title', MAX_TITLE_LENGTH);
  const contentHtml = requiredString(input.content_html, 'content_html', 850_000);
  const content = requiredString(input.content, 'content', 850_000);
  const excerpt = stringValue(input.excerpt, 'excerpt', MAX_EXCERPT_LENGTH);
  const status = input.status;
  if (status !== 'draft' && status !== 'published') {
    throw new HttpError(422, 'status must be "draft" or "published"');
  }

  return {
    payload_version: 2,
    id,
    created_at: nullableIsoDate(input.created_at, 'created_at'),
    published_at: nullableIsoDate(input.published_at, 'published_at'),
    title,
    content_html: contentHtml,
    content_markdown: nullableString(input.content_markdown, 'content_markdown', 850_000),
    content,
    excerpt,
    slug: nullableString(input.slug, 'slug', MAX_SLUG_LENGTH, false),
    meta_description: nullableString(input.meta_description, 'meta_description', 500),
    meta_title: nullableString(input.meta_title, 'meta_title', MAX_TITLE_LENGTH),
    tags: nullableStringArray(input.tags, 'tags'),
    keywords: nullableStringArray(input.keywords, 'keywords'),
    json_ld: nullableObject(input.json_ld, 'json_ld'),
    status,
    timestamp: isoDate(input.timestamp, 'timestamp')
  };
}

export function validateFaqStructuredData(jsonLd: Record<string, unknown> | null, contentHtml: string): void {
  const faqSection = findFaqHeading(contentHtml);
  const faqPage = findTypedNode(jsonLd, 'FAQPage');

  if (faqSection && !faqPage) {
    throw new HttpError(422, 'json_ld must include FAQPage markup when the article contains an FAQ section');
  }
  if (!faqPage) return;

  const entities = faqPage.mainEntity;
  if (!Array.isArray(entities) || entities.length === 0) {
    throw new HttpError(422, 'json_ld FAQPage.mainEntity must be a non-empty array');
  }

  const visibleText = normalizeText(articleText(contentHtml));
  entities.forEach((entity, index) => {
    if (!isRecord(entity) || !hasType(entity, 'Question')) {
      throw new HttpError(422, `json_ld FAQPage.mainEntity[${index}] must be a Question`);
    }

    const question = nonEmptySchemaText(entity.name);
    if (!question) throw new HttpError(422, `json_ld FAQ question ${index + 1} must have a name`);

    const answer = entity.acceptedAnswer;
    if (!isRecord(answer) || !hasType(answer, 'Answer')) {
      throw new HttpError(422, `json_ld FAQ question ${index + 1} must have an acceptedAnswer of type Answer`);
    }
    const answerText = nonEmptySchemaText(answer.text);
    if (!answerText) throw new HttpError(422, `json_ld FAQ answer ${index + 1} must have text`);

    if (!visibleText.includes(normalizeText(question)) || !visibleText.includes(normalizeText(answerText))) {
      throw new HttpError(422, `json_ld FAQ question ${index + 1} and its answer must appear in the visible article`);
    }
  });
}

function requiredString(value: unknown, field: string, maxLength: number): string {
  const result = stringValue(value, field, maxLength).trim();
  if (!result) throw new HttpError(422, `${field} must be a non-empty string`);
  return result;
}

function stringValue(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== 'string') throw new HttpError(422, `${field} must be a string`);
  if (value.length > maxLength) throw new HttpError(422, `${field} is too long`);
  return value;
}

function nullableString(value: unknown, field: string, maxLength: number, allowEmpty = true): string | null {
  if (value === null) return null;
  const result = stringValue(value, field, maxLength);
  if (!allowEmpty && !result.trim()) throw new HttpError(422, `${field} must be null or a non-empty string`);
  return result;
}

function nullableStringArray(value: unknown, field: string): string[] | null {
  if (value === null) return null;
  if (!Array.isArray(value)) throw new HttpError(422, `${field} must be an array of strings or null`);
  if (value.length > MAX_ARRAY_ITEMS) throw new HttpError(422, `${field} contains too many items`);
  return value.map((item, index) => {
    if (typeof item !== 'string' || !item.trim()) throw new HttpError(422, `${field}[${index}] must be a non-empty string`);
    if (item.length > MAX_ARRAY_ITEM_LENGTH) throw new HttpError(422, `${field}[${index}] is too long`);
    return item.trim();
  });
}

function nullableObject(value: unknown, field: string): Record<string, unknown> | null {
  if (value === null) return null;
  if (!isRecord(value)) throw new HttpError(422, `${field} must be an object or null`);
  return value;
}

function findFaqHeading(html: string): boolean {
  return [...html.matchAll(/<h2>([\s\S]*?)<\/h2>/gi)].some((match) => {
    const heading = normalizeText(articleText(match[1] || ''));
    return heading === 'faq' || heading === 'faqs' || heading === 'frequently asked questions';
  });
}

function findTypedNode(value: unknown, type: string): Record<string, unknown> | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findTypedNode(item, type);
      if (match) return match;
    }
    return null;
  }
  if (!isRecord(value)) return null;
  if (hasType(value, type)) return value;
  for (const child of Object.values(value)) {
    const match = findTypedNode(child, type);
    if (match) return match;
  }
  return null;
}

function hasType(value: Record<string, unknown>, type: string): boolean {
  const schemaType = value['@type'];
  return schemaType === type || (Array.isArray(schemaType) && schemaType.includes(type));
}

function nonEmptySchemaText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const text = articleText(value).trim();
  return text || null;
}

function normalizeText(value: string): string {
  return value.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

function nullableIsoDate(value: unknown, field: string): string | null {
  if (value === null) return null;
  return isoDate(value, field);
}

function isoDate(value: unknown, field: string): string {
  if (typeof value !== 'string' || !isIsoDatetime(value)) {
    throw new HttpError(422, `${field} must be a valid ISO date string`);
  }
  return value;
}

function isIsoDatetime(value: string): boolean {
  const match = ISO_DATETIME_PATTERN.exec(value);
  if (!match || Number.isNaN(Date.parse(value))) return false;

  const [, yearText, monthText, dayText, hourText, minuteText, secondText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  if (hour > 23 || minute > 59 || second > 59) return false;

  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  return calendarDate.getUTCFullYear() === year
    && calendarDate.getUTCMonth() === month - 1
    && calendarDate.getUTCDate() === day;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
