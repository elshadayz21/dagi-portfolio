"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Phone, Mail, X, MessageCircle, ChevronRight, ExternalLink } from "lucide-react";
import { SocialLinks, ContactPhone } from "@/lib/cms-store";

interface FloatingSocialsProps {
  socials?: SocialLinks;
  representativeName?: string;
  phoneDisplay?: string;
  phone?: string;
  phones?: ContactPhone[];
}

export function FloatingSocials({
  socials = {
    whatsapp: "https://wa.me/251911234567",
    telegram: "https://t.me/tekhaftractors",
    linkedin: "https://linkedin.com/in/dagim-melese",
    facebook: "https://facebook.com/tekhaftrading",
    phone: "tel:+251911234567",
    email: "mailto:dagim@tekhaf.com",
  },
  representativeName = "Dagim Melese",
  phoneDisplay = "+251 91 123 4567",
  phone = "+251911234567",
  phones = [],
}: FloatingSocialsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Derive phone numbers list (use dynamic CMS phones if available, or fallback to primary phone)
  const availablePhones: ContactPhone[] =
    phones && phones.length > 0
      ? phones
      : [
          {
            id: "primary-phone",
            label: "Direct Sales Line",
            phone: phone || "+251911234567",
            display: phoneDisplay || "+251 91 123 4567",
            isPrimary: true,
          },
        ];

  return (
    <>
      {/* ======================================================== */}
      {/* 1. MOBILE VIEW: Floating Bottom-Left Button & Modal (< md) */}
      {/* ======================================================== */}

      {/* Backdrop for mobile popup */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile Contact Channels Popup Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Direct Contact Channels"
          className="fixed bottom-20 left-4 z-50 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden md:hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-tekhaf-900 to-tekhaf-800 text-white p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-black tracking-tight uppercase text-tekhaf-200">
                Contact & Inquiries
              </div>
              <div className="text-sm font-bold text-white leading-tight">
                {representativeName}
              </div>
              <div className="text-[10px] text-tekhaf-300 font-medium">
                Tekhaf Trading Machinery Specialist
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close contact list"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action List */}
          <div className="p-3.5 space-y-2 max-h-[70vh] overflow-y-auto">
            {/* WhatsApp */}
            {socials.whatsapp && (
              <a
                href={socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-950 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Chat on WhatsApp</div>
                    <div className="text-[10px] text-emerald-700">Instant tractor quote & catalog</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}

            {/* Direct Phone Numbers (Dynamic from CMS) */}
            {availablePhones.map((p) => (
              <a
                key={p.id}
                href={`tel:${p.phone}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-tekhaf-50/70 hover:bg-tekhaf-100/80 border border-tekhaf-200/80 text-tekhaf-950 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-tekhaf-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{p.label}</div>
                    <div className="text-[11px] font-mono font-semibold text-tekhaf-700">
                      {p.display || p.phone}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-tekhaf-600 transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}

            {/* Telegram */}
            {socials.telegram && (
              <a
                href={socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200/80 text-sky-950 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Telegram Direct</div>
                    <div className="text-[10px] text-sky-700">Official channel & message desk</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-sky-600 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}

            {/* Email */}
            {socials.email && (
              <a
                href={socials.email}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Send Email</div>
                    <div className="text-[10px] text-slate-500">Formal RFQ & institutional tenders</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}

            {/* Social Channels Row */}
            {(socials.facebook || socials.linkedin || socials.youtube || socials.tiktok) && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Official Social Channels
                </span>
                <div className="flex items-center gap-2">
                  {socials.facebook && (
                    <a
                      href={socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Facebook"
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors border border-blue-100"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                      </svg>
                    </a>
                  )}
                  {socials.linkedin && (
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-colors border border-blue-100"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                    </a>
                  )}
                  {socials.youtube && (
                    <a
                      href={socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="YouTube"
                      className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors border border-rose-100"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                      </svg>
                    </a>
                  )}
                  {socials.tiktok && (
                    <a
                      href={socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="TikTok"
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 hover:bg-black hover:text-white flex items-center justify-center transition-colors border border-slate-200"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Button on Mobile (Bottom-Left) */}
      <div className="fixed bottom-5 left-4 z-50 md:hidden flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
          className={`relative w-12 h-12 rounded-full text-white shadow-2xl border-2 border-white flex items-center justify-center transition-all duration-300 active:scale-95 ${
            isOpen ? "bg-slate-900 rotate-90" : "bg-tekhaf-700 hover:bg-tekhaf-800"
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <MessageCircle className="w-6 h-6 stroke-[2.2]" />
              {/* Pulsing Attention Badge */}
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </>
          )}
        </button>

        {/* Small Invitation Pill when collapsed */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1.5 rounded-full shadow-lg border border-slate-200 flex items-center gap-1 active:scale-95 animate-in fade-in"
          >
            <span>Contact</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP VIEW: Sleek Left Dock (Hidden on Mobile >= md) */}
      {/* ======================================================== */}
      <aside
        aria-label="Direct Contact Channels"
        className="fixed left-3 lg:left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200"
      >
        {/* WhatsApp */}
        {socials.whatsapp && (
          <a
            href={socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            aria-label="WhatsApp"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600 bg-emerald-50/70 hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100 hover:scale-110"
          >
            <MessageSquare className="w-5 h-5" />
          </a>
        )}

        {/* Telegram */}
        {socials.telegram && (
          <a
            href={socials.telegram}
            target="_blank"
            rel="noopener noreferrer"
            title="Join Telegram Channel"
            aria-label="Telegram"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sky-600 bg-sky-50/70 hover:bg-sky-500 hover:text-white transition-all shadow-sm border border-sky-100 hover:scale-110"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
          </a>
        )}

        {/* LinkedIn */}
        {socials.linkedin && (
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-700 bg-blue-50/70 hover:bg-blue-700 hover:text-white transition-all shadow-sm border border-blue-100 hover:scale-110"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
        )}

        {/* Facebook */}
        {socials.facebook && (
          <a
            href={socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook Page"
            aria-label="Facebook"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 bg-blue-50/70 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100 hover:scale-110"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
          </a>
        )}

        {/* YouTube */}
        {socials.youtube && (
          <a
            href={socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube Channel"
            aria-label="YouTube"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-600 bg-rose-50/70 hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100 hover:scale-110"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
              <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
            </svg>
          </a>
        )}

        {/* TikTok */}
        {socials.tiktok && (
          <a
            href={socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok Channel"
            aria-label="TikTok"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-800 bg-slate-100/80 hover:bg-black hover:text-white transition-all shadow-sm border border-slate-200 hover:scale-110"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </a>
        )}

        {/* Direct Phone Call */}
        {(phone || socials.phone) && (
          <a
            href={phone ? `tel:${phone}` : socials.phone}
            title={`Direct Call: ${phoneDisplay || phone}`}
            aria-label="Direct Phone Call"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-tekhaf-700 bg-tekhaf-50/70 hover:bg-tekhaf-700 hover:text-white transition-all shadow-sm border border-tekhaf-100 hover:scale-110"
          >
            <Phone className="w-4.5 h-4.5" />
          </a>
        )}

        {/* Email */}
        {socials.email && (
          <a
            href={socials.email}
            title="Send Email Inquiry"
            aria-label="Email"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 bg-slate-50/70 hover:bg-slate-800 hover:text-white transition-all shadow-sm border border-slate-200 hover:scale-110"
          >
            <Mail className="w-4.5 h-4.5" />
          </a>
        )}
      </aside>
    </>
  );
}
