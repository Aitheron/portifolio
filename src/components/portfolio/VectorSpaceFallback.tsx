import {useTranslations} from "next-intl";
import {useId} from "react";

import {clusters} from "@/content/clusters";
import {identity} from "@/content/identity";
import {portfolioNodes} from "@/content/nodes";
import type {AppLocale} from "@/i18n/routing";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import {useExperienceStore} from "@/store/experience-store";

import {ProceduralCover} from "./ProceduralCover";

type VectorSpaceFallbackProps = {
  locale: AppLocale;
  webglUnavailable?: boolean;
  onNavigate?: () => void;
};

export function VectorSpaceFallback({
  locale,
  webglUnavailable = false,
  onNavigate,
}: VectorSpaceFallbackProps) {
  const t = useTranslations("Fallback");
  const titleId = useId();
  const selectedClusterId = useExperienceStore((state) => state.selectedClusterId);
  const focusCluster = useExperienceStore((state) => state.focusCluster);
  const focusNode = useExperienceStore((state) => state.focusNode);

  return (
    <section className="fallback-map" aria-labelledby={titleId}>
        <header className="fallback-map__header">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id={titleId}>{webglUnavailable ? t("title") : t("explore")}</h2>
          <p>{resolveLocalizedText(identity.title, locale)} · {resolveLocalizedText(identity.primaryRole, locale)} · {resolveLocalizedText(identity.secondaryRole, locale)}</p>
          {webglUnavailable && <p>{t("description")}</p>}
        </header>

      <div className="fallback-clusters">
        {clusters.map((cluster) => {
          const nodes = portfolioNodes.filter((node) => node.cluster === cluster.id);
          const clusterTitle = resolveLocalizedText(cluster.title, locale);
          const isSelected = selectedClusterId === cluster.id;

          return (
            <article
              className={`fallback-cluster${isSelected ? " is-selected" : ""}`}
              key={cluster.id}
            >
              <h3>
                <button
                  type="button"
                  className="fallback-cluster__header"
                  onClick={() => focusCluster(cluster.id)}
                  aria-expanded={isSelected}
                >
                  <span className="cluster-index" aria-hidden="true">
                    {String(clusters.indexOf(cluster) + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <strong>{clusterTitle}</strong>
                    <small>{resolveLocalizedText(cluster.description, locale)}</small>
                  </span>
                </button>
              </h3>

              <div className="fallback-nodes">
                {nodes.length === 0 && <p className="case-note">{t("empty")}</p>}
                {nodes.map((node) => {
                  const title = resolveLocalizedText(node.title, locale);
                  return (
                    <button
                      type="button"
                      className="fallback-node"
                      key={node.id}
                      onClick={() => {focusNode(node.id, node.cluster, webglUnavailable); onNavigate?.();}}
                      aria-label={t("openNode", {title})}
                    >
                      <ProceduralCover node={node} locale={locale} compact />
                      <span className="fallback-node__summary">{resolveLocalizedText(node.summary, locale)}</span>
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
