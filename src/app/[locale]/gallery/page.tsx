import { Metadata } from "next";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCMSData } from "@/lib/cms-store";
import { getAllGalleryItems } from "@/lib/gallery-store";
import { Breadcrumb } from "@/components/breadcrumb";
import { GallerySection } from "@/components/gallery-section";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { Phone, MessageSquare } from "lucide-react";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.gallery || "Field Gallery" },
        ]}
      />

      {/* Main Dynamic Gallery Section */}
      <GallerySection
        items={galleryItems}
        currentLocale={currentLocale}
        representativeName={cms.representativeName}
        phone={cms.phone}
        showAllLink={false}
      />

      {/* Contact Section: Simple Statement & Contact Form */}
      <div id="contact" className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Want to get in touch?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Have questions about a tractor model, want to schedule an on-farm demonstration, or request pricing details? Send a message directly to {cms.representativeName}.
          </p>
        </div>

        <LeadCaptureForm
          currentLocale={currentLocale}
          sourceContext="Field Gallery Page Contact Form"
        />

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
          <a
            href={`tel:${cms.phone}`}
            className="flex items-center gap-2 hover:text-tekhaf-700 transition-colors"
          >
            <Phone className="w-4 h-4 text-tekhaf-700" />
            <span>Call: {cms.phoneDisplay}</span>
          </a>
          <span className="text-slate-300">•</span>
          <a
            href={`https://wa.me/${cms.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `Hello ${cms.representativeName}, I visited the Field Gallery and would like to get in touch.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-emerald-700 text-emerald-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp: {cms.representativeName}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
