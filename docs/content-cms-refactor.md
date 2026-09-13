# File-based content architecture

The content refactor preserves the V2 renderer, spatial anchors, camera behavior, image reconstruction, identity orbit and fixed case shell. The default content is a generic profile, one example project and one connected experience; the other two clusters start empty.

## Authoring boundary

- `src/content/profile.json` owns identity copy and actions. The intro name derives from the canonical identity title.
- `src/content/clusters.json` owns cluster IDs, labels and visual configuration.
- `src/content/{projects,experience,education,talks}/*.json` contains one versioned document per entity.
- `src/content/registry.ts` imports and registers each entity once. This deliberately retains a small explicit registry instead of adding a generated index or client filesystem discovery. File names accompany entries in validation errors.
- `portfolio.config.ts` controls locales, default locale, language labels, engine brand and supported schema version.
- UI catalogs live in `src/content/messages`; personal copy belongs to the profile. Missing optional translations fall back to the configured default. Locale-specific resume destinations deliberately do not fall back to a different language.

The existing node field names (`kind`, `cluster`, `title`, `summary`) remain. Project media is now `coverImage`; identity media remains `image`. Both use the same image metadata schema and reconstruction hook. `signals` replaces the authored satellite collection. The orbit and case filter it independently; density limits and motion remain in the engine. Empty tag collections were removed rather than retained as a parallel semantic source.

`relations` supplies the graph and connected-context controls. Validation rejects missing targets, self-relations, identical duplicated edges and duplicate graph IDs. Profile signal references also resolve against the graph.

## Editorial content and media

`CaseContentRenderer` adds five block types after the fixed shell: text, image, gallery, metric and link. Safe presentation enums keep image placement within the case column. The existing optional evidence fields remain supported. Missing sections stay hidden.

A cover is independent of the optional, unrestricted gallery. Images support localized alt text/captions and optional semantic roles; roles do not control pixel coordinates. Missing optional covers use the existing procedural fallback. Failed image loads in cases also use that fallback.

`content-assets.server.ts` checks referenced `/assets/` files during page generation and development requests. It never enters the client bundle. Language catalogs are explicitly included in traced deployments, following [Next.js output-file tracing guidance](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

The registered `projects/example-project.json` demonstrates text, image, metric and link blocks, a two-image gallery, cover, signals and a relation to `experience/example-experience.json`. Its four SVGs were created locally for the repository. A gallery block is also supported for positioning images within the editorial flow. Contacts have no destinations and the illustrative metric is explicitly labeled as fictional.

## Verification

Verification uses the existing npm/TypeScript/node:test stack and an external local Playwright/Chromium harness; no browser-testing dependency was added to the application.

- Existing navigation, zoom boundary, spatial separation, selection, graph and satellite tests remain in place. The spacing test uses five synthetic projects so the two-entry demo does not weaken coverage of crowded scenes.
- New tests exercise all current JSON, schema versions, multiple/absent galleries, editorial ordering, safe image metadata, custom locales/clusters, locale fallback, signal visibility, invalid relations, missing assets and UI-catalog fallback.
- An isolated copy builds with `locales: ["es"]`, a corresponding default content fixture and generic content registered. This checks single-locale routing, not the accuracy of translated copy.
- Browser checks cover the identity, overview, example project case/context/orbit, PT/EN switching, keyboard navigation and responsive layout. The example fixture checks all editorial block types and actual image loading on desktop/mobile.

No second repository, deployment, CMS service, database or new application dependency is introduced.
