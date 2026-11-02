import Link from "next/link";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { dagimProfile } from "@/lib/data/profile";
import { serviceAreas } from "@/lib/data/service-areas";
import { tractorInventory } from "@/lib/data/inventory";
import { Tractor, Phone, Mail, MapPin, ShieldCheck, MessageSquare } from "lucide-react";

interface FooterProps {
  currentLocale: Locale;
}

export function Footer({ currentLocale }: FooterProps) {
  const dict = getDictionary(currentLocale);

  return (
    <footer className="bg-tekhaf-950 text-slate-300 pt-16 pb-12 border-t border-tekhaf-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Dagim Identity */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-tekhaf-700 flex items-center justify-center text-white">
                <Tractor className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  TEKHAF <span className="text-tekhaf-400">TRADING</span>
                </span>
                <p className="text-xs text-tekhaf-300">Agricultural Mechanization</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Authorized distributor of premium agricultural tractors in Ethiopia. Represented by{" "}
              <strong className="text-white">{dagimProfile.fullName}</strong>. Providing heavy-duty farm tractors, genuine spare parts, and nationwide field technician service.
            </p>

            <div className="flex items-center gap-2 text-xs text-tekhaf-200 bg-tekhaf-900/60 p-3 rounded-lg border border-tekhaf-800">
              <ShieldCheck className="w-5 h-5 text-tekhaf-400 shrink-0" />
              <span>{dict.common.dutyFreeAvailable}</span>
            </div>
          </div>

          {/* Col 2: Top Tractor Models */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-l-2 border-tekhaf-500 pl-3">
              Popular Tractors
            </h3>
            <ul className="space-y-2.5 text-sm">
              {tractorInventory.slice(0, 5).map((tractor) => (
                <li key={tractor.id}>
                  <Link
                    href={`/${currentLocale}/products/${tractor.slug}`}
                    className="hover:text-tekhaf-400 transition-colors flex items-center justify-between"
                  >
                    <span>{tractor.modelNumber}</span>
                    <span className="text-xs bg-tekhaf-900 text-tekhaf-300 px-2 py-0.5 rounded">
                      {tractor.horsepower} HP
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Regional Service Centers (Local SEO links) */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-l-2 border-tekhaf-500 pl-3">
              Regional Service Hubs
            </h3>
            <ul className="space-y-2.5 text-sm">
              {serviceAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/${currentLocale}/${area.slug}`}
                    className="hover:text-tekhaf-400 transition-colors"
                  >
                    {area.regionName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-l-2 border-tekhaf-500 pl-3">
              Direct Contact
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-tekhaf-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">{dagimProfile.officeAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-tekhaf-400 shrink-0" />
                <a
                  href={`tel:${dagimProfile.phone}`}
                  className="text-white font-semibold hover:text-tekhaf-400"
                >
                  {dagimProfile.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                <a
                  href={dagimProfile.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  WhatsApp: Dagim Melese
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-tekhaf-400 shrink-0" />
                <a
                  href={`mailto:${dagimProfile.email}`}
                  className="text-slate-400 hover:text-white"
                >
                  {dagimProfile.email}
                </a>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-tekhaf-900">
              <Link
                href="/admin/login"
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                CRM Admin Login &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-tekhaf-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Tekhaf Trading. Representative: Dagim Melese. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href={`/${currentLocale}/service-areas`} className="hover:text-slate-400">
              Coverage Areas
            </Link>
            <span>•</span>
            <Link href={`/${currentLocale}/products`} className="hover:text-slate-400">
              Tractor Inventory
            </Link>
            <span>•</span>
            <Link href={`/${currentLocale}/contact`} className="hover:text-slate-400">
              Duty-Free Advisory
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
