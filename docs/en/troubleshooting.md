# Troubleshooting

[English](./troubleshooting.md) | [Português](../pt-BR/troubleshooting.md) · [Back to home](../../README.md)

Keep the development terminal visible: content errors usually identify the source file and field. If this is your first setup, follow [Getting started](getting-started.md) in order.

## Installation and commands

| Symptom | What to do |
|---|---|
| `node` or `npm` is not recognized | Install Node.js 24 LTS following [the setup guide](getting-started.md), then reopen your terminal and editor. Check `node --version` and `npm --version`. |
| Node version is too old | Confirm the version in the same terminal that runs npm. Another terminal or editor may still use an older installation. |
| npm cannot find `package.json` | Run commands inside the cloned repository, where `package.json` is located. |
| Dependency download fails | Read the npm error for network/proxy or registry issues, restore connectivity and rerun `npm install`. Avoid deleting the lockfile as a first fix. |
| Port 3000 is occupied | Open the URL printed by Next.js, or run `npm run dev -- --port 3001` and visit port 3001. |
| `npm start` says no production build exists | Run `npm run build` first, or use `npm run dev` while editing. |
| Production still shows old content | Rebuild, then restart `npm start`. Production does not rebuild automatically when you edit JSON. |
| `npm test` fails on `rm` or `for` under Windows | The test script uses POSIX shell syntax. Run it in WSL or configure npm to use Git Bash, for example `npm --script-shell="C:\Program Files\Git\bin\bash.exe" test` if Git is installed there. |

## Invalid content

An error may look like:

```text
[portfolio-content] Invalid content
src/content/projects/example-project.json: title.pt — Required default-locale translation
```

Open the indicated file, find the field and correct it. With the starter configuration, every localized text object needs a nonempty `pt` value. Optional translations can be omitted, but an explicit empty translation is invalid.

If the error happens before schema validation, check JSON syntax: double-quoted keys and strings, balanced brackets, no comments and no trailing commas. Unknown fields are rejected; use the [reference](content-reference.md) rather than inventing fields such as `tags`, `signalId` or `cover`.

| Content error | Likely correction |
|---|---|
| Duplicate ID or slug | Give every entity a unique ID and every entry a unique slug; also check the profile and cluster IDs. |
| Cluster does not exist | Use a current ID from `src/content/clusters.json`. |
| Relationship target does not exist | Point `targetId` or `relationTargetId` to an existing entity ID, and register the target node if needed. |
| Self-relation or duplicate relation | Remove the self-reference or repeated `type` + `targetId` pair. |
| Unsupported schema version | Keep `schemaVersion` and `contentSchemaVersion` at `1` for this engine. |
| Invalid year or metric value | Use strings such as `"2025"` and `"42%"`, not JSON numbers. |

## A new entry does not appear

Saving a file under `src/content/projects/` is not enough. Import it in `src/content/registry.ts`, add it once to `contentEntries`, and verify that its `cluster` is valid. The `data` property must reference the new import, not an existing example by mistake.

Expand the corresponding region in the scene or HTML explorer. If it appears in the explorer but is hard to see in the scene, first use `position: {"mode": "auto"}` and normal visual sizes. Manual coordinates can place nodes outside the useful view. Registry order also affects automatic placement.

## Images or resumes do not load

A URL `/assets/projects/my-project/cover.webp` refers to `public/assets/projects/my-project/cover.webp`. Check the exact filename, extension and case; a case mismatch may work on one filesystem and fail on another. Do not include `public` in the URL. Open the URL directly in the browser.

The asset validator rejects missing `/assets/` files, including configured resume PDFs. Add the file or remove the optional reference. Keep files under `public/assets/` so the default ignore rules allow them to be committed.

For remote images, use HTTPS and confirm the host allows browser access and cross-origin texture loading. An image visible in the HTML case may still be blocked as a WebGL texture. Prefer a local copy you are allowed to publish when you need reliable covers.

Removing an optional cover activates a procedural visual. It does not hide the node. Case images also have a visual fallback when loading fails.

## A contact action is disabled

The starter has no destinations. Configure the relevant action in `src/content/profile.json`:

- LinkedIn/GitHub: valid HTTPS `href`.
- Email: valid `email`, with optional `subject`.
- Resume: local or HTTPS `href`; for a locale object, provide a destination for the current language.

Localized resume URLs intentionally do not fall back to another language. If one PDF is suitable for both, use one `href` string. Verify the file itself before investigating browser download behavior.

## Languages show unexpected text

Content copy belongs in the profile or entry JSON; buttons and navigation belong in `src/content/messages/<locale>.json`. Editing one does not update the other.

Missing optional translations use `defaultLocale`. To make the interface fully translated, keep the default catalog's keys in the other catalog and translate their values. Blank strings and incompatible message types are errors, not fallback requests. Ensure the default message file exists, restart after configuration changes, and open the explicit locale route such as `/en`.

The README's default language and the `docs/pt-BR/` directory do not configure app routing. The starter app uses `/pt`, not `/pt-BR`.

## Signals, galleries or cases look unexpected

`showInOrbit: true` makes a signal eligible for the orbit, but the device's visual budget can limit how many appear. Check `importance` and `showInCase` separately. `visualWeight` currently has no rendering effect. Use explicit `relations` for connected-context buttons; `relationTargetId` alone does not create them.

If images appear twice, check whether you put them in both a gallery block and the top-level `gallery`. If text sections repeat, compare `content` with legacy `problem`, `solution`, `myRole` and `impact` fields. Cases follow the [documented display order](content-reference.md#case-display-order).

## The scene is slow or WebGL is unavailable

Try the reduced-motion control, close GPU-heavy tabs and check browser graphics support. The HTML career explorer and WebGL fallback let visitors reach the same content without relying on spatial targeting. Smaller images can reduce texture and download costs.

To return from a deep view, use Escape step by step or the home control. On mobile, use the guided controls. If the problem follows a code change, inspect the browser console and reproduce it with the unmodified starter before changing content coordinates to compensate.

## Tests fail after personalization

The content-system suite checks exact starter fixtures, including two entries and contacts without destinations. A customized portfolio may invalidate those expectations. Follow the [test guidance](build-your-portfolio.md#about-the-template-tests): update content-specific fixtures/expectations while preserving validation and behavioral coverage.

Deleting or renaming example JSON also requires updating imports in tests, not just the registry. TypeScript checks those imports during the application build. Removing a field accessed directly by tests, such as `example.gallery`, can fail type checking too. For the initial walkthrough, keep `"gallery": []`; for a broader cleanup, update the test fixture. If navigation, layout or schema tests fail, investigate them as possible regressions rather than assuming all failures are due to personalized copy.

## Reporting a problem

Include the command you ran, Node version, operating system, browser, exact error and smallest steps to reproduce it. For a content problem, a minimal generic JSON example and its registry entry are usually enough. Exclude private documents and credentials from reports.

---

[Previous: Architecture](architecture.md) · [Back to home](../../README.md)
