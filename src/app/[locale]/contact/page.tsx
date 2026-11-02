import { Metadata } from "next";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCMSData } from "@/lib/cms-store";
import { Breadcrumb } from "@/components/breadcrumb";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  ExternalLink,
  Building2,
  Globe,
} from "lucide-react";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const cms = await getCMSData();

  return {
    title: `Contact ${cms.representativeName} | ${cms.companyName}`,
    description: `Get in touch with ${cms.representativeName}, ${cms.jobTitle} at ${cms.companyName} in Addis Ababa, Ethiopia. Direct consultation, showroom inspections, and spare parts.`,
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/contact`,
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);
  const cms = await getCMSData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.contact },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Dynamic Contact & Multi-Location Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Representative Identity Card */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-700 block">
                {cms.jobTitle}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {cms.representativeName}
              </h1>
              <p className="text-sm font-semibold text-tekhaf-700 mt-0.5">
                {cms.companyName}
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {cms.companySlogan}
              </p>
            </div>

            {/* Dynamic Phone Numbers */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Telephone & Direct Lines
              </span>
              <div className="space-y-2.5">
                {cms.phones.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">{p.label}</span>
                        <a
                          href={`tel:${p.phone}`}
                          className="text-xs text-slate-900 font-bold hover:text-tekhaf-700 transition-colors"
                        >
                          {p.display}
                        </a>
                      </div>
                      {p.isPrimary && (
                        <span className="text-[10px] bg-tekhaf-50 text-tekhaf-700 font-bold px-2 py-0.5 rounded-full border border-tekhaf-200">
                          Primary
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Emails */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Email Correspondence
              </span>
              <div className="space-y-2.5">
                {cms.emails.map((e) => (
                  <div key={e.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">{e.label}</span>
                        <a
                          href={`mailto:${e.email}`}
                          className="text-xs text-slate-900 font-medium hover:text-tekhaf-700 transition-colors"
                        >
                          {e.email}
                        </a>
                      </div>
                      {e.isPrimary && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Social Media Channels */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Instant Chat & Social Channels
              </span>
              <div className="flex flex-wrap gap-2">
                {cms.socials.whatsapp && (
                  <a
                    href={cms.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {cms.socials.telegram && (
                  <a
                    href={cms.socials.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold hover:bg-sky-100 transition-colors"
                  >
                    <span>Telegram</span>
                  </a>
                )}
                {cms.socials.linkedin && (
                  <a
                    href={cms.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    <span>LinkedIn</span>
                  </a>
                )}
                {cms.socials.facebook && (
                  <a
                    href={cms.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                  >
                    <span>Facebook</span>
                  </a>
                )}
              </div>
            </div>

            {/* Working Hours */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <span className="text-slate-400 block font-medium">Business Working Hours</span>
                <span className="text-slate-700 font-semibold">{cms.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Showrooms & Facility Locations Card */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-tekhaf-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Showroom & Depot Facilities ({cms.locations.length})
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Ethiopian Hubs
              </span>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {cms.locations.map((loc) => (
                <div key={loc.id} className="pt-3 first:pt-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-tekhaf-600 shrink-0" />
                      <span>{loc.title}</span>
                    </h3>
                    {loc.isHeadquarters && (
                      <span className="text-[9px] bg-tekhaf-50 text-tekhaf-700 font-bold px-2 py-0.5 rounded-full border border-tekhaf-200 shrink-0">
                        Headquarters
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 pl-5 leading-relaxed">
                    {loc.address}, <strong className="text-slate-800">{loc.city}</strong>, {loc.country}
                  </p>

                  {loc.operatingHours && (
                    <p className="text-[11px] text-slate-400 pl-5">
                      Hours: {loc.operatingHours}
                    </p>
                  )}

                  {loc.mapUrl && (
                    <div className="pl-5 pt-0.5">
                      <a
                        href={loc.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-tekhaf-700 hover:text-tekhaf-800 font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Generic Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
              {dict.contactForm.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-8">
              {dict.contactForm.subtitle}
            </p>

            <LeadCaptureForm
              currentLocale={currentLocale}
              sourceContext="Contact Page Main Form"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
