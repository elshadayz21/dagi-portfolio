import { Metadata } from "next";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getAllLocations } from "@/lib/location-store";
import { getCMSData } from "@/lib/cms-store";
import { Breadcrumb } from "@/components/breadcrumb";
import { LocationsFilterView } from "@/components/locations-filter-view";

interface ServiceAreasPageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ServiceAreasPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const cms = await getCMSData();

  return {
    title: `Regional Service Locations & Hubs | ${cms.representativeName} - ${cms.companyName}`,
    description: `Agricultural tractor deliveries, on-farm field orientation, and spare parts across Adama, Bishoftu, Bahir Dar, Mekele, Addis Ababa, and all Ethiopian regions.`,
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/service-areas`,
    },
  };
}

export default async function ServiceAreasPage({
  params,
}: ServiceAreasPageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);
  const cms = await getCMSData();
  const locations = await getAllLocations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.serviceAreas },
        ]}
      />

      {/* Page Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Regional Service Locations & Machinery Hubs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
          Facilitating direct farm tractor delivery, implement sizing, warranty inspections, and genuine Perkins parts distribution across Ethiopian agricultural corridors.
        </p>
      </div>

      {/* Dynamic Filterable Locations View (with Region & City Filtering) */}
      <LocationsFilterView
        currentLocale={currentLocale}
        initialLocations={locations}
        phoneDisplay={cms.phoneDisplay}
        phone={cms.phone}
        representativeName={cms.representativeName}
      />
    </div>
  );
}
