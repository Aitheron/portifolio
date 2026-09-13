import {useTranslations} from "next-intl";
import {useState} from "react";
import {resolveImageSource, resolveLocalizedText} from "@/lib/portfolio-types";
import type {AppLocale, PortfolioImage, PortfolioNode} from "@/lib/portfolio-types";
import {ProceduralCover} from "./ProceduralCover";

export function CaseMediaImage({image, node, locale}: {image: PortfolioImage; node: PortfolioNode; locale: AppLocale}) {
  const t = useTranslations("Details");
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const src = resolveImageSource(image, locale);
  const failed = failedSource === src;
  const alt = resolveLocalizedText(image.alt, locale);
  const caption = resolveLocalizedText(image.caption, locale) || alt;
  return <figure>
    {failed ? <ProceduralCover node={node} locale={locale} /> : (
      <img src={src} alt={alt} loading="lazy" decoding="async" width={960} height={540} onError={() => setFailedSource(src)} />
    )}
    {(failed || image.category === "conceptual" || caption) && <figcaption>{failed || image.category === "conceptual" ? t("conceptual") : caption}</figcaption>}
  </figure>;
}
