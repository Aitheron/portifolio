# V2 career graph — template maintenance

The engine renders a central identity, configurable career clusters, project micro-universes and HTML cases. The distributed content is generic: one project, one experience and two empty clusters. Add real content through JSON and the registry.

## Preserve when customizing

- A single spatial anchor per entity, with typed relations resolving to existing IDs.
- Identity satellites visible from overview; project satellites subject to the existing proximity and focus rules.
- Shared signals for orbit labels and case context, with independent visibility controls.
- Cover fragmentation and procedural fallback, including low-quality dissolve and reduced motion.
- Node → cluster → overview navigation, cursor-oriented zoom, camera boundaries and selection readiness.
- Direct case opening from project previews, dialog focus restoration and keyboard access through the semantic explorer.
- Responsive satellite budgets and mobile navigation without requiring a desktop pointer.

## Verification workflow

Run `npm test`, `npm run typecheck` and `npm run build`. The spacing test deliberately uses five synthetic projects even though the starter has only one project.

Check the browser at 320, 768, 1024 and 1440 pixels:

1. Enter through the language gateway and inspect the central identity.
2. Confirm contact controls remain disabled until destinations are configured.
3. Open the project through the semantic explorer and inspect its orbit, cover and case.
4. Confirm the case includes project context, connected experience, editorial images, an explicitly illustrative metric and both gallery images.
5. Navigate to the connected experience and return through project, cluster and overview.
6. Expand the empty education/community clusters and verify their empty states.
7. Switch languages without losing context; check keyboard navigation, reduced motion and WebGL fallback.
8. Check console errors, image loading, overflow, dialog focus and accessibility in the rendered page.

Keep performance constraints in the rendering engine rather than adding content-specific camera or layout logic. Use supported visual variants and controlled editorial presentation values.

See [content architecture](../content-cms-refactor.md) and the [customization guide](../../README.md).
