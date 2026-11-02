"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n/config";
import { LeadCaptureForm } from "./lead-capture-form";
import { X, Tractor } from "lucide-react";

interface InquiryModalProps {
  currentLocale: Locale;
  tractorTitle?: string;
  triggerButtonText?: string;
  className?: string;
}

export function InquiryModal({
  currentLocale,
  tractorTitle,
  triggerButtonText = "Inquire",
  className,
}: InquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "w-full bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-xs shadow-sm"
        }
      >
        {triggerButtonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative border border-slate-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center shrink-0">
                <Tractor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Direct Machinery Inquiry
                </h3>
                <p className="text-xs text-slate-500">
                  {tractorTitle ? `Model: ${tractorTitle}` : "Agricultural Machinery Consultation"}
                </p>
              </div>
            </div>

            <LeadCaptureForm
              currentLocale={currentLocale}
              defaultProductTitle={tractorTitle}
              sourceContext={`Inquiry Modal (${tractorTitle || "General"})`}
            />
          </div>
        </div>
      )}
    </>
  );
}

// Keep export for backwards-compatibility
export const QuoteModal = InquiryModal;
