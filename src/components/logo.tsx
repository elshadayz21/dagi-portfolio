"use client";

import { useState } from "react";

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
  const [imageFailed, setImageFailed] = useState(false);
  const isLightText = className.includes("text-white");

  // Fallback Vector Tractor SVG Emblem
  const defaultEmblem = (
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
        <path d="M3 17h18" />
        <path d="M7 17v-4h6l2 4" />
        <path d="M13 13V8h-4l-2 5" />
        <path d="M10 8V5h2" />
        <circle cx="6" cy="17" r="3" />
        <circle cx="17.5" cy="17" r="2" />
        <path d="M12 5V3" />
      </svg>
    </div>
  );

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Emblem: Custom Uploaded Logo or Default Tractor Emblem */}
      {customLogoUrl && !imageFailed ? (
        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-200 overflow-hidden p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={customLogoUrl}
            alt={representativeName}
            className="w-full h-full object-contain"
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : (
        defaultEmblem
      )}

      {/* Representative Headline & Subline */}
      <div className="flex flex-col leading-tight">
        <span
          className={`text-base sm:text-lg font-black tracking-tight uppercase transition-colors ${
            isLightText
              ? "text-white"
              : "text-slate-900 group-hover:text-tekhaf-700"
          }`}
        >
          {representativeName}
        </span>
        {!isCompact && (
          <span
            className={`text-[11px] font-medium ${
              isLightText ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {jobTitle} •{" "}
            <span
              className={
                isLightText
                  ? "text-tekhaf-300 font-semibold"
                  : "text-tekhaf-700 font-semibold"
              }
            >
              {companyName}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
