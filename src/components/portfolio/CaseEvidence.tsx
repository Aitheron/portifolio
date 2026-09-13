import {useTranslations} from "next-intl";

import {portfolioGraph} from "@/content/nodes";
import type {GraphTarget} from "@/lib/portfolio-graph";
import {remainingGalleryImages, resolveLocalizedText} from "@/lib/portfolio-types";
import type {AppLocale, PortfolioNode} from "@/lib/portfolio-types";
import {CaseMediaImage} from "./CaseMediaImage";
import {CaseContentRenderer} from "./CaseContentRenderer";
import {CaseLink} from "./CaseLink";
import {resolveProjectLinkHref} from "@/lib/project-links";
import {visibleSignals} from "@/lib/semantic-signals";

export function CaseEvidence({node, locale, onNavigate}: {
  node: PortfolioNode; locale: AppLocale; onNavigate: (target: GraphTarget) => void;
}) {
  const t = useTranslations("Details");
  const metadata = [
    node.year, node.projectType && resolveLocalizedText(node.projectType, locale),
    node.status && resolveLocalizedText(node.status, locale), node.company,
    node.participationRole && t(`roles.${node.participationRole}`),
  ].filter(Boolean);
  const sections = (["problem", "solution", "myRole", "impact"] as const).filter((key) => node[key]);
  const signals = visibleSignals(node.signals, "case");
  const gallery = remainingGalleryImages(node);
  const links = (node.links ?? []).filter(link => link.type !== "document");
  const documents = (node.links ?? []).filter(link => link.type === "document" && resolveProjectLinkHref(link, locale));
  const related = (node.relations ?? []).flatMap((relation) => {
    const target = portfolioGraph.get(relation.targetId);
    return target ? [{relation, target}] : [];
  });

  return (
    <>
      {metadata.length > 0 && <p className="case-metadata">{metadata.join(" · ")}</p>}
      {node.provisional && <p className="case-note">{t("provisional")}</p>}
      {node.technologies.length > 0 && <section className="node-taxonomy">
        <h3>{t("technologies")}</h3><ul>{node.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
      </section>}
      {signals.length > 0 && <section className="node-taxonomy">
        <h3>{t("context")}</h3><ul>{signals.map((signal) => <li key={signal.id}>{resolveLocalizedText(signal.label, locale)}</li>)}</ul>
        {node.provisional && signals.some(({type}) => type === "metric") && <p className="case-note">{t("provisionalMetrics")}</p>}
      </section>}
      {sections.map((key) => <section className="node-taxonomy" key={key}>
        <h3>{t(key)}</h3><p className="node-description">{resolveLocalizedText(node[key]!, locale)}</p>
      </section>)}
      <CaseContentRenderer node={node} locale={locale} />
      {!!gallery.length && <section className="node-taxonomy case-gallery">
        <h3>{t("gallery")}</h3>{gallery.map((image, index) => <CaseMediaImage key={`${image.src}-${index}`} image={image} node={node} locale={locale} />)}
      </section>}
      {links.length > 0 && <section className="node-links">
        <h3>{t("links")}</h3>{links.map((link, index) => <CaseLink key={index} link={link} locale={locale} />)}
      </section>}
      {documents.length > 0 && <section className="node-links">
        <h3>{t("documents")}</h3>{documents.map((link, index) => <CaseLink key={index} link={link} locale={locale} />)}
      </section>}
      {related.length > 0 && <section className="node-taxonomy">
        <h3>{t("related")}</h3>
        <ul className="case-relations">{related.map(({relation, target}) => <li key={`${relation.type}:${target.id}`}>
          <button type="button" onClick={() => onNavigate(target)}>
            <small>{relation.label ? resolveLocalizedText(relation.label, locale) : t(`relations.${relation.type}`)}</small>
            {resolveLocalizedText(target.title, locale)} <span aria-hidden="true">↗</span>
          </button>
        </li>)}</ul>
      </section>}
    </>
  );
}
