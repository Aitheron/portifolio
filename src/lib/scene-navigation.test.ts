import assert from "node:assert/strict";
import test from "node:test";

import {
  navigationBoundaries,
  resolveElasticBoundaryRadius,
} from "./scene-navigation";

const boundary = {
  correctionStrength: 3,
  hardRadius: 24,
  softRadius: 20,
};

test("keeps positions inside the soft boundary unchanged", () => {
  assert.equal(resolveElasticBoundaryRadius(12, boundary, 1 / 60), 12);
  assert.equal(resolveElasticBoundaryRadius(20, boundary, 1 / 60), 20);
});

test("applies progressive resistance between the soft and hard boundaries", () => {
  const resolved = resolveElasticBoundaryRadius(22, boundary, 1 / 60);

  assert.ok(resolved > boundary.softRadius);
  assert.ok(resolved < 22);
});

test("never allows a position beyond the hard boundary", () => {
  const resolved = resolveElasticBoundaryRadius(40, boundary, 1 / 60);

  assert.ok(resolved <= boundary.hardRadius);
  assert.ok(resolved >= boundary.softRadius);
});

test("uses stronger correction when the frame lasts longer", () => {
  const shortFrame = resolveElasticBoundaryRadius(23, boundary, 1 / 120);
  const longFrame = resolveElasticBoundaryRadius(23, boundary, 1 / 20);

  assert.ok(longFrame < shortFrame);
});

test("does not resist movement between the current outer knowledge nodes", () => {
  const outerNodeRadius = 18.2;

  assert.equal(
    resolveElasticBoundaryRadius(
      outerNodeRadius,
      navigationBoundaries.target,
      1 / 60,
    ),
    outerNodeRadius,
  );
});
