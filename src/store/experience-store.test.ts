import assert from "node:assert/strict";
import test, {beforeEach} from "node:test";

import {useExperienceStore} from "./experience-store";

const state = () => useExperienceStore.getState();
beforeEach(() => useExperienceStore.setState(useExperienceStore.getInitialState(), true));

test("opens a preview's own case immediately without selecting its cluster first", () => {
  state().returnToOverview();
  state().openNodeCase("aitheron", "key-projects");
  assert.equal(state().stage, "node-details");
  assert.equal(state().selectedNodeId, "aitheron");
  assert.equal(state().selectedClusterId, "key-projects");
  state().closeCase();
  assert.equal(state().stage, "node-focus");
  state().openCase();
  assert.equal(state().stage, "node-details");
  state().focusCluster("education-research");
  state().openNodeCase("pn-extractor", "key-projects");
  assert.equal(state().stage, "node-details");
  assert.equal(state().selectedNodeId, "pn-extractor");
  assert.equal(state().selectedClusterId, "key-projects");
});

test("travels before opening a case and returns outward one level at a time", () => {
  state().focusCluster("key-projects");
  state().focusNode("aitheron", "key-projects");
  assert.equal(state().stage, "node-focus");
  state().openCase();
  assert.equal(state().stage, "node-focus");
  state().completeNodeFocus("aitheron");
  state().openCase();
  assert.equal(state().stage, "node-details");
  state().navigateBack();
  assert.equal(state().stage, "node-focus");
  assert.equal(state().selectedNodeId, "aitheron");
  state().navigateBack();
  assert.equal(state().stage, "cluster-focus");
  state().navigateBack();
  assert.equal(state().stage, "overview");
  assert.equal(state().selectedClusterId, null);
});

test("ignores stale arrival and resets readiness on a different project", () => {
  state().focusNode("aitheron", "key-projects");
  state().focusNode("pn-extractor", "key-projects");
  state().completeNodeFocus("aitheron");
  assert.equal(state().focusReady, false);
  state().completeNodeFocus("pn-extractor");
  assert.equal(state().focusReady, true);
});

test("locale transitions preserve case versus exploration context", () => {
  state().focusNode("aitheron", "key-projects", true);
  state().beginEntering("en");
  state().completeEntering();
  assert.equal(state().stage, "node-focus");
  state().openCase();
  state().beginEntering("pt");
  state().completeEntering();
  assert.equal(state().stage, "node-details");
});

test("fallback needs no camera and repeated case close does not skip a level", () => {
  state().focusNode("aitheron", "key-projects", true);
  state().openCase();
  state().closeCase();
  state().closeCase();
  assert.equal(state().stage, "node-focus");
  state().returnToOverview();
  assert.equal(state().selectedNodeId, null);
  assert.equal(state().focusReady, false);
});

test("an overview reset during locale entry cannot restore a stale selected stage", () => {
  state().focusNode("aitheron", "key-projects", true);
  state().openCase();
  state().beginEntering("en");
  state().returnToOverview();
  state().completeEntering();
  assert.equal(state().stage, "overview");
  assert.equal(state().selectedNodeId, null);
});
