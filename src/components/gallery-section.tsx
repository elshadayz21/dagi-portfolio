"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GalleryItem, GalleryCategory } from "@/lib/gallery-store";
import {
  Film,
  Image as ImageIcon,
  Play,
  MapPin,
  Tractor,
  User,
  X,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

interface GallerySectionProps {
  items: GalleryItem[];
  currentLocale?: string;
  representativeName?: string;
  phone?: string;
  maxItems?: number;
  showAllLink?: boolean;
}

const CATEGORY_NAMES: Record<string, string> = {
  ALL: "All Field Media",
  FIELD_WORK: "Field Work & Plowing",
  DELIVERY: "Deliveries & Handover",
  TRAINING: "Farmer Training",
  HARVEST: "Harvesting",
  VIDEO: "Videos Only",
};

export function GallerySection({
  items,
  currentLocale = "en",
  representativeName = "Dagim Melese",
  phone = "+251911234567",
  maxItems,
  showAllLink = true,
}: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "title-asc" | "location-asc" | "tractor-asc"
  >("date-desc");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(() => {
    const list = items.filter((item) => {
      if (activeCategory === "ALL") return true;
      if (activeCategory === "VIDEO") return item.type === "VIDEO";
      return item.category === activeCategory;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "location-asc":
          return a.location.localeCompare(b.location);
        case "tractor-asc":
          return (a.tractorModel || "").localeCompare(b.tractorModel || "");
        default:
          return 0;
      }
    });

    return list;
  }, [items, activeCategory, sortBy]);

  const displayedItems = maxItems ? filteredItems.slice(0, maxItems) : filteredItems;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Tractors & Farmers in Action Across Ethiopia
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Authentic photographic records and operational field video demonstrations of Tekhaf tractors plowing, harvesting, and supporting farmers in Oromia, Amhara, Sidama, and beyond.
          </p>
        </div>

        {showAllLink && (
          <Link
            href={`/${currentLocale}/gallery`}
            className="text-xs sm:text-sm font-bold text-tekhaf-700 hover:text-tekhaf-900 flex items-center gap-1.5 shrink-0 hover:underline"
          >
            <span>Explore Full Field Gallery ({items.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Filter Tabs & Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {["ALL", "FIELD_WORK", "DELIVERY", "TRAINING", "HARVEST", "VIDEO"].map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === "ALL"
                ? items.length
                : cat === "VIDEO"
                ? items.filter((i) => i.type === "VIDEO").length
                : items.filter((i) => i.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-tekhaf-800 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{CATEGORY_NAMES[cat] || cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 shadow-xs"
          >
            <option value="date-desc">Latest Demonstrations</option>
            <option value="date-asc">Oldest Demonstrations</option>
            <option value="title-asc">Title (A to Z)</option>
            <option value="location-asc">Location / Region</option>
            <option value="tractor-asc">Tractor Model</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item, index) => {
          const isVideo = item.type === "VIDEO";

          return (
            <ScrollReveal
              key={item.id}
              direction="up"
              distance={28}
              delay={(index % 6) * 90}
              duration={700}
            >
              <div
                onClick={() => setSelectedItem(item)}
                role="button"
                tabIndex={0}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group cursor-pointer h-full"
              >
                <div>
                  {/* Media Thumbnail */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    {isVideo ? (
                      item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover opacity-80"
                        />
                      )
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Play Button Overlay for Video */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/95 text-tekhaf-800 flex items-center justify-center shadow-2xl group-hover:scale-115 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5 text-tekhaf-700" />
                        </div>
                      </div>
                    )}

                    {/* Location & Region Badge */}
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    {item.tractorModel && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-tekhaf-700">
                        <Tractor className="w-3.5 h-3.5 text-tekhaf-600 shrink-0" />
                        <span className="truncate">{item.tractorModel}</span>
                      </div>
                    )}

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-tekhaf-700 transition-colors line-clamp-1 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.farmerName && (
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-slate-700 truncate">
                          {item.farmerName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-tekhaf-700 font-bold text-[11px] flex items-center gap-1">
                    <span>{isVideo ? "Watch Demonstration" : "View Photo"}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE LIGHTBOX & VIDEO PLAYER MODAL                */}
      {/* ======================================================== */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150"
          >
            {/* Player Container */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {selectedItem.type === "VIDEO" ? (
                selectedItem.mediaUrl.includes("youtube.com") || selectedItem.mediaUrl.includes("youtu.be") ? (
                  <iframe
                    src={selectedItem.mediaUrl.replace("watch?v=", "embed/")}
                    title={selectedItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={selectedItem.mediaUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <img
                  src={selectedItem.mediaUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-lg"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Info Footer */}
            <div className="p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {CATEGORY_NAMES[selectedItem.category] || selectedItem.category}
                  </span>
                  <span className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedItem.location}</span>
                  </span>
                </div>

                {/* WhatsApp Inquiry Link for this exact tractor/farmer demo */}
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello Dagim Melese, I saw the field demonstration "${selectedItem.title}" (${selectedItem.location}). I would like to inquire about this tractor and pricing.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask Dagim on WhatsApp</span>
                </a>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {selectedItem.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedItem.description}
              </p>

              {(selectedItem.tractorModel || selectedItem.farmerName) && (
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                  {selectedItem.tractorModel && (
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                        Machinery Model
                      </span>
                      <span className="font-bold text-tekhaf-800">{selectedItem.tractorModel}</span>
                    </div>
                  )}
                  {selectedItem.farmerName && (
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                        Farmer / Cooperative Union
                      </span>
                      <span className="font-bold text-slate-800">{selectedItem.farmerName}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
