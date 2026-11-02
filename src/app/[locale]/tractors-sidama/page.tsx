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
    title: "Tractors & Farm Machinery in Sidama & Hawassa | Tekhaf Trading",
    description:
      "Maneuverable 75 HP tractors for coffee cooperatives, maize farming, and agro-processing in Sidama Region and Hawassa. New Holland and Lovol tractors with on-site technician service.",
    keywords: [
      "Tractors Sidama",
      "Tractor Sales Hawassa",
      "Farm Machinery Sidama",
      "Coffee Cooperative Tractors",
      "New Holland Hawassa",
    ],
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/tractors-sidama`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const area = serviceAreas.find((a) => a.slug === "tractors-sidama");

  if (!area) notFound();

  return <LocalSEOTemplate currentLocale={currentLocale} area={area} />;
}
