import assert from "node:assert/strict";
import test from "node:test";

import {clusters, getNodePosition} from "../content/clusters";
import aitheronData from "../content/projects/aitheron.json";
import multiAgentData from "../content/projects/multi-agent-tariff-intelligence.json";
import pnExtractorData from "../content/projects/pn-extractor.json";
import llmInfrastructureData from "../content/projects/enterprise-llm-infrastructure.json";
import docguardData from "../content/projects/docguard.json";
import {navigationBoundaries} from "./scene-navigation";
import {getProjectVisualRadius, projectVisualSafetyMargin} from "./satellite-layout";

import {portfolioNodeSchema} from "./portfolio-schema";
const [aitheron, multiAgent, pnExtractor, llmInfrastructure, docguard] = [aitheronData, multiAgentData, pnExtractorData, llmInfrastructureData, docguardData].map(data => portfolioNodeSchema.parse(data));

test("career regions and project anchors leave room for orbiting context within navigable space", () => {
  for (const cluster of clusters) assert.ok(Math.hypot(...cluster.position) >= 14);
  const projects = [aitheron, multiAgent, pnExtractor, llmInfrastructure, docguard];
  const positions = projects.map((node, index) => getNodePosition(node, index, projects.length));
  positions.forEach((position, index) => {
    assert.ok(Math.hypot(...position) >= 10, "projects stay clear of the central identity's orbit");
    assert.ok(Math.hypot(...position) < navigationBoundaries.target.softRadius);
    for (let otherIndex = index + 1; otherIndex < positions.length; otherIndex += 1) {
      // The cluster uses an elliptical plane, as do the desktop semantic orbits.
      const separation = Math.hypot(...position.map((value, axis) => (value - positions[otherIndex][axis]) / (axis === 1 ? 0.65 : 1)));
      const required = getProjectVisualRadius(projects[index]) + getProjectVisualRadius(projects[otherIndex]) + projectVisualSafetyMargin;
      assert.ok(separation >= required, `${projects[index].id} needs ${required.toFixed(1)} units of visual clearance, got ${separation.toFixed(1)}`);
    }
  });
});
