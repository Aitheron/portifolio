import {loadMessages} from "../i18n/messages";
import assert from "node:assert/strict";
import test from "node:test";
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import {createContentSchemas, portfolioNodeSchema, validatePortfolioNodes, profileSchema, clusterCollectionSchema, parseContent} from "./portfolio-schema";
import {validateContentAssets, validateLocalAssets} from "./content-assets.server";
import {resolveIdentityActionHref} from "./identity-actions";
import {visibleSignals} from "./semantic-signals";
import {getSatelliteBudget, selectSatellites} from "./satellite-layout";
import {resolveImageSource, resolveLocalizedText, remainingGalleryImages} from "./portfolio-types";
import {contentEntries} from "../content/registry";
import profile from "../content/profile.json";
import clusters from "../content/clusters.json";
import example from "../content/projects/example-project.json";

const fixture = {...example, relations: []};
test("the gallery only renders media not already placed in the editorial narrative", () => {
  const first = {src: "/first.png"};
  const second = {src: "/second.png"};
  const third = {src: "/third.png"};
  const node = portfolioNodeSchema.parse({...fixture, gallery: [first, second, third], content: [
    {type: "image", ...first}, {type: "gallery", images: [second]},
  ]});
  assert.deepEqual(remainingGalleryImages(node), [third]);
  assert.deepEqual(remainingGalleryImages({...node, content: undefined}), [first, second, third]);
});
test("localized media selects the active locale, falls back and validates every source", () => {
  const image = {src: "/assets/base.svg", srcByLocale: {en: "/assets/english.svg"}};
  assert.equal(resolveImageSource(image, "en"), "/assets/english.svg");
  assert.equal(resolveImageSource(image, "pt"), image.src);
  assert.equal(resolveImageSource(image, "de"), image.src);
  assert.deepEqual(portfolioNodeSchema.parse({...fixture, coverImage: image}).coverImage, image);
  for (const src of ["javascript:alert(1)", "/assets/../secret", "http://example.com/image.png"]) {
    assert.throws(() => portfolioNodeSchema.parse({...fixture, coverImage: {...image, srcByLocale: {en: src}}}));
  }
  assert.throws(() => validateLocalAssets({srcByLocale: {en: "/assets/nonexistent-localized-image.svg"}}, "localized.json"), /srcByLocale.en/);
});
test("all current files and the teaching example validate, with an optional cover and unrestricted gallery", () => {
  const identity = profileSchema.parse(profile);
  clusterCollectionSchema.parse(clusters);
  const nodes = validatePortfolioNodes(contentEntries.map(e => e.data));
  assert.deepEqual(nodes.map(node => node.id), ["aitheron", "multi-agent-tariff-intelligence", "pn-extractor", "enterprise-llm-infrastructure", "docguard", "professional-experience", "software-engineering", "ai-automation-talks", "internal-genai-workshops", "parkify"]);
  assert.deepEqual(nodes.map(node => node.kind), ["project", "project", "project", "project", "project", "experience", "education", "talk", "talk", "project"]);
  assert.deepEqual(nodes[0].relations, [{targetId: "software-engineering", type: "thesis-of"}, {targetId: "education-research", type: "research"}]);
  assert.deepEqual(nodes[5].relations?.map(relation => relation.targetId), nodes.slice(1, 4).map(node => node.id));
  assert.equal(nodes[6].relations?.[0].targetId, "aitheron");
  assert.deepEqual(nodes.filter(node => node.cluster === "talks-community").map(node => node.participationRole), ["speaker", "workshop-host"]);
  assert.equal(nodes[0].provisional, false);
  assert.equal(nodes[0].signals?.length, 7);
  assert.equal(nodes[0].coverImage?.src, "/assets/projects/aitheron/cover/aitheron-cover.png");
  assert.equal(nodes[0].gallery?.length, 4);
  for (const width of [390, 1440]) {
    assert.ok(selectSatellites(nodes[0].signals ?? [], getSatelliteBudget(width, "high")).some(signal => signal.id === "auroc"));
  }
  assert.deepEqual(nodes[0].content?.filter(block => block.type === "metric").map(block => block.value), ["0.9942", "0.9898", "0.9958", "0.9946"]);
  for (const surface of ["orbit", "case"] as const) {
    assert.ok(visibleSignals(nodes[0].signals, surface).some(signal => signal.type === "metric"));
  }
  for (const node of nodes.slice(1, 5)) {
    assert.equal(node.signals?.length, 6);
    assert.equal(node.provisional, true);
    for (const surface of ["orbit", "case"] as const) {
      assert.ok(visibleSignals(node.signals ?? [], surface).every(signal => signal.type !== "metric"));
    }
  }
  assert.equal(profile.title.pt, "Marlon de Souza");
  assert.equal(profile.image.src, "/assets/identity/perfil.jpg");
  const destinations = identity.actions.map(action => [action.type, resolveIdentityActionHref(action, "pt"), resolveIdentityActionHref(action, "en")]);
  assert.deepEqual(destinations, [
    ["linkedin", "https://www.linkedin.com/in/marlon-de-souza-software-engineer/", "https://www.linkedin.com/in/marlon-de-souza-software-engineer/"],
    ["github", "https://github.com/Marlon-Souza16", "https://github.com/Marlon-Souza16"],
    ["email", "mailto:marlondesouzajlle@hotmail.com?subject=Contact%20from%20Marlon's%20Portfolio", "mailto:marlondesouzajlle@hotmail.com?subject=Contact%20from%20Marlon's%20Portfolio"],
    ["resume", "/assets/resume/curriculo.pdf", "/assets/resume/resume.pdf"],
  ]);
  validateContentAssets();
  assert.equal(portfolioNodeSchema.parse(example).gallery?.length, 2);
  assert.equal(portfolioNodeSchema.parse({...fixture, gallery: Array(12).fill(example.gallery[0])}).gallery?.length, 12);
  assert.equal(portfolioNodeSchema.parse({...fixture, coverImage: undefined, gallery: undefined}).coverImage, undefined);
});

