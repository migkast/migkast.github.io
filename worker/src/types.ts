export type PostStatus = 'draft' | 'published';

export interface SeoForGptPayload {
  payload_version: 2;
  id: string;
  created_at: string | null;
  published_at: string | null;
  title: string;
  content_html: string;
  content_markdown: string | null;
  content: string;
  excerpt: string;
  slug: string | null;
  meta_description: string | null;
  meta_title: string | null;
  tags: string[] | null;
  keywords: string[] | null;
  json_ld: Record<string, unknown> | null;
  status: PostStatus;
  timestamp: string;
}
export interface StoredBlogPost extends Omit<SeoForGptPayload, 'slug'> {
  slug: string;
}

export interface Env {
  BLOG_POSTS: KVNamespace;
  WEBHOOK_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  SITE_ORIGIN: string;
}
