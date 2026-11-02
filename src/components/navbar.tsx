"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Locale, localeDetails, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { dagimProfile } from "@/lib/data/profile";
import {
  Phone,
  MessageSquare,
  Menu,
  X,
  Globe,
  Tractor,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  currentLocale: Locale;
}

export function Navbar({ currentLocale }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dict = getDictionary(currentLocale);

  const switchLocale = (newLocale: Locale) => {
    setLangDropdownOpen(false);
    // Replace current locale prefix in URL
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
    { href: `/${currentLocale}/about`, label: dict.nav.aboutDagim },
    { href: `/${currentLocale}/service-areas`, label: dict.nav.serviceAreas },
    { href: `/${currentLocale}/#testimonials`, label: dict.nav.testimonials },
    { href: `/${currentLocale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-tekhaf-100 shadow-sm">
      {/* Top Bar for Trust & Direct Contact */}
      <div className="bg-tekhaf-900 text-white text-xs py-2 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-tekhaf-300" />
          <span>
            {dagimProfile.companyName} • {dagimProfile.fullName} ({dagimProfile.jobTitle})
          </span>
          <span className="hidden md:inline bg-tekhaf-700 text-tekhaf-100 px-2 py-0.5 rounded text-[11px] font-semibold">
            {dict.common.dutyFreeAvailable}
          </span>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <a
            href={`tel:${dagimProfile.phone}`}
            className="flex items-center gap-1 hover:text-tekhaf-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-tekhaf-400" />
            <span className="font-semibold">{dagimProfile.phoneDisplay}</span>
          </a>
          <a
            href={dagimProfile.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-semibold">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link href={`/${currentLocale}`} className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tekhaf-700 to-tekhaf-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Tractor className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-tekhaf-900">
                  TEKHAF
                </span>
                <span className="text-xl font-bold tracking-tight text-tekhaf-600">
                  TRADING
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Tractor Sales • Dagim Melese
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-tekhaf-700 border-b-2 border-tekhaf-700 pb-1"
                      : "text-slate-700 hover:text-tekhaf-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Language Switcher & Quote CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-tekhaf-50 border border-tekhaf-200 rounded-lg hover:bg-tekhaf-100 transition-colors"
                aria-label="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-tekhaf-600" />
                <span>{localeDetails[currentLocale].flag}</span>
                <span>{localeDetails[currentLocale].nativeLabel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-tekhaf-50 transition-colors ${
                        currentLocale === loc
                          ? "bg-tekhaf-50 text-tekhaf-700 font-bold"
                          : "text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{localeDetails[loc].flag}</span>
                        <span>{localeDetails[loc].nativeLabel}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {loc}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quote CTA Button */}
            <Link
              href={`/${currentLocale}/contact`}
              className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <span>{dict.common.requestQuote}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="p-2 text-slate-700 rounded-lg hover:bg-slate-100"
              aria-label="Language"
            >
              <span className="text-base">{localeDetails[currentLocale].flag}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl">
          <div className="flex flex-col gap-2 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-tekhaf-50 hover:text-tekhaf-700"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-medium text-slate-500 rounded-lg hover:bg-slate-50"
            >
              {dict.nav.adminPortal}
            </Link>
          </div>

          {/* Mobile Languages */}
          <div className="border-t border-slate-100 pt-3">
            <div className="text-xs font-bold text-slate-500 mb-2">Language:</div>
            <div className="grid grid-cols-2 gap-2">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg text-left flex items-center gap-2 border ${
                    currentLocale === loc
                      ? "bg-tekhaf-100 border-tekhaf-400 font-bold text-tekhaf-800"
                      : "border-slate-200 text-slate-700"
                  }`}
                >
                  <span>{localeDetails[loc].flag}</span>
                  <span>{localeDetails[loc].nativeLabel}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`tel:${dagimProfile.phone}`}
              className="w-full text-center py-2.5 bg-tekhaf-700 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{dict.common.callNow} ({dagimProfile.phoneDisplay})</span>
            </a>
            <a
              href={dagimProfile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{dict.common.chatWhatsapp}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
