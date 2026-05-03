# DatoCMS Content Model (OIOI Website)

This project consumes DatoCMS data at build-time. If DatoCMS is unavailable, local defaults are used.

## Models

### `aboutPage` (single instance)

- `heading` (string, localized)
- `seoTitle` (string, localized)
- `seoDescription` (text, localized)
- `introParagraphs` (string list, localized)
- `introClosing` (string, localized)
- `heroImage` (asset)
- `sections` (modular/JSON list)
  - `title` (string, localized)
  - `paragraphs` (string list, localized)
  - `image` (asset, optional)
- `contactIntro` (string, localized)
- `contactCalligraphy` (string, localized)

### `categoryPage` (collection)

- `slug` (string, unique, not localized)
  - expected values: `matricaria`, `things`, `they-them`, `opera`
- `displayTitle` (string, localized)
- `pageUrl` (string, optional)
- `subtitle` (string, localized)
- `seoTitle` (string, localized)
- `seoDescription` (text, localized)
- `ogImage` (asset)
- `homepageCardEnabled` (boolean, default true)
- `homepageCardOrder` (integer)
- `homepageCardTitle` (string, localized)
- `homepageCardAlt` (string, localized)
- `homepageCardImage` (asset)
- `homepageCardUrl` (string URL, optional; defaults to `pageUrl` / `shopUrl`)
- `shopUrl` (string URL)
- `shopCollectionHandle` (string)
- `descriptionOpening` (string, localized, optional)
- `descriptionParagraphs` (string list, localized)
- `descriptionClosing` (string list, localized, optional)
- `variants` (string list, localized, optional)
- `extraNotes` (string list, localized, optional)
- `gallery` (modular/JSON list)
  - `url` (string URL or asset URL)
  - `alt` (string, localized)
  - `channels` (string list) -> allowed values: `web`, `social`, `email`
  - `socialCaption` (text, localized, optional)
  - `emailCaption` (text, localized, optional)
  - `campaignTag` (string, optional)
  - `usageRights` (string, optional)
  - `focalPoint` (object, optional) `{ x: number, y: number }`

## Localization

- Configure at least `en` and `it`.
- Build script queries locale-specific content (`SiteLocale`) and uses fallback to `en`.

## Build-time integration

- Script: `scripts/build-pug.js`
- Dato client: `scripts/datocms-client.js`
- Default fallback: `scripts/cms-default-content.js`

Required environment variables:

- `DATOCMS_API_TOKEN` (read-only CDA token)
- `DATOCMS_ENV` (optional, defaults to `main`)
- `DATOCMS_API_URL` (optional, defaults to `https://graphql.datocms.com/`)
- `CMS_FALLBACK_MODE` (optional: `dev-only` | `always` | `never`, default `dev-only`)

Fallback policy:

- `dev-only`: fallback allowed only outside production context (recommended)
- `always`: fallback always allowed
- `never`: fallback disabled in all contexts

With `dev-only`, production builds fail if `DATOCMS_API_TOKEN` is missing or Dato fetch fails.

## Marketing outputs generated at build

For each locale:

- `dist/feeds/marketing-assets-<locale>.json`
- `dist/feeds/marketing-assets-<locale>.csv`

These feeds are generated from `categoryPage.gallery` and include social/email metadata.
