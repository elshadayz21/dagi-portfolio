import Image from "next/image";
import Link from "next/link";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { tractorInventory } from "@/lib/data/inventory";
import { dagimProfile } from "@/lib/data/profile";
import { customerTestimonials } from "@/lib/data/testimonials";
import { serviceAreas } from "@/lib/data/service-areas";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { QuoteModal } from "@/components/quote-modal";
import {
  Tractor,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Award,
  Wrench,
  FileCheck,
  Truck,
  ArrowRight,
  Star,
  MapPin,
  Sparkles,
} from "lucide-react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);
  const featuredTractors = tractorInventory.filter((t) => t.isFeatured);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-tekhaf-50/50 to-background pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-tekhaf-100">
        <div className="absolute inset-0 bg-[radial-gradient(#005B96_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tekhaf-100 text-tekhaf-800 text-xs font-bold border border-tekhaf-200">
                <Sparkles className="w-3.5 h-3.5 text-tekhaf-600" />
                <span>{dict.hero.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-tekhaf-950 tracking-tight leading-[1.15]">
                {dict.hero.headline}
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
                {dict.hero.subheadline}
              </p>

              {/* Endorsement card */}
              <div className="p-4 rounded-2xl bg-white border border-tekhaf-100 shadow-sm flex items-center gap-4 text-left max-w-xl mx-auto lg:mx-0">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-tekhaf-600 shadow-inner">
                  <Image
                    src={dagimProfile.profilePhoto}
                    alt={dagimProfile.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {dagimProfile.fullName} • {dagimProfile.jobTitle}
                  </h2>
                  <p className="text-xs text-slate-500 leading-normal">
                    {dagimProfile.companyName} • {dagimProfile.experienceYears}+ Years Helping Ethiopian Farmers Succeed
                  </p>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href={`tel:${dagimProfile.phone}`}
                  className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{dict.common.callNow}</span>
                </a>

                <a
                  href={dagimProfile.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{dict.common.chatWhatsapp}</span>
                </a>

                <Link
                  href={`/${currentLocale}/products`}
                  className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-3.5 rounded-xl text-sm border border-slate-200 shadow-sm transition-all flex items-center gap-2"
                >
                  <Tractor className="w-4 h-4 text-tekhaf-600" />
                  <span>{dict.hero.browseTractors}</span>
                </Link>
              </div>

              {/* Quick Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-tekhaf-600" />
                  <span>Duty-Free Exemption Guidance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-tekhaf-600" />
                  <span>1-Year Comprehensive Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-tekhaf-600" />
                  <span>Genuine Perkins Spare Parts</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Tractor Image + Representative Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <Image
                  src="https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80"
                  alt="Massey Ferguson 385 4WD Tractor Ethiopia Tekhaf Trading"
                  width={700}
                  height={500}
                  priority
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Floating Specs Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-tekhaf-600">
                      Top Seller In Ethiopia
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      Massey Ferguson MF 385 (85 HP, 4WD)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Perkins 4.41 Engine • 2,145 kg Hydraulic Lift
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative background blur */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-tekhaf-400/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl border border-tekhaf-100 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-tekhaf-700">
              {dagimProfile.metrics.tractorsDelivered}+
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              {dict.hero.statsTractors}
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-tekhaf-700">
              {dagimProfile.metrics.satisfiedFarmers}+
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              {dict.hero.statsFarmers}
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-tekhaf-700">
              {dagimProfile.metrics.regionsCovered}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              {dict.hero.statsRegions}
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-tekhaf-700">
              100%
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              {dict.hero.statsWarranty}
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED TRACTOR INVENTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-600">
              Tekhaf Trading Showroom
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Featured Agricultural Tractors
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Equipped for Ethiopian soil conditions. Inspected, pre-serviced, and backed by manufacturer warranty.
            </p>
          </div>
          <Link
            href={`/${currentLocale}/products`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-tekhaf-700 hover:text-tekhaf-800 transition-colors"
          >
            <span>{dict.common.viewInventory}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTractors.map((tractor) => (
            <div
              key={tractor.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <Image
                  src={tractor.image}
                  alt={`${tractor.title} Ethiopia Tekhaf Trading`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-tekhaf-900/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  {tractor.horsepower} HP • {tractor.driveType}
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      tractor.availability === "IN_STOCK"
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {tractor.availability === "IN_STOCK"
                      ? dict.common.inStock
                      : dict.common.preOrder}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-tekhaf-600 mb-1">
                    {tractor.brand}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-tekhaf-700 transition-colors">
                    <Link href={`/${currentLocale}/products/${tractor.slug}`}>
                      {tractor.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {tractor.summary}
                  </p>

                  {/* Specs Quick List */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block">{dict.common.engine}</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {tractor.engineType.split(" ")[0]} Engine
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Hydraulic Lift</span>
                      <span className="font-semibold text-slate-800">
                        {tractor.hydraulicLift.split(" ")[0]} kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/${currentLocale}/products/${tractor.slug}`}
                    className="flex-1 text-center py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {dict.common.details}
                  </Link>

                  <QuoteModal
                    currentLocale={currentLocale}
                    tractorTitle={tractor.title}
                    triggerButtonText={dict.common.requestQuote}
                    className="flex-1 text-center py-2.5 px-3 rounded-xl bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold shadow-sm transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ABOUT DAGIM MELESE SECTION */}
      <section className="bg-white py-16 border-y border-tekhaf-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Consultant Profile Photo & Certifications */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="relative inline-block">
                <div className="w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-tekhaf-100 relative">
                  <Image
                    src={dagimProfile.profilePhoto}
                    alt={`${dagimProfile.fullName} - Agricultural Machinery Sales Specialist`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-tekhaf-700 text-white p-4 rounded-2xl shadow-xl border-2 border-white text-left">
                  <div className="text-2xl font-black">
                    {dagimProfile.experienceYears}+
                  </div>
                  <div className="text-xs font-medium text-tekhaf-200">
                    Years Serving Ethiopian Agribusiness
                  </div>
                </div>
              </div>
            </div>

            {/* Consultant Bio & Expertise */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-600">
                  {dagimProfile.companyName} Dedicated Representative
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                  {dagimProfile.fullName}
                </h2>
                <p className="text-base font-semibold text-tekhaf-700 mt-1">
                  {dagimProfile.jobTitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {dagimProfile.biography}
              </p>

              {/* Expertise Bullet points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {dagimProfile.expertise.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                    <CheckCircle className="w-4 h-4 text-tekhaf-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${dagimProfile.phone}`}
                  className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Dagim Directly ({dagimProfile.phoneDisplay})</span>
                </a>
                <a
                  href={dagimProfile.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Message</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY TEKHAF TRADING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-600">
            Trust & Engineering
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            {dict.features.whyTekhaf}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {dict.features.whyTekhafSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center mb-4">
              <Tractor className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {dict.features.f1Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {dict.features.f1Desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {dict.features.f2Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {dict.features.f2Desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {dict.features.f3Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {dict.features.f3Desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {dict.features.f4Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {dict.features.f4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 6. ETHIOPIAN SERVICE AREAS (Local SEO Hub) */}
      <section className="bg-gradient-to-b from-tekhaf-900 to-tekhaf-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-300">
              Nationwide Mechanization Support
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1">
              Serving Agricultural Corridors Across Ethiopia
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Tekhaf Trading dispatches tractors, disc implements, and field technicians directly to your farm gate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((area) => (
              <div
                key={area.slug}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-tekhaf-400 mb-2 text-xs font-bold">
                    <MapPin className="w-4 h-4" />
                    <span>{area.regionName}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    <Link
                      href={`/${currentLocale}/${area.slug}`}
                      className="hover:text-tekhaf-300 transition-colors"
                    >
                      {area.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {area.farmingContext}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-tekhaf-300 font-semibold">
                    Rec: {area.recommendedHorsepower}
                  </span>
                  <Link
                    href={`/${currentLocale}/${area.slug}`}
                    className="text-white hover:text-tekhaf-300 font-bold flex items-center gap-1"
                  >
                    <span>Explore Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FARMER STORIES & TESTIMONIALS */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-600">
            Real Experiences
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            What Ethiopian Farmers Say
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Read reviews from agricultural union leaders, cooperative heads, and commercial farm managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {customerTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200">
                  <Image src={t.image} alt={t.customerName} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t.customerName}</h3>
                  <p className="text-xs text-slate-500">{t.farmOrOrg} • {t.region}</p>
                  <p className="text-[11px] text-tekhaf-600 font-semibold mt-0.5">
                    Purchased: {t.tractorPurchased}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. DIRECT QUOTE REQUEST SECTION */}
      <section id="quote" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-tekhaf-100 p-8 sm:p-12 relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-600">
              Immediate Response
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              {dict.contactForm.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              {dict.contactForm.subtitle}
            </p>
          </div>

          <LeadCaptureForm
            currentLocale={currentLocale}
            sourceContext="Homepage Bottom Quote Section"
          />
        </div>
      </section>
    </div>
  );
}
