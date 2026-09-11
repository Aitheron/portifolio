import {portfolioConfig} from "../../portfolio.config";
import type {AppLocale, IdentityAction} from "./portfolio-types";

export function resolveIdentityActionHref(
  action: Pick<IdentityAction, "type" | "href" | "email" | "subject">,
  locale: AppLocale = portfolioConfig.defaultLocale,
): string | null {
  if (action.type === "email" && action.email !== undefined) {
    const email = action.email.trim();
    if (!/^[^\s@?&#:\\]+@[^\s@?&#:\\]+\.[^\s@?&#:\\]+$/.test(email)) return null;
    return `mailto:${email}${action.subject ? `?subject=${encodeURIComponent(action.subject)}` : ""}`;
  }
  const href = (typeof action.href === "string" ? action.href : action.href?.[locale])?.trim();
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
