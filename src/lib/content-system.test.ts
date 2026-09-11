import {loadMessages} from "../i18n/messages";
import assert from "node:assert/strict";
import test from "node:test";
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import {createContentSchemas, portfolioNodeSchema, validatePortfolioNodes, profileSchema, clusterCollectionSchema, parseContent} from "./portfolio-schema";
import {validateLocalAssets} from "./content-assets.server";
import {visibleSignals} from "./semantic-signals";
import {resolveLocalizedText} from "./portfolio-types";
import {contentEntries} from "../content/registry";
import profile from "../content/profile.json";
import clusters from "../content/clusters.json";
import example from "../content/examples/example-project.json";

const fixture = {...example, relations: []};
test("all current files and the teaching example validate, with an optional cover and unrestricted gallery", () => {
  profileSchema.parse(profile); clusterCollectionSchema.parse(clusters);
  const nodes = validatePortfolioNodes(contentEntries.map(e => e.data));
  assert.equal(nodes.length, 9);
  assert.equal(nodes.find(n => n.id === "pn-extractor")?.signals?.length, 6);
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
  assert.deepEqual(portfolioNodeSchema.parse(example).content?.map(b => b.type), ["text", "image", "text", "metric", "gallery", "link"]);
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
