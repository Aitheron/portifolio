# Build your portfolio

[English](./build-your-portfolio.md) | [Português](../pt-BR/build-your-portfolio.md) · [Back to home](../../README.md)

This tutorial takes you from the generic starter to a portfolio with your identity, a first case and another project. Start with a working [local installation](getting-started.md). Keep `npm run dev` running and open the repository in your editor.

You will edit JSON, add media files and make a small change to the content registry. JSON uses double quotes and does not accept comments or trailing commas. Examples below use both existing app languages: `pt` and `en`.

## 1. Map the files you will edit

| File or folder | What you change |
|---|---|
| `src/content/profile.json` | Name, introduction, biography, metadata and contacts |
| `src/content/projects/example-project.json` | Your first project and its case |
| `src/content/experience/example-experience.json` | An experience connected to that project |
| `src/content/clusters.json` | Names and descriptions of the four career regions |
| `src/content/registry.ts` | Which project, experience and other entry files are loaded |
| `src/content/messages/pt.json` and `en.json` | Interface labels, such as buttons and navigation |
| `portfolio.config.ts` | App languages and the space name |
| `public/assets/` | Public images and resume files |

Start by editing the existing examples in place. Keep their filenames, `id`, `slug`, `cluster` and relation targets during your first pass. This keeps their connections valid while you learn the format. Folder names alone do not register content.

## 2. Replace the identity

Open `src/content/profile.json`. Replace these fields **inside the existing object**, keeping its other required properties:

```json
{
  "title": {"pt": "Alex Silva", "en": "Alex Silva"},
  "shortName": "Alex",
  "primaryRole": {"pt": "Desenvolvimento de software", "en": "Software development"},
  "secondaryRole": {"pt": "Interfaces e acessibilidade", "en": "Interfaces and accessibility"},
  "summary": {
    "pt": "Crio ferramentas para tornar tarefas do dia a dia mais simples.",
    "en": "I build tools that make everyday tasks simpler."
  }
}
```

Alex is a fictional example; use your own information. Update all four fields inside `intro`: `eyebrow`, `role`, `statement` and `status`. These control the entry screen. The large introduction name comes from `title`.

Update `metadata.title` and `metadata.description` too. They describe your portfolio in page metadata; they are separate from the visible introduction. Keep the default `position` and `visual` for now.

**Check:** reload the page to see the introduction, enter the space and focus the central identity. The name and biography should reflect your edits. Check both `/pt` and `/en`.

## 3. Configure contacts and resume downloads

The starter deliberately has no contact destinations. Replace its `actions` array with the following example, then replace the example URLs and email with your real destinations:

```json
[
  {
    "id": "linkedin", "type": "linkedin",
    "label": {"pt": "LinkedIn", "en": "LinkedIn"},
    "href": "https://www.linkedin.com/in/your-handle/", "external": true
  },
  {
    "id": "github", "type": "github",
    "label": {"pt": "GitHub", "en": "GitHub"},
    "href": "https://github.com/your-handle", "external": true
  },
  {
    "id": "email", "type": "email",
    "label": {"pt": "E-mail", "en": "Email"},
    "email": "hello@example.com", "subject": "Hello from your portfolio"
  },
  {
    "id": "resume", "type": "resume",
    "label": {"pt": "Currículo", "en": "Resume"},
    "href": {"pt": "/assets/resume/resume-pt.pdf", "en": "/assets/resume/resume-en.pdf"},
    "download": "alex-silva-resume.pdf"
  }
]
```

Create `public/assets/resume/` and put your PDF files there **before saving these local paths**. A path such as `/assets/resume/resume-en.pdf` refers to `public/assets/resume/resume-en.pdf`; omit `public` from the URL. Everything in this folder is public.

If you have one resume for all languages, use a single `href` string instead of an object. If you have no resume yet, omit that action or keep it without `href`. A missing destination disables the action. Locale-specific download destinations do not fall back to another language. Email uses the `email` field, not a `mailto:` URL in `href`.

