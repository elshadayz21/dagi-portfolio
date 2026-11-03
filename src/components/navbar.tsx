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
  Search,
  Check,
} from "lucide-react";

interface NavbarProps {
  currentLocale: Locale;
  representativeName?: string;
  jobTitle?: string;
  companyName?: string;
  phoneDisplay?: string;
  phone?: string;
  customLogoUrl?: string | null;
  enabledLocales?: string[];
}

export function Navbar({
  currentLocale,
  representativeName = "Dagim Melese",
  jobTitle = "Agricultural Machinery Specialist",
  companyName = "Tekhaf Trading",
  phoneDisplay = "+251 91 123 4567",
  phone = "+251911234567",
  customLogoUrl = null,
  enabledLocales,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const dict = getDictionary(currentLocale);

  // Dynamic active locales from CMS
  const activeLocales = (
    enabledLocales && enabledLocales.length > 0
      ? locales.filter((loc) => enabledLocales.includes(loc))
      : locales
  );

  const filteredLocales = activeLocales.filter((loc) => {
    if (!langSearch.trim()) return true;
    const q = langSearch.toLowerCase().trim();
    const meta = localeDetails[loc];
    const code = loc.toLowerCase();
    const label = meta?.label?.toLowerCase() || "";
    const native = meta?.nativeLabel?.toLowerCase() || "";

    return (
      code.includes(q) ||
      label.includes(q) ||
      native.includes(q) ||
      (q === "አማ" && loc === "am") ||
      (q === "en" && loc === "en") ||
      (q === "am" && loc === "am") ||
      (q === "or" && loc === "or") ||
      (q === "so" && loc === "so") ||
      (q === "sid" && loc === "sid")
    );
  });

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
            {/* Dynamic Language Selector Dropdown (Shown when multiple languages enabled) */}
            {activeLocales.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-tekhaf-600" />
                  <span>{localeDetails[currentLocale]?.nativeLabel || currentLocale.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                    {activeLocales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          currentLocale === loc
                            ? "bg-slate-50 text-tekhaf-700 font-bold"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{localeDetails[loc]?.nativeLabel || loc.toUpperCase()}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {loc}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Direct Phone / Contact CTA */}
            <a
              href={`tel:${phone}`}
              className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{phoneDisplay}</span>
            </a>
          </div>

          {/* Mobile Menu Button & Dynamic Language Picker */}
          <div className="flex md:hidden items-center gap-2">
            {activeLocales.length > 1 && (
              <button
                onClick={() => {
                  setMobileMenuOpen(true);
                  setTimeout(() => {
                    document.getElementById("mobile-lang-search")?.focus();
                  }, 150);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors shadow-sm"
                aria-label="Select Language"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-tekhaf-600" />
                <span className="uppercase font-mono">
                  {currentLocale === "am" ? "አማ" : currentLocale}
                </span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-xl hover:bg-slate-100 border border-slate-200 shadow-sm transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg ${
          mobileMenuOpen ? "block animate-in fade-in slide-in-from-top-2 duration-200" : "hidden"
        }`}
      >
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

          {/* Mobile Language Search & Selection Form with Globe Icon */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="mobile-lang-search"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-800"
              >
                <Globe className="w-3.5 h-3.5 text-tekhaf-600" />
                <span>Language / ቋንቋ</span>
              </label>
              <span className="text-[10px] font-bold text-tekhaf-700 bg-tekhaf-50 px-2 py-0.5 rounded-md border border-tekhaf-200">
                Active: {localeDetails[currentLocale]?.nativeLabel} ({currentLocale.toUpperCase()})
              </span>
            </div>

            {/* Quick-Select Shortcuts (e.g. EN, አማ, OR, SO, SID) */}
            <div className="flex flex-wrap items-center gap-1.5">
              {activeLocales.map((loc) => {
                const isSelected = currentLocale === loc;
                const shortLabel =
                  loc === "en"
                    ? "EN"
                    : loc === "am"
                    ? "አማ"
                    : loc === "or"
                    ? "OR"
                    : loc === "so"
                    ? "SO"
                    : "SID";

                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      switchLocale(loc);
                      setMobileMenuOpen(false);
                      setLangSearch("");
                    }}
                    className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all border ${
                      isSelected
                        ? "bg-tekhaf-700 text-white border-tekhaf-800 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                    title={localeDetails[loc]?.label}
                  >
                    <span>{shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input with Globe Icon */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-3.5 h-3.5 text-tekhaf-600" />
              </div>
              <input
                id="mobile-lang-search"
                type="text"
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                placeholder="Search language (e.g. en, አማ, Oromoo)..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tekhaf-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
              />
              {langSearch && (
                <button
                  type="button"
                  onClick={() => setLangSearch("")}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="Clear language search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filtered Search Results Dropdown/List */}
            {filteredLocales.length > 0 ? (
              <div className="space-y-1 pt-1 max-h-44 overflow-y-auto">
                {filteredLocales.map((loc) => {
                  const meta = localeDetails[loc];
                  const isSelected = currentLocale === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        switchLocale(loc);
                        setMobileMenuOpen(false);
                        setLangSearch("");
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors border ${
                        isSelected
                          ? "bg-tekhaf-50/80 border-tekhaf-300 text-tekhaf-900 font-bold"
                          : "bg-white hover:bg-slate-50 border-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-mono font-bold uppercase text-slate-600">
                          {loc}
                        </span>
                        <div className="text-left">
                          <span className="font-bold block leading-tight">{meta?.nativeLabel}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{meta?.label}</span>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="text-tekhaf-700 text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-tekhaf-200 flex items-center gap-1 shadow-xs">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Switch</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                <span>No matching language for &ldquo;{langSearch}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setLangSearch("")}
                  className="block mx-auto mt-1 text-[11px] font-bold text-tekhaf-700 hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
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
    </header>
  );
}
