import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Locale, locales } from "@/lib/i18n/config";
import { getLocationBySlug } from "@/lib/location-store";
import { LocalSEOTemplate } from "@/components/local-seo-template";
import { getCMSData } from "@/lib/cms-store";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const area = await getLocationBySlug(slug);
  const cms = await getCMSData();

  if (!area) {
    return {
      title: `Location Not Found | ${cms.companyName}`,
    };
  }

  return {
    title: `${area.title} | ${cms.representativeName} - ${cms.companyName}`,
    description: area.description,
    keywords: [
      `Tractors ${area.name}`,
      `Tractor Dealer ${area.name}`,
      `Buy Tractor ${area.region}`,
      `${cms.companyName} ${area.name}`,
      `Agricultural Equipment ${area.name}`,
    ],
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/locations/${area.slug}`,
    },
  };
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const area = await getLocationBySlug(slug);
  const cms = await getCMSData();

  if (!area) notFound();

  // Adapt LocationItem to ServiceAreaInfo for LocalSEOTemplate
  const serviceAreaAdapted = {
    slug: area.slug,
    regionName: area.regionName || `${area.name} (${area.region})`,
    title: area.title,
    subtitle: area.subtitle || area.title,
    heroImage: area.heroImage,
    description: area.description,
    farmingContext: area.farmingContext,
    recommendedHorsepower: area.recommendedHorsepower,
    popularTractors: area.popularTractors || ["Massey Ferguson MF 385 4WD", "Lovol TB754 4WD"],
    hubOffice: area.hubOffice,
    phone: area.phone || cms.phone,
  };

  return (
    <LocalSEOTemplate
      currentLocale={currentLocale}
      area={serviceAreaAdapted}
      representativeName={cms.representativeName}
      companyName={cms.companyName}
      phoneDisplay={cms.phoneDisplay}
      phone={cms.phone}
    />
  );
}
