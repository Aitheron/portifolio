import type {CSSProperties} from "react";

import {clusterById} from "@/content/clusters";
import type {AppLocale} from "@/i18n/routing";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import type {PortfolioNode} from "@/lib/portfolio-types";

type ProceduralCoverProps = {
  node: PortfolioNode;
  locale: AppLocale;
  compact?: boolean;
};

export function ProceduralCover({node, locale, compact = false}: ProceduralCoverProps) {
  const cluster = clusterById[node.cluster];
  const title = resolveLocalizedText(node.title, locale);
  const clusterTitle = resolveLocalizedText(cluster.title, locale);
  const style = {"--cover-accent": cluster.color} as CSSProperties;

  return (
    <div
      className={`procedural-cover procedural-cover--${node.visual.variant}${compact ? " procedural-cover--compact" : ""}`}
      style={style}
      role="img"
      aria-label={`${title} — ${clusterTitle}`}
    >
      <div className="procedural-cover__field" aria-hidden="true">
        {Array.from({length: 7}, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="procedural-cover__copy">
        <strong>{title}</strong>
        <span>{clusterTitle}</span>
      </div>
    </div>
  );
}
