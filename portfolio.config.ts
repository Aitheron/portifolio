/** Engine settings. Biography, projects and interface copy live in src/content/. */
export const portfolioConfig: {
  defaultLocale: string;
  locales: string[];
  localeLabels: Record<string, {label: string; code: string; languageTag?: string}>;
  branding: {spaceName: string};
  contentSchemaVersion: number;
} = {
  defaultLocale: "pt",
  locales: ["pt", "en"],
  localeLabels: {
    pt: {label: "Português", code: "PT-BR", languageTag: "pt-BR"},
    en: {label: "English", code: "EN"},
  },
  branding: {spaceName: "Vector Space"},
  contentSchemaVersion: 1,
};

export function localeLabel(locale: string) {
  return portfolioConfig.localeLabels[locale] ?? {label: locale, code: locale.toUpperCase()};
}
