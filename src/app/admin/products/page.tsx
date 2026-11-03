"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TractorProduct } from "@/lib/data/inventory";
import { MediaAsset } from "@/lib/media-store";
import {
  Plus,
  X,
  CheckCircle2,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  ImageIcon,
  Search,
  Check,
} from "lucide-react";
import { Pagination } from "@/components/pagination";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<TractorProduct[]>([]);
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [form, setForm] = useState({
    title: "",
    brand: "Massey Ferguson",
    modelNumber: "",
    horsepower: 75,
    engineType: "Perkins Diesel 4-Cylinder",
    transmission: "8 Forward + 2 Reverse",
    driveType: "4WD",
    availability: "IN_STOCK" as "IN_STOCK" | "PRE_ORDER" | "OUT_OF_STOCK",
    priceFormatted: "Inquire",
    image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80",
    summary: "",
    isFeatured: true,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success && data.media) {
        setMediaList(data.media);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMedia();
  }, []);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      brand: "Massey Ferguson",
      modelNumber: "",
      horsepower: 85,
      engineType: "Perkins 4.41 Direct Injection Diesel",
      transmission: "8 Forward + 2 Reverse Mechanical",
      driveType: "4WD",
      availability: "IN_STOCK",
      priceFormatted: "Inquire",
      image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80",
      summary: "",
      isFeatured: true,
    });
    setShowModal(true);
  };

  const openEditModal = (p: TractorProduct) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      brand: p.brand,
      modelNumber: p.modelNumber,
      horsepower: p.horsepower,
      engineType: p.engineType,
      transmission: p.transmission,
      driveType: p.driveType,
      availability: p.availability,
      priceFormatted: p.priceFormatted,
      image: p.image,
      summary: p.summary,
      isFeatured: p.isFeatured,
    });
    setShowModal(true);
  };

  const handleSaveTractor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.modelNumber) return;

    try {
      setSubmitting(true);
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const payload: Partial<TractorProduct> = {
        id: editingId || `prod-${Date.now()}`,
        slug,
        title: form.title,
        brand: form.brand,
        modelNumber: form.modelNumber,
        horsepower: Number(form.horsepower),
        engineType: form.engineType,
        fuelType: "Diesel",
        transmission: form.transmission,
        driveType: form.driveType as "2WD" | "4WD",
        availability: form.availability,
        priceFormatted: form.priceFormatted || "Inquire",
        isFeatured: form.isFeatured,
        image: form.image,
        gallery: [form.image],
        summary: form.summary || `${form.title} available from Dagim Melese at Tekhaf Trading.`,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.products);
        setShowModal(false);
        showToast(
          editingId
            ? `Tractor "${form.title}" updated and synced to footer & catalog.`
            : `Tractor "${form.title}" added to inventory and synchronized with footer!`
        );
      } else {
        alert(data.error || "Failed to save tractor");
      }
    } catch {
      alert("Error saving tractor. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAvailability = async (id: string, current: string) => {
    const nextStatus =
      current === "IN_STOCK"
        ? "PRE_ORDER"
        : current === "PRE_ORDER"
        ? "OUT_OF_STOCK"
        : "IN_STOCK";

    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, availability: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, availability: nextStatus as any } : p))
        );
        showToast(`Stock status updated to ${nextStatus.replace("_", " ")}`);
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (p: TractorProduct) => {
    if (!confirm(`Are you sure you want to delete ${p.title} from inventory? It will also be removed from the website footer.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products?id=${p.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((item) => item.id !== p.id));
        showToast(`Tractor "${p.title}" deleted.`);
      }
    } catch {
      alert("Failed to delete tractor.");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.modelNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = brandFilter === "ALL" || p.brand === brandFilter;
      return matchesSearch && matchesBrand;
    });
  }, [products, searchQuery, brandFilter]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tractor Inventory & Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage heavy tractors and implements. Added models automatically display in the public catalog and site footer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-tekhaf-600" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Tractor</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search tractors by title, model number, brand..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setBrandFilter("ALL");
              setCurrentPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              brandFilter === "ALL"
                ? "bg-tekhaf-700 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Brands ({products.length})
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => {
                setBrandFilter(b);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                brandFilter === b
                  ? "bg-tekhaf-700 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Tractor Model</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Horsepower</th>
                <th className="p-4">Drive</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No tractor models match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((tractor) => (
                  <tr key={tractor.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tractor.image}
                          alt={tractor.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80";
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{tractor.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {tractor.modelNumber} • {tractor.transmission}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{tractor.brand}</td>
                    <td className="p-4 font-bold text-tekhaf-700">{tractor.horsepower} HP</td>
                    <td className="p-4 font-mono text-slate-600">{tractor.driveType || "4WD"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleAvailability(tractor.id, tractor.availability)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          tractor.availability === "IN_STOCK"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                            : tractor.availability === "PRE_ORDER"
                            ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle availability"
                      >
                        {tractor.availability === "IN_STOCK"
                          ? "In Stock"
                          : tractor.availability === "PRE_ORDER"
                          ? "Pre-Order"
                          : "Unavailable"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/en/products/${tractor.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-tekhaf-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View on Live Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(tractor)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tractor)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Tractor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[4, 8, 12, 24]}
            itemName="tractors"
          />
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 sm:p-7 relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingId ? "Edit Tractor Specifications" : "Add New Tractor to Catalog & Footer"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Saved tractors immediately reflect in the public machinery catalog and website footer.
            </p>

            <form onSubmit={handleSaveTractor} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tractor Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Massey Ferguson MF 385 (4WD, 85 HP)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand *</label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  >
                    <option value="Massey Ferguson">Massey Ferguson</option>
                    <option value="Lovol">Lovol</option>
                    <option value="New Holland">New Holland</option>
                    <option value="John Deere">John Deere</option>
                    <option value="Sonalika">Sonalika</option>
                    <option value="Case IH">Case IH</option>
                    <option value="Deutz-Fahr">Deutz-Fahr</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model Number *</label>
                  <input
                    type="text"
                    required
                    value={form.modelNumber}
                    onChange={(e) => setForm({ ...form, modelNumber: e.target.value })}
                    placeholder="e.g. MF 385 4WD"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Horsepower (HP) *</label>
                  <input
                    type="number"
                    required
                    value={form.horsepower}
                    onChange={(e) => setForm({ ...form, horsepower: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Drive System</label>
                  <select
                    value={form.driveType}
                    onChange={(e) => setForm({ ...form, driveType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  >
                    <option value="4WD">4WD (Heavy Field)</option>
                    <option value="2WD">2WD (Light Hauling)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Availability</label>
                  <select
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  >
                    <option value="IN_STOCK">In Stock</option>
                    <option value="PRE_ORDER">Pre-Order</option>
                    <option value="OUT_OF_STOCK">Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Engine Specification</label>
                  <input
                    type="text"
                    value={form.engineType}
                    onChange={(e) => setForm({ ...form, engineType: e.target.value })}
                    placeholder="e.g. Perkins 4.41 Direct Injection"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transmission</label>
                  <input
                    type="text"
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                    placeholder="e.g. 8 Forward + 2 Reverse"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>
              </div>

              {/* Image Input with Media Library Picker */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Tractor Image URL *</label>
                  {mediaList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(!showMediaPicker)}
                      className="text-[11px] text-tekhaf-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>{showMediaPicker ? "Hide Media Assets" : "Pick from Uploaded Media"}</span>
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />

                {/* Media Picker Grid */}
                {showMediaPicker && (
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Click an asset to set as tractor photo:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto">
                      {mediaList.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, image: m.url });
                            setShowMediaPicker(false);
                          }}
                          className={`relative aspect-video rounded-lg overflow-hidden border transition-all ${
                            form.image === m.url
                              ? "ring-2 ring-tekhaf-600 border-tekhaf-600"
                              : "border-slate-200 hover:opacity-80"
                          }`}
                          title={m.title}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brief Description / Summary</label>
                <textarea
                  rows={2}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Field-tested heavy duty machinery for grain, teff, and agricultural operations..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="rounded border-slate-300 text-tekhaf-600 focus:ring-tekhaf-500"
                  />
                  <span>Feature on Homepage Showcase</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-tekhaf-700 text-white rounded-xl font-bold hover:bg-tekhaf-800 disabled:opacity-75 flex items-center gap-1.5"
                  >
                    {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingId ? "Update Tractor" : "Save to Catalog & Footer"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
