import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { serviceAreas } from "@/lib/data/service-areas";
import { Breadcrumb } from "@/components/breadcrumb";
import { MapPin, Phone, ArrowRight, ShieldCheck, Tractor } from "lucide-react";

interface ServiceAreasPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ServiceAreasPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;

  return {
    title: "Tractor Service Areas & Regional Delivery in Ethiopia | Tekhaf Trading",
    description:
      "Tekhaf Trading delivers agricultural tractors across Oromia, Addis Ababa, Hawassa / Sidama, Dire Dawa, Somali Region, and Amhara Region with 1-year warranty and technician deployment.",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.serviceAreas },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-tekhaf-900 via-tekhaf-800 to-tekhaf-950 text-white p-8 sm:p-12 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-300">
            Ethiopia Coverage
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Tractor Sales & Field Support by Region
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Tekhaf Trading supports mechanized farming in all major agricultural zones. Every tractor is paired with implements and operator orientation adapted to your local soil and crop requirements.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-tekhaf-200">
            <ShieldCheck className="w-4 h-4 text-tekhaf-400" />
            <span>On-Farm Delivery with Technician Handover Nationwide</span>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-tekhaf-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Regional Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceAreas.map((area) => (
          <div
            key={area.slug}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <Image
                src={area.heroImage}
                alt={`${area.title} Ethiopia`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-xs font-bold bg-tekhaf-700/90 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {area.regionName}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-tekhaf-700 transition-colors">
                  <Link href={`/${currentLocale}/${area.slug}`}>
                    {area.title}
                  </Link>
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {area.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Farming Conditions:</span>
                    <span className="font-semibold text-slate-800">{area.farmingContext}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Recommended Power:</span>
                    <span className="font-bold text-tekhaf-700">{area.recommendedHorsepower}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/${currentLocale}/${area.slug}`}
                  className="text-xs font-bold text-tekhaf-700 hover:text-tekhaf-800 flex items-center gap-1"
                >
                  <span>Explore Regional Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <span className="text-[11px] text-slate-400 font-medium">
                  {area.hubOffice.split(",")[0]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
