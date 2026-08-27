import { HttpError } from './validation';
import type { Env, StoredBlogPost } from './types';

type Fetcher = typeof fetch;

interface GitHubContentResponse {
  sha: string;
  content?: string;
  encoding?: string;
}
export async function publishToGitHub(post: StoredBlogPost, env: Env, fetcher: Fetcher): Promise<void> {
  const path = `src/content/blog/${post.id}.json`;
  const current = await getGitHubFile(path, env, fetcher);
  const serialized = `${JSON.stringify(post, null, 2)}\n`;

  if (current?.content && current.encoding === 'base64' && decodeBase64(current.content) === serialized) return;

  const response = await githubRequest(path, env, fetcher, {
    method: 'PUT',
    body: JSON.stringify({
      message: `blog: publish ${post.id}`,
      content: encodeBase64(serialized),
      branch: env.GITHUB_BRANCH,
      ...(current ? { sha: current.sha } : {})
    })
  });

  if (!response.ok) await throwGitHubError(response, 'publish the post');
}

export async function removeFromGitHub(id: string, env: Env, fetcher: Fetcher): Promise<void> {
  const path = `src/content/blog/${id}.json`;
  const current = await getGitHubFile(path, env, fetcher);
  if (!current) return;

  const response = await githubRequest(path, env, fetcher, {
    method: 'DELETE',
    body: JSON.stringify({
      message: `blog: return ${id} to draft`,
      sha: current.sha,
      branch: env.GITHUB_BRANCH
    })
  });

  if (!response.ok) await throwGitHubError(response, 'remove the published post');
}

async function getGitHubFile(path: string, env: Env, fetcher: Fetcher): Promise<GitHubContentResponse | null> {
  const response = await githubRequest(path, env, fetcher, {
    method: 'GET',
    query: `?ref=${encodeURIComponent(env.GITHUB_BRANCH)}`
  });
  if (response.status === 404) return null;
  if (!response.ok) await throwGitHubError(response, 'read the current post');
  return response.json<GitHubContentResponse>();
}

async function githubRequest(
  path: string,
  env: Env,
  fetcher: Fetcher,
  options: { method: string; body?: string; query?: string }
): Promise<Response> {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const url = `https://api.github.com/repos/${encodeURIComponent(env.GITHUB_OWNER)}/${encodeURIComponent(env.GITHUB_REPO)}/contents/${encodedPath}${options.query || ''}`;
  return fetcher(url, {
    method: options.method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'miguel-blog-webhook',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: options.body,
    signal: AbortSignal.timeout(10_000)
  });
}

async function throwGitHubError(response: Response, action: string): Promise<never> {
  let detail = '';
  try {
    const body = await response.json<{ message?: string }>();
    detail = body.message ? `: ${body.message}` : '';
  } catch {
    // Keep the stable fallback message when GitHub does not return JSON.
  }
  if (response.status === 409) throw new HttpError(409, `GitHub conflict while trying to ${action}; retry the webhook${detail}`);
  if (response.status === 422) throw new HttpError(422, `GitHub rejected the post while trying to ${action}${detail}`);
  if (response.status === 401 || response.status === 403) throw new HttpError(503, `GitHub authorization or rate limit prevented the webhook from completing${detail}`);
  throw new HttpError(502, `GitHub could not ${action}${detail}`);
}

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (let index = 0; index < bytes.length; index += 8192) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
  }
  return btoa(binary);
}

function decodeBase64(value: string): string {
  const binary = atob(value.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
