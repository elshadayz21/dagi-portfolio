"use client";

import { useState, useEffect, useMemo } from "react";
import { Phone, Mail, X, MessageCircle } from "lucide-react";
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
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.39C16.32 14.27 15.1 13.67 14.88 13.59C14.65 13.5 14.49 13.46 14.32 13.71C14.16 13.96 13.69 14.51 13.55 14.68C13.4 14.84 13.26 14.86 13.01 14.74C12.76 14.61 11.97 14.36 11.03 13.52C10.29 12.87 9.8 12.06 9.65 11.81C9.51 11.57 9.64 11.43 9.76 11.31C9.87 11.2 10.01 11.02 10.13 10.87C10.26 10.73 10.3 10.63 10.38 10.46C10.46 10.3 10.42 10.15 10.36 10.03C10.3 9.91 9.8 8.68 9.59 8.18C9.39 7.7 9.18 7.76 9.03 7.75C8.89 7.75 8.72 7.74 8.56 7.74C8.39 7.74 8.13 7.8 7.9 8.05C7.67 8.3 7.03 8.9 7.03 10.12C7.03 11.34 7.92 12.51 8.04 12.68C8.16 12.84 9.78 15.35 12.28 16.42C12.87 16.68 13.33 16.83 13.69 16.95C14.29 17.14 14.83 17.11 15.26 17.05C15.74 16.98 16.74 16.44 16.95 15.86C17.16 15.27 17.16 14.77 17.09 14.67C17.03 14.56 16.88 14.49 16.57 14.39Z" />
          </svg>
        ),
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
      {/* 2. DESKTOP VIEW: Pure Floating Social Icons (>= md)       */}
      {/* (Floating naturally without an enclosing background box)   */}
      {/* ======================================================== */}
      <aside
        aria-label="Direct Contact Channels"
        className="fixed left-3 lg:left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3"
      >
        {/* WhatsApp */}
        {socials.whatsapp && (
          <a
            href={socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            aria-label="WhatsApp"
            className="group relative flex items-center justify-center w-8.5 h-8.5 text-[#25D366] hover:text-[#1ebe5b] transition-transform duration-200 hover:scale-125 focus:scale-125 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.39C16.32 14.27 15.1 13.67 14.88 13.59C14.65 13.5 14.49 13.46 14.32 13.71C14.16 13.96 13.69 14.51 13.55 14.68C13.4 14.84 13.26 14.86 13.01 14.74C12.76 14.61 11.97 14.36 11.03 13.52C10.29 12.87 9.8 12.06 9.65 11.81C9.51 11.57 9.64 11.43 9.76 11.31C9.87 11.2 10.01 11.02 10.13 10.87C10.26 10.73 10.3 10.63 10.38 10.46C10.46 10.3 10.42 10.15 10.36 10.03C10.3 9.91 9.8 8.68 9.59 8.18C9.39 7.7 9.18 7.76 9.03 7.75C8.89 7.75 8.72 7.74 8.56 7.74C8.39 7.74 8.13 7.8 7.9 8.05C7.67 8.3 7.03 8.9 7.03 10.12C7.03 11.34 7.92 12.51 8.04 12.68C8.16 12.84 9.78 15.35 12.28 16.42C12.87 16.68 13.33 16.83 13.69 16.95C14.29 17.14 14.83 17.11 15.26 17.05C15.74 16.98 16.74 16.44 16.95 15.86C17.16 15.27 17.16 14.77 17.09 14.67C17.03 14.56 16.88 14.49 16.57 14.39Z" />
            </svg>
            <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center px-2 py-1 text-[11px] font-bold text-white bg-slate-900/90 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              WhatsApp
            </span>
          </a>
        )}

        {/* Direct Phone Call */}
        {primaryPhone && (
          <a
            href={`tel:${primaryPhone}`}
            title={`Call: ${phoneDisplay || primaryPhone}`}
            aria-label="Direct Phone Call"
            className="group relative flex items-center justify-center w-8.5 h-8.5 text-tekhaf-700 hover:text-tekhaf-900 transition-transform duration-200 hover:scale-125 focus:scale-125 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
          >
            <Phone className="w-5.5 h-5.5 stroke-[2.3]" />
            <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center px-2 py-1 text-[11px] font-bold text-white bg-slate-900/90 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Call {phoneDisplay || primaryPhone}
            </span>
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
            className="group relative flex items-center justify-center w-8.5 h-8.5 text-[#229ED9] hover:text-[#1b8ec5] transition-transform duration-200 hover:scale-125 focus:scale-125 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center px-2 py-1 text-[11px] font-bold text-white bg-slate-900/90 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Telegram
            </span>
          </a>
        )}

        {/* Email */}
        {socials.email && (
          <a
            href={socials.email}
            title="Send Email"
            aria-label="Email"
            className="group relative flex items-center justify-center w-8.5 h-8.5 text-slate-700 hover:text-slate-900 transition-transform duration-200 hover:scale-125 focus:scale-125 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
          >
            <Mail className="w-5.5 h-5.5 stroke-[2.3]" />
            <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center px-2 py-1 text-[11px] font-bold text-white bg-slate-900/90 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Email
            </span>
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
            className="group relative flex items-center justify-center w-8.5 h-8.5 text-[#1877F2] hover:text-[#0d65d9] transition-transform duration-200 hover:scale-125 focus:scale-125 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
            <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center px-2 py-1 text-[11px] font-bold text-white bg-slate-900/90 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Facebook
            </span>
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
            className="group relative flex items-center justify-center w-8.5 h-8.5 text-black hover:text-zinc-800 transition-transform duration-200 hover:scale-125 focus:scale-125 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] filter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
            <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center px-2 py-1 text-[11px] font-bold text-white bg-slate-900/90 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              TikTok
            </span>
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
            className="group relative flex items-center justify-center w-8.5 h-8.5 text-[#FF0000] hover:text-[#cc0000] transition-transform duration-200 hover:scale-125 focus:scale-125 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
            </svg>
            <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center px-2 py-1 text-[11px] font-bold text-white bg-slate-900/90 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              YouTube
            </span>
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
            className="group relative flex items-center justify-center w-8.5 h-8.5 text-[#0A66C2] hover:text-[#084e96] transition-transform duration-200 hover:scale-125 focus:scale-125 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            <span className="pointer-events-none absolute left-full ml-3 hidden group-hover:flex items-center px-2 py-1 text-[11px] font-bold text-white bg-slate-900/90 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              LinkedIn
            </span>
          </a>
        )}
      </aside>
    </>
  );
}
