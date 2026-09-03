import {hasLocale} from "next-intl";
import {getRequestConfig} from "next-intl/server";
import * as rootParams from "next/root-params";
import {notFound} from "next/navigation";

import {routing} from "./routing";

export default getRequestConfig(async ({locale}) => {
  let resolvedLocale = locale;

  if (!hasLocale(routing.locales, resolvedLocale)) {
    const routeLocale = await rootParams.locale();
    if (!hasLocale(routing.locales, routeLocale)) notFound();
    resolvedLocale = routeLocale;
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
