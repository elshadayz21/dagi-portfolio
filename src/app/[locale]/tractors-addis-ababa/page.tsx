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
    title: "Tractor Sales & Dealer in Addis Ababa, Ethiopia | Tekhaf Trading",
    description:
      "Buy Massey Ferguson, Lovol, and New Holland tractors in Addis Ababa. Central warehouse showroom at Bole Medhanialem. Call Dagim Melese for duty-free and standard tractor quotes.",
    keywords: [
      "Tractor Dealer Addis Ababa",
      "Tractor Sales Addis Ababa",
      "Buy Tractor Addis Ababa",
      "Tekhaf Trading Addis Ababa",
      "Agricultural Equipment Addis Ababa",
      "Dagim Melese Tractor Sales",
    ],
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/tractors-addis-ababa`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const area = serviceAreas.find((a) => a.slug === "tractors-addis-ababa");

  if (!area) notFound();

  return <LocalSEOTemplate currentLocale={currentLocale} area={area} />;
}