**Check:** focus the identity and test each configured action. Open each resume URL directly to confirm that it serves the correct PDF.

## 4. Turn the example project into your first case

Edit `src/content/projects/example-project.json` in place. Update `title`, `summary` and `description` in both languages. Use the summary for a brief introduction and the description for context. Replace `projectType` and `status` if you keep them; optional fields can be removed.

The example contains fictional text, a `42%` demonstration metric and an `https://example.com` link. Replace or remove all of them. Only include a result you can substantiate.

The `content` array is your ordered case narrative. To begin with two sections, replace that array with:

```json
[
  {
    "type": "text",
    "title": {"pt": "O problema", "en": "The problem"},
    "body": {
      "pt": "Descreva quem precisava de ajuda e qual dificuldade enfrentava.",
      "en": "Describe who needed help and the difficulty they faced."
    }
  },
  {
    "type": "text",
    "title": {"pt": "Minha contribuição", "en": "My contribution"},
    "body": {
      "pt": "Explique suas decisões, sua participação e o que aprendeu.",
      "en": "Explain your decisions, your contribution and what you learned."
    }
  }
]
```

These are writing prompts, not finished case copy. Replace them before sharing. Text is rendered as plain text, so Markdown syntax will not produce headings or links. Use block types for structure.

The existing `gallery` is separate from `content`. Replace it with your own images, or set `"gallery": []` when you no longer want the two example screenshots. Keep the empty field during this first walkthrough: a starter test imports `example.gallery` directly, so deleting the property can fail TypeScript even though the content schema allows omission. The [reference](content-reference.md#editorial-blocks) describes text, image, gallery, metric and link blocks.

**Check:** expand the projects region, select your project, then open its case. Your sections should appear in array order, with no leftover fictional result.

## 5. Add your own images

Create a folder such as `public/assets/projects/my-project/`. Add your cover and any screenshots or diagrams there. Keep names simple, for example `cover.webp` and `architecture.png`. Use images you have permission to publish, and write meaningful alternative text.

Replace the existing `coverImage` object with this example after adding the file:

```json
{
  "src": "/assets/projects/my-project/cover.webp",
  "alt": {"pt": "Tela principal do projeto", "en": "Project main screen"},
  "role": "cover"
}
```

To place a diagram between text sections, insert an image block into `content`:

```json
{
  "type": "image",
  "src": "/assets/projects/my-project/architecture.png",
  "alt": {"pt": "Fluxo entre interface, API e banco de dados", "en": "Flow between interface, API and database"},
  "caption": {"pt": "Visão geral da solução", "en": "Solution overview"},
  "role": "architecture",
  "presentation": {"size": "wide", "align": "center"}
}
```

A cover is optional: remove `coverImage` if you do not have one and the engine uses a procedural visual. A referenced local `/assets/` file must exist; a broken path is a validation error. Remote HTTPS images are allowed, but the remote host may prevent their use as WebGL textures.

Store committed media under `public/assets/`: the repository's `.gitignore` ignores other top-level content inside `public/`. The four starter SVGs are examples you can replace or remove once no content references them.

## 6. Describe skills and connect your experience

Replace the project's `signals` with a small selection of technologies or concepts that actually describe your work. Each signal has one label shared by the orbit and the case:

```json
[
  {
    "id": "accessibility", "type": "concept",
    "label": {"pt": "Acessibilidade", "en": "Accessibility"},
    "showInOrbit": true, "showInCase": true, "importance": 0.9
  }
]
```

The scene limits visible satellites according to device capability. Setting `showInOrbit` to `true` makes a signal eligible; it does not guarantee every signal is visible at once.

Next, edit `src/content/experience/example-experience.json` with your experience's title, summary, description and content. Keep the starter connection only if the project belongs to that experience. The project has a `built-at` relation to the experience; the experience has a `produced` relation back. These are explicit, directed relations: one does not automatically create the other.

If the connection does not apply, set `relations` to `[]` in both files. To connect different entries later, use their exact `id`, not their title, filename or slug. See [relations](content-reference.md#relations).

## 7. Add another entry

Create `src/content/projects/community-map.json` with this **complete, minimal project file**:

```json
{
  "schemaVersion": 1,
  "id": "community-map",
  "slug": "community-map",
  "kind": "project",
  "cluster": "key-projects",
  "title": {"pt": "Mapa da comunidade", "en": "Community map"},
  "summary": {"pt": "Um mapa de espaços públicos.", "en": "A map of public spaces."},
  "description": {"pt": "Projeto demonstrativo para praticar a criação de conteúdo.", "en": "A demonstration project for practicing content creation."},
  "visual": {"variant": "data-node"},
  "position": {"mode": "auto"}
}
```

Then replace `src/content/registry.ts` with the following, which keeps the existing entries and adds the new one:

```ts
import project from "./projects/example-project.json";
import experience from "./experience/example-experience.json";
import communityMap from "./projects/community-map.json";

export const contentEntries = [
  {file: "src/content/projects/example-project.json", data: project},
  {file: "src/content/experience/example-experience.json", data: experience},
  {file: "src/content/projects/community-map.json", data: communityMap},
];
```

Registration is explicit. Saving a JSON file alone does not add a node. The `file` value identifies it in validation errors; `data` must refer to the correct import. Keep IDs and slugs unique. Automatic placement uses the registry order, so reordering entries can change their positions.

For other entry types, follow the same process with `kind` set to `experience`, `education`, `talk` or `mentoring`, and choose an existing cluster ID. You may create new folders under `src/content/` for organization; the registry still decides what loads. See the [node reference](content-reference.md#entries-nodes) for the available fields.

**Check:** the new project should appear in the projects region and HTML explorer. Its case should open even without images or editorial blocks.

## 8. Adjust languages and region labels

Edit the localized titles and descriptions in `src/content/clusters.json` if you want different region names. Keep the IDs and layout values at first.

In `portfolio.config.ts`, `branding.spaceName` controls the space name and `defaultLocale` controls the default app language. To use English by default, change `defaultLocale` from `"pt"` to `"en"`; both are already present in `locales`.

For interface wording, edit `src/content/messages/en.json` and `pt.json`. For biography and case text, edit the content files. These are different translation sources. Restart the development server after changing locale configuration. Follow the [language reference](content-reference.md#languages-and-configuration) before adding or removing a language.

## 9. Validate your version

In another terminal, from the repository root:

```bash
npm run typecheck
npm run build
```

The build validates registered content, references and local `/assets/` files. Fix any reported file and field, then rerun it. Check both languages in the browser, each case, configured contacts, image descriptions, keyboard navigation and a narrow viewport. Review all text for remaining example names, writing prompts and fictional metrics.

### About the template tests

`npm test` also checks the starter's exact data in `src/lib/content-system.test.ts`: two entries, example IDs, unconfigured contact actions and specific example blocks, among other expectations. Personalization can legitimately change those assertions even when content is valid. Changing the default locale can also affect tests that expect `pt`.

For your fork, update those fixture-specific expectations or give those tests dedicated fixtures. Preserve the tests for validation, navigation, layout and contact safety. Do not remove a failing test without understanding what it verifies. The build and type check are your initial content checks; they do not replace behavioral tests when changing the engine.

If you rename or delete the original example files later, update their imports in both the registry and tests, and fix all relations that use their old IDs. Broken test imports can fail the production type check too. Direct accesses to fields of the imported example, such as `example.gallery`, can also fail type checking when you remove those fields; update the test fixture accordingly.

When this walkthrough is complete, you have a customized local portfolio. [Publishing later is optional](getting-started.md#optional-publish-later).

---

[Previous: Getting started](getting-started.md) · [Next: Content reference](content-reference.md)
