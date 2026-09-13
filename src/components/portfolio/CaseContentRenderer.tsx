import {resolveLocalizedText} from "@/lib/portfolio-types";
import type {AppLocale, PortfolioNode} from "@/lib/portfolio-types";
import {CaseMediaImage} from "./CaseMediaImage";

/** The fixed hero/context shell stays outside this ordered editorial flow. */
export function CaseContentRenderer({node, locale}: {node: PortfolioNode; locale: AppLocale}) {
  return node.content?.map((block, index) => {
    switch (block.type) {
      case "text": return <section className="node-taxonomy" key={index}>
        {block.title && <h3>{resolveLocalizedText(block.title, locale)}</h3>}
        <p className="node-description case-text">{resolveLocalizedText(block.body, locale)}</p>
      </section>;
      case "image": return <div className={`case-gallery case-image case-image--${block.presentation?.size ?? "full"} case-image--${block.presentation?.align ?? "center"}`} key={index}>
        <CaseMediaImage image={block} node={node} locale={locale} />
      </div>;
      case "gallery": return <div className="case-gallery" key={index}>
        {block.images.map((image, i) => <CaseMediaImage key={`${image.src}-${i}`} image={image} node={node} locale={locale} />)}
      </div>;
      case "metric": return <section className="node-taxonomy case-metric" key={index}>
        <h3>{resolveLocalizedText(block.label, locale)}</h3>
        <strong className="node-summary">{block.value}</strong>
        {block.description && <p className="node-description">{resolveLocalizedText(block.description, locale)}</p>}
      </section>;
      case "link": return <div className="node-links" key={index}>
        <a href={block.href} target="_blank" rel="noopener noreferrer">{resolveLocalizedText(block.label, locale)} <span aria-hidden="true">↗</span></a>
      </div>;
    }
  });
}