test("configuration supports a single Spanish locale and arbitrary multilingual content with default fallback", () => {
  for (const locales of [["es"], ["en", "es", "de"]]) {
    const schema = createContentSchemas({locales, defaultLocale: locales[0], contentSchemaVersion: 1});
    assert.deepEqual(schema.localizedText.parse({[locales[0]]: "Default"}), {[locales[0]]: "Default"});
    assert.throws(() => schema.localizedText.parse({fr: "Missing default"}), /Required default/);
    assert.throws(() => schema.localizedText.parse({[locales[0]]: 4}));
    const text = {[locales[0]]: "Example"};
    const nodes = validatePortfolioNodes([{schemaVersion: 1, id: "custom", slug: "custom", kind: "project", cluster: "custom-cluster", title: text, summary: text, description: text, visual: {variant: "data-node"}, position: {mode: "auto"}}], {schema: schema.node, clusterIds: ["custom-cluster"], identityId: "person"});
    assert.equal(nodes[0].cluster, "custom-cluster");
  }
  assert.equal(resolveLocalizedText({pt: "Fallback"}, "de"), "Fallback");
  assert.throws(() => createContentSchemas({locales: ["es"], defaultLocale: "en", contentSchemaVersion: 1}), /defaultLocale/);
});

test("signals independently control orbit and case visibility while preserving defaults", () => {
  const base = example.signals[0];
  const signals = [{...base, id: "orbit", showInCase: false}, {...base, id: "case", showInOrbit: false}, {...base, id: "both", showInOrbit: undefined, showInCase: undefined}];
  assert.deepEqual(visibleSignals(signals as Parameters<typeof visibleSignals>[0], "orbit").map(s => s.id), ["orbit", "both"]);
  assert.deepEqual(visibleSignals(signals as Parameters<typeof visibleSignals>[0], "case").map(s => s.id), ["case", "both"]);
});

