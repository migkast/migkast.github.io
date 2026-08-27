import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const blogDirectory = resolve('src/content/blog');
const blogLastModified = new Map();

if (existsSync(blogDirectory)) {
  for (const filename of readdirSync(blogDirectory).filter((name) => name.endsWith('.json'))) {
    try {
      const post = JSON.parse(readFileSync(resolve(blogDirectory, filename), 'utf8'));
      if (post.status === 'published' && post.slug) {
        blogLastModified.set(`/blog/${post.slug}/`, post.timestamp || post.published_at || post.created_at);
      }
    } catch {
      // Astro's content validation will report malformed content with better context.
    }
  }
}

export default defineConfig({
  site: 'https://miguelcasteleiro.com',
  output: 'static',
  integrations: [sitemap({
    filter: (page) => !new URL(page).pathname.startsWith('/en/'),
    serialize(item) {
      const lastModified = blogLastModified.get(new URL(item.url).pathname);
      if (lastModified) item.lastmod = new Date(lastModified);
      return item;
    }
  })],
  build: { format: 'directory' }
});
