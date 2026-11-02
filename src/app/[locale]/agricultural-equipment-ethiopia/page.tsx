import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Locale, locales } from "@/lib/i18n/config";
import { serviceAreas } from "@/lib/data/service-areas";
import { LocalSEOTemplate } from "@/components/local-seo-template";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;

  return {
    title: "Agricultural Equipment & Farm Machinery Ethiopia | Tekhaf Trading",
    description:
      "Complete agricultural equipment supplier in Ethiopia: 4WD tractors, disc ploughs, offset harrows, seed drills, trailers, and combine harvesters. Duty-free purchase guidance by Dagim Melese.",
    keywords: [
      "Agricultural Equipment Ethiopia",
      "Farm Machinery Ethiopia",
      "Disc Plough Ethiopia",
      "Tractor Implements Addis Ababa",
      "Duty Free Tractor Ethiopia",
      "Heavy Equipment Ethiopia",
    ],
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/agricultural-equipment-ethiopia`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const area = serviceAreas.find((a) => a.slug === "agricultural-equipment-ethiopia");

  if (!area) notFound();

  return <LocalSEOTemplate currentLocale={currentLocale} area={area} />;
}
