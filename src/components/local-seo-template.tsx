import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ServiceAreaInfo } from "@/lib/data/service-areas";
import { tractorInventory } from "@/lib/data/inventory";
import { dagimProfile } from "@/lib/data/profile";
import { Breadcrumb } from "@/components/breadcrumb";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { QuoteModal } from "@/components/quote-modal";
import {
  Tractor,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  MapPin,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface LocalSEOTemplateProps {
  currentLocale: Locale;
  area: ServiceAreaInfo;
}

export function LocalSEOTemplate({ currentLocale, area }: LocalSEOTemplateProps) {
  const dict = getDictionary(currentLocale);
  const recommendedTractors = tractorInventory.filter(
    (t) =>
      area.popularTractors.includes(t.title) ||
      area.popularTractors.includes(t.modelNumber) ||
      t.bestForRegions.some((r) => area.regionName.includes(r))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.serviceAreas, href: `/${currentLocale}/service-areas` },
          { label: area.regionName },
        ]}
      />

      {/* Hero Banner with Location Target */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-tekhaf-950 via-tekhaf-900 to-tekhaf-800 text-white p-8 sm:p-14 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tekhaf-500/20 text-tekhaf-300 text-xs font-bold border border-tekhaf-400/30">
              <MapPin className="w-3.5 h-3.5" />
              <span>{area.regionName} Agricultural Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {area.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
              {area.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${dagimProfile.phone}`}
                className="bg-tekhaf-600 hover:bg-tekhaf-500 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Regional Sales ({dagimProfile.phoneDisplay})</span>
              </a>

              <a
                href={dagimProfile.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Dagim Melese</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative h-64 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
              <Image
                src={area.heroImage}
                alt={`${area.title} tractor delivery`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-tekhaf-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Regional Context & Mechanization Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Mechanization Advice for {area.regionName}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {area.description}
            </p>

            <div className="p-4 rounded-xl bg-tekhaf-50 border border-tekhaf-100 text-xs text-slate-800 space-y-1">
              <span className="font-bold text-tekhaf-900 block">Soil & Crop Compatibility:</span>
              <p>{area.farmingContext}</p>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                What Tekhaf Trading Delivers to {area.regionName}:
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct truck delivery to your farm location</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>On-site operator safety orientation & 50-hour inspection visit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Priority spare parts dispatch from Addis Ababa warehouse</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Duty-free exemption support for registered cooperatives and commercial growers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Recommended Tractors in this region */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Recommended Tractor Models for {area.regionName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedTractors.slice(0, 4).map((tractor) => (
                <div
                  key={tractor.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative h-36 bg-slate-100">
                    <Image src={tractor.image} alt={tractor.title} fill className="object-cover" />
                    <span className="absolute top-2 left-2 bg-tekhaf-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {tractor.horsepower} HP • {tractor.driveType}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{tractor.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{tractor.summary}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-tekhaf-700">{tractor.priceFormatted}</span>
                      <Link
                        href={`/${currentLocale}/products/${tractor.slug}`}
                        className="text-xs font-bold text-tekhaf-700 hover:text-tekhaf-800 flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Capture Form Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-tekhaf-200 shadow-lg sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Request Price Quote for {area.regionName}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Dagim Melese will prepare a quote including transport to your farm.
            </p>

            <LeadCaptureForm
              currentLocale={currentLocale}
              sourceContext={`Local SEO Page: ${area.regionName}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
