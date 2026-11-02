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
  sourceContext = "Website Inquiry",
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
    "Addis Ababa & Outskirts",
    "Amhara Region",
    "Sidama / Hawassa",
    "Somali Region",
    "Dire Dawa",
    "Southern Ethiopia / Wolaita",
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
    } catch (err) {
      setStatus("error");
      setErrorMessage(dict.contactForm.errorMessage);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-emerald-950 mb-2">
          Inquiry Successfully Sent!
        </h3>
        <p className="text-sm text-emerald-800 leading-relaxed max-w-md mx-auto mb-6">
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
          className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-lg transition-colors"
        >
          Submit Another Request
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
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {dict.contactForm.nameLabel} *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Ato Tsegaye Bekele"
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {dict.contactForm.phoneLabel} *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0911234567"
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {dict.contactForm.emailLabel}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="yourname@gmail.com"
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
          />
        </div>

        {/* Region */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {dict.contactForm.regionLabel} *
          </label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
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
        {/* Tractor Model */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {dict.contactForm.productLabel}
          </label>
          <select
            value={formData.productTitle}
            onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white font-medium"
          >
            {tractorInventory.map((t) => (
              <option key={t.id} value={t.title}>
                {t.title}
              </option>
            ))}
            <option value="General Tractor Consultation">General Tractor Consultation</option>
          </select>
        </div>

        {/* Farm Size */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {dict.contactForm.farmSizeLabel}
          </label>
          <input
            type="number"
            value={formData.farmSizeHectares}
            onChange={(e) =>
              setFormData({ ...formData, farmSizeHectares: e.target.value })
            }
            placeholder="e.g. 50"
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {dict.contactForm.messageLabel}
        </label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Specify if you require disc ploughs, harrows, trailers, or bank proforma invoices..."
          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-gradient-to-r from-tekhaf-700 to-tekhaf-600 hover:from-tekhaf-800 hover:to-tekhaf-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75"
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

      <p className="text-[11px] text-slate-500 text-center">
        🔒 Inquiries are delivered directly to Dagim Melese at Tekhaf Trading. Your contact details are kept strictly confidential.
      </p>
    </form>
  );
}
