import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => data.status === 'published');

  return posts.sort((left, right) => postTime(right) - postTime(left));
}
export function postDate(post: BlogPost): string {
  return post.data.published_at || post.data.created_at || post.data.timestamp;
}

export function formatPostDate(post: BlogPost): string {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(postDate(post)));
}

export function postDescription(post: BlogPost): string {
  return post.data.meta_description?.trim()
    || post.data.excerpt.trim()
    || plainText(post.data.content_html).slice(0, 160);
}

function postTime(post: BlogPost): number {
  return new Date(postDate(post)).getTime();
}

function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
