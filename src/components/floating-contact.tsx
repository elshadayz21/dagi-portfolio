"use client";

import { dagimProfile } from "@/lib/data/profile";
import { Phone, MessageSquare } from "lucide-react";

export function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex sm:flex-col gap-2.5 shadow-2xl">
      {/* WhatsApp CTA */}
      <a
        href={dagimProfile.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
        aria-label="Chat with Dagim Melese on WhatsApp"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline text-xs font-semibold">WhatsApp Dagim</span>
      </a>

      {/* Direct Phone Call */}
      <a
        href={`tel:${dagimProfile.phone}`}
        className="flex items-center gap-2 bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
        aria-label="Call Dagim Melese directly"
      >
        <Phone className="w-5 h-5" />
        <span className="hidden sm:inline text-xs font-semibold">Call {dagimProfile.phoneDisplay}</span>
      </a>
    </div>
  );
}
