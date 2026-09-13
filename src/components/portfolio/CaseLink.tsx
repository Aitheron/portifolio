import {useTranslations} from "next-intl";
import {resolveProjectLinkHref} from "@/lib/project-links";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import type {AppLocale, ContentBlock, ProjectLink} from "@/lib/portfolio-types";

export function CaseLink({link, locale}: {
  link: ProjectLink | Extract<ContentBlock, {type: "link"}>; locale: AppLocale;
}) {
  const t = useTranslations("Details");
  const href = resolveProjectLinkHref(link, locale);
  if (!href) return null;
  const label = resolveLocalizedText(link.label, locale);
  const download = link.type === "document" && href.startsWith("/");
  return <a href={href} download={download || undefined} target={download ? undefined : "_blank"}
    rel={download ? undefined : "noopener noreferrer"}
    aria-label={t(download ? "downloadDocument" : "openLink", {label})}>
    {label} <span aria-hidden="true">{download ? "↓" : "↗"}</span>
  </a>;
}
