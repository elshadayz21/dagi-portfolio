"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Locale, localeDetails, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Logo } from "@/components/logo";
import {
  Phone,
  Menu,
  X,
  Globe,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  currentLocale: Locale;
  representativeName?: string;
  jobTitle?: string;
  companyName?: string;
  phoneDisplay?: string;
  phone?: string;
  customLogoUrl?: string | null;
}

export function Navbar({
  currentLocale,
  representativeName = "Dagim Melese",
  jobTitle = "Agricultural Machinery Specialist",
  companyName = "Tekhaf Trading",
  phoneDisplay = "+251 91 123 4567",
  phone = "+251911234567",
  customLogoUrl = null,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dict = getDictionary(currentLocale);

  const switchLocale = (newLocale: Locale) => {
    setLangDropdownOpen(false);
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || `/${newLocale}`;
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${currentLocale}`, label: dict.nav.home },
    { href: `/${currentLocale}/products`, label: dict.nav.tractors },
    { href: `/${currentLocale}/about`, label: dict.nav.about },
    { href: `/${currentLocale}/service-areas`, label: dict.nav.serviceAreas },
    { href: `/${currentLocale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Main Logo & Name: Dagim Melese prominently, company in subline */}
          <Link href={`/${currentLocale}`} className="group flex items-center">
            <Logo
              representativeName={representativeName}
              jobTitle={jobTitle}
              companyName={companyName}
              customLogoUrl={customLogoUrl}
            />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-tekhaf-700 border-b-2 border-tekhaf-700 pb-1"
                      : "text-slate-600 hover:text-tekhaf-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Dynamic Language Selector & Contact */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Language Selector Dropdown (Clean, Professional, No emojis) */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-tekhaf-600" />
                <span>{localeDetails[currentLocale].nativeLabel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentLocale === loc
                          ? "bg-slate-50 text-tekhaf-700 font-bold"
                          : "text-slate-700"
                      }`}
                    >
                      <span>{localeDetails[loc].nativeLabel}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {loc}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Phone / Contact CTA */}
            <a
              href={`tel:${phone}`}
              className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{phoneDisplay}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="px-2 py-1 text-xs font-bold border border-slate-200 rounded text-slate-700 uppercase"
              aria-label="Language"
            >
              {currentLocale}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Languages */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 block mb-2">Language</span>
            <div className="grid grid-cols-2 gap-2">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={`text-xs px-3 py-1.5 rounded-lg border text-left font-medium ${
                    currentLocale === loc
                      ? "bg-tekhaf-50 border-tekhaf-600 text-tekhaf-700 font-bold"
                      : "border-slate-200 text-slate-700"
                  }`}
                >
                  {localeDetails[loc].nativeLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <a
              href={`tel:${phone}`}
              className="w-full text-center py-2.5 bg-tekhaf-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call {phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
