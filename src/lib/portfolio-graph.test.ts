import assert from "node:assert/strict";
import test from "node:test";
import {createPortfolioGraph} from "./portfolio-graph";
import {validatePortfolioNodes} from "./portfolio-schema";
import type {ClusterDefinition} from "./portfolio-types";

const title = {pt: "Projeto", en: "Project"};
const clusters: ClusterDefinition[] = ["key-projects", "education-research"].map((id) => ({
  id: id as ClusterDefinition["id"], title, description: title, position: [0, 0, 0],
  radius: 5, color: "#ffffff", secondaryColor: "#ffffff", pattern: "network",
}));
const project = {
  schemaVersion: 1,
  id: "project-a", slug: "project-a", title, summary: title, description: title,
  kind: "project", cluster: "key-projects", technologies: [],
  visual: {variant: "data-node"}, position: {mode: "auto"},
};

test("multiple career relationships keep one canonical project and spatial anchor", () => {
  const nodes = validatePortfolioNodes([
    {...project, relations: [{targetId: "education-research", type: "research"}]},
    {...project, id: "education", slug: "education", kind: "education", cluster: "education-research",
      relations: [{targetId: "project-a", type: "produced"}]},
  ]);
  const graph = createPortfolioGraph(nodes, clusters, {id: "profile", title});
  assert.equal([...graph.values()].filter(({id}) => id === "project-a").length, 1);
  assert.equal(graph.get("project-a")?.cluster, "key-projects");
  assert.equal(graph.get("education")?.kind, "education");
});

test("rejects anchors and relations missing from the actual rendered graph", () => {
  const nodes = validatePortfolioNodes([{
    ...project, relations: [{targetId: "education-research", type: "research"}],
  }]);
  assert.throws(() => createPortfolioGraph(nodes, [], {id: "profile", title}), /anchor/);
  assert.throws(() => createPortfolioGraph(nodes, clusters.slice(0, 1), {id: "profile", title}), /education-research/);
  const satellites = validatePortfolioNodes([{
    ...project, signals: [{id: "research", type: "concept", label: title, relationTargetId: "education-research"}],
  }]);
  assert.throws(() => createPortfolioGraph(satellites, clusters.slice(0, 1), {id: "profile", title}), /education-research/);
});

test("graph index rejects a node colliding with the identity", () => {
  const nodes = validatePortfolioNodes([project]);
  assert.throws(() => createPortfolioGraph(nodes, [], {id: "project-a", title}), /Duplicate/);
});

test("identity signal references must also resolve against the rendered graph", () => {
  assert.throws(() => createPortfolioGraph([], clusters, {
    id: "person", title, signals: [{id: "research", type: "concept", label: title, relationTargetId: "missing"}],
  }), /signals.research.relationTargetId missing/);
});
