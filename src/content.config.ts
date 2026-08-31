import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const nullableStringArray = z.array(z.string()).nullable();
const isoDatetime = z.iso.datetime({ offset: true });

const blog = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/blog' }),
  schema: z.object({
    payload_version: z.literal(2),
    id: z.uuid(),
    created_at: isoDatetime.nullable(),
    published_at: isoDatetime.nullable(),
    title: z.string().min(1),
    content_html: z.string().min(1),
    content_markdown: z.string().nullable(),
    content: z.string(),
    excerpt: z.string(),
    slug: z.string().min(1),
    meta_description: z.string().nullable(),
    meta_title: z.string().nullable(),
    tags: nullableStringArray,
    keywords: nullableStringArray,
    json_ld: z.record(z.string(), z.unknown()).nullable(),
    status: z.literal('published'),
    timestamp: isoDatetime
  })
});

export const collections = { blog };
