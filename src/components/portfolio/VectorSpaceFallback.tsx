import {useTranslations} from "next-intl";

import {clusters} from "@/content/clusters";
import {portfolioNodes} from "@/content/nodes";
import type {AppLocale} from "@/i18n/routing";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import {useExperienceStore} from "@/store/experience-store";

import {ProceduralCover} from "./ProceduralCover";

type VectorSpaceFallbackProps = {
  locale: AppLocale;
  webglUnavailable?: boolean;
};

export function VectorSpaceFallback({
  locale,
  webglUnavailable = false,
}: VectorSpaceFallbackProps) {
  const t = useTranslations("Fallback");
  const selectedClusterId = useExperienceStore((state) => state.selectedClusterId);
  const focusCluster = useExperienceStore((state) => state.focusCluster);
  const selectNode = useExperienceStore((state) => state.selectNode);

  return (
    <section className="fallback-map" aria-labelledby="fallback-title">
      {webglUnavailable && (
        <header className="fallback-map__header">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="fallback-title">{t("title")}</h2>
          <p>{t("description")}</p>
        </header>
      )}

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
                {nodes.map((node) => {
                  const title = resolveLocalizedText(node.title, locale);
                  return (
                    <button
                      type="button"
                      className="fallback-node"
                      key={node.id}
                      onClick={() => selectNode(node.id, node.cluster)}
                      aria-label={t("openNode", {title})}
                    >
                      <ProceduralCover node={node} locale={locale} compact />
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
