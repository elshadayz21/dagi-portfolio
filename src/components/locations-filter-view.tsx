"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/lib/i18n/config";
import { LocationItem } from "@/lib/location-store";
import {
  MapPin,
  Search,
  Filter,
  ArrowRight,
  Tractor,
  Phone,
  Building,
  RotateCcw,
  Sparkles,
  MessageSquare,
  ArrowUpDown,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

interface LocationsFilterViewProps {
  currentLocale: Locale;
  initialLocations: LocationItem[];
  phoneDisplay?: string;
  phone?: string;
  representativeName?: string;
}

export function LocationsFilterView({
  currentLocale,
  initialLocations,
  phoneDisplay = "+251 91 123 4567",
  phone = "+251911234567",
  representativeName = "Dagim Melese",
}: LocationsFilterViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [sortBy, setSortBy] = useState<"name-asc" | "region-asc" | "order-asc">("order-asc");

  // Extract unique regions dynamically
  const regions = useMemo(() => {
    const set = new Set<string>();
    initialLocations.forEach((loc) => {
      if (loc.region) set.add(loc.region);
    });
    return ["ALL", ...Array.from(set)];
  }, [initialLocations]);

  // Extract unique cities / hubs dynamically (e.g. Adama, Bishoftu, Bahir Dar, Mekele)
  const cities = useMemo(() => {
    const filteredByRegion =
      selectedRegion === "ALL"
        ? initialLocations
        : initialLocations.filter((l) => l.region === selectedRegion);

    const set = new Set<string>();
    filteredByRegion.forEach((loc) => {
      if (loc.name) set.add(loc.name);
    });
    return ["ALL", ...Array.from(set)];
  }, [initialLocations, selectedRegion]);

  // Filtered and sorted locations list
  const filteredLocations = useMemo(() => {
    const list = initialLocations.filter((loc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        loc.name.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q) ||
        loc.title.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q) ||
        loc.farmingContext.toLowerCase().includes(q) ||
        loc.hubOffice.toLowerCase().includes(q);

      const matchesRegion =
        selectedRegion === "ALL" || loc.region === selectedRegion;

      const matchesCity =
        selectedCity === "ALL" || loc.name === selectedCity;

      return matchesSearch && matchesRegion && matchesCity;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "region-asc":
          return a.region.localeCompare(b.region);
        case "order-asc":
        default:
          return a.order - b.order;
      }
    });

    return list;
  }, [initialLocations, searchQuery, selectedRegion, selectedCity, sortBy]);

  const STATIC_SLUGS = [
    "tractors-addis-ababa",
    "tractors-oromia",
    "tractors-sidama",
    "tractors-somali-region",
    "agricultural-equipment-ethiopia",
  ];

  const getLocationUrl = (slug: string) => {
    if (STATIC_SLUGS.includes(slug)) {
      return `/${currentLocale}/${slug}`;
    }
    return `/${currentLocale}/locations/${slug}`;
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRegion("ALL");
    setSelectedCity("ALL");
    setSortBy("order-asc");
  };

  return (
    <div className="space-y-8">
      {/* Search, Region & City Filter Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/90 space-y-5">
        {/* Top Search & Reset Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Adama, Bishoftu, Bahir Dar, Mekele, or crop type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-slate-50/60 font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort selector */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-600">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 shadow-xs"
              >
                <option value="order-asc">Featured Hubs</option>
                <option value="name-asc">City Name (A to Z)</option>
                <option value="region-asc">Region (A to Z)</option>
              </select>
            </div>

            {(searchQuery || selectedRegion !== "ALL" || selectedCity !== "ALL") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div>
          <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Filter by Region:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {regions.map((reg) => {
              const isSelected = selectedRegion === reg;
              const count =
                reg === "ALL"
                  ? initialLocations.length
                  : initialLocations.filter((l) => l.region === reg).length;

              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => {
                    setSelectedRegion(reg);
                    setSelectedCity("ALL");
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-tekhaf-800 text-white shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  <span>{reg === "ALL" ? "All Regions" : reg}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specific City / Location Filter Tabs */}
        {cities.length > 2 && (
          <div className="pt-3 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Specific City / Hub:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {cities.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-tekhaf-600 text-white shadow-xs"
                        : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-tekhaf-500" />
                    <span>{city === "ALL" ? "All Locations" : city}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Locations Cards Grid */}
      {filteredLocations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            No regional locations found matching your filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or selecting &ldquo;All Regions&rdquo; to browse our complete Ethiopian network.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-2 bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            Show All Locations ({initialLocations.length})
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((loc, index) => (
            <ScrollReveal
              key={loc.id}
              direction="up"
              distance={28}
              delay={(index % 6) * 80}
              duration={700}
            >
              <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full">
              <div>
                {/* Hero Photo Banner */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={loc.heroImage}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

                  {/* Region Badge */}
                  <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-md shadow-xs">
                    {loc.region}
                  </span>

                  {/* City Name Headline on Thumbnail */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xl font-black tracking-tight">{loc.name}</p>
                    <p className="text-[11px] text-slate-200 line-clamp-1">{loc.subtitle}</p>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-3.5">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-tekhaf-700 transition-colors line-clamp-1">
                      <Link href={getLocationUrl(loc.slug)}>
                        {loc.title}
                      </Link>
                    </h2>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                      {loc.description}
                    </p>
                  </div>

                  {/* Agricultural Specs Pills */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-start gap-2 text-slate-600">
                      <Tractor className="w-4 h-4 text-tekhaf-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Recommended Machinery
                        </span>
                        <span className="font-semibold text-slate-800">
                          {loc.recommendedHorsepower}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-slate-600">
                      <Building className="w-4 h-4 text-tekhaf-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Field Hub Office
                        </span>
                        <span className="font-semibold text-slate-800 line-clamp-1">
                          {loc.hubOffice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={getLocationUrl(loc.slug)}
                  className="font-bold text-xs text-tekhaf-700 hover:text-tekhaf-900 flex items-center gap-1 hover:underline"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello ${representativeName}, I would like to inquire about tractor delivery and machinery support in ${loc.name} (${loc.region}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                    title={`Message about ${loc.name} on WhatsApp`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`tel:${loc.phone || phone}`}
                    className="p-2 rounded-xl bg-white text-slate-700 hover:text-tekhaf-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                    title={`Call hub for ${loc.name}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-tekhaf-700" />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
        </div>
      )}
    </div>
  );
}
