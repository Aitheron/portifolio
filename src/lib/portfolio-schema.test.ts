import assert from "node:assert/strict";
import test from "node:test";

import {validatePortfolioNodes} from "./portfolio-schema";

const title = {pt: "Exemplo", en: "Example"};
const fixture = {
  schemaVersion: 1, id: "example", slug: "example", kind: "project", cluster: "key-projects",
  title, summary: title, description: title, technologies: [],
  visual: {variant: "data-node"}, position: {mode: "auto"},
};

test("accepts incomplete career content with optional evidence and default arrays", () => {
  const [node] = validatePortfolioNodes([fixture]);
  assert.deepEqual(node.relations, []);
  assert.deepEqual(node.signals, []);
  assert.equal(node.importance, "primary");
});

test("resolves a cluster relationship without creating another project", () => {
  const nodes = validatePortfolioNodes([{...fixture, relations: [{targetId: "education-research", type: "research"}]}]);
  assert.equal(nodes.length, 1);
  assert.equal(nodes[0].cluster, "key-projects");
});

test("rejects duplicate identities and unresolved semantic targets", () => {
  assert.throws(() => validatePortfolioNodes([fixture, fixture]), /duplicate/);
  assert.throws(() => validatePortfolioNodes([{...fixture, id: "key-projects"}]), /duplicate|reserved/);
  assert.throws(() => validatePortfolioNodes([{...fixture, relations: [{targetId: "missing", type: "uses"}]}]), /missing/);
});

test("validates local satellite identities and optional relation targets", () => {
  const satellite = {id: "context", type: "concept", label: title};
  assert.throws(() => validatePortfolioNodes([{...fixture, signals: [satellite, satellite]}]), /duplicate/);
  assert.throws(() => validatePortfolioNodes([{...fixture, signals: [{...satellite, relationTargetId: "missing"}]}]), /missing/);
});

test("rejects duplicate typed edges and removed V1 fields and clusters", () => {
  const relation = {targetId: "education-research", type: "research"};
  assert.throws(() => validatePortfolioNodes([{...fixture, relations: [relation, relation]}]), /duplicate relation/);
  assert.throws(() => validatePortfolioNodes([{...fixture, relationships: ["education-research"]}]), /relationships/);
  assert.throws(() => validatePortfolioNodes([{...fixture, cluster: "applied-ai"}]), /cluster/);
});

test("rejects unsafe links, missing translations and unsupported participation roles", () => {
  assert.throws(() => validatePortfolioNodes([{...fixture, links: [{label: title, href: "javascript:alert(1)", type: "website"}]}]), /HTTPS|URL/);
  assert.throws(() => validatePortfolioNodes([{...fixture, title: {en: "Example"}}]), /pt/);
  assert.throws(() => validatePortfolioNodes([{...fixture, participationRole: "organizer"}]), /participationRole/);
});
