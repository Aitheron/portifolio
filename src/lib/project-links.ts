import type {AppLocale, ProjectLink} from "./portfolio-types";

/** File translations never fall back to a different language. */
export function resolveProjectLinkHref(link: Pick<ProjectLink, "href">, locale: AppLocale): string | null {
  return (typeof link.href === "string" ? link.href : link.href[locale]) || null;
}
