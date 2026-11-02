import Image from "next/image";
import Link from "next/link";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCMSData, getLiveTractors } from "@/lib/cms-store";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { InquiryModal } from "@/components/inquiry-modal";
import {
  Tractor,
  Phone,
  MessageSquare,
  ArrowRight,
  Wrench,
  Shield,
  Truck,
} from "lucide-react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);

  const cms = await getCMSData();
  const allTractors = await getLiveTractors();
  const featuredTractors = allTractors.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION: Clean, spacious, Dagim Melese as main title */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-tekhaf-700 block">
                  {cms.jobTitle}
                </span>
                {/* Main Prominent Name */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                  {cms.representativeName}
                </h1>
                {/* Company Affiliation below the name */}
                <p className="text-base sm:text-lg font-semibold text-tekhaf-700">
                  {cms.companyName}
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {cms.biography}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href={`/${currentLocale}/contact`}
                  className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
                >
                  {dict.hero.contactButton}
                </Link>

                <Link
                  href={`/${currentLocale}/products`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  {dict.hero.browseTractors}
                </Link>

                <a
                  href={`tel:${cms.phone}`}
                  className="border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold px-5 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-tekhaf-700" />
                  <span>{cms.phoneDisplay}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Consultant Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-88 sm:w-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
                <Image
                  src={cms.profilePhoto}
                  alt={cms.representativeName}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES OVERVIEW: 3 Clean Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center">
              <Tractor className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Commercial Farm Tractors
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Matching farmers and cooperatives with tested 4WD models (75 HP to 120 HP) suited to local soils and operations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Genuine Spare Parts
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Guaranteed Perkins and OEM spare parts availability from Tekhaf Trading’s central warehouse in Addis Ababa.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Field Handover & Support
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct farm delivery with technician inspection and hands-on driver orientation on safety and regular maintenance.
            </p>
          </div>
        </div>
      </section>

      {/* 3. TRACTOR SHOWCASE: Clean, Simple Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Machinery
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Popular agricultural models available through Tekhaf Trading.
            </p>
          </div>
          <Link
            href={`/${currentLocale}/products`}
            className="text-xs font-bold text-tekhaf-700 hover:text-tekhaf-800 flex items-center gap-1"
          >
            <span>All Tractors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTractors.map((tractor) => (
            <div
              key={tractor.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-100">
                <Image src={tractor.image} alt={tractor.title} fill className="object-cover" />
                <span className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                  {tractor.horsepower} HP
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {tractor.brand}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                    <Link
                      href={`/${currentLocale}/products/${tractor.slug}`}
                      className="hover:text-tekhaf-700 transition-colors"
                    >
                      {tractor.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {tractor.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/${currentLocale}/products/${tractor.slug}`}
                    className="flex-1 text-center py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Details
                  </Link>
                  <InquiryModal
                    currentLocale={currentLocale}
                    tractorTitle={tractor.title}
                    triggerButtonText="Inquire"
                    className="flex-1 text-center py-2 px-3 rounded-lg bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ABOUT DAGIM MELESE: Simple & Professional */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-700">
              Professional Profile
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              About {cms.representativeName}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Dagim Melese represents Tekhaf Trading as a dedicated agricultural machinery sales consultant in Addis Ababa. Over the past 12 years, Dagim has advised agricultural cooperatives, private commercial estates, and emerging agribusinesses on tractor horsepower sizing, disc plough configurations, and maintenance routines.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-tekhaf-700" />
                <span>12+ Years Field Experience</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-tekhaf-700" />
                <span>Tekhaf Trading Representative</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-tekhaf-700" />
                <span>Comprehensive Technical Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIMPLE CONTACT INQUIRY SECTION */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          <div className="text-center max-w-lg mx-auto mb-8">
            <h2 className="text-2xl font-black text-slate-900">
              {dict.contactForm.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {dict.contactForm.subtitle}
            </p>
          </div>

          <LeadCaptureForm
            currentLocale={currentLocale}
            sourceContext="Homepage Generic Inquiry Form"
          />
        </div>
      </section>
    </div>
  );
}
