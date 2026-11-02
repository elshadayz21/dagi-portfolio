"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n/config";
import { LeadCaptureForm } from "./lead-capture-form";
import { X, Tractor } from "lucide-react";

interface QuoteModalProps {
  currentLocale: Locale;
  tractorTitle?: string;
  triggerButtonText?: string;
  className?: string;
}

export function QuoteModal({
  currentLocale,
  tractorTitle,
  triggerButtonText = "Request Price Quote",
  className,
}: QuoteModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "w-full bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm shadow-sm"
        }
      >
        {triggerButtonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative border border-slate-100">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-tekhaf-100 text-tekhaf-700 flex items-center justify-center">
                <Tractor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Request Official Proforma & Price Quote
                </h3>
                <p className="text-xs text-slate-500">
                  {tractorTitle ? `Model: ${tractorTitle}` : "Tekhaf Trading Agricultural Machinery"}
                </p>
              </div>
            </div>

            <LeadCaptureForm
              currentLocale={currentLocale}
              defaultProductTitle={tractorTitle}
              sourceContext={`Quote Modal (${tractorTitle || "General"})`}
            />
          </div>
        </div>
      )}
    </>
  );
}
