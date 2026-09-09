import {useTranslations} from "next-intl";

import {clusterById, clusters} from "@/content/clusters";
import {portfolioNodes} from "@/content/nodes";
import type {AppLocale} from "@/i18n/routing";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import {useExperienceStore} from "@/store/experience-store";

type PortfolioHUDProps = {
  onLocaleChange: (locale: AppLocale) => void;
};

export function PortfolioHUD({onLocaleChange}: PortfolioHUDProps) {
  const t = useTranslations("HUD");
  const locale = useExperienceStore((state) => state.locale);
  const selectedClusterId = useExperienceStore((state) => state.selectedClusterId);
  const selectedNodeId = useExperienceStore((state) => state.selectedNodeId);
  const quality = useExperienceStore((state) => state.quality);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const returnToOverview = useExperienceStore((state) => state.returnToOverview);
  const focusCluster = useExperienceStore((state) => state.focusCluster);
  const setReducedMotion = useExperienceStore((state) => state.setReducedMotion);
  const selectedIndex = selectedClusterId
    ? clusters.findIndex((cluster) => cluster.id === selectedClusterId)
    : -1;
  const currentLabel = selectedClusterId
    ? resolveLocalizedText(clusterById[selectedClusterId].title, locale)
    : t("overview");
  const selectedNode = selectedNodeId
    ? portfolioNodes.find((node) => node.id === selectedNodeId)
    : undefined;
  const selectedNodeLabel = selectedNode
    ? resolveLocalizedText(selectedNode.title, locale)
    : null;
  const locationParts = ["Vector Space", currentLabel, selectedNodeLabel]
    .filter((part): part is string => part !== null);
  const qualityLabel = {
    high: t("qualityHigh"),
    medium: t("qualityMedium"),
    low: t("qualityLow"),
  }[quality];

  const moveCluster = (direction: -1 | 1) => {
    const nextIndex = selectedIndex < 0
      ? direction > 0 ? 0 : clusters.length - 1
      : (selectedIndex + direction + clusters.length) % clusters.length;
    focusCluster(clusters[nextIndex].id);
  };

  return (
    <header className="portfolio-hud">
      <div className="hud-brand">
        <span>Marlon</span>
        <strong>// Vector Space</strong>
      </div>

      <nav className="hud-location" aria-live="polite" aria-label={t("location")}>
        {locationParts.map((part, index) => (
          <span
            aria-current={index === locationParts.length - 1 ? "location" : undefined}
            className={index === locationParts.length - 1 ? "is-current" : ""}
            key={`${part}-${index}`}
          >
            {part}
            {index < locationParts.length - 1 && <i aria-hidden="true">/</i>}
          </span>
        ))}
      </nav>

      <div className="hud-actions">
        <div className="locale-switcher" role="group" aria-label={t("selectLanguage")}>
          {(["pt", "en"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={locale === option ? "is-active" : ""}
              aria-pressed={locale === option}
              onClick={() => onLocaleChange(option)}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          className="motion-control"
          type="button"
          aria-pressed={reducedMotion}
          onClick={() => setReducedMotion(!reducedMotion)}
        >
          {t("reducedMotion")}
        </button>
      </div>

      <div className="hud-bottom">
        <span className="navigation-hint">{t("navigationHint")}</span>
        <span className="quality-indicator">{t("quality", {quality: qualityLabel})}</span>
        <button type="button" className="overview-action" onClick={returnToOverview}>
          <span aria-hidden="true">{selectedClusterId ? "←" : "◎"}</span>{" "}
          {selectedClusterId ? t("returnOverview") : t("centerView")}
        </button>
      </div>

      <nav className="mobile-cluster-nav" aria-label={currentLabel}>
        <button type="button" aria-label={t("previousCluster")} onClick={() => moveCluster(-1)}>←</button>
        <span>{currentLabel}</span>
        <button type="button" aria-label={t("centerView")} onClick={returnToOverview}>◎</button>
        <button type="button" aria-label={t("nextCluster")} onClick={() => moveCluster(1)}>→</button>
      </nav>
    </header>
  );
}
