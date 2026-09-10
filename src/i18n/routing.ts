import {defineRouting} from "next-intl/routing";
import {locales} from "../lib/portfolio-types";

export const routing = defineRouting({
  locales,
  defaultLocale: "pt",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
