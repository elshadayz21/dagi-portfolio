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
    title: "Tractors for Sale in Oromia (Arsi, Bale, Shewa) | Tekhaf Trading",
    description:
      "Heavy-duty 4WD tractors for wheat, teff, and barley farms across Oromia. Massey Ferguson 385 4WD and Lovol TB754 with direct delivery to Adama, Asella, Shashemene, and Jimma.",
    keywords: [
      "Tractors Oromia",
      "Tractor Sales Arsi",
      "Massey Ferguson Oromia",
      "Agricultural Machinery Oromia",
      "Buy Tractor Bale",
      "Farm Equipment Adama",
    ],
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/tractors-oromia`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const area = serviceAreas.find((a) => a.slug === "tractors-oromia");

  if (!area) notFound();

  return <LocalSEOTemplate currentLocale={currentLocale} area={area} />;
}
