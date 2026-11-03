"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  RefreshCw,
  X,
  Tractor,
  Image as ImageIcon,
  Layers,
  Sparkles,
  AlertTriangle,
  Tag,
  Check,
} from "lucide-react";
import { CategoryItem } from "@/lib/category-store";
import { Pagination } from "@/components/pagination";

interface EnrichedCategory extends CategoryItem {
  productCount?: number;
  mediaCount?: number;
  totalItems?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<EnrichedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "PRODUCT" | "MEDIA" | "BOTH">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EnrichedCategory | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formType, setFormType] = useState<"PRODUCT" | "MEDIA" | "BOTH">("BOTH");
  const [formDesc, setFormDesc] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<EnrichedCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormType("BOTH");
    setFormDesc("");
    setModalOpen(true);
  };

  const openEditModal = (cat: EnrichedCategory) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormType(cat.type);
    setFormDesc(cat.description || "");
    setModalOpen(true);
  };

  const openDeleteModal = (cat: EnrichedCategory) => {
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormSlug(generated);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setSaving(true);
      if (editingCategory) {
        const res = await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCategory.id,
            name: formName.trim(),
            slug: formSlug.trim() || undefined,
            type: formType,
            description: formDesc.trim(),
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Category "${formName}" updated successfully!`);
          setModalOpen(false);
          fetchCategories();
        } else {
          alert(data.error || "Failed to update category");
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName.trim(),
            slug: formSlug.trim() || undefined,
            type: formType,
            description: formDesc.trim(),
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`New category "${formName}" added successfully!`);
          setModalOpen(false);
          fetchCategories();
        } else {
          alert(data.error || "Failed to add category");
        }
      }
    } catch {
      alert("Error saving category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/categories?id=${categoryToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Category "${categoryToDelete.name}" permanently deleted.`);
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch {
      alert("Error deleting category. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q));

      const matchesType =
        selectedType === "ALL" ||
        cat.type === selectedType ||
        (cat.type === "BOTH" && (selectedType === "PRODUCT" || selectedType === "MEDIA"));

      return matchesSearch && matchesType;
    });
  }, [categories, searchQuery, selectedType]);

  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  // Metric stats
  const metrics = useMemo(() => {
    const total = categories.length;
    const products = categories.filter((c) => c.type === "PRODUCT" || c.type === "BOTH").length;
    const media = categories.filter((c) => c.type === "MEDIA" || c.type === "BOTH").length;
    const totalTaggedItems = categories.reduce((acc, c) => acc + (c.totalItems || 0), 0);
    return { total, products, media, totalTaggedItems };
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderTree className="w-7 h-7 text-tekhaf-700" />
            <span>Categories Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add new categories, edit definitions, or delete existing categories across agricultural machinery inventory and media assets.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Categories
            </span>
            <span className="text-xl font-black text-slate-900">{metrics.total}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Tractor className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Machinery Types
            </span>
            <span className="text-xl font-black text-slate-900">{metrics.products}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Media Categories
            </span>
            <span className="text-xl font-black text-slate-900">{metrics.media}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Associated Assets
            </span>
            <span className="text-xl font-black text-slate-900">{metrics.totalTaggedItems} items</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search categories by name, slug, or keywords..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-slate-50/50"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: "All Categories" },
            { id: "PRODUCT", label: "Machinery & Equipment" },
            { id: "MEDIA", label: "Media & Assets" },
            { id: "BOTH", label: "Dual Purpose" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedType(tab.id as any);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === tab.id
                  ? "bg-tekhaf-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-tekhaf-600" />
          <span>Loading categories...</span>
        </div>
      ) : paginatedCategories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FolderTree className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No categories found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, or click below to create a new category.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 bg-tekhaf-50 text-tekhaf-700 border border-tekhaf-200 hover:bg-tekhaf-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Category</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-tekhaf-700 transition-colors">
                          {cat.name}
                        </h3>
                        {cat.isDefault && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.5 rounded">
                            Built-in
                          </span>
                        )}
                      </div>
                      <code className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        slug: {cat.slug}
                      </code>
                    </div>

                    {/* Scope Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 uppercase tracking-wider ${
                        cat.type === "PRODUCT"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : cat.type === "MEDIA"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {cat.type === "PRODUCT"
                        ? "Machinery"
                        : cat.type === "MEDIA"
                        ? "Media"
                        : "Dual Purpose"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description || "No description provided for this category."}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {/* Item Counts */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    {cat.type === "PRODUCT" || cat.type === "BOTH" ? (
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <Tractor className="w-3.5 h-3.5 text-amber-600" />
                        <span>{cat.productCount || 0} tractors</span>
                      </span>
                    ) : null}
                    {cat.type === "MEDIA" || cat.type === "BOTH" ? (
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                        <span>{cat.mediaCount || 0} assets</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-slate-500 hover:text-tekhaf-700 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openDeleteModal(cat)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCategories.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[8, 16, 24, 48]}
                itemName="categories"
              />
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT CATEGORY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-tekhaf-700" />
                <h3 className="font-black text-slate-900 text-base">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Harvesters, Disc Ploughs, Delivery Handover"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category Scope / Purpose *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white font-medium"
                  >
                    <option value="PRODUCT">Machinery & Products</option>
                    <option value="MEDIA">Media & Assets Gallery</option>
                    <option value="BOTH">Dual Purpose (Both)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    URL Identifier (Slug)
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="auto-generated-slug"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description / Machinery Context
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Provide guidance on what equipment, implements, or media assets belong in this category..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 leading-relaxed text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-900 text-base">
                Delete Category &quot;{categoryToDelete.name}&quot;?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will permanently remove this category from the portal. Associated products and media will not be deleted; their category tag will simply be unassigned.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Category Slug:</span>
                <span className="font-mono font-bold text-slate-800">{categoryToDelete.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Associated Items:</span>
                <span className="font-bold text-slate-800">
                  {categoryToDelete.totalItems || 0} items
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Category</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
