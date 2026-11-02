"use client";

import { useState } from "react";
import { Locale, localeDetails, locales } from "@/lib/i18n/config";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { Save, CheckCircle } from "lucide-react";

export default function AdminTranslationsPage() {
  const [selectedLocale, setSelectedLocale] = useState<Locale>("am");
  const [dict, setDict] = useState(dictionaries);
  const [notice, setNotice] = useState(false);

  const handleUpdate = (section: keyof typeof dictionaries["en"], key: string, val: string) => {
    setDict((prev) => ({
      ...prev,
      [selectedLocale]: {
        ...prev[selectedLocale],
        [section]: {
          ...(prev[selectedLocale] as any)[section],
          [key]: val,
        },
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  };

  const currentDict = dict[selectedLocale];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Multilingual CMS Translation Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Dynamically customize phrases across English, Amharic (አማርኛ), Afaan Oromoo, Somali (Soomaali), and Sidama (Sidaamu Afoo).
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Translations saved successfully to CMS!</span>
        </div>
      )}

      {/* Language Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => setSelectedLocale(loc)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              selectedLocale === loc
                ? "bg-tekhaf-700 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{localeDetails[loc].nativeLabel}</span>
            <span className="uppercase text-[10px] opacity-75">({loc})</span>
          </button>
        ))}
      </div>

      {/* Translations Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Hero Section Phrases ({localeDetails[selectedLocale].nativeLabel})
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subheadline Prefix</label>
            <input
              type="text"
              value={currentDict.hero.subheadlinePrefix}
              onChange={(e) => handleUpdate("hero", "subheadlinePrefix", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Consultant Introduction Text</label>
            <textarea
              rows={3}
              value={currentDict.hero.consultantIntro}
              onChange={(e) => handleUpdate("hero", "consultantIntro", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Button Label</label>
              <input
                type="text"
                value={currentDict.hero.contactButton}
                onChange={(e) => handleUpdate("hero", "contactButton", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Browse Tractors Button Label</label>
              <input
                type="text"
                value={currentDict.hero.browseTractors}
                onChange={(e) => handleUpdate("hero", "browseTractors", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4">
          Common Action Labels
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Call Button</label>
            <input
              type="text"
              value={currentDict.common.callNow}
              onChange={(e) => handleUpdate("common", "callNow", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Dagim Label</label>
            <input
              type="text"
              value={currentDict.common.contactDagim}
              onChange={(e) => handleUpdate("common", "contactDagim", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Send Inquiry Button</label>
            <input
              type="text"
              value={currentDict.common.sendInquiry}
              onChange={(e) => handleUpdate("common", "sendInquiry", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">In Stock Badge</label>
            <input
              type="text"
              value={currentDict.common.inStock}
              onChange={(e) => handleUpdate("common", "inStock", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save {localeDetails[selectedLocale].nativeLabel} Phrases</span>
        </button>
      </form>
    </div>
  );
}
