Miguel Casteleiro Growth Advisory
================================

Astro website for miguelcasteleiro.com.

Local development
-----------------

1. Run `npm install`
2. Run `npm run dev`
3. Open `http://localhost:4321/`

Production
----------

Run `npm run build`. The static site is generated in `dist/`.

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys
the `dist/` directory to GitHub Pages on pushes to `main` or `master`.

Languages
---------

English commercial pages use the root routes. Portuguese and Spanish are
available under `/pt/` and `/es/`.

Booking
-------

The contact journey sends the initial context to migkast@gmail.com through
FormSubmit, then opens the configured Google Calendar appointment schedule.
FormSubmit requires the recipient to confirm its first activation email.

Blog automation
---------------

English blog posts are generated at `/blog/` from JSON files in
`src/content/blog/`. The Cloudflare Worker in `worker/` receives authenticated
SEOforGPT payload-version-2 webhooks, sanitizes article HTML, stores drafts in
private Workers KV, and creates or removes published content files through the
GitHub API. Each resulting repository commit triggers the existing GitHub Pages
deployment workflow.
