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
} from "lucide-react";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const cms = await getCMSData();

  return {
    title: `Contact ${cms.representativeName} | ${cms.companyName}`,
    description: `Get in touch with ${cms.representativeName}, ${cms.jobTitle} at ${cms.companyName} in Addis Ababa, Ethiopia.`,
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
        {/* Left Information Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
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
            </div>

            <div className="space-y-4 text-xs pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Telephone</span>
                  <a
                    href={`tel:${cms.phone}`}
                    className="text-slate-900 font-bold hover:text-tekhaf-700 transition-colors"
                  >
                    {cms.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">WhatsApp</span>
                  <a
                    href={cms.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Message on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Email</span>
                  <a
                    href={`mailto:${cms.email}`}
                    className="text-slate-900 hover:text-tekhaf-700 font-medium transition-colors"
                  >
                    {cms.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Office Location</span>
                  <p className="text-slate-700 leading-relaxed">{cms.officeAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Hours</span>
                  <p className="text-slate-700">Monday – Saturday: 8:30 AM – 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Generic Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {dict.contactForm.title}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
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
