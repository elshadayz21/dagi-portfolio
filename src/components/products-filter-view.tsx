"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { TractorProduct } from "@/lib/data/inventory";
import { QuoteModal } from "./quote-modal";
import { Search, Filter, Tractor, RotateCcw, Check, ArrowRight } from "lucide-react";

interface ProductsFilterViewProps {
  currentLocale: Locale;
  initialProducts: TractorProduct[];
}

export function ProductsFilterView({
  currentLocale,
  initialProducts,
}: ProductsFilterViewProps) {
  const dict = getDictionary(currentLocale);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedHP, setSelectedHP] = useState("ALL");
  const [selectedAvailability, setSelectedAvailability] = useState("ALL");

  const brands = useMemo(() => {
    const list = Array.from(new Set(initialProducts.map((p) => p.brand)));
    return ["ALL", ...list];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Search text match
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.modelNumber.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.engineType.toLowerCase().includes(query);

      // Brand filter
      const matchesBrand =
        selectedBrand === "ALL" || product.brand === selectedBrand;

      // HP filter
      let matchesHP = true;
      if (selectedHP === "under-75") matchesHP = product.horsepower < 75;
      else if (selectedHP === "75-85")
        matchesHP = product.horsepower >= 75 && product.horsepower <= 85;
      else if (selectedHP === "over-85") matchesHP = product.horsepower > 85;

      // Availability filter
      const matchesAvailability =
        selectedAvailability === "ALL" ||
        product.availability === selectedAvailability;

      return matchesSearch && matchesBrand && matchesHP && matchesAvailability;
    });
  }, [initialProducts, searchQuery, selectedBrand, selectedHP, selectedAvailability]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBrand("ALL");
    setSelectedHP("ALL");
    setSelectedAvailability("ALL");
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.productsPage.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-slate-50/50"
          />
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {/* Brand */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            >
              <option value="ALL">{dict.productsPage.allBrands}</option>
              {brands.filter((b) => b !== "ALL").map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Horsepower */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Horsepower
            </label>
            <select
              value={selectedHP}
              onChange={(e) => setSelectedHP(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            >
              <option value="ALL">{dict.productsPage.allHPs}</option>
              <option value="under-75">Under 75 HP (Utility / Light)</option>
              <option value="75-85">75 HP - 85 HP (Standard Grain Farming)</option>
              <option value="over-85">90+ HP (Heavy Duty / Commercial)</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Stock Status
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            >
              <option value="ALL">{dict.productsPage.allAvailability}</option>
              <option value="IN_STOCK">In Stock (Addis Ababa Depot)</option>
              <option value="PRE_ORDER">Available on Pre-Order</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full text-xs font-bold text-slate-600 hover:text-tekhaf-700 bg-slate-100 hover:bg-slate-200 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{dict.productsPage.clearFilters}</span>
            </button>
          </div>
        </div>

        {/* Counter feedback */}
        <div className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span>
            {dict.productsPage.showingResults}: <strong>{filteredProducts.length}</strong> tractors
          </span>
          <span className="text-[11px] text-tekhaf-600 font-bold">
            All tractors include 1-Year Tekhaf Field Warranty
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Tractor className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {dict.productsPage.noResults}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Try adjusting your search keywords or horsepower filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold bg-tekhaf-700 text-white px-4 py-2 rounded-lg"
          >
            Show All Tractors
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((tractor) => (
            <div
              key={tractor.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-60 bg-slate-100 overflow-hidden">
                <Image
                  src={tractor.image}
                  alt={`${tractor.title} Tractor Ethiopia Tekhaf Trading`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-tekhaf-900/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  {tractor.horsepower} HP • {tractor.driveType}
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      tractor.availability === "IN_STOCK"
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {tractor.availability === "IN_STOCK"
                      ? dict.common.inStock
                      : dict.common.preOrder}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-tekhaf-600 mb-1">
                    <span>{tractor.brand}</span>
                    <span className="text-slate-400">{tractor.modelNumber}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-tekhaf-700 transition-colors">
                    <Link href={`/${currentLocale}/products/${tractor.slug}`}>
                      {tractor.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {tractor.summary}
                  </p>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block">{dict.common.engine}</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {tractor.engineType.split(" ")[0]} 4-Cyl
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{dict.common.transmission}</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {tractor.transmission.split(" ")[0]} Mech
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Indicative Price:</span>
                    <span className="font-extrabold text-tekhaf-700 text-sm">
                      {tractor.priceFormatted}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/${currentLocale}/products/${tractor.slug}`}
                    className="flex-1 text-center py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>{dict.common.details}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <QuoteModal
                    currentLocale={currentLocale}
                    tractorTitle={tractor.title}
                    triggerButtonText={dict.common.requestQuote}
                    className="flex-1 text-center py-2.5 px-3 rounded-xl bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold shadow-sm transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
