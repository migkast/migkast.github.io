# SEOforGPT blog webhook

Cloudflare Worker that receives SEOforGPT payload-version-2 blog webhooks, stores private state in Workers KV, and publishes sanitized posts to this Astro repository through GitHub's Contents API.

Articles with a visible FAQ section must include matching `FAQPage` JSON-LD. The Worker validates every `Question` and `acceptedAnswer` against the visible article and returns an actionable `422` response when the markup is incomplete or inconsistent.

Published posts must include `BlogPosting` JSON-LD. Before publishing, the Worker aligns site-owned facts—the canonical URL, visible publication and modification dates, headline, author and publisher—with the persisted article so structured data cannot contradict the page.

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

## Wheeler shared review

The same Worker now serves password-protected content-direction approvals at:

- `POST /clients/wheeler/session`: validate the workspace password and return a signed 12-hour session.
- `GET /clients/wheeler/review`: read the shared decisions and cluster ideas.
- `POST /clients/wheeler/review`: save one decision, idea update or recoverable idea removal.

Set `WHEELER_WORKSPACE_PASSWORD` with `wrangler secret put WHEELER_WORKSPACE_PASSWORD` before deployment. The dashboard defaults to `https://miguel-blog-webhook.hey-948.workers.dev/clients/wheeler`; `PUBLIC_WHEELER_REVIEW_API` can override it. For a fully local preview, set that override to `http://localhost:8787/clients/wheeler`, put the password in ignored `worker/.dev.vars` and run `npm run dev -- --local --port 8787` in `worker/`.

The review uses immutable event records under `workspace:wheeler:2026-09-30-v1:event:` in the existing `BLOG_POSTS` KV namespace. It never edits blog keys, publishes articles, or sends email. Approving a direction is separate from approving an article for publication. Distinct decisions cannot overwrite a whole review; the latest event wins when both users change the same item. Idea removal is reversible and retains history.

The Worker caches authenticated review reads at each edge location for five minutes, avoiding a KV history listing for every refresh. Successful writes invalidate that location’s cache; cache failures never block a durable save. Browser responses remain private and uncached, and every read still requires a valid signed session.

The dashboard checks for updates every five minutes while visible and recently active, pauses after ten minutes of inactivity, and backs off failed automatic reads for fifteen minutes. Saves are sent immediately, with failed changes queued locally for retry. Other users’ updates can take roughly ten minutes plus KV propagation to appear across locations. Acknowledged local events are retained so a delayed read cannot undo a confirmed save. The UI confirms shared saving only after server acknowledgement. The reviewer’s name is supplied by the user, not an independently verified identity.

CORS allows the configured website, its `www` host and local previews. Both reading and writing require the signed session; the preview-only JavaScript gate is no longer used for this workspace. The original proposal gate is unchanged.

### Updating the content directions

Existing cluster copy is kept in `src/lib/clients/wheeler-clusters.json`. Keep a direction's `key` unchanged when editing its copy so its shared decisions remain attached. After publishing a material change, use **Reopen review** in that direction to ask for another decision; existing feedback is retained. This does not publish an article or populate the calendar. Adding a new direction also requires adding its key to the Worker's allowed cluster keys.
