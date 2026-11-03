"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { TractorProduct } from "@/lib/data/inventory";
import { InquiryModal } from "./inquiry-modal";
import { Search, RotateCcw, ArrowRight, Tractor, ArrowUpDown } from "lucide-react";
import { Pagination } from "./pagination";

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
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedHP, setSelectedHP] = useState("ALL");
  const [selectedAvailability, setSelectedAvailability] = useState("ALL");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "name-asc" | "name-desc" | "hp-desc" | "hp-asc" | "category-asc"
  >("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const categories = useMemo(() => {
    const list = Array.from(
      new Set(initialProducts.map((p) => p.category).filter(Boolean) as string[])
    );
    return ["ALL", ...list];
  }, [initialProducts]);

  const brands = useMemo(() => {
    const list = Array.from(new Set(initialProducts.map((p) => p.brand)));
    return ["ALL", ...list];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    const list = initialProducts.filter((product) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.modelNumber.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        (product.category && product.category.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === "ALL" || product.category === selectedCategory;

      const matchesBrand =
        selectedBrand === "ALL" || product.brand === selectedBrand;

      let matchesHP = true;
      if (selectedHP === "under-75") matchesHP = product.horsepower < 75;
      else if (selectedHP === "75-85")
        matchesHP = product.horsepower >= 75 && product.horsepower <= 85;
      else if (selectedHP === "over-85") matchesHP = product.horsepower > 85;

      const matchesAvailability =
        selectedAvailability === "ALL" ||
        product.availability === selectedAvailability;

      return matchesSearch && matchesCategory && matchesBrand && matchesHP && matchesAvailability;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (b.id || "").localeCompare(a.id || "");
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "hp-desc":
          return b.horsepower - a.horsepower;
        case "hp-asc":
          return a.horsepower - b.horsepower;
        case "category-asc":
          return (a.category || "").localeCompare(b.category || "");
        default:
          return 0;
      }
    });

    return list;
  }, [initialProducts, searchQuery, selectedCategory, selectedBrand, selectedHP, selectedAvailability, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedBrand("ALL");
    setSelectedHP("ALL");
    setSelectedAvailability("ALL");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={dict.productsPage.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-slate-50/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            >
              <option value="ALL">All Categories</option>
              {categories.filter((c) => c !== "ALL").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            >
              <option value="ALL">{dict.productsPage.allBrands}</option>
              {brands.filter((b) => b !== "ALL").map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Horsepower
            </label>
            <select
              value={selectedHP}
              onChange={(e) => {
                setSelectedHP(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            >
              <option value="ALL">{dict.productsPage.allHPs}</option>
              <option value="under-75">Under 75 HP</option>
              <option value="75-85">75 HP - 85 HP</option>
              <option value="over-85">90+ HP</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => {
                setSelectedAvailability(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            >
              <option value="ALL">{dict.productsPage.allAvailability}</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="PRE_ORDER">Available on Pre-Order</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span>Sort By</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            >
              <option value="date-desc">Latest Added</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
              <option value="hp-desc">Horsepower (High to Low)</option>
              <option value="hp-asc">Horsepower (Low to High)</option>
              <option value="category-asc">Category / Type (A to Z)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full text-xs font-semibold text-slate-600 hover:text-tekhaf-700 bg-slate-100 hover:bg-slate-200 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{dict.productsPage.clearFilters}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Tractor className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">
            {dict.productsPage.noResults}
          </h3>
          <button
            onClick={handleResetFilters}
            className="mt-4 text-xs font-semibold bg-tekhaf-700 text-white px-4 py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((tractor) => (
            <div
              key={tractor.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="relative h-52 bg-slate-100">
                <Image
                  src={tractor.image}
                  alt={tractor.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                  {tractor.horsepower} HP • {tractor.driveType}
                </span>
                <span className="absolute top-3 right-3 text-[10px] font-semibold bg-white/90 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                  {tractor.availability === "IN_STOCK"
                    ? dict.common.inStock
                    : dict.common.preOrder}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {tractor.brand}
                    </span>
                    {tractor.category && (
                      <span className="text-[10px] font-semibold text-tekhaf-700 bg-tekhaf-50 border border-tekhaf-200 px-2 py-0.5 rounded-md">
                        {tractor.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    <Link
                      href={`/${currentLocale}/products/${tractor.slug}`}
                      className="hover:text-tekhaf-700 transition-colors"
                    >
                      {tractor.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tractor.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/${currentLocale}/products/${tractor.slug}`}
                    className="flex-1 text-center py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>{dict.common.details}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <InquiryModal
                    currentLocale={currentLocale}
                    tractorTitle={tractor.title}
                    triggerButtonText="Inquire"
                    className="flex-1 text-center py-2 px-3 rounded-lg bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold transition-colors shadow-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          </div>

          {filteredProducts.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredProducts.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[6, 9, 15, 30]}
                itemName="tractors"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
