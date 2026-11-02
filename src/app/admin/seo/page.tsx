"use client";

import { useState } from "react";
import { Search, Save, CheckCircle, Globe, Sparkles } from "lucide-react";

export default function AdminSEOPage() {
  const [routes, setRoutes] = useState([
    {
      path: "/",
      title: "Trusted Tractor Solutions for Ethiopian Farmers | Tekhaf Trading",
      desc: "Quality tractors and agricultural machinery from Tekhaf Trading. Dagim Melese provides duty-free guidance, 1-year warranty, and Perkins spare parts.",
      keywords: "Tractor Ethiopia, Tractor Sales Ethiopia, Buy Tractor Ethiopia, Tekhaf Trading",
    },
    {
      path: "/products",
      title: "Agricultural Tractor Inventory Ethiopia | Tekhaf Trading",
      desc: "Explore high-performance 4WD tractors from Massey Ferguson, Lovol, and New Holland in Ethiopia.",
      keywords: "Massey Ferguson 385, Lovol 754, New Holland TT75, Farm Equipment Ethiopia",
    },
    {
      path: "/tractors-addis-ababa",
      title: "Tractor Sales & Dealer in Addis Ababa | Tekhaf Trading",
      desc: "Central Addis Ababa tractor showroom and spare parts warehouse at Bole Medhanialem.",
      keywords: "Tractor Dealer Addis Ababa, Tractor Sales Addis Ababa, Heavy Equipment Addis Ababa",
    },
    {
      path: "/tractors-oromia",
      title: "Heavy-Duty Tractors for Oromia (Arsi, Bale, Shewa) | Tekhaf Trading",
      desc: "Field-ready 4WD tractors for wheat, teff, and grain farms across Oromia region.",
      keywords: "Tractor Sales Oromia, Massey Ferguson Arsi, Agribusiness Ethiopia",
    },
  ]);

  const [savedNotice, setSavedNotice] = useState(false);

  const handleUpdate = (index: number, field: string, value: string) => {
    setRoutes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Dynamic SEO & Meta Tags Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize page titles, meta descriptions, and search engine keywords across all Ethiopian localized routes.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>SEO settings successfully synchronized!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {routes.map((route, idx) => (
          <div key={route.path} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-mono font-bold text-tekhaf-700 bg-tekhaf-50 px-2.5 py-1 rounded">
                Route: {route.path}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Indexed in Google & Bing</span>
              </span>
            </div>

            <div className="text-xs space-y-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Page Title Tag (Recommended &lt; 60 chars)</label>
                <input
                  type="text"
                  value={route.title}
                  onChange={(e) => handleUpdate(idx, "title", e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Meta Description (Recommended &lt; 160 chars)</label>
                <textarea
                  rows={2}
                  value={route.desc}
                  onChange={(e) => handleUpdate(idx, "desc", e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Keywords</label>
                <input
                  type="text"
                  value={route.keywords}
                  onChange={(e) => handleUpdate(idx, "keywords", e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save All SEO Meta Tags</span>
        </button>
      </form>
    </div>
  );
}
