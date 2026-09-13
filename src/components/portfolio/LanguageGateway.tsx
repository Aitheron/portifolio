import {localeLabel, portfolioConfig} from "../../../portfolio.config";
import {useTranslations} from "next-intl";

import type {AppLocale} from "@/i18n/routing";

type LanguageGatewayProps = {
  selectedLocale: AppLocale | null;
  onSelect: (locale: AppLocale) => void;
};

export function LanguageGateway({selectedLocale, onSelect}: LanguageGatewayProps) {
  const t = useTranslations("Gateway");

  if (selectedLocale) {
    return (
      <section className="gateway gateway--entering" aria-live="polite">
        <p className="eyebrow">{t("acquired")}</p>
        <strong>{localeLabel(selectedLocale).code}</strong>
        <p>{t("entering")}</p>
        <div className="gateway-distortion" aria-hidden="true" />
      </section>
    );
  }

  return (
    <section className="gateway" aria-labelledby="gateway-title">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 id="gateway-title">{t("title")}</h1>
      <p className="gateway__description">{t("description")}</p>
      <div className="language-signals">
        {portfolioConfig.locales.map((option) => (
          <button
            className="language-signal"
            key={option}
            type="button"
            aria-label={localeLabel(option).label}
            onClick={() => onSelect(option)}
          >
            <span className="language-signal__glyph" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="language-signal__copy">
              <strong>{localeLabel(option).label}</strong>
              <small>{localeLabel(option).code}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
