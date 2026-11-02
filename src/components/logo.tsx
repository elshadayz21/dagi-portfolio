import Image from "next/image";

interface LogoProps {
  representativeName?: string;
  jobTitle?: string;
  companyName?: string;
  customLogoUrl?: string | null;
  className?: string;
  isCompact?: boolean;
}

export function Logo({
  representativeName = "Dagim Melese",
  jobTitle = "Agricultural Machinery Specialist",
  companyName = "Tekhaf Trading",
  customLogoUrl = null,
  className = "",
  isCompact = false,
}: LogoProps) {
  if (customLogoUrl) {
    return (
      <div className={`relative flex items-center gap-3 ${className}`}>
        <div className="relative h-11 w-36">
          <Image
            src={customLogoUrl}
            alt={representativeName}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Tractor Emblem SVG */}
      <div className="w-11 h-11 rounded-xl bg-tekhaf-700 flex items-center justify-center text-white shrink-0 shadow-sm border border-tekhaf-800">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          {/* Tractor Cabin & Body */}
          <path d="M3 17h18" />
          <path d="M7 17v-4h6l2 4" />
          <path d="M13 13V8h-4l-2 5" />
          <path d="M10 8V5h2" />
          {/* Wheels */}
          <circle cx="6" cy="17" r="3" />
          <circle cx="17.5" cy="17" r="2" />
          {/* Exhaust */}
          <path d="M12 5V3" />
        </svg>
      </div>

      {/* Name and Affiliation */}
      <div className="flex flex-col leading-tight">
        <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-tekhaf-700 transition-colors uppercase">
          {representativeName}
        </span>
        {!isCompact && (
          <span className="text-[11px] font-medium text-slate-500">
            {jobTitle} • <span className="text-tekhaf-700 font-semibold">{companyName}</span>
          </span>
        )}
      </div>
    </div>
  );
}
