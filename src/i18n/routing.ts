import {defineRouting} from "next-intl/routing";
import {portfolioConfig} from "../../portfolio.config";

export const routing = defineRouting({
  locales: portfolioConfig.locales,
  defaultLocale: portfolioConfig.defaultLocale,
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
