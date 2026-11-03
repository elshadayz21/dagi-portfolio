"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Tractor,
  Home,
  ArrowRight,
  Phone,
  MessageSquare,
  Compass,
  Volume2,
  Sparkles,
  Wrench,
} from "lucide-react";

interface Animated404Props {
  currentLocale?: string;
  phoneDisplay?: string;
  phone?: string;
  representativeName?: string;
}

export function Animated404({
  currentLocale = "en",
  phoneDisplay = "+251 91 123 4567",
  phone = "+251911234567",
  representativeName = "Dagim Melese",
}: Animated404Props) {
  const [honking, setHonking] = useState(false);
  const [honkCount, setHonkCount] = useState(0);

  // Synthesize realistic dual-tone tractor horn using Web Audio API
  const handleHonk = () => {
    setHonking(true);
    setHonkCount((prev) => prev + 1);

    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;

        const playBeep = (startTime: number, duration: number) => {
          // Classic European dual-tone tractor horn frequencies (F#4 ~370Hz & A4 ~440Hz)
          [370, 440].forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.08, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
          });
        };

        playBeep(now, 0.16);
        playBeep(now + 0.22, 0.24);
      }
    } catch {
      // AudioContext unavailable or restricted
    }

    setTimeout(() => setHonking(false), 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-b from-[#EDF5FF] via-[#F4F9FF] to-[#FAF8F5]">
      {/* Background Decorative Farmland Rays & Sun */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-200/30 via-sky-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Floating Clouds Animation */}
      <div className="absolute top-12 left-10 text-slate-200/60 animate-pulse pointer-events-none">
        <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor">
          <path d="M20 30 a15 15 0 0 1 25 -10 a20 20 0 0 1 35 -5 a15 15 0 0 1 25 15 z" />
        </svg>
      </div>
      <div className="absolute top-20 right-16 text-slate-200/40 animate-pulse pointer-events-none hidden sm:block">
        <svg width="150" height="50" viewBox="0 0 150 50" fill="currentColor">
          <path d="M25 38 a18 18 0 0 1 30 -12 a25 25 0 0 1 45 -6 a18 18 0 0 1 32 18 z" />
        </svg>
      </div>

      <div className="max-w-3xl w-full mx-auto text-center relative z-10 space-y-6">
        {/* 404 Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-black uppercase tracking-wider shadow-xs animate-bounce">
          <Compass className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Error 404 • Machinery Detour Detected</span>
        </div>

        {/* ======================================================== */}
        {/* ANIMATED TRACTOR DRIVING SCENE                           */}
        {/* ======================================================== */}
        <div className="relative py-2 max-w-lg mx-auto">
          {/* Tractor SVG Container with suspension bounce animation */}
          <div
            onClick={handleHonk}
            role="button"
            tabIndex={0}
            title="Click the tractor to honk the horn!"
            className={`cursor-pointer transition-transform duration-200 select-none ${
              honking ? "scale-105" : "hover:scale-[1.02]"
            }`}
          >
            <svg
              viewBox="0 0 460 220"
              className="w-full h-auto drop-shadow-xl"
              style={{
                filter: "drop-shadow(0 12px 20px rgba(0, 91, 150, 0.15))",
              }}
            >
              <defs>
                {/* Tekhaf Blue Body Gradient */}
                <linearGradient id="tractorBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0074BD" />
                  <stop offset="60%" stopColor="#005B96" />
                  <stop offset="100%" stopColor="#003E6B" />
                </linearGradient>

                {/* Tire Rubber Texture */}
                <linearGradient id="tireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2E384D" />
                  <stop offset="100%" stopColor="#131B2A" />
                </linearGradient>

                {/* Steel Rim Gradient */}
                <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                {/* Cabin Glass Reflection */}
                <linearGradient id="cabGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.75" />
                </linearGradient>

                {/* Headlight Beam */}
                <linearGradient id="headlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
                </linearGradient>
              </defs>

              <style>{`
                @keyframes tractorSuspension {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-3.5px); }
                }
                @keyframes wheelRotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes smokeRise1 {
                  0% { transform: translate(0, 0) scale(0.6); opacity: 0.8; }
                  100% { transform: translate(-28px, -45px) scale(1.8); opacity: 0; }
                }
                @keyframes smokeRise2 {
                  0% { transform: translate(0, 0) scale(0.5); opacity: 0.9; }
                  100% { transform: translate(-38px, -62px) scale(2.2); opacity: 0; }
                }
                @keyframes groundDrift {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-120px); }
                }
                .anim-chassis { animation: tractorSuspension 0.8s ease-in-out infinite; }
                .anim-wheel-rear { transform-origin: 125px 150px; animation: wheelRotate 1.6s linear infinite; }
                .anim-wheel-front { transform-origin: 345px 165px; animation: wheelRotate 1.6s linear infinite; }
                .anim-smoke-1 { transform-origin: 295px 48px; animation: smokeRise1 1.4s ease-out infinite; }
                .anim-smoke-2 { transform-origin: 295px 48px; animation: smokeRise2 1.4s ease-out infinite 0.7s; }
                .anim-ground { animation: groundDrift 1.2s linear infinite; }
              `}</style>

              {/* Distant Acacia Tree Silhouette & Hill */}
              <path
                d="M-20 185 Q 120 160 260 178 T 480 182 L 480 220 L -20 220 Z"
                fill="#DCFCE7"
                opacity="0.6"
              />

              {/* Headlight Beam illuminating the ground */}
              <polygon points="392,126 460,110 460,185 392,138" fill="url(#headlightBeam)" />

              {/* Ground & Plowed Soil Lines (Infinite scroll effect) */}
              <g className="anim-ground">
                <line x1="-120" y1="195" x2="600" y2="195" stroke="#78350F" strokeWidth="3" strokeDasharray="14 10" />
                <line x1="-120" y1="202" x2="600" y2="202" stroke="#92400E" strokeWidth="2" strokeDasharray="8 12" />
                <line x1="-120" y1="209" x2="600" y2="209" stroke="#B45309" strokeWidth="1.5" strokeDasharray="20 15" />
              </g>

              {/* TRACTOR CHASSIS & CAB (Bobbing with suspension) */}
              <g className="anim-chassis">
                {/* Exhaust Smoke Puffs */}
                <circle cx="295" cy="46" r="6" fill="#94A3B8" className="anim-smoke-1" />
                <circle cx="295" cy="46" r="7" fill="#CBD5E1" className="anim-smoke-2" />

                {/* Vertical Exhaust Stack */}
                <rect x="292" y="44" width="7" height="42" rx="3" fill="#1E293B" />
                <path d="M291 44 L300 40 L300 45 Z" fill="#0F172A" />

                {/* Cab Structure */}
                <path
                  d="M105 130 L120 62 L225 62 L245 130 Z"
                  fill="#0F172A"
                  stroke="#334155"
                  strokeWidth="3"
                />

                {/* Cab Glass Window */}
                <path
                  d="M124 125 L135 72 L218 72 L234 125 Z"
                  fill="url(#cabGlassGrad)"
                  stroke="#0284C7"
                  strokeWidth="1.5"
                />

                {/* Operator Seat & Silhouette (Dagim Melese driving) */}
                <circle cx="165" cy="92" r="10" fill="#003E6B" />
                <path d="M152 120 C152 104 178 104 178 120 Z" fill="#005B96" />
                {/* Steering wheel */}
                <line x1="184" y1="102" x2="194" y2="114" stroke="#1E293B" strokeWidth="3" />
                <circle cx="183" cy="100" r="4" fill="none" stroke="#F8FAFC" strokeWidth="2" />

                {/* Tractor Bonnet / Hood */}
                <path
                  d="M240 102 L380 106 Q395 108 395 125 L395 152 L240 152 Z"
                  fill="url(#tractorBodyGrad)"
                  stroke="#003E6B"
                  strokeWidth="2"
                />

                {/* Front Chrome Grille */}
                <rect x="382" y="112" width="10" height="34" rx="2" fill="#E2E8F0" stroke="#94A3B8" />
                <line x1="384" y1="118" x2="390" y2="118" stroke="#475569" strokeWidth="1.5" />
                <line x1="384" y1="124" x2="390" y2="124" stroke="#475569" strokeWidth="1.5" />
                <line x1="384" y1="130" x2="390" y2="130" stroke="#475569" strokeWidth="1.5" />
                <line x1="384" y1="136" x2="390" y2="136" stroke="#475569" strokeWidth="1.5" />

                {/* Headlight Lamp */}
                <circle cx="390" cy="132" r="6" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />

                {/* Tekhaf Brand Decal on Hood */}
                <rect x="260" y="118" width="85" height="15" rx="3" fill="#FFFFFF" opacity="0.95" />
                <text
                  x="302"
                  y="129"
                  textAnchor="middle"
                  fill="#005B96"
                  fontSize="8.5"
                  fontWeight="900"
                  fontFamily="system-ui, sans-serif"
                  letterSpacing="0.5"
                >
                  TEKHAF 404
                </text>

                {/* Rear Fender / Mudguard */}
                <path
                  d="M68 152 Q72 90 135 90 Q178 90 185 130 L158 132 Q150 110 130 110 Q94 110 88 152 Z"
                  fill="#003E6B"
                />

                {/* Front Mudguard */}
                <path
                  d="M320 144 Q330 125 358 125 Q375 125 382 138"
                  fill="none"
                  stroke="#003E6B"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>

              {/* ==================================================== */}
              {/* GIANT REAR WHEEL (Animated Rotation & Chevron Lugs)  */}
              {/* ==================================================== */}
              <g className="anim-wheel-rear">
                {/* Rubber Tire Outer */}
                <circle cx="125" cy="150" r="48" fill="url(#tireGrad)" stroke="#0F172A" strokeWidth="3" />
                {/* Deep Heavy-Duty Agricultural Tread Lugs (12 Lugs) */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <path
                    key={deg}
                    d="M125 104 L121 113 L129 113 Z"
                    fill="#475569"
                    transform={`rotate(${deg} 125 150)`}
                  />
                ))}
                {/* Gold Steel Rim */}
                <circle cx="125" cy="150" r="30" fill="url(#rimGrad)" stroke="#78350F" strokeWidth="2" />
                {/* Wheel Rim Cutouts / Spokes */}
                <circle cx="125" cy="150" r="14" fill="#003E6B" />
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <circle
                    key={deg}
                    cx="125"
                    cy="130"
                    r="4"
                    fill="#FEF3C7"
                    transform={`rotate(${deg} 125 150)`}
                  />
                ))}
                {/* Center Hub & Axle Nut */}
                <circle cx="125" cy="150" r="8" fill="#1E293B" />
                <circle cx="125" cy="150" r="4" fill="#F8FAFC" />
              </g>

              {/* ==================================================== */}
              {/* FRONT WHEEL (Animated Rotation & Steel Rim)          */}
              {/* ==================================================== */}
              <g className="anim-wheel-front">
                {/* Rubber Tire Outer */}
                <circle cx="345" cy="165" r="32" fill="url(#tireGrad)" stroke="#0F172A" strokeWidth="2.5" />
                {/* Treads (8 Lugs) */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path
                    key={deg}
                    d="M345 135 L342 142 L348 142 Z"
                    fill="#475569"
                    transform={`rotate(${deg} 345 165)`}
                  />
                ))}
                {/* Gold Steel Rim */}
                <circle cx="345" cy="165" r="20" fill="url(#rimGrad)" stroke="#78350F" strokeWidth="1.5" />
                {/* Center Hub & 5 Lug Nuts */}
                <circle cx="345" cy="165" r="10" fill="#003E6B" />
                {[0, 72, 144, 216, 288].map((deg) => (
                  <circle
                    key={deg}
                    cx="345"
                    cy="159"
                    r="2.5"
                    fill="#FEF3C7"
                    transform={`rotate(${deg} 345 165)`}
                  />
                ))}
                <circle cx="345" cy="165" r="4" fill="#1E293B" />
              </g>

              {/* Dirt Specks kicked up by rear wheel */}
              <g className="anim-ground" opacity="0.8">
                <circle cx="70" cy="188" r="2.5" fill="#78350F" />
                <circle cx="58" cy="180" r="2" fill="#92400E" />
                <circle cx="62" cy="192" r="1.5" fill="#B45309" />
              </g>
            </svg>
          </div>

          {/* Interactive Honk Button under the scene */}
          <div className="flex justify-center -mt-2">
            <button
              type="button"
              onClick={handleHonk}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-tekhaf-800 text-xs font-bold shadow-md border border-slate-200/80 transition-all active:scale-95 group"
            >
              <Volume2 className="w-3.5 h-3.5 text-tekhaf-600 group-hover:scale-110 transition-transform" />
              <span>Honk Tractor Horn!</span>
              {honkCount > 0 && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                  {honkCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Headline & Description */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Plowed Off the Digital Furrow!
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            The page you requested has either driven to another farm, been cultivated into a new URL, or never existed in the Tekhaf Machinery catalog.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Home Yard */}
          <Link
            href={`/${currentLocale}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home Yard</span>
          </Link>

          {/* Browse Tractors */}
          <Link
            href={`/${currentLocale}/products`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Tractor className="w-4 h-4" />
            <span>Browse Tractor Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Direct WhatsApp Assistance */}
          <a
            href="https://wa.me/251911234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Ask Dagim on WhatsApp</span>
          </a>
        </div>

        {/* Quick Tractor Suggestions Grid */}
        <div className="pt-6 border-t border-slate-200/80 max-w-xl mx-auto space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Popular Farm Machinery Inquiries in Ethiopia
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              {
                title: "Massey Ferguson 385 (85 HP)",
                slug: "massey-ferguson-385-4wd",
              },
              {
                title: "Deutz-Fahr 120 HP Heavy Duty",
                slug: "deutz-fahr-120hp-heavy-duty",
              },
              {
                title: "Lovol TB754 (75 HP 4WD)",
                slug: "lovol-tb754-75hp-4wd",
              },
              {
                title: "Agricultural Implements & Ploughs",
                slug: "agricultural-implements",
              },
            ].map((tractor) => (
              <Link
                key={tractor.slug}
                href={`/${currentLocale}/products`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-tekhaf-50 text-slate-700 hover:text-tekhaf-800 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{tractor.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Direct Phone Support Footer */}
        <div className="pt-2 text-xs text-slate-500">
          <span>Need immediate tractor specs or proforma invoice? Call </span>
          <a href={`tel:${phone}`} className="font-bold text-tekhaf-700 hover:underline">
            {representativeName} at {phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
