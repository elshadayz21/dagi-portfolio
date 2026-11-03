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
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const dict = getDictionary(currentLocale);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangPickerOpen(false);
        setMobileMenuOpen(false);
      }
    };
    if (langPickerOpen || mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [langPickerOpen, mobileMenuOpen]);

  // Dynamic active locales from CMS
  const activeLocales =
    enabledLocales && enabledLocales.length > 0
      ? locales.filter((loc) => enabledLocales.includes(loc))
      : locales;

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
    setLangPickerOpen(false);
    setMobileMenuOpen(false);
    setLangSearch("");
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
    { href: `/${currentLocale}/gallery`, label: dict.nav.gallery },
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
          <nav className="hidden lg:flex items-center gap-3 xl:gap-6 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs xl:text-sm font-semibold whitespace-nowrap transition-colors ${
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

          {/* Desktop Actions: Clickable Globe Language Selector & Direct Contact */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3.5 shrink-0">
            {/* Clickable & Choosable Globe Section (Desktop) */}
            {activeLocales.length > 1 && (
              <div className="relative">
                <button
                  type="button"
                  id="desktop-globe-lang-button"
                  onClick={() => setLangPickerOpen(!langPickerOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors shadow-2xs ${
                    langPickerOpen
                      ? "bg-tekhaf-50 text-tekhaf-700 border-tekhaf-300 ring-2 ring-tekhaf-600/20"
                      : "text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                  aria-label="Select Language"
                  title="Choose Language"
                >
                  <Globe className="w-3.5 h-3.5 text-tekhaf-600" />
                  <span className="hidden xl:inline">{localeDetails[currentLocale]?.nativeLabel || currentLocale.toUpperCase()}</span>
                  <span className="xl:hidden uppercase font-mono font-bold text-[11px]">{currentLocale === "am" ? "አማ" : currentLocale}</span>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                      langPickerOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Direct Phone / Contact CTA */}
            <a
              href={`tel:${phone}`}
              className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold px-3.5 xl:px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xl:inline">{phoneDisplay}</span>
              <span className="xl:hidden">Call</span>
            </a>
          </div>

          {/* Mobile Actions: Direct Call + Clickable Globe + Hamburger Button */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick 1-tap Phone Call on Mobile Header */}
            <a
              href={`tel:${phone}`}
              className="p-2 text-tekhaf-700 bg-tekhaf-50/90 hover:bg-tekhaf-100 border border-tekhaf-200 rounded-xl transition-colors sm:hidden shadow-xs"
              title={`Call ${phoneDisplay}`}
              aria-label="Direct Phone Call"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Clickable & Choosable Globe Button on Mobile Header */}
            {activeLocales.length > 1 && (
              <button
                type="button"
                id="mobile-globe-lang-button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLangPickerOpen(!langPickerOpen);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold border rounded-xl transition-all shadow-xs ${
                  langPickerOpen
                    ? "bg-tekhaf-700 text-white border-tekhaf-800 ring-2 ring-tekhaf-600/30"
                    : "text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
                aria-label="Select Language"
                title="Choose Language"
              >
                <Globe
                  className={`w-3.5 h-3.5 ${
                    langPickerOpen ? "text-white" : "text-tekhaf-600"
                  }`}
                />
                <span className="uppercase font-mono text-[11px]">
                  {currentLocale === "am" ? "አማ" : currentLocale}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    langPickerOpen ? "rotate-180 text-white" : "text-slate-400"
                  }`}
                />
              </button>
            )}

            {/* Hamburger Navigation Button */}
            <button
              type="button"
              id="mobile-hamburger-button"
              onClick={() => {
                setLangPickerOpen(false);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className={`p-2 rounded-xl border transition-colors shadow-sm ${
                mobileMenuOpen
                  ? "bg-slate-900 text-white border-slate-900"
                  : "text-slate-700 bg-white hover:bg-slate-100 border-slate-200"
              }`}
              aria-label="Toggle navigation"
              title="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CLICKABLE & CHOOSABLE GLOBE LANGUAGE SELECTOR POPOVER    */}
      {/* ======================================================== */}
      {langPickerOpen && (
        <>
          {/* Backdrop for click-away */}
          <div
            onClick={() => {
              setLangPickerOpen(false);
              setLangSearch("");
            }}
            className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[1px] transition-opacity"
            aria-hidden="true"
          />

          {/* Language Picker Dropdown / Popover Card */}
          <div
            id="globe-language-popover"
            role="dialog"
            aria-modal="true"
            aria-label="Language Selector"
            className="absolute top-20 right-4 sm:right-6 lg:right-8 z-50 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">
                    Select Language
                  </h3>
                  <span className="text-[10px] text-slate-400">ቋንቋ ይምረጡ</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLangPickerOpen(false);
                  setLangSearch("");
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close language selector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick 1-Tap Shortcut Pills (EN, አማ, OR, SO, SID) */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick Switch
              </span>
              <div className="flex flex-wrap gap-1">
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
                      onClick={() => switchLocale(loc)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-all ${
                        isSelected
                          ? "bg-tekhaf-700 text-white border-tekhaf-800 shadow-2xs scale-105"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                      title={localeDetails[loc]?.label}
                    >
                      {shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Search Input with Instant Match */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                id="globe-lang-search-input"
                type="text"
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                placeholder="Search language (e.g. en, አማ, or)..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tekhaf-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {langSearch && (
                <button
                  type="button"
                  onClick={() => setLangSearch("")}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="Clear filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Choosable Languages List */}
            <div className="space-y-1 max-h-52 overflow-y-auto pt-1">
              {filteredLocales.length > 0 ? (
                filteredLocales.map((loc) => {
                  const meta = localeDetails[loc];
                  const isSelected = currentLocale === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => switchLocale(loc)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors border ${
                        isSelected
                          ? "bg-tekhaf-50/90 border-tekhaf-300 text-tekhaf-900 font-bold"
                          : "bg-white hover:bg-slate-50 border-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-mono font-bold uppercase text-slate-600">
                          {loc}
                        </span>
                        <div className="text-left">
                          <span className="font-bold block leading-tight">
                            {meta?.nativeLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {meta?.label}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="text-tekhaf-700 text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-tekhaf-200 flex items-center gap-1 shadow-2xs">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Choose
                        </span>
                      )}
                    </button>
                  );
                })
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
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* MOBILE HAMBURGER MENU DRAWER (SITE NAVIGATION ONLY)      */}
      {/* Seamless absolute overlay with backdrop                 */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 top-20 z-20 bg-slate-950/30 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <div
        id="mobile-nav-drawer"
        className={`absolute top-full left-0 right-0 z-30 lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto ${
          mobileMenuOpen ? "block animate-in fade-in slide-in-from-top-2 duration-200" : "hidden"
        }`}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-between ${
                  isActive
                    ? "bg-tekhaf-50 text-tekhaf-800 font-bold border-l-4 border-tekhaf-700 pl-3"
                    : "text-slate-800 hover:bg-slate-50 active:bg-tekhaf-50"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-tekhaf-700" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          <a
            href={`tel:${phone}`}
            className="w-full text-center py-2.5 bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call {phoneDisplay}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
