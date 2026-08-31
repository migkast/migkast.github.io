# SEOforGPT blog webhook

Cloudflare Worker that receives SEOforGPT payload-version-2 blog webhooks, stores private state in Workers KV, and publishes sanitized posts to this Astro repository through GitHub's Contents API.

Articles with a visible FAQ section must include matching `FAQPage` JSON-LD. The Worker validates every `Question` and `acceptedAnswer` against the visible article and returns an actionable `422` response when the markup is incomplete or inconsistent.

## Routes

- `GET /health` returns `{ "status": "ok" }`.
- `POST /webhook` accepts the SEOforGPT JSON payload and requires `X-Webhook-Secret`.

## Local verification

```sh
npm install
npm run check
npm test
```

For local Worker execution, create an ignored `.dev.vars` file containing `WEBHOOK_SECRET` and `GITHUB_TOKEN`, then run `npm run dev`.

## Deployment

1. Create the `BLOG_POSTS` KV namespace and place its namespace id in `wrangler.jsonc`.
2. Set `WEBHOOK_SECRET` and `GITHUB_TOKEN` with `wrangler secret put`.
3. Run `npm run deploy`.
4. Enter the resulting `/webhook` URL and the matching webhook secret in SEOforGPT Blog Automation.

The GitHub token must be fine-grained, limited to `migkast/migkast.github.io`, and grant only repository **Contents: write** permission.
