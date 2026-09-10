import {useTranslations} from "next-intl";
import {useState} from "react";

import {portfolioGraph} from "@/content/nodes";
import type {GraphTarget} from "@/lib/portfolio-graph";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import type {AppLocale, PortfolioImage, PortfolioNode} from "@/lib/portfolio-types";
import {ProceduralCover} from "./ProceduralCover";

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
  const signals = node.satellites ?? [];
  const related = (node.relations ?? []).flatMap((relation) => {
    const target = portfolioGraph.get(relation.targetId);
    return target ? [{relation, target}] : [];
  });

  return (
    <>
      {metadata.length > 0 && <p className="case-metadata">{metadata.join(" · ")}</p>}
      {node.provisional && <p className="case-note">{t("provisional")}</p>}
      {sections.map((key) => <section className="node-taxonomy" key={key}>
        <h3>{t(key)}</h3><p className="node-description">{resolveLocalizedText(node[key]!, locale)}</p>
      </section>)}
      {node.technologies.length > 0 && <section className="node-taxonomy">
        <h3>{t("technologies")}</h3><ul>{node.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
      </section>}
      {signals.length > 0 && <section className="node-taxonomy">
        <h3>{t("context")}</h3><ul>{signals.map((signal) => <li key={signal.id}>{resolveLocalizedText(signal.label, locale)}</li>)}</ul>
        {node.provisional && signals.some(({type}) => type === "metric") && <p className="case-note">{t("provisionalMetrics")}</p>}
      </section>}
      {node.tags.length > 0 && <section className="node-taxonomy">
        <h3>{t("tags")}</h3><ul>{node.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
      </section>}
      {related.length > 0 && <section className="node-taxonomy">
        <h3>{t("related")}</h3>
        <ul className="case-relations">{related.map(({relation, target}) => <li key={`${relation.type}:${target.id}`}>
          <button type="button" onClick={() => onNavigate(target)}>
            <small>{t(`relations.${relation.type}`)}</small>
            {resolveLocalizedText(target.title, locale)} <span aria-hidden="true">↗</span>
          </button>
        </li>)}</ul>
      </section>}
      {!!node.gallery?.length && <section className="node-taxonomy case-gallery">
        <h3>{t("gallery")}</h3>{node.gallery.map((image) => <CaseGalleryImage key={image.src} image={image} node={node} locale={locale} />)}
      </section>}
      {!!node.links?.length && <section className="node-links">
        <h3>{t("links")}</h3>{node.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" aria-label={t("openLink", {label: resolveLocalizedText(link.label, locale)})}>
          {resolveLocalizedText(link.label, locale)} <span aria-hidden="true">↗</span>
        </a>)}
      </section>}
    </>
  );
}

function CaseGalleryImage({image, node, locale}: {image: PortfolioImage; node: PortfolioNode; locale: AppLocale}) {
  const t = useTranslations("Details");
  const [failed, setFailed] = useState(false);
  const alt = resolveLocalizedText(image.alt, locale);
  return (
    <figure>
      {failed ? <ProceduralCover node={node} locale={locale} /> : (
        <img src={image.src} alt={alt} loading="lazy" decoding="async" width={960} height={540} onError={() => setFailed(true)} />
      )}
      <figcaption>{failed || image.category === "conceptual" ? t("conceptual") : alt}</figcaption>
    </figure>
  );
}
