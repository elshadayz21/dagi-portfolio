"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { tractorInventory } from "@/lib/data/inventory";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

interface LeadCaptureFormProps {
  currentLocale: Locale;
  defaultProductTitle?: string;
  sourceContext?: string;
}

export function LeadCaptureForm({
  currentLocale,
  defaultProductTitle,
  sourceContext = "General Inquiry",
}: LeadCaptureFormProps) {
  const dict = getDictionary(currentLocale);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    region: "Oromia",
    farmSizeHectares: "",
    productTitle: defaultProductTitle || "Massey Ferguson MF 385 (4WD, 85 HP)",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const regions = [
    "Oromia",
    "Addis Ababa",
    "Amhara Region",
    "Sidama",
    "Somali Region",
    "Dire Dawa",
    "Southern Ethiopia",
    "Tigray",
    "Benishangul-Gumuz",
    "Gambella",
    "Afar",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: sourceContext,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.error || dict.contactForm.errorMessage);
      }
    } catch {
      setStatus("error");
      setErrorMessage(dict.contactForm.errorMessage);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h3 className="text-lg font-bold text-emerald-950">
          Inquiry Received
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
          {dict.contactForm.successMessage}
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setFormData({
              fullName: "",
              phone: "",
              email: "",
              region: "Oromia",
              farmSizeHectares: "",
              productTitle: defaultProductTitle || "Massey Ferguson MF 385 (4WD, 85 HP)",
              message: "",
            });
          }}
          className="text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-lg transition-colors mt-2"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {dict.contactForm.nameLabel} *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Your Name"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {dict.contactForm.phoneLabel} *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0911234567"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {dict.contactForm.emailLabel}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@example.com"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {dict.contactForm.regionLabel} *
          </label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {dict.contactForm.productLabel}
          </label>
          <select
            value={formData.productTitle}
            onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
          >
            {tractorInventory.map((t) => (
              <option key={t.id} value={t.title}>
                {t.title}
              </option>
            ))}
            <option value="General Consultation">General Tractor Consultation</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {dict.contactForm.farmSizeLabel}
          </label>
          <input
            type="number"
            value={formData.farmSizeHectares}
            onChange={(e) =>
              setFormData({ ...formData, farmSizeHectares: e.target.value })
            }
            placeholder="e.g. 30"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {dict.contactForm.messageLabel}
        </label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Provide any details regarding your farm, machinery requirements, or questions..."
          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs shadow-sm disabled:opacity-75"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{dict.contactForm.submitting}</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>{dict.contactForm.submitButton}</span>
          </>
        )}
      </button>
    </form>
  );
}
