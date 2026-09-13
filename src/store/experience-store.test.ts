import assert from "node:assert/strict";
import test, {beforeEach} from "node:test";

import {useExperienceStore} from "./experience-store";

const state = () => useExperienceStore.getState();
beforeEach(() => useExperienceStore.setState(useExperienceStore.getInitialState(), true));

test("identity focus clears project selection, never opens a case, and returns to overview", () => {
  state().focusNode("project-a", "key-projects", true);
  state().focusIdentity();
  assert.equal(state().stage, "identity-focus");
  assert.equal(state().selectedNodeId, null);
  assert.equal(state().selectedClusterId, null);
  state().openCase();
  assert.equal(state().stage, "identity-focus");
  state().beginEntering("en");
  state().completeEntering();
  assert.equal(state().stage, "identity-focus");
  state().navigateBack();
  assert.equal(state().stage, "overview");
});

test("opens a preview's own case immediately without selecting its cluster first", () => {
  state().returnToOverview();
  state().openNodeCase("project-a", "key-projects");
  assert.equal(state().stage, "node-details");
  assert.equal(state().selectedNodeId, "project-a");
  assert.equal(state().selectedClusterId, "key-projects");
  state().closeCase();
  assert.equal(state().stage, "node-focus");
  state().openCase();
  assert.equal(state().stage, "node-details");
  state().focusCluster("education-research");
  state().openNodeCase("project-b", "key-projects");
  assert.equal(state().stage, "node-details");
  assert.equal(state().selectedNodeId, "project-b");
  assert.equal(state().selectedClusterId, "key-projects");
});

test("travels before opening a case and returns outward one level at a time", () => {
  state().focusCluster("key-projects");
  state().focusNode("project-a", "key-projects");
  assert.equal(state().stage, "node-focus");
  state().openCase();
  assert.equal(state().stage, "node-focus");
  state().completeNodeFocus("project-a");
  state().openCase();
  assert.equal(state().stage, "node-details");
  state().navigateBack();
  assert.equal(state().stage, "node-focus");
  assert.equal(state().selectedNodeId, "project-a");
  state().navigateBack();
  assert.equal(state().stage, "cluster-focus");
  state().navigateBack();
  assert.equal(state().stage, "overview");
  assert.equal(state().selectedClusterId, null);
});

test("ignores stale arrival and resets readiness on a different project", () => {
  state().focusNode("project-a", "key-projects");
  state().focusNode("project-b", "key-projects");
  state().completeNodeFocus("project-a");
  assert.equal(state().focusReady, false);
  state().completeNodeFocus("project-b");
  assert.equal(state().focusReady, true);
});

test("locale transitions preserve case versus exploration context", () => {
  state().focusNode("project-a", "key-projects", true);
  state().beginEntering("en");
  state().completeEntering();
  assert.equal(state().stage, "node-focus");
  state().openCase();
  state().beginEntering("pt");
  state().completeEntering();
  assert.equal(state().stage, "node-details");
});

test("fallback needs no camera and repeated case close does not skip a level", () => {
  state().focusNode("project-a", "key-projects", true);
  state().openCase();
  state().closeCase();
  state().closeCase();
  assert.equal(state().stage, "node-focus");
  state().returnToOverview();
  assert.equal(state().selectedNodeId, null);
  assert.equal(state().focusReady, false);
});

test("an overview reset during locale entry cannot restore a stale selected stage", () => {
  state().focusNode("project-a", "key-projects", true);
  state().openCase();
  state().beginEntering("en");
  state().returnToOverview();
  state().completeEntering();
  assert.equal(state().stage, "overview");
  assert.equal(state().selectedNodeId, null);
});
