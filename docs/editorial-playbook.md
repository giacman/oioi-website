# Editorial Playbook (Web + Social + Email)

## Roles

- **Admin**: schema changes, permissions, token rotation
- **Reviewer**: validates copy, SEO, legal/image rights
- **Editor**: updates page copy, images, campaign metadata

## Asset conventions

- File naming: `<campaign>-<category>-<sequence>`
  - example: `ss26-matricaria-01`
- Preferred channels:
  - `web`: site gallery and OG usage
  - `social`: ad/social repurposing
  - `email`: newsletter blocks/hero
- Minimum metadata on every asset:
  - `alt`
  - `channels`
  - `campaignTag`
  - `usageRights`

## QA checklist before publish

1. SEO
   - `seoTitle` and `seoDescription` present
   - `ogImage` present and high quality
2. Accessibility
   - non-empty `alt` text for all gallery images
3. Cross-channel readiness
   - at least one gallery item flagged `social`
   - at least one gallery item flagged `email`
   - caption fields filled where relevant
4. Legal/commercial safety
   - `usageRights` confirmed
   - `shopUrl` verified for shoppable categories

## Publishing workflow

1. Editor updates records in DatoCMS
2. Reviewer validates with checklist
3. Publish in DatoCMS
4. Dato webhook triggers Netlify build
5. Netlify publishes website + refreshed feeds in `dist/feeds/`

## Rollback

- Prefer DatoCMS content version rollback first.
- If needed, rollback deploy in Netlify.
- Keep weekly backup of generated `marketing-assets-*.json` in external storage.
