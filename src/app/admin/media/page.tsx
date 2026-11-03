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
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeLogoUrl, setActiveLogoUrl] = useState<string | null>(null);
  const [settingLogoUrl, setSettingLogoUrl] = useState<string | null>(null);

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState<string>("Tractors");
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
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?type=MEDIA");
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

    setUploading(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadTitle.trim(),
          url: uploadUrl,
          category: uploadCategory,
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
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
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

    setSavingEdit(true);
    try {
      const res = await fetch("/api/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          title: editTitle.trim(),
          url: editUrl,
          category: editCategory,
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

  // Filtered Media Items
  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [mediaItems, searchQuery, selectedCategory]);

  const mediaCategories = useMemo(() => {
    const set = new Set<string>();
    categories.forEach((c) => set.add(c.name));
    mediaItems.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    if (set.size === 0) {
      ["Tractors", "Implements", "Showroom", "Branding", "Brochures"].forEach((c) => set.add(c));
    }
    return Array.from(set);
  }, [categories, mediaItems]);

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
            setUploadTitle("");
            setUploadUrl("");
            setUploadPreview(null);
            setUploadModalOpen(true);
          }}
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
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
        <div className="bg-gradient-to-r from-tekhaf-50/90 to-blue-50/70 p-4 rounded-2xl border border-tekhaf-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeLogoUrl}
                alt="Active Site Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Custom Brand Logo & Favicon Active
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live on Public Site
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                This image is dynamically active across the header navbar, footer, and browser tab favicon.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAsSiteLogo(activeLogoUrl)}
            disabled={settingLogoUrl !== null}
            className="text-xs font-bold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
            title="Reset site logo to official tractor emblem"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${settingLogoUrl === activeLogoUrl ? "animate-spin" : ""}`} />
            <span>Reset to Default Logo</span>
          </button>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
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

        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {["ALL", ...mediaCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-tekhaf-700 text-white"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Manage Categories Shortcut */}
          <Link
            href="/admin/categories"
            className="text-xs font-bold text-tekhaf-700 bg-tekhaf-50 hover:bg-tekhaf-100 border border-tekhaf-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
            title="Manage Media & Machinery Categories"
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Manage Categories</span>
          </Link>
        </div>
      </div>

      {/* Media Grid */}
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
            Try adjusting your search query or upload a new image to start building your media gallery.
          </p>
        </div>
      ) : (
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
                      onClick={() => openEditModal(item)}
                      className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3 h-3 text-slate-500" />
                      <span>Edit / Replace</span>
                    </button>

                    <button
                      onClick={() => setAsSiteLogo(item.url)}
                      disabled={settingLogoUrl === item.url}
                      className={`py-1.5 px-2.5 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
                        activeLogoUrl?.trim() === item.url.trim()
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm"
                          : "bg-tekhaf-50 hover:bg-tekhaf-100 text-tekhaf-700 border-tekhaf-200"
                      } disabled:opacity-60`}
                      title={
                        activeLogoUrl?.trim() === item.url.trim()
                          ? "Currently active site logo & favicon (click to reset to default emblem)"
                          : "Use this image as active site logo & favicon"
                      }
                    >
                      {settingLogoUrl === item.url ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : activeLogoUrl?.trim() === item.url.trim() ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span>Active Logo</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-tekhaf-600" />
                          <span>Set as Logo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredMedia.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[8, 12, 24, 48]}
                itemName="assets"
              />
            </div>
          )}
        </div>
      )}

      {/* ------------------- UPLOAD MODAL ------------------- */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-7 relative border border-slate-200">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload New Media Asset</h3>
                <p className="text-xs text-slate-500">Choose a local file or enter an image URL</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone / Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Image File
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-tekhaf-500 rounded-2xl p-5 text-center cursor-pointer bg-slate-50/50 hover:bg-tekhaf-50/20 transition-all"
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

              {/* Category */}
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
                    <span>New Category</span>
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
                </select>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-7 relative border border-slate-200">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center shrink-0">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit or Replace Media Image</h3>
                <p className="text-xs text-slate-500">Update image title, category, or upload another image</p>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Image Preview & Replace Trigger */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Image Preview
                </label>
                <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editPreview || editingItem.url}
                    alt={editTitle}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Another Image</span>
                    </button>
                  </div>
                </div>

                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileSelect}
                  className="hidden"
                />

                <div className="pt-2 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Want to replace the image file?</span>
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="text-tekhaf-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Choose File from Device</span>
                  </button>
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

              {/* Category */}
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
                    <span>New Category</span>
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
                </select>
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
