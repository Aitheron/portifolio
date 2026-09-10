import type {IdentityAction} from "./portfolio-types";

export function resolveIdentityActionHref(action: Pick<IdentityAction, "type" | "href">): string | null {
  const href = action.href?.trim();
  if (!href || /[\s\\]/.test(href)) return null;
  if (action.type === "email") {
    return /^mailto:[^@?]+@[^@?]+\.[^@?]+(?:\?.*)?$/i.test(href) ? href : null;
  }
  if (action.type === "resume" && href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password ? href : null;
  } catch {
    return null;
  }
}
