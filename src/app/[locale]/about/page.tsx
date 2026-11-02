import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { dagimProfile } from "@/lib/data/profile";
import { Breadcrumb } from "@/components/breadcrumb";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import {
  Tractor,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Award,
  ShieldCheck,
  CheckCircle,
  Building,
  Calendar,
} from "lucide-react";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;

  return {
    title: `About ${dagimProfile.fullName} • Agricultural Machinery Specialist | Tekhaf Trading`,
    description: `Learn about Dagim Melese, Senior Tractor Sales Consultant at Tekhaf Trading. 12+ years advising Ethiopian commercial farmers, cooperatives, and agribusinesses on agricultural mechanization.`,
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/about`,
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.aboutDagim },
        ]}
      />

      {/* Main Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Photo */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="relative inline-block">
              <div className="w-64 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-tekhaf-100 relative">
                <Image
                  src={dagimProfile.profilePhoto}
                  alt={`${dagimProfile.fullName} - Tekhaf Trading`}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-tekhaf-700 text-white p-4 rounded-2xl shadow-xl border-2 border-white text-left">
                <span className="text-2xl font-black">{dagimProfile.experienceYears}+</span>
                <p className="text-[11px] text-tekhaf-200 font-semibold">
                  Years Mechanizing Ethiopian Agriculture
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tekhaf-50 text-tekhaf-700 text-xs font-bold border border-tekhaf-200 mb-2">
                <Building className="w-3.5 h-3.5" />
                <span>Tekhaf Trading Commercial Team</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {dagimProfile.fullName}
              </h1>
              <p className="text-base font-bold text-tekhaf-700 mt-1">
                {dagimProfile.jobTitle}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {dagimProfile.biography}
            </p>

            {/* Direct Connect Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${dagimProfile.phone}`}
                className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call {dagimProfile.phoneDisplay}</span>
              </a>

              <a
                href={dagimProfile.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Message</span>
              </a>

              <a
                href={`mailto:${dagimProfile.email}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{dagimProfile.email}</span>
              </a>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-2 pt-2">
              <MapPin className="w-4 h-4 text-tekhaf-600 shrink-0" />
              <span>{dagimProfile.officeAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expertise & Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Competencies */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Agricultural Machinery Expertise
              </h2>
              <p className="text-xs text-slate-500">
                Tailored consulting for Ethiopian soil and climate
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {dagimProfile.expertise.map((exp, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-tekhaf-600 shrink-0 mt-0.5" />
                <span className="font-medium">{exp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Certifications & Industry Credentials */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Professional Credentials
              </h2>
              <p className="text-xs text-slate-500">
                Accredited training and machinery standards
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {dagimProfile.certifications.map((cert, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{cert}</span>
              </li>
            ))}
          </ul>

          <div className="p-4 rounded-xl bg-tekhaf-50 border border-tekhaf-100 text-xs text-tekhaf-900 mt-4">
            <strong>About Tekhaf Trading:</strong> Tekhaf Trading is an established Ethiopian commercial enterprise engaged in the importation, distribution, and maintenance of agricultural machinery, tractors, implements, and heavy equipment.
          </div>
        </div>
      </div>

      {/* Contact Dagim Directly Form */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-tekhaf-100 shadow-xl max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-600">
            Personal Consultation
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Book an Agricultural Machinery Consultation with Dagim
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Whether you need assistance with duty-free customs clearance or tractor selection, send your message below.
          </p>
        </div>

        <LeadCaptureForm
          currentLocale={currentLocale}
          sourceContext="About Dagim Melese Page"
        />
      </div>
    </div>
  );
}
