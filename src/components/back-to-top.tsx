"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button once the user scrolls beyond 320px
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-tekhaf-700 hover:bg-tekhaf-800 text-white shadow-xl hover:shadow-2xl border-2 border-white flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-tekhaf-500 focus:ring-offset-2 active:scale-95 group ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-6 scale-75 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover:-translate-y-0.5 duration-200 stroke-[2.5]" />
      
      {/* Subtle Desktop Tooltip */}
      <span className="hidden sm:block absolute -top-9 px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
        Back to top
      </span>
    </button>
  );
}
