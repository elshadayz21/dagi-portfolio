"use client";

import { useState, useEffect } from "react";
import { Locale, localeDetails, locales } from "@/lib/i18n/config";
import { dictionaries as defaultDictionaries, Dictionary } from "@/lib/i18n/dictionaries";
import { Save, CheckCircle, RefreshCw, Globe } from "lucide-react";

export default function AdminTranslationsPage() {
  const [selectedLocale, setSelectedLocale] = useState<Locale>("am");
  const [dict, setDict] = useState<Record<Locale, Dictionary>>(defaultDictionaries);
  const [enabledLocales, setEnabledLocales] = useState<string[]>(["en", "am", "or", "so", "sid"]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/translations")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          if (res.dictionaries) setDict(res.dictionaries);
          if (res.enabledLocales) setEnabledLocales(res.enabledLocales);
        }
      })
      .catch((err) => console.error("Error loading translations:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = (section: keyof Dictionary, key: string, val: string) => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: selectedLocale,
          updates: dict[selectedLocale],
          enabledLocales,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotice(`Custom phrases for ${localeDetails[selectedLocale].nativeLabel} saved to CMS!`);
        setTimeout(() => setNotice(null), 4000);
      } else {
        alert(data.error || "Failed to save translations");
      }
    } catch {
      alert("Failed to save translations. Please check connection.");
    } finally {
      setSaving(false);
    }
  };

  const currentDict = dict[selectedLocale] || defaultDictionaries[selectedLocale];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-tekhaf-600" />
        <span>Loading CMS translation catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Multilingual CMS Translation Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize localized phrases across English, Amharic (አማርኛ), Afaan Oromoo, Somali (Soomaali), and Sidama (Sidaamu Afoo).
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Language Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {locales.map((loc) => {
          const isEnabled = enabledLocales.includes(loc);
          return (
            <button
              key={loc}
              onClick={() => setSelectedLocale(loc)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                selectedLocale === loc
                  ? "bg-tekhaf-700 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{localeDetails[loc].nativeLabel}</span>
              <span className="uppercase text-[10px] opacity-75">({loc})</span>
              {!isEnabled && (
                <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded font-normal">
                  Hidden
                </span>
              )}
            </button>
          );
        })}
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
              value={currentDict.hero?.subheadlinePrefix || ""}
              onChange={(e) => handleUpdate("hero", "subheadlinePrefix", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Consultant Introduction Text</label>
            <textarea
              rows={3}
              value={currentDict.hero?.consultantIntro || ""}
              onChange={(e) => handleUpdate("hero", "consultantIntro", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Button Label</label>
              <input
                type="text"
                value={currentDict.hero?.contactButton || ""}
                onChange={(e) => handleUpdate("hero", "contactButton", e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Browse Tractors Button Label</label>
              <input
                type="text"
                value={currentDict.hero?.browseTractors || ""}
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
              value={currentDict.common?.callNow || ""}
              onChange={(e) => handleUpdate("common", "callNow", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Dagim Label</label>
            <input
              type="text"
              value={currentDict.common?.contactDagim || ""}
              onChange={(e) => handleUpdate("common", "contactDagim", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Send Inquiry Button</label>
            <input
              type="text"
              value={currentDict.common?.sendInquiry || ""}
              onChange={(e) => handleUpdate("common", "sendInquiry", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">In Stock Badge</label>
            <input
              type="text"
              value={currentDict.common?.inStock || ""}
              onChange={(e) => handleUpdate("common", "inStock", e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors disabled:opacity-75"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving to CMS..." : `Save ${localeDetails[selectedLocale].nativeLabel} Phrases`}</span>
        </button>
      </form>
    </div>
  );
}
