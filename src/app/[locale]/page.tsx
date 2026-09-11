import {identity} from "@/content/identity";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import {validateContentAssets} from "@/lib/content-assets.server";
import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {VectorSpaceExperience} from "@/components/portfolio/VectorSpaceExperience";
import type {AppLocale} from "@/i18n/routing";
import {routing} from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const {locale} = await params;


  return {title: resolveLocalizedText(identity.metadata.title, locale), description: resolveLocalizedText(identity.metadata.description, locale)};
}

export default async function HomePage({params}: HomePageProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  validateContentAssets();
  setRequestLocale(locale);
  return <VectorSpaceExperience locale={locale as AppLocale} />;
}
