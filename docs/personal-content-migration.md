# Personal content migration

The personal instance uses the existing `src/content/` registry and schemas. The migration source remains intact and is not imported or served at runtime. No renderer, camera, navigation, shader, layout, locale configuration, or dependency was changed.

## Migrated content

- Profile: original bilingual identity, introduction, metadata and six signals. LinkedIn, GitHub and email use the supplied destinations; email uses the existing encoded subject/mailto action.
- Projects: Aitheron, Multi-Agent Tariff Intelligence, PN Extractor, Enterprise LLM Infrastructure and DocGuard, in the original placement order. Original signals, technologies, visual metadata, importance, confidentiality and provisional flags remain.
- The Portuguese source resume supplies Aitheron's dataset/pipeline description and MLP, XGBoost and Random Forest; the provided English resume supplies the existing English equivalent. The tariff project also receives the source pipeline description and editorial integration paragraph.
- Experience: Becomex – Software Developer (AI Team), original responsibilities and source interval/location. Its three professional projects remain separate canonical entities connected by relations.
- Education: Software Engineering at Católica de Santa Catarina, connected to Aitheron. The source's in-progress/expected-2025 status is retained, without inferring graduation.
- Community: the resume documents AI/automation talks (GDG Joinville, Católica and internal talks) and internal GenAI workshops. These are two aggregate activity records, with `speaker` and `workshop-host` roles; no individual event title, date, attendee record or employer association was inferred.
- Four clusters retain their geometry, labels and colors. Only the source's two personalized cluster descriptions replace generic copy. Interface catalogs already match the source and remain unchanged.

## Public assets

The three supplied files were moved from `public/assets/projects/example-project/` without renaming or changing their bytes:

| Asset | Configured URL |
| --- | --- |
| Profile photograph | `/assets/identity/perfil.jpg` |
| Portuguese PDF | `/assets/resume/curriculo.pdf` |
| English PDF | `/assets/resume/resume.pdf` |

The configured `pt` locale has language tag `pt-BR`; its resume action selects the Portuguese PDF. `en` selects the English PDF. Existing resolver behavior is unchanged: an unconfigured resume locale remains unavailable rather than linking to a document in an unexpected language. Configure another locale's resume destination when adding it.

The source's old `/curriculo.pdf` reference has been replaced. No real project covers, galleries, diagrams, event photos or project URLs were present. Procedural media fallbacks remain in use. The supplied square photograph is rendered by the existing centered 16:9 image crop, which clips the top of the portrait; a suitably framed landscape image is still needed for this unchanged image renderer.

## Preserved editorial uncertainty

- Enterprise LLM Infrastructure stays visible as requested.
- The source README explicitly identifies project metrics as provisional/unverified. AUROC 0.99+, +70% efficiency, 6h → ~15min and ~98% accuracy are preserved in canonical `signals`, with both `showInOrbit` and `showInCase` disabled pending confirmation. They remain present in the delivered resume files, whose bytes were not edited.
- The PDF additionally contains SLA figures (second-best SLA, 99.5%, previous 77–81%) and -96% TOIL. These have not been promoted to case evidence while the source's verification/confidentiality concern is unresolved. They remain available in the original and supplied resumes.
- PN Extractor, DocGuard and Enterprise LLM Infrastructure still have the original provisional case descriptions; no replacement case narrative, dates, links or outcomes were invented.
- Becomex's `Oct 2023 – Present` interval and the education `expected 2025` status are source statements, not independently confirmed current facts. Both entries retain their provisional flag and need an editorial update.
- The English resume additionally mentions an internship-to-AI-Lab transition and developer mentoring, without equivalent detailed Portuguese source copy. Those English-only details remain in the resume; no Portuguese translation, dated role, or standalone mentoring event was invented.
- No missing translations exist for registered required fields; absent optional editorial information remains absent. English content comes from existing JSON or the supplied English PDF.
- The two historical community placeholder events are not registered. The generic example project/experience are not registered either; their files and SVGs remain available for existing schema/layout tests and template documentation.

## Validation

- 55 existing tests pass, including updated personal-instance expectations, schema/graph validation, contact destinations and local asset checks. Invalid-data and configurable-locale tests remain intact.
- `npm run typecheck` and `npm run build` pass. No lint script is configured.
- A SHA-256 inventory confirms all 17 migration-source files are unchanged. Every configured local asset exists under `public/`.
- Chromium production checks pass at 1440px in Portuguese and 320px in English: all nine cases, relation controls, overview/identity, actual PDF downloads, locale retention and WebGL-unavailable fallback. No page or console errors were reported. Screenshots are in `/tmp/vector-space-evidence/personal-*.png`; touch/mobile checks use browser emulation.
- HTTP checks return 200 with exact file bytes for the photo and both PDFs, and 404 for private migration files and source JSON URLs.
