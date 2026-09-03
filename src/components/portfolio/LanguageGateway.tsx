import {useTranslations} from "next-intl";

import type {AppLocale} from "@/i18n/routing";

type LanguageGatewayProps = {
  selectedLocale: AppLocale | null;
  onSelect: (locale: AppLocale) => void;
};

const options: readonly {locale: AppLocale; code: string; labelKey: "portuguese" | "english"; ariaKey: "choosePortuguese" | "chooseEnglish"}[] = [
  {locale: "pt", code: "PT-BR", labelKey: "portuguese", ariaKey: "choosePortuguese"},
  {locale: "en", code: "EN", labelKey: "english", ariaKey: "chooseEnglish"},
];

export function LanguageGateway({selectedLocale, onSelect}: LanguageGatewayProps) {
  const t = useTranslations("Gateway");

  if (selectedLocale) {
    return (
      <section className="gateway gateway--entering" aria-live="polite">
        <p className="eyebrow">{t("acquired")}</p>
        <strong>{selectedLocale === "pt" ? "PT-BR" : "EN"}</strong>
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
        {options.map((option) => (
          <button
            className="language-signal"
            key={option.locale}
            type="button"
            aria-label={t(option.ariaKey)}
            onClick={() => onSelect(option.locale)}
          >
            <span className="language-signal__glyph" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="language-signal__copy">
              <strong>{t(option.labelKey)}</strong>
              <small>{option.code}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
