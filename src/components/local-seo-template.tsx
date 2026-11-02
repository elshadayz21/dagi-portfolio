import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ServiceAreaInfo } from "@/lib/data/service-areas";
import { tractorInventory } from "@/lib/data/inventory";
import { Breadcrumb } from "@/components/breadcrumb";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { InquiryModal } from "@/components/inquiry-modal";
import { Phone, MessageSquare, MapPin, ArrowRight } from "lucide-react";

interface LocalSEOTemplateProps {
  currentLocale: Locale;
  area: ServiceAreaInfo;
  representativeName?: string;
  companyName?: string;
  phoneDisplay?: string;
  phone?: string;
}

export function LocalSEOTemplate({
  currentLocale,
  area,
  representativeName = "Dagim Melese",
  companyName = "Tekhaf Trading",
  phoneDisplay = "+251 91 123 4567",
  phone = "+251911234567",
}: LocalSEOTemplateProps) {
  const dict = getDictionary(currentLocale);
  const recommendedTractors = tractorInventory.filter(
    (t) =>
      area.popularTractors.includes(t.title) ||
      area.popularTractors.includes(t.modelNumber) ||
      t.bestForRegions.some((r) => area.regionName.includes(r))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.serviceAreas, href: `/${currentLocale}/service-areas` },
          { label: area.regionName },
        ]}
      />

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-tekhaf-700">
              <MapPin className="w-4 h-4" />
              <span>{area.regionName}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {area.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {area.subtitle}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`tel:${phone}`}
                className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {phoneDisplay}</span>
              </a>
              <a
                href={`https://wa.me/251911234567`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative h-56 rounded-xl overflow-hidden border border-slate-200">
              <Image src={area.heroImage} alt={area.title} fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Content & Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Regional Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {area.description}
            </p>
            <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800 block mb-0.5">Agricultural Profile:</span>
              <span>{area.farmingContext}</span>
            </div>
          </div>

          {/* Recommended Tractors */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Machinery Recommended for {area.regionName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedTractors.slice(0, 4).map((tractor) => (
                <div
                  key={tractor.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden p-4 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {tractor.brand} • {tractor.horsepower} HP
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{tractor.title}</h4>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/${currentLocale}/products/${tractor.slug}`}
                      className="text-tekhaf-700 font-semibold hover:underline"
                    >
                      Details &rarr;
                    </Link>
                    <InquiryModal
                      currentLocale={currentLocale}
                      tractorTitle={tractor.title}
                      triggerButtonText="Inquire"
                      className="px-3 py-1 bg-tekhaf-700 text-white rounded text-[11px] font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Inquiry Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Contact Regarding {area.regionName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Inquire about tractors or regional transport with Dagim Melese.
            </p>
            <LeadCaptureForm
              currentLocale={currentLocale}
              sourceContext={`Regional Page: ${area.regionName}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