test("editorial order, image presentation and media metadata validate with actionable file errors", () => {
  assert.deepEqual(portfolioNodeSchema.parse(example).content?.map(b => b.type), ["text", "image", "text", "metric", "link"]);
  const gallery = portfolioNodeSchema.parse({...fixture, content: [{type: "gallery", images: example.gallery}]});
  assert.equal(gallery.content?.[0].type, "gallery");
  for (const changes of [{content: [{type: "script"}]}, {content: [{type: "image", src: "/image.svg", presentation: {x: 20}}]}, {coverImage: {src: "javascript:alert(1)"}}, {coverImage: {src: "/%zz"}}, {gallery: [{src: "/image.svg", role: "unknown"}]}, {schemaVersion: 2}]) {
    assert.throws(() => parseContent(portfolioNodeSchema, {...fixture, ...changes}, "src/content/projects/bad.json"), /src\/content\/projects\/bad.json/);
  }
});

test("invalid, duplicate and self relations fail before rendering", () => {
  assert.throws(() => validatePortfolioNodes([{...fixture, relations: [{targetId: fixture.id, type: "uses"}]}]), /self relation/);
  assert.throws(() => validatePortfolioNodes([{...fixture, relations: [{targetId: "missing", type: "uses"}]}]), /missing/);
  assert.throws(() => validatePortfolioNodes([{...fixture, relations: [{targetId: "key-projects", type: "unknown"}]}]), /relations/);
});

test("local assets are checked at build/server time with source and field information", () => {
  validateLocalAssets(example, "example.json");
  const root = mkdtempSync(path.join(tmpdir(), "portfolio-assets-"));
  try {
    mkdirSync(path.join(root, "assets")); writeFileSync(path.join(root, "assets/ok.svg"), "<svg/>");
    validateLocalAssets({coverImage: {src: "/assets/ok.svg"}}, "test.json", root);
    assert.throws(() => validateLocalAssets({gallery: [{src: "/assets/missing.svg"}]}, "test.json", root), /test.json: root.gallery.0.src.*missing/);
    assert.throws(() => validateLocalAssets("/assets/../../outside.svg", "test.json", root), /outside/);
  } finally {rmSync(root, {recursive: true, force: true});}
});

test("documents validate every localized public file, including paths outside assets", () => {
  const root = mkdtempSync(path.join(tmpdir(), "portfolio-documents-"));
  try {
    writeFileSync(path.join(root, "manual.pdf"), "document fixture");
    validateLocalAssets({links: [{type: "document", href: {pt: "/manual.pdf", en: "https://example.com/manual.pdf"}}]}, "project.json", root);
    for (const field of ["links", "content"]) {
      assert.throws(() => validateLocalAssets({[field]: [{type: "document", href: {pt: "/manual.pdf", en: "/missing.pdf"}}]}, "project.json", root), /project.json: root\.(links|content)\.0\.href\.en.*missing/);
      assert.throws(() => validateLocalAssets({[field]: [{type: "document", href: "/../outside.pdf"}]}, "project.json", root), /outside/);
      assert.throws(() => validateLocalAssets({[field]: [{type: "document", href: "/"}]}, "project.json", root), /outside|file/);
    }
  } finally {rmSync(root, {recursive: true, force: true});}
});


test("interface catalogs fall back by missing file or key and reject malformed values", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "portfolio-messages-"));
  try {
    writeFileSync(path.join(root, "pt.json"), JSON.stringify({HUD: {overview: "Visão geral", close: "Fechar"}}));
    assert.deepEqual(await loadMessages("en", root), {HUD: {overview: "Visão geral", close: "Fechar"}});
    writeFileSync(path.join(root, "en.json"), JSON.stringify({HUD: {overview: "Overview"}}));
    assert.deepEqual(await loadMessages("en", root), {HUD: {overview: "Overview", close: "Fechar"}});
    writeFileSync(path.join(root, "en.json"), JSON.stringify({HUD: {overview: 42}}));
    await assert.rejects(loadMessages("en", root), /en.json.*HUD/);
    await assert.rejects(loadMessages("unknown", root), /Unsupported locale/);
  } finally {rmSync(root, {recursive: true, force: true});}
});
