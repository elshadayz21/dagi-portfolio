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
    title: "Tractors for Somali Region & Eastern Ethiopia | Tekhaf Trading",
    description:
      "Heavy-duty tractors with air-conditioned cabins and reinforced cooling radiators for irrigated commercial farming in Gode, Jigjiga, and along the Wabe Shebelle river basin.",
    keywords: [
      "Tractors Somali Region",
      "Tractor Sales Jigjiga",
      "Farm Machinery Gode",
      "Irrigation Tractors Ethiopia",
      "Air Conditioned Tractor Ethiopia",
    ],
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/tractors-somali-region`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const area = serviceAreas.find((a) => a.slug === "tractors-somali-region");

  if (!area) notFound();

  return <LocalSEOTemplate currentLocale={currentLocale} area={area} />;
}
