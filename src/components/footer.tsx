import Link from "next/link";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { TractorProduct } from "@/lib/data/inventory";
import { Logo } from "@/components/logo";
import { Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  currentLocale: Locale;
  tractors?: TractorProduct[];
  representativeName?: string;
  jobTitle?: string;
  companyName?: string;
  officeAddress?: string;
  phoneDisplay?: string;
  phone?: string;
  email?: string;
  customLogoUrl?: string | null;
}

export function Footer({
  currentLocale,
  tractors = [],
  representativeName = "Dagim Melese",
  jobTitle = "Agricultural Machinery Specialist",
  companyName = "Tekhaf Trading",
  officeAddress = "Tekhaf Tower, 4th Floor, Bole Medhanialem, Addis Ababa, Ethiopia",
  phoneDisplay = "+251 91 123 4567",
  phone = "+251911234567",
  email = "dagim@tekhaf.com",
  customLogoUrl = null,
}: FooterProps) {
  const dict = getDictionary(currentLocale);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Col 1: Identity (Dagim Melese & Tekhaf) */}
          <div className="lg:col-span-5 space-y-4">
            <Logo
              representativeName={representativeName}
              jobTitle={jobTitle}
              companyName={companyName}
              customLogoUrl={customLogoUrl}
              className="text-white brightness-200"
            />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed pt-2">
              Agricultural machinery sales consultant facilitating heavy-duty tractor acquisition, genuine spare parts, and on-farm technician support throughout Ethiopia.
            </p>
            <div className="text-xs text-slate-400 space-y-1.5 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-tekhaf-400 shrink-0" />
                <span>{officeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-tekhaf-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                  {phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-tekhaf-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Dynamic Tractor Inventory (Auto-populated from CMS when added) */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Tractor Inventory
            </h3>
            <ul className="space-y-2 text-xs">
              {(tractors || []).slice(0, 6).map((tractor) => (
                <li key={tractor.id}>
                  <Link
                    href={`/${currentLocale}/products/${tractor.slug}`}
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span className="text-slate-300 group-hover:text-white">
                      {tractor.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {tractor.horsepower} HP
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation & Admin */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${currentLocale}`} className="hover:text-white transition-colors">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/products`} className="hover:text-white transition-colors">
                  {dict.nav.tractors}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/about`} className="hover:text-white transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/service-areas`} className="hover:text-white transition-colors">
                  {dict.nav.serviceAreas}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/contact`} className="hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
              <li className="pt-3 border-t border-slate-800">
                <Link href="/admin/login" className="text-slate-400 hover:text-slate-200">
                  CRM Portal Access &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {representativeName}. {jobTitle} at {companyName}. {dict.common.allRightsReserved}
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/${currentLocale}/products`} className="hover:text-slate-400">
              Inventory
            </Link>
            <span>•</span>
            <Link href={`/${currentLocale}/contact`} className="hover:text-slate-400">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
