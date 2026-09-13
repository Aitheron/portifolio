import assert from "node:assert/strict";
import test from "node:test";
import {resolveProjectLinkHref} from "./project-links";

test("document destinations select the current language without fallback", () => {
  const link = {href: {pt: "/manual.pdf", en: "https://example.com/manual-en.pdf"}};
  assert.equal(resolveProjectLinkHref(link, "pt"), "/manual.pdf");
  assert.equal(resolveProjectLinkHref(link, "en"), "https://example.com/manual-en.pdf");
  assert.equal(resolveProjectLinkHref({href: {pt: "/manual.pdf"}}, "en"), null);
  assert.equal(resolveProjectLinkHref({href: {}}, "pt"), null);
});

test("a single document destination is shared across languages", () => {
  for (const href of ["/manual.pdf", "https://example.com/manual.pdf"]) {
    for (const locale of ["pt", "en"]) assert.equal(resolveProjectLinkHref({href}, locale), href);
  }
});
