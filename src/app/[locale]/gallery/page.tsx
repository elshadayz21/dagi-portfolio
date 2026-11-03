import { Metadata } from "next";
import Link from "next/link";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCMSData } from "@/lib/cms-store";
import { getAllGalleryItems } from "@/lib/gallery-store";
import { Breadcrumb } from "@/components/breadcrumb";
import { GallerySection } from "@/components/gallery-section";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import {
  Tractor,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Video,
  Camera,
  MapPin,
  Sparkles,
} from "lucide-react";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const cms = await getCMSData();

  return {
    title: `Field Work & Farmer Gallery | ${cms.representativeName} - ${cms.companyName}`,
    description: `Explore authentic field photos and videos of tractors, farmers, and machinery demonstrations across Ethiopian farmlands in Arsi, Bale, Gojjam, and Hawassa.`,
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/gallery`,
    },
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);
  const cms = await getCMSData();
  const galleryItems = (await getAllGalleryItems()) || [];

  const videoCount = galleryItems.filter((i) => i.type === "VIDEO").length;
  const photoCount = galleryItems.filter((i) => i.type === "IMAGE").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.gallery || "Field Gallery" },
        ]}
      />

      {/* Page Header Hero */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ethiopian Farmland Operations & Deliveries</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Field Gallery: Machinery & Farmers in Action
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Real photographic and operational video archives of {cms.companyName} tractors working alongside farmers, cooperative unions, and commercial estates across Arsi, Bale, Gojjam, Sidama, and the Rift Valley.
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-tekhaf-700" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">{photoCount}</p>
              <p className="text-xs text-slate-500 font-medium">Field Photos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">{videoCount}</p>
              <p className="text-xs text-slate-500 font-medium">Action Videos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">4+ Regions</p>
              <p className="text-xs text-slate-500 font-medium">Oromia, Amhara, Sidama</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-tekhaf-700" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">Verified</p>
              <p className="text-xs text-slate-500 font-medium">100% Genuine Records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dynamic Gallery Section */}
      <GallerySection
        items={galleryItems}
        currentLocale={currentLocale}
        representativeName={cms.representativeName}
        phone={cms.phone}
        showAllLink={false}
      />

      {/* Schedule a Demonstration / Consultation CTA */}
      <div className="bg-gradient-to-br from-tekhaf-900 via-tekhaf-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-300">
              Schedule An On-Farm Demonstration
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Want to See a Tractor Tested on Your Own Soil?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {cms.representativeName} coordinates on-site tractor demonstrations, soil tests, and implement configuration consultations for commercial farms and agricultural unions.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`https://wa.me/${cms.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hello ${cms.representativeName}, I visited the Field Gallery on your website and would like to arrange an on-farm tractor consultation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>

              <a
                href={`tel:${cms.phone}`}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-tekhaf-300" />
                <span>Call {cms.phoneDisplay}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 text-xs space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Direct Inquiries
            </h3>
            <p className="text-slate-300">
              Have photos or footage from your farm delivery with Tekhaf machinery? Share them directly with Dagim Melese to be featured in our official showcase.
            </p>
            <div className="pt-2 text-slate-400">
              <span className="block font-semibold text-white">{cms.representativeName}</span>
              <span>{cms.jobTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
