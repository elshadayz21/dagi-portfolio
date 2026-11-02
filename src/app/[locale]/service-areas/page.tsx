import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { serviceAreas } from "@/lib/data/service-areas";
import { getCMSData } from "@/lib/cms-store";
import { Breadcrumb } from "@/components/breadcrumb";
import { MapPin, ArrowRight } from "lucide-react";

interface ServiceAreasPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ServiceAreasPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const cms = await getCMSData();

  return {
    title: `Regional Service Locations | ${cms.representativeName} - ${cms.companyName}`,
    description: `Agricultural tractor deliveries and field support across Oromia, Addis Ababa, Sidama, Somali Region, and Amhara Region.`,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.serviceAreas },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl border border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Regional Service Locations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Facilitating tractor delivery, field orientation, and spare parts across Ethiopia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceAreas.map((area) => (
          <div
            key={area.slug}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="relative h-44 bg-slate-100">
              <Image src={area.heroImage} alt={area.title} fill className="object-cover" />
              <span className="absolute bottom-3 left-3 bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded">
                {area.regionName}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  <Link
                    href={`/${currentLocale}/${area.slug}`}
                    className="hover:text-tekhaf-700 transition-colors"
                  >
                    {area.title}
                  </Link>
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                  {area.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={`/${currentLocale}/${area.slug}`}
                  className="font-semibold text-tekhaf-700 hover:underline flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
