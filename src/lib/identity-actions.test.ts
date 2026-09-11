import assert from "node:assert/strict";
import test from "node:test";

import {resolveIdentityActionHref} from "./identity-actions";

test("resolves the resume for the active locale without falling back to another language", () => {
  const action = {type: "resume" as const, href: {pt: "/curriculo.pdf", en: "/resume.pdf"}};
  assert.equal(resolveIdentityActionHref(action, "pt"), "/curriculo.pdf");
  assert.equal(resolveIdentityActionHref(action, "en"), "/resume.pdf");
  assert.equal(resolveIdentityActionHref({...action, href: {...action.href, en: ""}}, "en"), null);
  assert.equal(resolveIdentityActionHref({...action, href: {...action.href, en: "javascript:alert(1)"}}, "en"), null);
  assert.equal(resolveIdentityActionHref({type: "github", href: "https://github.com/example"}, "en"), "https://github.com/example");
});

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

test("builds a mailto action from a configured address and encodes the subject", () => {
  assert.equal(resolveIdentityActionHref({type: "email", email: "hello@example.com", subject: "Olá & portfolio?"}),
    "mailto:hello@example.com?subject=Ol%C3%A1%20%26%20portfolio%3F");
  assert.equal(resolveIdentityActionHref({type: "email", email: "hello@example.com?bcc=other@example.com"}), null);
  assert.equal(resolveIdentityActionHref({type: "email", email: "hello@example.com\nBcc:other@example.com"}), null);
});
