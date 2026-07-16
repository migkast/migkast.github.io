Miguel Casteleiro Growth Advisory
================================

Astro website for miguelcasteleiro.com.

Local development
-----------------

1. Run `npm install`
2. Run `npm run dev`
3. Open `http://localhost:4321/en/`

Production
----------

Run `npm run build`. The static site is generated in `dist/`.

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys
the `dist/` directory to GitHub Pages on pushes to `main` or `master`.

Languages
---------

Commercial pages are available in English, Portuguese, and Spanish under
`/en/`, `/pt/`, and `/es/`.

Booking
-------

The contact journey sends the initial context to migkast@gmail.com through
FormSubmit, then opens the configured Google Calendar appointment schedule.
FormSubmit requires the recipient to confirm its first activation email.
