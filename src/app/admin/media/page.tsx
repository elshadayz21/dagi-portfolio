"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Cloud,
  Edit2,
  X,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FolderOpen,
  FolderTree,
  Plus,
  LayoutGrid,
  List,
  ArrowUpDown,
  CheckSquare,
  Square,
} from "lucide-react";
import { MediaAsset } from "@/lib/media-store";
import { Pagination } from "@/components/pagination";
import { CategoryItem } from "@/lib/category-store";

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaAsset[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "title-asc" | "title-desc" | "category-asc" | "size-desc"
  >("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeLogoUrl, setActiveLogoUrl] = useState<string | null>(null);
  const [settingLogoUrl, setSettingLogoUrl] = useState<string | null>(null);

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState<string>("Tractors");
  const [customUploadCategory, setCustomUploadCategory] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFormat, setUploadFormat] = useState("JPEG");
  const [uploadSize, setUploadSize] = useState("500 KB");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit / Replace Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaAsset | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<string>("Tractors");
  const [customEditCategory, setCustomEditCategory] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editFormat, setEditFormat] = useState("JPEG");
  const [editSize, setEditSize] = useState("500 KB");
  const [savingEdit, setSavingEdit] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
    fetchActiveLogo();
    fetchCategories();

    // Auto-refresh categories when window regains focus (e.g. after adding category in another tab)
    const handleFocus = () => {
      fetchCategories();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchCategories = async () => {
    try {
      // Fetch all categories without restriction so newly added ones appear immediately
      const res = await fetch("/api/categories?type=ALL");
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch media categories", err);
    }
  };

  const fetchActiveLogo = async () => {
    try {
      const res = await fetch("/api/cms");
      const data = await res.json();
      if (data.success && data.data) {
        setActiveLogoUrl(data.data.customLogoUrl || null);
      }
    } catch (err) {
      console.error("Failed to fetch active logo", err);
    }
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success && data.items) {
        setMediaItems(data.items);
      }
    } catch (err) {
      console.error("Failed to fetch media", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast("Media URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick set as Site Logo & Favicon
  const setAsSiteLogo = async (url: string) => {
    try {
      setSettingLogoUrl(url);
      const trimmedUrl = url.trim();
      const isCurrentlyActive = activeLogoUrl?.trim() === trimmedUrl;
      const targetUrl = isCurrentlyActive ? null : trimmedUrl;

      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customLogoUrl: targetUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const newLogo = data.data?.customLogoUrl || null;
        setActiveLogoUrl(newLogo);
        showToast(
          newLogo
            ? "Asset set as active site logo & favicon!"
            : "Site logo reset to official tractor emblem!"
        );
      } else {
        alert(data.error || "Failed to update logo");
      }
    } catch {
      alert("Failed to update logo. Please check connection.");
    } finally {
      setSettingLogoUrl(null);
    }
  };

  // Helper to downscale and optimize large device camera uploads
  const processImageFile = (
    file: File
  ): Promise<{ dataUrl: string; size: string; format: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve({
              dataUrl: src,
              size: `${Math.round(file.size / 1024)} KB`,
              format: file.type.split("/")[1]?.toUpperCase() || "JPEG",
            });
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
          const optimized = canvas.toDataURL(mime, 0.88);
          const approxKB = Math.round((optimized.length * 3) / 4 / 1024);
          resolve({
            dataUrl: optimized,
            size: `${approxKB} KB`,
            format: mime.split("/")[1]?.toUpperCase() || "JPEG",
          });
        };
        img.onerror = () => {
          resolve({
            dataUrl: src,
            size: `${Math.round(file.size / 1024)} KB`,
            format: "JPEG",
          });
        };
        img.src = src;
      };
      reader.onerror = () => {
        resolve({ dataUrl: "", size: "0 KB", format: "JPEG" });
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle local file selection for Upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!uploadTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setUploadTitle(cleanName);
    }

    const { dataUrl, size, format } = await processImageFile(file);
    setUploadPreview(dataUrl);
    setUploadUrl(dataUrl);
    setUploadFormat(format);
    setUploadSize(size);
  };

  // Submit New Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl || !uploadTitle) {
      alert("Please provide an image and a title.");
      return;
    }

    const resolvedCategory =
      uploadCategory === "__CUSTOM__"
        ? customUploadCategory.trim() || "General"
        : uploadCategory;

    setUploading(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadTitle.trim(),
          url: uploadUrl,
          category: resolvedCategory,
          format: uploadFormat || "JPEG",
          size: uploadSize || "650 KB",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMediaItems([data.asset, ...mediaItems]);
        setUploadModalOpen(false);
        setUploadTitle("");
        setUploadUrl("");
        setUploadPreview(null);
        setCustomUploadCategory("");
        showToast("New media asset successfully uploaded and saved!");
      } else {
        alert(data.error || "Failed to upload asset");
      }
    } catch {
      alert("Error uploading media asset. Please verify file format.");
    } finally {
      setUploading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (item: MediaAsset) => {
    fetchCategories();
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setCustomEditCategory("");
    setEditUrl(item.url);
    setEditPreview(item.url);
    setEditFormat(item.format);
    setEditSize(item.size);
    setEditModalOpen(true);
  };

  // Handle local file selection for Edit / Replace
  const handleEditFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { dataUrl, size, format } = await processImageFile(file);
    setEditPreview(dataUrl);
    setEditUrl(dataUrl);
    setEditFormat(format);
    setEditSize(size);
  };

  // Submit Edit / Replace
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const resolvedCategory =
      editCategory === "__CUSTOM__"
        ? customEditCategory.trim() || editingItem.category
        : editCategory;

    setSavingEdit(true);
    try {
      const res = await fetch("/api/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          title: editTitle.trim(),
          url: editUrl,
          category: resolvedCategory,
          format: editFormat || editingItem.format,
          size: editSize || editingItem.size,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMediaItems(
          mediaItems.map((m) => (m.id === editingItem.id ? data.asset : m))
        );
        setEditModalOpen(false);
        setEditingItem(null);
        showToast("Media asset updated and saved successfully!");
      } else {
        alert(data.error || "Failed to update asset");
      }
    } catch {
      alert("Error updating media asset. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Media
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this media asset?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMediaItems(mediaItems.filter((m) => m.id !== id));
        showToast("Media asset permanently deleted.");
      } else {
        alert("Failed to delete media asset");
      }
    } catch {
      alert("Error deleting media asset");
    } finally {
      setDeletingId(null);
    }
  };

  // Dynamic merged categories list (includes all added categories from DB & all used categories in media)
  const mediaCategories = useMemo(() => {
    const set = new Set<string>();
    // Add all categories defined in the categories manager
    categories.forEach((c) => {
      if (c.name?.trim()) set.add(c.name.trim());
    });
    // Add all categories present on existing media assets
    mediaItems.forEach((m) => {
      if (m.category?.trim()) set.add(m.category.trim());
    });
    if (set.size === 0) {
      ["Tractors", "Implements", "Showroom", "Branding", "Brochures"].forEach((c) => set.add(c));
    }
    return Array.from(set);
  }, [categories, mediaItems]);

  // Toggle multi-select category
  const toggleCategory = (cat: string) => {
    setCurrentPage(1);
    if (cat === "ALL") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) {
        return prev.filter((c) => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  // Filtered & Sorted Media Items
  const filteredMedia = useMemo(() => {
    const list = mediaItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.format.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(item.category);

      return matchesSearch && matchesCategory;
    });

    // Apply Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "category-asc":
          return a.category.localeCompare(b.category);
        case "size-desc": {
          const sizeA = parseInt(a.size.replace(/[^\d]/g, "")) || 0;
          const sizeB = parseInt(b.size.replace(/[^\d]/g, "")) || 0;
          return sizeB - sizeA;
        }
        default:
          return 0;
      }
    });

    return list;
  }, [mediaItems, searchQuery, selectedCategories, sortBy]);

  const totalPages = Math.ceil(filteredMedia.length / pageSize) || 1;

  const paginatedMedia = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMedia.slice(start, start + pageSize);
  }, [filteredMedia, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Media Manager & Assets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store, upload, edit, replace, and organize tractor gallery photos, brochures, and brand graphics.
          </p>
        </div>

        <button
          onClick={() => {
            fetchCategories();
            setUploadTitle("");
            setUploadUrl("");
            setUploadPreview(null);
            setCustomUploadCategory("");
            setUploadModalOpen(true);
          }}
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Media Asset</span>
        </button>
      </div>

      {/* Cloudinary & CDN Delivery Status */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              High-Speed Agricultural CDN & Storage Active
            </span>
            <span className="text-[11px] text-slate-400">
              Automatic optimization and compression for high-speed delivery to Ethiopian regional users
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {mediaItems.length} Total Assets
          </span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Online
          </span>
        </div>
      </div>

      {/* Active Brand Logo Indicator Banner */}
      {activeLogoUrl && (
        <div className="bg-gradient-to-r from-tekhaf-900 via-tekhaf-800 to-slate-900 p-4 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-white p-1 overflow-hidden shrink-0 border border-white/20 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeLogoUrl}
                alt="Active Site Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Active Brand Logo & Header Emblem
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Live on Website
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                Custom graphic displayed in navbar, footer, and browser favicon across all pages.
              </p>
            </div>
          </div>

          <button
            onClick={() => setAsSiteLogo(activeLogoUrl)}
            disabled={settingLogoUrl === activeLogoUrl}
            className="text-xs font-bold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
            title="Reset site logo to official tractor emblem"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${settingLogoUrl === activeLogoUrl ? "animate-spin" : ""}`} />
            <span>Reset to Default Logo</span>
          </button>
        </div>
      )}

      {/* Multi-Select Category Filters Panel (Checkbox Pills) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-tekhaf-700" />
            <span className="text-xs font-bold text-slate-800">
              Filter by Category (Multi-Select Checkboxes):
            </span>
            {selectedCategories.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tekhaf-100 text-tekhaf-800">
                {selectedCategories.length} selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategories([]);
                  setCurrentPage(1);
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline mr-1"
              >
                Clear Filters
              </button>
            )}
            <Link
              href="/admin/categories"
              className="text-[11px] font-bold text-tekhaf-700 bg-tekhaf-50 hover:bg-tekhaf-100 border border-tekhaf-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              title="Add or Manage Categories"
            >
              <FolderTree className="w-3 h-3" />
              <span>Manage Categories</span>
            </Link>
          </div>
        </div>

        {/* Checkbox Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All Categories Option */}
          <button
            type="button"
            onClick={() => toggleCategory("ALL")}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              selectedCategories.length === 0
                ? "bg-tekhaf-700 text-white shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {selectedCategories.length === 0 ? (
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>All Categories</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategories.length === 0
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {mediaItems.length}
            </span>
          </button>

          {/* Individual Categories from Categories Manager & Assets */}
          {mediaCategories.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            const count = mediaItems.filter((m) => m.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                  isChecked
                    ? "bg-tekhaf-800 text-white shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isChecked ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Sort and View Mode Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search media by title or keyword..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-slate-50/50"
          />
        </div>

        {/* Sort Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sorting */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-600 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="text-xs font-medium py-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            >
              <option value="date-desc">Date (Latest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="title-asc">Name (A to Z)</option>
              <option value="title-desc">Name (Z to A)</option>
              <option value="category-asc">Category / Type (A to Z)</option>
              <option value="size-desc">File Size (Largest First)</option>
            </select>
          </div>

          {/* View Mode Switcher (Grid vs Table / List) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === "grid"
                  ? "bg-white text-tekhaf-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === "table"
                  ? "bg-white text-tekhaf-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table / List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table / List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Media Display: Loading, Empty, Table or Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-tekhaf-600" />
          <span>Loading media library...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No media assets found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, clearing category filters, or upload a new image to start building your media gallery.
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Asset Title & Direct URL</th>
                  <th className="py-3 px-4">Category / Type</th>
                  <th className="py-3 px-4">Format / Size</th>
                  <th className="py-3 px-4">Date Added</th>
                  <th className="py-3 px-4">Usage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedMedia.map((item) => {
                  const isSiteLogo = activeLogoUrl === item.url;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80";
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs sm:max-w-md">
                          <p className="font-bold text-slate-800 line-clamp-1" title={item.title}>
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => copyUrl(item.url, item.id)}
                              className="text-[11px] text-tekhaf-700 hover:text-tekhaf-900 flex items-center gap-1 font-mono hover:underline truncate max-w-[200px]"
                              title="Click to copy full image URL"
                            >
                              {copiedId === item.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700 font-sans font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-400" />
                                  <span className="truncate">{item.url.slice(0, 30)}...</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                        <span className="font-semibold text-slate-700">{item.format}</span>
                        <span className="text-[11px] text-slate-400 block">{item.size}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isSiteLogo ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>Active Site Logo</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            General Asset
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setAsSiteLogo(item.url)}
                            disabled={settingLogoUrl === item.url}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              isSiteLogo
                                ? "bg-amber-50 text-amber-700 border-amber-300"
                                : "bg-white text-slate-600 hover:text-tekhaf-700 border-slate-200 hover:bg-slate-50"
                            }`}
                            title={isSiteLogo ? "Reset / Remove as Site Logo" : "Set as Official Site Logo & Favicon"}
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${settingLogoUrl === item.url ? "animate-spin" : ""}`} />
                          </button>

                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-tekhaf-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                            title="Edit or Replace Image"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-1.5 rounded-lg bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors disabled:opacity-50"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginatedMedia.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80";
                    }}
                  />

                  {/* Category Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>

                  {/* Quick Action Overlay */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyUrl(item.url, item.id)}
                      className="p-1.5 rounded-lg bg-white/95 text-slate-700 hover:text-tekhaf-700 shadow-md transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-white/95 text-slate-700 hover:text-tekhaf-700 shadow-md transition-colors"
                      title="Edit or Replace Image"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-1.5 rounded-lg bg-white/95 text-rose-600 hover:bg-rose-50 shadow-md transition-colors disabled:opacity-50"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Meta & Actions */}
                <div className="p-3.5 space-y-2.5">
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 line-clamp-1" title={item.title}>
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{item.format} • {item.size}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyUrl(item.url, item.id)}
                      className="text-xs font-semibold text-tekhaf-700 hover:text-tekhaf-800 flex items-center gap-1"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setAsSiteLogo(item.url)}
                      disabled={settingLogoUrl === item.url}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 border ${
                        activeLogoUrl === item.url
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-slate-50 hover:bg-tekhaf-50 text-slate-600 hover:text-tekhaf-700 border-slate-200"
                      }`}
                      title="Set as website header logo and favicon"
                    >
                      <Sparkles
                        className={`w-3 h-3 ${
                          settingLogoUrl === item.url
                            ? "animate-spin text-tekhaf-600"
                            : activeLogoUrl === item.url
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      />
                      <span>{activeLogoUrl === item.url ? "Active Logo" : "Set as Logo"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredMedia.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setCurrentPage(1);
          }}
          pageSizeOptions={[8, 12, 24, 48]}
          itemName="assets"
        />
      )}

      {/* ------------------- UPLOAD MODAL ------------------- */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-7 relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-tekhaf-50 text-tekhaf-700 rounded-xl">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Upload New Media Asset
                </h3>
                <p className="text-xs text-slate-500">
                  Select an image from your device or paste a CDN URL.
                </p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Drop / Select Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Image from Device
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-tekhaf-500 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-tekhaf-50/30"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {uploadPreview ? (
                    <div className="space-y-2">
                      <div className="relative h-32 w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-200 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-[11px] text-tekhaf-700 font-semibold">
                        Click to choose a different file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">
                        Click to browse file from device
                      </p>
                      <p className="text-[10px] text-slate-400">
                        PNG, JPG, WebP supported (Auto-compressed)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Or Direct URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Paste Image URL (Cloudinary / Web)
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                  value={uploadUrl}
                  onChange={(e) => {
                    setUploadUrl(e.target.value);
                    setUploadPreview(e.target.value);
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
                />
              </div>

              {/* Asset Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asset Title / Caption *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Massey Ferguson 385 4WD Heavy Engine Bay"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 font-medium"
                />
              </div>

              {/* Category Dropdown (With All Registered & User Categories) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Category
                  </label>
                  <Link
                    href="/admin/categories"
                    target="_blank"
                    className="text-[10px] text-tekhaf-600 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>Manage Categories</span>
                  </Link>
                </div>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white font-medium"
                >
                  {mediaCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__CUSTOM__">+ Type Custom Category...</option>
                </select>

                {uploadCategory === "__CUSTOM__" && (
                  <input
                    type="text"
                    required
                    placeholder="Type custom category name..."
                    value={customUploadCategory}
                    onChange={(e) => setCustomUploadCategory(e.target.value)}
                    className="mt-2 w-full text-xs p-2.5 rounded-xl border border-tekhaf-400 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-tekhaf-50/20"
                  />
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 rounded-xl bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 disabled:opacity-75"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload to Library</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------- EDIT / REPLACE MODAL ------------------- */}
      {editModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-7 relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-tekhaf-50 text-tekhaf-700 rounded-xl">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Edit or Replace Asset
                </h3>
                <p className="text-xs text-slate-500">
                  Update title, change category, or upload a replacement file.
                </p>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Image Preview & Replace */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Image & Replacement
                </label>
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editPreview || editingItem.url}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {editingItem.title}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {editFormat || editingItem.format} • {editSize || editingItem.size}
                    </p>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="text-xs font-semibold text-tekhaf-700 hover:text-tekhaf-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Choose File from Device</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Or New Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Replace with Image URL
                </label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => {
                    setEditUrl(e.target.value);
                    setEditPreview(e.target.value);
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 font-medium"
                />
              </div>

              {/* Category Dropdown (With All Registered & User Categories) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Category
                  </label>
                  <Link
                    href="/admin/categories"
                    target="_blank"
                    className="text-[10px] text-tekhaf-600 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>Manage Categories</span>
                  </Link>
                </div>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white font-medium"
                >
                  {mediaCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__CUSTOM__">+ Type Custom Category...</option>
                </select>

                {editCategory === "__CUSTOM__" && (
                  <input
                    type="text"
                    required
                    placeholder="Type custom category name..."
                    value={customEditCategory}
                    onChange={(e) => setCustomEditCategory(e.target.value)}
                    className="mt-2 w-full text-xs p-2.5 rounded-xl border border-tekhaf-400 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-tekhaf-50/20"
                  />
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    handleDelete(editingItem.id);
                  }}
                  className="text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Asset</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-5 py-2.5 rounded-xl bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 disabled:opacity-75"
                  >
                    {savingEdit ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
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
