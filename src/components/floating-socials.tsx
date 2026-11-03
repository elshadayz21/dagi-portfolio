"use client";

import { useState, useEffect, useMemo } from "react";
import { MessageSquare, Phone, Mail, X, MessageCircle } from "lucide-react";
import { SocialLinks, ContactPhone } from "@/lib/cms-store";

interface FloatingSocialsProps {
  socials?: SocialLinks;
  representativeName?: string;
  phoneDisplay?: string;
  phone?: string;
  phones?: ContactPhone[];
}

interface SpiralItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  bg: string;
  icon: React.ReactNode;
}

/**
 * Computes radial spiral coordinates (x, y) relative to the trigger button.
 * Sweeps from straight up (90 deg) down towards horizontal right (0 deg)
 * with an expanding radius to form a smooth spiral speed-dial arc.
 */
function getSpiralCoordinates(index: number, total: number) {
  if (total <= 1) return { x: 0, y: -70 };

  const startAngle = 90; // degrees (straight up)
  const endAngle = 0; // degrees (horizontal right)

  const t = index / (total - 1);
  const angleDeg = startAngle - (startAngle - endAngle) * t;
  const angleRad = (angleDeg * Math.PI) / 180;

  // Expanding radius: from 70px up to 232px to accommodate generous button touch targets
  const minR = 70;
  const maxR = total > 6 ? 232 : total > 4 ? 215 : total > 2 ? 175 : 130;
  const r = minR + (maxR - minR) * Math.pow(t, 0.65);

  const x = Math.round(r * Math.cos(angleRad));
  const y = Math.round(-r * Math.sin(angleRad)); // negative is UP

  return { x, y };
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

  // Primary phone number
  const primaryPhone =
    phones && phones.length > 0
      ? phones[0].phone
      : phone || "+251911234567";

  // Build the list of active items for the mobile spiral speed-dial
  const spiralItems: SpiralItem[] = useMemo(() => {
    const list: SpiralItem[] = [];

    // 1. WhatsApp
    if (socials.whatsapp) {
      list.push({
        id: "whatsapp",
        label: "WhatsApp",
        href: socials.whatsapp,
        external: true,
        bg: "bg-emerald-600 hover:bg-emerald-700",
        icon: <MessageSquare className="w-5.5 h-5.5" />,
      });
    }

    // 2. Direct Phone Call
    if (primaryPhone) {
      list.push({
        id: "phone",
        label: `Direct Call: ${phoneDisplay || primaryPhone}`,
        href: `tel:${primaryPhone}`,
        external: false,
        bg: "bg-tekhaf-700 hover:bg-tekhaf-800",
        icon: <Phone className="w-5.5 h-5.5" />,
      });
    }

    // 3. Telegram
    if (socials.telegram) {
      list.push({
        id: "telegram",
        label: "Telegram",
        href: socials.telegram,
        external: true,
        bg: "bg-sky-500 hover:bg-sky-600",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
        ),
      });
    }

    // 4. Email
    if (socials.email) {
      list.push({
        id: "email",
        label: "Email",
        href: socials.email,
        external: false,
        bg: "bg-slate-800 hover:bg-slate-900",
        icon: <Mail className="w-5.5 h-5.5" />,
      });
    }

    // 5. Facebook
    if (socials.facebook) {
      list.push({
        id: "facebook",
        label: "Facebook",
        href: socials.facebook,
        external: true,
        bg: "bg-blue-600 hover:bg-blue-700",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
          </svg>
        ),
      });
    }

    // 6. TikTok
    if (socials.tiktok) {
      list.push({
        id: "tiktok",
        label: "TikTok",
        href: socials.tiktok,
        external: true,
        bg: "bg-black hover:bg-zinc-800",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        ),
      });
    }

    // 7. YouTube
    if (socials.youtube) {
      list.push({
        id: "youtube",
        label: "YouTube",
        href: socials.youtube,
        external: true,
        bg: "bg-rose-600 hover:bg-rose-700",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
          </svg>
        ),
      });
    }

    // 8. LinkedIn
    if (socials.linkedin) {
      list.push({
        id: "linkedin",
        label: "LinkedIn",
        href: socials.linkedin,
        external: true,
        bg: "bg-blue-700 hover:bg-blue-800",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        ),
      });
    }

    return list;
  }, [socials, primaryPhone, phoneDisplay]);

  return (
    <>
      {/* ======================================================== */}
      {/* 1. MOBILE VIEW: Spiral Floating Action Speed-Dial (< md) */}
      {/* ======================================================== */}

      {/* Backdrop for click-away when spiral is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px] md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Floating Action Button & Spiral Icons Container on Mobile */}
      <div className="fixed bottom-5 left-4 z-50 md:hidden">
        <div className="relative w-13 h-13 flex items-center justify-center">
          {/* Spiral Icons (Fan out when open, collapse back to 0,0 when closed) */}
          {spiralItems.map((item, index) => {
            const pos = getSpiralCoordinates(index, spiralItems.length);
            return (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setIsOpen(false)}
                aria-label={item.label}
                title={item.label}
                style={{
                  transform: isOpen
                    ? `translate3d(${pos.x}px, ${pos.y}px, 0) scale(1)`
                    : `translate3d(0, 0, 0) scale(0)`,
                  opacity: isOpen ? 1 : 0,
                  pointerEvents: isOpen ? "auto" : "none",
                  transitionDelay: isOpen
                    ? `${index * 35}ms`
                    : `${(spiralItems.length - 1 - index) * 20}ms`,
                }}
                className={`absolute inset-0 w-11.5 h-11.5 m-auto rounded-full flex items-center justify-center text-white border-2 border-white shadow-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 ${item.bg}`}
              >
                {item.icon}
              </a>
            );
          })}

          {/* Main Floating Trigger Button: Pure Icon, No Text Labeling */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open social channels"}
            className={`relative w-12.5 h-12.5 rounded-full text-white shadow-2xl border-2 border-white flex items-center justify-center transition-all duration-300 active:scale-95 z-10 ${
              isOpen
                ? "bg-slate-900 rotate-90 scale-105"
                : "bg-tekhaf-700 hover:bg-tekhaf-800"
            }`}
          >
            {isOpen ? (
              <X className="w-5.5 h-5.5" />
            ) : (
              <>
                <MessageCircle className="w-6 h-6 stroke-[2.2]" />
                {/* Subtle attention indicator */}
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP VIEW: Sleek, Well-Proportioned Left Dock (>= md) */}
      {/* ======================================================== */}
      <aside
        aria-label="Direct Contact Channels"
        className="fixed left-3 lg:left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90"
      >
        {/* WhatsApp */}
        {socials.whatsapp && (
          <a
            href={socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            aria-label="WhatsApp"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-emerald-600 bg-emerald-50/70 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 hover:scale-110 shadow-xs"
          >
            <MessageSquare className="w-4.5 h-4.5" />
          </a>
        )}

        {/* Direct Phone Call */}
        {primaryPhone && (
          <a
            href={`tel:${primaryPhone}`}
            title={`Call: ${phoneDisplay || primaryPhone}`}
            aria-label="Direct Phone Call"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-tekhaf-700 bg-tekhaf-50/70 hover:bg-tekhaf-700 hover:text-white transition-all border border-tekhaf-100 hover:scale-110 shadow-xs"
          >
            <Phone className="w-4.5 h-4.5" />
          </a>
        )}

        {/* Telegram */}
        {socials.telegram && (
          <a
            href={socials.telegram}
            target="_blank"
            rel="noopener noreferrer"
            title="Telegram Direct"
            aria-label="Telegram"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sky-600 bg-sky-50/70 hover:bg-sky-500 hover:text-white transition-all border border-sky-100 hover:scale-110 shadow-xs"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
          </a>
        )}

        {/* Email */}
        {socials.email && (
          <a
            href={socials.email}
            title="Send Email"
            aria-label="Email"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 bg-slate-50/70 hover:bg-slate-800 hover:text-white transition-all border border-slate-200 hover:scale-110 shadow-xs"
          >
            <Mail className="w-4.5 h-4.5" />
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
            className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-600 bg-blue-50/70 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 hover:scale-110 shadow-xs"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
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
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 bg-slate-100/80 hover:bg-black hover:text-white transition-all border border-slate-200 hover:scale-110 shadow-xs"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
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
            className="w-9 h-9 rounded-xl flex items-center justify-center text-rose-600 bg-rose-50/70 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 hover:scale-110 shadow-xs"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
              <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
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
            className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-700 bg-blue-50/70 hover:bg-blue-700 hover:text-white transition-all border border-blue-100 hover:scale-110 shadow-xs"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
        )}
      </aside>
    </>
  );
}
