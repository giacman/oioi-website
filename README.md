[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/StartBootstrap/startbootstrap-creative/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/startbootstrap-creative.svg)](https://www.npmjs.com/package/startbootstrap-creative)
[![Netlify Status](https://api.netlify.com/api/v1/badges/d05bdf5b-4f46-4ac4-8a3e-05caf4dccf77/deploy-status)](https://app.netlify.com/projects/oioi-website/deploys)

## OIOI Jewellery — Website

Official website for OIOI Jewellery. Contemporary design, artisanal craft, made in Flornce, Italy.

- Live site: [oioijewellery.it](https://oioijewellery.it)

### Overview

This repository contains the static site for OIOI Jewellery. It’s a customized adaptation of the
“Creative” theme by Start Bootstrap with brand copy, styles, and sections tailored to OIOI.

## Tech stack

- Sources in `src/` (Pug, SCSS, Bootstrap 5) → build output in `dist/` (HTML/CSS/JS)
- Build toolchain: Node 18 (Pug, Sass, PostCSS, BrowserSync)
- Hosting & deploy: Netlify (build `npm ci && npm run build`, publish `dist/`)
- CMS: DatoCMS (optional build-time source for `about` + category pages, with local fallbacks)
- Key components:
  - Pug templates (`src/pug/index.pug`)
  - Modular SCSS (`src/scss/...`) with custom variables
  - Netlify Forms for the contact form (with success page)
- Supporting CI: manual GitHub Pages workflow for previews (no CNAME)

## Local development

Prerequisites: Node 18.

```bash
npm ci
npm start      # dev server with live reload (http://localhost:3000)
npm run build  # production build
```

Project structure:

- `src/` → sources (assets, pug, scss, js)
- `dist/` → static build artifacts
- `docs/datocms-content-model.md` → DatoCMS schema and field mapping
- `docs/editorial-playbook.md` → editorial workflow and QA checklist

## DatoCMS integration

Build-time content is fetched from DatoCMS when `DATOCMS_API_TOKEN` is present. If missing (or fetch fails), the site builds using local defaults.

Environment variables:

- `DATOCMS_API_TOKEN` (read-only content delivery token)
- `DATOCMS_ENV` (optional, defaults to `main`)
- `DATOCMS_API_URL` (optional, defaults to `https://graphql.datocms.com/`)
- `CMS_FALLBACK_MODE` (optional: `dev-only` | `always` | `never`, defaults to `dev-only`)

Fallback behavior:

- `dev-only` (recommended): local/staging can use fallback, production fails fast without Dato data
- `always`: fallback always allowed
- `never`: Dato always required

The build also generates marketing-ready asset feeds:

- `dist/feeds/marketing-assets-en.json` and `.csv`
- `dist/feeds/marketing-assets-it.json` and `.csv`

These are built from category gallery data and include social/email metadata (`channels`, captions, campaign tags, usage rights).
Homepage cards are also CMS-driven through category fields (`homepageCard*`), so new collection cards can be added/updated without editing `index.pug`.

## Deployment

- Netlify builds from `main` and publishes `dist/`
- Domain: `oioijewellery.it` with HTTPS enabled
- Contact submissions are handled by Netlify Forms (enable email notifications in Netlify)
- Add `DATOCMS_API_TOKEN` in Netlify environment variables
- Configure a DatoCMS publish webhook to trigger the Netlify build hook

## License

Base theme under [MIT](https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE). Customizations and content © OIOI Jewellery.
