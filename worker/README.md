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

The dashboard loads shared decisions when opened or reloaded, with no automatic polling or tab-focus reads. Failed requests can be explicitly retried; reconnecting also retries queued changes. Saves are sent immediately, with failed changes queued locally for retry. Reloads may return a server snapshot up to five minutes old, plus KV propagation across locations. Acknowledged local events are retained so a delayed read cannot undo a confirmed save. The UI confirms shared saving only after server acknowledgement. The reviewer’s name is supplied by the user, not an independently verified identity.

CORS allows the configured website, its `www` host and local previews. Both reading and writing require the signed session; the preview-only JavaScript gate is no longer used for this workspace. The original proposal gate is unchanged.

### Updating the content directions

Existing cluster copy is kept in `src/lib/clients/wheeler-clusters.json`. Keep a direction's `key` unchanged when editing its copy so its shared decisions remain attached. After publishing a material change, use **Reopen review** in that direction to ask for another decision; existing feedback is retained. This does not publish an article or populate the calendar. Adding a new direction also requires adding its key to the Worker's allowed cluster keys.

## Wheeler unified analytics

The **Analytics** sidebar view reads GA4 users/page views, Google Search clicks/impressions/CTR/position with top pages and queries, GA4 traffic sources with users and sessions, and Bing daily clicks/impressions. It uses the existing Wheeler session and never changes approvals, answers, blog posts, or historical monitoring runs.

Website traffic also shows a compact inquiry/contact summary. A separate GA4 `eventCount` report reads `generate_lead`, `phone_click`, `email_click`, `kit_request`, and `ask_don_entry` for the two production Wheeler hostnames. Labels and tracking start dates live in `src/lib/clients/wheeler-analytics-conversions.ts`. Kit and Ask Don rules began on 25 October 2026; earlier periods show the tracking start date rather than zero, and overlapping periods count only events recorded after the rules began. These distinct actions are not added into a combined lead total. If this request fails, traffic remains available and conversion figures show unavailable rather than zero.

### Connection setup

Wheeler uses the isolated Google Cloud project `wheeler-dashboard-analytics` (project number `529511894928`), created on 22 October 2026. Keep SEOforGPT’s `seoforgpt` project, existing clients and shared consent settings unchanged. No billing account is to be linked for this setup.

An existing Google OAuth **Web application** client can be reused if it represents software you control and its consent-screen settings allow the Google account managing Wheeler. Add a redirect URI; do not replace the other software’s redirect URIs. A separate client in the same project is also suitable.

1. Enable **Google Analytics Data API** and **Google Search Console API** in that Google Cloud project.
2. Add these read-only consent scopes:
   - `https://www.googleapis.com/auth/analytics.readonly`
   - `https://www.googleapis.com/auth/webmasters.readonly`
3. Add the production authorized redirect URI exactly:
   `https://miguel-blog-webhook.hey-948.workers.dev/clients/wheeler/analytics/google/callback`
   For a local-only test, add `http://localhost:8787/clients/wheeler/analytics/google/callback` and access that Worker host consistently.
4. Configure Worker secrets using `wrangler secret put`:
   - `WHEELER_GOOGLE_CLIENT_ID`
   - `WHEELER_GOOGLE_CLIENT_SECRET`
   - `WHEELER_ANALYTICS_ENCRYPTION_KEY` — a base64-encoded, cryptographically random 32-byte key. Generate it locally; do not use the workspace password. Keep it stable: replacing it requires reconnecting both sources.
5. Configure the numeric **GA4 property ID** (not the `G-` measurement ID) and exact verified GSC/Bing properties through the authenticated `/clients/wheeler/analytics/config` endpoint. The client-facing dashboard intentionally has no connection controls. Domain properties must be `sc-domain:getwheelersteel.com`; URL-prefix properties must be the HTTPS root URL of getwheelersteel.com or www.getwheelersteel.com. Select the account with GA4 report access and Search Console access when connecting Google.
6. For Bing, obtain the **Bing Webmaster Tools API key** from the account with the verified Wheeler site. In local development, open `/clients/wheeler/?connect=bing#analytics` while signed into the workspace to use the password-masked connection dialog. This form is excluded from production builds. Never put the key in chat or a source file. The server verifies a read request before saving it. Only reporting endpoints are called.

Google external apps in Testing need the Wheeler account added as a test user; Google may expire their refresh tokens after seven days. For ongoing access, use appropriate production/verification settings. Do not change the existing software’s publishing status without reviewing its requirements. No API keys, client secrets or refresh tokens are embedded in the static website.

### Storage and refresh

Credentials are AES-GCM encrypted under dedicated `analytics:wheeler:v1:` keys in the existing KV namespace. Only authenticated workspace users can configure or read analytics. OAuth uses an authenticated start, a random expiring state, one-time authorization codes and PKCE. The callback redirects to the fixed dashboard URL; it does not put tokens in browser URLs. Disconnect removes this dashboard’s saved credential and snapshots, not Google’s global account grant or any review records.

All sources use 7-, 28- or 90-day windows ending three days ago. GA4 uses deduplicated `totalUsers` for the summary, a separate report per page and a separate daily report; user rows are not summed. Google search uses final Web data and independent summary, date, page and query requests (up to 100 detail rows). Bing uses the supported REST/JSON `GetRankAndTrafficStats` method; dates outside the selected window are excluded. An empty Bing response is missing data, not zero traffic.

Opening Analytics refreshes snapshots older than one hour. The explicit refresh button bypasses that hour but retains a 60-second cooldown. Requests in one Worker isolate are coalesced. Independent source failures retain each source’s last successful report and original timestamp with an error label. Provider data can lag behind the selected end date; fetch time and latest reported day are separate. This is not real-time analytics.

The current documented APIs used here do not expose the separate Google generative-AI report or Bing AI-citation report. The Analytics view therefore omits AI visibility reporting rather than inventing AI click metrics or substituting prompt-monitoring scores. Official references:
- https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport
- https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- https://developers.google.com/identity/protocols/oauth2/web-server
- https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c
- https://learn.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi.getrankandtrafficstats?view=bing-webmaster-dotnet

Deploy the Worker before the static dashboard when publication is approved. Live account data cannot be verified until credentials and property access are configured. For local drafts use `PUBLIC_WHEELER_REVIEW_API=http://localhost:8787/clients/wheeler`, set Worker `SITE_ORIGIN` to the draft origin, and keep all secrets in ignored `worker/.dev.vars`.

For production migration, install the same Analytics encryption key with the two Google client secrets, then copy only the encrypted `analytics:wheeler:v1:google`, `analytics:wheeler:v1:bing`, and `analytics:wheeler:v1:config` records. Do not copy local snapshots, OAuth states, or review records. Deploy the Worker before publishing the static site, then verify all three sources through the authenticated live endpoint.

Bing can return HTTP 400 with `ErrorCode: 17` (`ThrottleIP`) for shared hosting egress addresses. The dashboard reports this as a rate limit and retains the last successful report with its original fetch time; it does not substitute zeroes or claim the source refreshed successfully. A one-time deployment seed may use a verified API report for the exact same date window, with the live error retained and `checkedAt: 0` so normal refresh behavior resumes.
