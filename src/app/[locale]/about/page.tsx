import { Metadata } from "next";
import Image from "next/image";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCMSData } from "@/lib/cms-store";
import { Breadcrumb } from "@/components/breadcrumb";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  CheckCircle,
} from "lucide-react";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const cms = await getCMSData();

  return {
    title: `About ${cms.representativeName} | ${cms.companyName}`,
    description: `About ${cms.representativeName}, ${cms.jobTitle} at ${cms.companyName} in Ethiopia. 12+ years experience advising commercial farms and farmer unions.`,
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/about`,
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);
  const cms = await getCMSData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.about },
        ]}
      />

      {/* Main Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Portrait Photo */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-64 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
              <Image
                src={cms.profilePhoto}
                alt={cms.representativeName}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-tekhaf-700 block">
                {cms.jobTitle}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                {cms.representativeName}
              </h1>
              <p className="text-base font-semibold text-tekhaf-700 mt-0.5">
                {cms.companyName}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {cms.biography}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                href={`tel:${cms.phone}`}
                className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-sm transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {cms.phoneDisplay}</span>
              </a>

              <a
                href={cms.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-sm transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`mailto:${cms.email}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{cms.email}</span>
              </a>
            </div>

            <div className="text-xs text-slate-500 flex items-center justify-center lg:justify-start gap-2 pt-2">
              <MapPin className="w-3.5 h-3.5 text-tekhaf-700 shrink-0" />
              <span>{cms.officeAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Competencies */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Specialization & Field Advisory
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {[
            "Agricultural Tractor Sizing & Implement Selection",
            "Cooperative Union & Commercial Farm Consultations",
            "Heavy-Duty Disk Ploughs, Harrows & Trailer Pairings",
            "Genuine Perkins & OEM Engine Spare Parts",
            "On-Farm Handover Inspection & Safety Briefing",
            "Ethiopian Soil & Field Operational Advisory",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-tekhaf-700 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Inquiry */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Contact Dagim Melese Directly
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Send an inquiry regarding tractor requirements or farm visits.
          </p>
        </div>

        <LeadCaptureForm
          currentLocale={currentLocale}
          sourceContext="About Page Direct Contact"
        />
      </div>
    </div>
  );
}
