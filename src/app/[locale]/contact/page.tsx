import { Metadata } from "next";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { dagimProfile } from "@/lib/data/profile";
import { Breadcrumb } from "@/components/breadcrumb";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  ShieldCheck,
  Building,
} from "lucide-react";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;

  return {
    title: "Contact Dagim Melese • Tekhaf Trading Tractor Sales Ethiopia",
    description:
      "Get in touch with Dagim Melese at Tekhaf Trading. Request official tractor price quotes, duty-free exemption paperwork guidance, or showroom appointments in Addis Ababa.",
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/contact`,
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.contact },
        ]}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-tekhaf-900 to-tekhaf-950 text-white p-8 rounded-3xl shadow-lg space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-300">
                Direct Contact
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-1">
                Speak With Dagim Melese
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Agricultural Machinery Sales Specialist at Tekhaf Trading. Available for phone consultations, proforma invoices, and farm site visits.
              </p>
            </div>

            <div className="space-y-4 text-sm pt-2 border-t border-white/10">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-tekhaf-300" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Direct Telephone</span>
                  <a
                    href={`tel:${dagimProfile.phone}`}
                    className="text-white font-bold hover:text-tekhaf-300 transition-colors"
                  >
                    {dagimProfile.phoneDisplay}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">WhatsApp Chat</span>
                  <a
                    href={dagimProfile.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    Message on WhatsApp
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-tekhaf-300" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Corporate Email</span>
                  <a
                    href={`mailto:${dagimProfile.email}`}
                    className="text-white font-semibold hover:text-tekhaf-300 transition-colors"
                  >
                    {dagimProfile.email}
                  </a>
                </div>
              </div>

              {/* Office Address */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-tekhaf-300" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Addis Ababa Central Showroom</span>
                  <p className="text-slate-200 text-xs leading-relaxed">{dagimProfile.officeAddress}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-tekhaf-300" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Working Hours</span>
                  <p className="text-slate-200 text-xs">Monday – Saturday: 8:30 AM – 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-tekhaf-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-tekhaf-400 shrink-0" />
              <span>Official Proforma Invoices for Commercial Banks & Cooperative Unions</span>
            </div>
          </div>
        </div>

        {/* Lead Capture Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Send Your Machinery Request
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Please complete the form below. Dagim will review your requirements and provide an official quotation within hours.
              </p>
            </div>

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
