import { MessageSquare, Phone, Mail } from "lucide-react";

interface FloatingSocialsProps {
  socials?: {
    whatsapp: string;
    telegram: string;
    linkedin: string;
    phone: string;
    email: string;
  };
}

export function FloatingSocials({
  socials = {
    whatsapp: "https://wa.me/251911234567",
    telegram: "https://t.me/tekhaftractors",
    linkedin: "https://linkedin.com/in/dagim-melese",
    phone: "tel:+251911234567",
    email: "mailto:dagim@tekhaf.com",
  },
}: FloatingSocialsProps) {
  return (
    <aside
      aria-label="Direct Contact Channels"
      className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200"
    >
      {/* WhatsApp */}
      <a
        href={socials.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp"
        aria-label="WhatsApp"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-emerald-600 bg-emerald-50/70 hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100 hover:scale-110"
      >
        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
      </a>

      {/* Telegram */}
      <a
        href={socials.telegram}
        target="_blank"
        rel="noopener noreferrer"
        title="Telegram"
        aria-label="Telegram"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sky-600 bg-sky-50/70 hover:bg-sky-500 hover:text-white transition-all shadow-sm border border-sky-100 hover:scale-110"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href={socials.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn"
        aria-label="LinkedIn"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-blue-700 bg-blue-50/70 hover:bg-blue-700 hover:text-white transition-all shadow-sm border border-blue-100 hover:scale-110"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-4.5 sm:h-4.5">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      </a>

      {/* Phone */}
      <a
        href={socials.phone}
        title="Call"
        aria-label="Call"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-tekhaf-700 bg-tekhaf-50/70 hover:bg-tekhaf-700 hover:text-white transition-all shadow-sm border border-tekhaf-100 hover:scale-110"
      >
        <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </a>

      {/* Email */}
      <a
        href={socials.email}
        title="Email"
        aria-label="Email"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 bg-slate-50/70 hover:bg-slate-800 hover:text-white transition-all shadow-sm border border-slate-200 hover:scale-110"
      >
        <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </a>
    </aside>
  );
}
