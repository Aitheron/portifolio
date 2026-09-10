import assert from "node:assert/strict";
import test from "node:test";

import {resolveIdentityActionHref} from "./identity-actions";

test("unconfigured and unsafe contact actions never become links", () => {
  for (const href of [undefined, "PLACEHOLDER", "javascript:alert(1)", "//example.com", "https://", "https://user:secret@example.com"]) {
    assert.equal(resolveIdentityActionHref({type: "linkedin", href}), null);
  }
  assert.equal(resolveIdentityActionHref({type: "email", href: "https://example.com"}), null);
});

test("contact destinations support HTTPS, mailto, and internal or external resumes", () => {
  assert.equal(resolveIdentityActionHref({type: "github", href: "https://github.com/example"}), "https://github.com/example");
  const email = "mailto:hello@example.com?subject=Portfolio%20contact";
  assert.equal(resolveIdentityActionHref({type: "email", href: email}), email);
  for (const href of ["/resume.pdf", "/en/resume", "https://example.com/cv.pdf"]) {
    assert.equal(resolveIdentityActionHref({type: "resume", href}), href);
  }
  assert.equal(resolveIdentityActionHref({type: "resume", href: "/\\example.com"}), null);
});
