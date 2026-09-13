# Content reference

[English](./content-reference.md) | [Português](../pt-BR/content-reference.md) · [Back to home](../../README.md)

Use this page to look up the content contract after following [Build your portfolio](build-your-portfolio.md). The authoritative implementation is [portfolio-schema.ts](../../src/lib/portfolio-schema.ts), with shared types in [portfolio-types.ts](../../src/lib/portfolio-types.ts).

## Shared rules

- Content uses JSON with `schemaVersion: 1`. The current engine supports version 1 only; changing the number does not migrate content.
- Schema objects reject unknown fields. An unsupported field is an error, not an extension point.
- IDs and slugs use lowercase letters, digits and single hyphen separators, such as `community-map`. Entity IDs must be unique across the profile, clusters and registered entries. Entry slugs must also be unique.
- A localized text is an object such as `{"pt": "Projeto", "en": "Project"}`. The configured default language is required. Other missing translations fall back to the default. A provided translation cannot be blank.
- Optional fields can be omitted. Do not replace an absent image with an empty object or an absent translation with an empty string.
- Content text is plain text, not Markdown or executable HTML.

## Languages and configuration

[portfolio.config.ts](../../portfolio.config.ts) is the shared configuration:

| Field | Meaning |
|---|---|
| `defaultLocale` | Default application language; must appear in `locales`. The starter uses `pt`. |
| `locales` | Nonempty list of unique, valid locale identifiers. The starter uses `pt` and `en`. |
| `localeLabels` | Selector labels by locale: `label`, `code` and optional `languageTag`. A missing entry falls back to the locale identifier. |
| `branding.spaceName` | Space name used by the interface. |
| `contentSchemaVersion` | Supported content version, currently `1`. |

Documentation uses the folder name `pt-BR`; the starter application uses the locale identifier `pt`. Those names serve different purposes. Making the README English does not change the app's default language.

To add a language, for example Spanish:

1. Add `"es"` to `locales`, and an `es` entry to `localeLabels`.
2. Add `es` translations to localized content fields as desired. Missing translations use `defaultLocale`.
3. Copy the default interface message file to `src/content/messages/es.json` and translate its values, keeping the same keys.
4. Configure any language-specific resume destination you want to enable.
5. Restart development, open `/es`, and run `npm run build`.

Interface messages are loaded from `src/content/messages/<locale>.json`. Missing optional language files or missing keys use default-language messages. Invalid JSON, empty strings or invalid value types fail validation. Translate the existing default message keys; additional keys in an optional language do not extend the default message structure.

Before changing `defaultLocale`, ensure every localized content field has a value in the new default language and its interface message file exists. Before removing a language, check contact destinations and links to locale routes. Tests may contain starter-language expectations that need updating in a personalized fork.

## Profile

[profile.json](../../src/content/profile.json) defines the central identity and entry screen. These fields are required unless marked optional:

| Field | Shape / purpose |
|---|---|
| `schemaVersion`, `id` | Version `1` and unique entity ID. |
| `title` | Localized full name; also supplies the introduction name. |
| `shortName` | Nonempty string for compact identity display. |
| `primaryRole`, `secondaryRole`, `summary` | Localized identity text. |
| `intro` | Localized `eyebrow`, `role`, `statement` and `status`. |
| `metadata` | Localized `title` and `description` for page metadata. |
| `position` | Numeric `[x, y, z]` tuple; starter `[0, 0, 0]`. |
| `visual` | Visual configuration described below. |
| `signals` | Array of semantic signals; may be empty. |
| `actions` | Array of contact actions; may be empty. |
| `image` | Optional media object. The profile uses `image`, not `coverImage`. |

### Contact actions

Every action requires `id`, `type` and localized `label`. Available types are `linkedin`, `github`, `email` and `resume`.

| Optional field | Behavior |
|---|---|
| `href` | Destination string, or object mapping locales to destinations. Empty strings are permitted for unconfigured destinations. |
| `external` | Requests external navigation where applicable. |
| `email` | Valid email address for an email action; the resolver constructs the `mailto:` link. |
| `subject` | Email subject string. |
| `download` | Suggested download filename for a resume. Browser handling can vary; same-origin resume downloads use this attribute. |

LinkedIn and GitHub actions need HTTPS URLs. Resume destinations may be local paths or HTTPS URLs. Missing destinations produce disabled actions. A localized `href` has **no language fallback**: an English resume does not silently become a Portuguese download. Use a single string if the same file serves all languages.

## Entries (nodes)

Every registered entry follows the same schema, regardless of its folder. See the [complete minimal example](build-your-portfolio.md#7-add-another-entry).

| Required field | Accepted value |
|---|---|
| `schemaVersion` | `1` |
| `id`, `slug` | Unique identifiers following the shared ID rules. A slug does not create a separate case-study route. |
| `kind` | `project`, `experience`, `talk`, `mentoring` or `education` |
| `cluster` | Existing cluster ID |
| `title`, `summary`, `description` | Localized text |
| `visual` | Visual configuration |
| `position` | `{"mode": "auto"}` or `{"mode": "manual", "value": [1, 2, 3]}` |

| Optional field | Accepted value / behavior |
|---|---|
| `importance` | `flagship`, `primary` or `secondary`; default `primary`. Influences scene layout and emphasis. |
| `participationRole` | `speaker`, `workshop-host`, `mentor`, `panelist` or `attendee` |
| `provisional`, `confidential` | Boolean editorial metadata. `confidential` does not provide access control; do not store private material in public content. |
| `year`, `company` | Nonempty strings; use `"2025"`, not the number `2025`. |
| `status`, `projectType` | Localized text |
| `coverImage` | Optional media object for the project visual/case cover |
| `gallery` | Array of media objects, shown after ordered editorial content |
| `content` | Ordered array of editorial blocks |
| `signals` | Array of semantic signals; defaults to `[]` |
| `relations` | Array of directed connections; defaults to `[]` |
| `technologies` | Array of nonempty strings; defaults to `[]`. Existing technology metadata is distinct from typed semantic signals. |
| `problem`, `solution`, `myRole`, `impact` | Optional localized legacy case sections; displayed before `content` |
| `links` | Array of objects with localized `label`, HTTPS `href` and `type`: `website`, `github`, `article`, `video` or `document` |

Creating another `kind` requires changes to types, validation and rendering. For normal customization, use the existing kinds. Nodes are loaded only when imported and added to [registry.ts](../../src/content/registry.ts).

## Media

Media objects are shared by profile images, covers, galleries and image blocks.

| Field | Meaning |
|---|---|
| `src` | Required local URL path or HTTPS URL without embedded credentials |
| `alt` | Optional localized alternative text; supply it for meaningful images |
| `caption` | Optional localized visible caption |
| `role` | Optional `cover`, `interface`, `architecture`, `result`, `research`, `concept`, `event` or `gallery` |
| `category` | Optional `project`, `conceptual` or `event` metadata |

Local URLs start with one `/`, contain no spaces, query strings, fragments or backslashes, and cannot traverse directories with `..`. Prefer `/assets/...`, mapped to `public/assets/...`.

The server validates referenced `/assets/` files for existence and containment inside `public/`. It does not preflight remote URLs or every other local URL prefix. HTTPS availability, cross-origin permissions and browser texture decoding are runtime concerns.

An omitted cover uses a procedural fallback. A missing referenced `/assets/` file fails validation. A remote cover that fails to load can use the runtime fallback. `role` and `category` describe media; they do not select scene coordinates.

## Editorial blocks

`content` is rendered in array order. The examples below are **individual blocks**, to insert into that array. Image files referenced in examples must be added before use.

### Text

```json
{
  "type": "text",
  "title": {"pt": "Decisões", "en": "Decisions"},
  "body": {"pt": "Explique uma decisão e seu motivo.", "en": "Explain a decision and its reason."}
}
```

`body` is required; `title` is optional. Use `\n` within a JSON string for a line break.

### Image

```json
{
  "type": "image",
  "src": "/assets/projects/example-project/architecture.svg",
  "alt": {"pt": "Diagrama demonstrativo", "en": "Demonstration diagram"},
  "presentation": {"size": "wide", "align": "center"}
}
```

All media fields are supported. Optional `presentation.size` accepts `inline`, `wide` or `full`; optional `presentation.align` accepts `left`, `center` or `right`. They affect the image within the existing case layout, not the whole page grid.

### Gallery

```json
{
  "type": "gallery",
  "images": [
    {
      "src": "/assets/projects/example-project/interface.svg",
      "alt": {"pt": "Interface demonstrativa", "en": "Demonstration interface"}
    }
  ]
}
```

A gallery block needs at least one image. Use this block to place a gallery at a specific narrative point; use the node's top-level `gallery` for images after `content`. Putting the same images in both displays them twice.

### Metric

```json
{
  "type": "metric",
  "value": "42%",
  "label": {"pt": "Métrica fictícia", "en": "Fictional metric"},
  "description": {"pt": "Exemplo de formato; substitua por um resultado verificado.", "en": "Format example; replace with a verified result."}
}
```

`value` is a nonempty string, `label` is localized and required, and `description` is optional. A metric block does not reference a signal by `signalId`. A signal of type `metric` remains a semantic label; the block carries the displayed result.

### Link

```json
{
  "type": "link",
  "label": {"pt": "Ver demonstração", "en": "View demonstration"},
  "href": "https://example.com"
}
```

Both `label` and HTTPS `href` are required. This block does not accept the `type: "website"` metadata used by top-level `links`; here `type` is always `"link"`.

### Case display order

The case shell shows the title, summary, description and available cover. Its evidence area then shows available metadata, provisional note, technologies, signals and related context; legacy `problem`/`solution`/`myRole`/`impact` sections; ordered `content`; top-level `gallery`; and top-level `links`. Optional absent sections are omitted. Avoid repeating the same story in legacy fields and text blocks.

## Semantic signals

Each signal requires `id`, `type` (`technology`, `concept`, `metric` or `domain`) and localized `label`.

| Optional field | Meaning |
|---|---|
| `showInOrbit` | Eligible for scene satellites unless explicitly `false` |
| `showInCase` | Included in case context unless explicitly `false` |
| `importance` | Number from `0` to `1`; higher values sort first in the orbit, omitted values use `0.5` |
| `visualWeight` | Number from `0` to `2`; accepted metadata, currently not consumed by the renderer |
| `relationTargetId` | Existing entity ID; validated, but does not create a clickable satellite or replace a relation |

Signal IDs must be unique within their owning profile or node. Orbit signals with equal priority use an ID tie-break for stable ordering; case signals retain their authored order. Scene quality and viewport size limit visible satellites; the full eligible case list is separate from that visual budget. Signal `importance` is numeric and differs from the node's named importance levels.

## Relations

A relation requires `targetId` and `type`; an optional localized `label` overrides its display label. Supported types:

| Type | Typical use |
|---|---|
| `built-at` | Project → experience where it was built |
| `produced` | Experience → project it produced |
| `uses` | Entry → related entity it uses |
| `related-to` | General contextual connection |
| `thesis-of` | Research or thesis → education context |
| `impact` | Entry → related impact context |
| `presented-at` | Project → talk or event entry |
| `research` | Entry → research context |

These are editorial meanings, not enforced source/target kind restrictions. The target must be an existing node, cluster or identity ID. Self-relations and duplicate pairs of `type` + `targetId` on a node are rejected. Reverse connections are not created automatically.

## Clusters and visuals

[clusters.json](../../src/content/clusters.json) contains `schemaVersion: 1` and a nonempty `clusters` array. Each cluster requires:

| Field | Accepted value |
|---|---|
| `id` | Unique entity ID |
| `title`, `description` | Localized text |
| `position` | Numeric `[x, y, z]` tuple |
| `radius` | Positive number |
| `color`, `secondaryColor` | Six-digit hex color, such as `#5ad7ff` |
| `pattern` | `streams`, `helix`, `network`, `topology` or `pulse` |

The starter IDs are `key-projects`, `experience-impact`, `education-research` and `talks-community`. Empty clusters are valid. Removing or renaming one requires updating every node and relation that references it.

Profile and node `visual` objects require a `variant`: `data-node`, `genomic-nebula`, `agent-network`, `system-module` or `human-signal`. Optional `size` is greater than `0` and at most `3`; optional `intensity` ranges from `0` to `2`.

Node `position.mode: "auto"` lets the layout place entries around their cluster. Manual mode uses an explicit coordinate tuple. Keep automatic placement until you need to tune the scene and can check desktop and mobile navigation.

---

[Previous: Build your portfolio](build-your-portfolio.md) · [Next: Architecture](architecture.md)
