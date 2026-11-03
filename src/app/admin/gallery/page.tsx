"use client";

import { useState, useEffect, useMemo } from "react";
import { GalleryItem, GalleryCategory, GalleryMediaType } from "@/lib/gallery-store";
import {
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Tractor,
  User,
  CheckCircle2,
  Loader2,
  X,
  Play,
  UploadCloud,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Video,
} from "lucide-react";

const CATEGORY_LABELS: Record<GalleryCategory, { label: string; bg: string; text: string }> = {
  FIELD_WORK: { label: "Field Work & Tillage", bg: "bg-emerald-50", text: "text-emerald-800" },
  DELIVERY: { label: "Delivery & Handover", bg: "bg-blue-50", text: "text-blue-800" },
  TRAINING: { label: "Farmer Training", bg: "bg-purple-50", text: "text-purple-800" },
  HARVEST: { label: "Harvesting & Threshing", bg: "bg-amber-50", text: "text-amber-800" },
  MAINTENANCE: { label: "Maintenance & Workshop", bg: "bg-slate-100", text: "text-slate-800" },
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "IMAGE" as GalleryMediaType,
    mediaUrl: "",
    thumbnailUrl: "",
    location: "Arsi - Asella, Oromia",
    farmerName: "",
    tractorModel: "Massey Ferguson MF 385 (85 HP)",
    category: "FIELD_WORK" as GalleryCategory,
    featured: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success && data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error("Failed to fetch gallery items", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      type: "IMAGE",
      mediaUrl: "",
      thumbnailUrl: "",
      location: "Arsi - Asella, Oromia",
      farmerName: "",
      tractorModel: "Deutz-Fahr Agrofarm 115G / 120HP",
      category: "FIELD_WORK",
      featured: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl || "",
      location: item.location,
      farmerName: item.farmerName || "",
      tractorModel: item.tractorModel || "",
      category: item.category,
      featured: Boolean(item.featured),
    });
    setModalOpen(true);
  };

  // Handle Local File Upload (Base64 encoding)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        mediaUrl: result,
        type: isVideo ? "VIDEO" : "IMAGE",
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      }));
      showToast(`Selected file "${file.name}" (${(file.size / 1024).toFixed(0)} KB)`);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.mediaUrl.trim()) {
      alert("Please provide both a Title and Media File/URL.");
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        // PATCH
        const res = await fetch("/api/gallery", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingItem.id,
            ...formData,
          }),
        });
        const data = await res.json();
        if (data.success && data.item) {
          setItems((prev) =>
            prev.map((it) => (it.id === editingItem.id ? data.item : it))
          );
          showToast(`Gallery item "${formData.title}" updated.`);
          setModalOpen(false);
        } else {
          alert(data.error || "Failed to update item.");
        }
      } else {
        // POST
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.item) {
          setItems((prev) => [data.item, ...prev]);
          showToast(`New ${formData.type.toLowerCase()} added to field gallery!`);
          setModalOpen(false);
        } else {
          alert(data.error || "Failed to add item.");
        }
      }
    } catch (err) {
      console.error("Save error", err);
      alert("Error saving gallery item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(
      `Delete "${title}" from the field gallery? This will remove it from the public site immediately.`
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        showToast(`Gallery item removed.`);
      } else {
        alert(data.error || "Failed to delete item.");
      }
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        it.title.toLowerCase().includes(q) ||
        it.location.toLowerCase().includes(q) ||
        (it.farmerName && it.farmerName.toLowerCase().includes(q)) ||
        (it.tractorModel && it.tractorModel.toLowerCase().includes(q));

      const matchesFilter =
        activeFilter === "ALL" ||
        (activeFilter === "IMAGE" && it.type === "IMAGE") ||
        (activeFilter === "VIDEO" && it.type === "VIDEO") ||
        it.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [items, activeFilter, searchQuery]);

  const metrics = useMemo(() => {
    return {
      total: items.length,
      images: items.filter((i) => i.type === "IMAGE").length,
      videos: items.filter((i) => i.type === "VIDEO").length,
      featured: items.filter((i) => i.featured).length,
    };
  }, [items]);

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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              On-Site Tractor & Field Work Gallery
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              CMS Dynamic
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Attach pictures and videos of tractors operating in Ethiopian farmland, cooperative union deliveries, and farmer training demonstrations.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Attach Picture or Video</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Gallery Assets
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {metrics.total}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Field Photos
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {metrics.images}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Action Videos
          </span>
          <span className="text-2xl font-black text-sky-600 mt-1 block">
            {metrics.videos}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Featured in Hero
          </span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {metrics.featured}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: "ALL", label: `All Media (${metrics.total})` },
            { id: "IMAGE", label: `Photos (${metrics.images})` },
            { id: "VIDEO", label: `Videos (${metrics.videos})` },
            { id: "FIELD_WORK", label: "Field Work & Tillage" },
            { id: "DELIVERY", label: "Tractor Deliveries" },
            { id: "TRAINING", label: "Farmer Training" },
            { id: "HARVEST", label: "Harvesting" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? "bg-tekhaf-800 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location (e.g. Arsi, Bale, Gojjam), tractor model, or farmer name..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 text-xs flex items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-5 h-5 animate-spin text-tekhaf-700" />
          <span>Loading dynamic gallery assets...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200 space-y-3">
          <Film className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No gallery items match your current filter.</p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 text-tekhaf-700 font-bold hover:underline"
          >
            <Plus className="w-4 h-4" />
            <span>Attach the first picture or video</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const cat = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.FIELD_WORK;
            const isVideo = item.type === "VIDEO";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Media Thumbnail with Badges */}
                  <div
                    onClick={() => setPreviewItem(item)}
                    className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden"
                  >
                    {isVideo ? (
                      item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Media Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs ${
                          isVideo
                            ? "bg-sky-500 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {isVideo ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                        <span>{isVideo ? "VIDEO" : "PHOTO"}</span>
                      </span>

                      {item.featured && (
                        <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    {/* Play Button for Video */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-tekhaf-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Location Badge on Bottom-Left */}
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cat.bg} ${cat.text}`}
                      >
                        {cat.label}
                      </span>
                      {item.tractorModel && (
                        <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[170px] flex items-center gap-1">
                          <Tractor className="w-3 h-3 text-tekhaf-600 shrink-0" />
                          <span className="truncate">{item.tractorModel}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description || "Field demonstration and tractor performance inspection."}
                    </p>

                    {item.farmerName && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 border-t border-slate-100">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-slate-700 truncate">
                          {item.farmerName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="text-tekhaf-700 hover:text-tekhaf-900 font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-tekhaf-50 hover:text-tekhaf-700 border border-slate-200 transition-colors"
                      title="Edit Item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      disabled={deletingId === item.id}
                      className="p-1.5 rounded-lg bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                      title="Delete Item"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* ATTACH / EDIT GALLERY MEDIA MODAL                       */}
      {/* ======================================================== */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingItem ? "Edit Field Gallery Asset" : "Attach Photo or Video to Field Gallery"}
                </h3>
                <span className="text-xs text-slate-400">
                  Manage tractors and farmers media on the public site
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              {/* Media Type Selector */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Media Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "IMAGE" })}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      formData.type === "IMAGE"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Field Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "VIDEO" })}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      formData.type === "VIDEO"
                        ? "bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-500/20"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Film className="w-4 h-4 text-sky-600" />
                    <span>Action Video</span>
                  </button>
                </div>
              </div>

              {/* File Upload OR Media URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                  Media Source (Upload File or Enter URL):
                </label>

                {/* File input button */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer border-2 border-dashed border-slate-300 hover:border-tekhaf-500 rounded-xl p-3 text-center bg-slate-50/70 hover:bg-tekhaf-50/40 transition-colors">
                    <UploadCloud className="w-5 h-5 text-tekhaf-600 mx-auto mb-1" />
                    <span className="font-bold text-slate-700 block text-[11px]">
                      Click to upload local {formData.type === "VIDEO" ? "video (.mp4, .webm)" : "photo (.jpg, .png, .webp)"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Converts automatically to high-resolution asset
                    </span>
                    <input
                      type="file"
                      accept={formData.type === "VIDEO" ? "video/*" : "image/*"}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                    placeholder="Or paste image URL, MP4 video link, or YouTube embed URL..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Title:
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Deutz-Fahr 120HP Commercial Plowing in Arsi"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>

              {/* Description / Caption */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Description / Story:
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain the farming activity, union context, implement used, or tractor performance..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>

              {/* Location & Tractor Model Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Location in Ethiopia:
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Arsi - Asella, Oromia"
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Tractor / Machinery Model:
                  </label>
                  <input
                    type="text"
                    value={formData.tractorModel}
                    onChange={(e) => setFormData({ ...formData, tractorModel: e.target.value })}
                    placeholder="e.g. Massey Ferguson 385 4WD"
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>
              </div>

              {/* Farmer & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Farmer or Cooperative Name:
                  </label>
                  <input
                    type="text"
                    value={formData.farmerName}
                    onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                    placeholder="e.g. Ato Tadesse & Union Members"
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Activity Category:
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as GalleryCategory })
                    }
                    className="w-full text-xs font-semibold p-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  >
                    <option value="FIELD_WORK">Field Work & Tillage</option>
                    <option value="DELIVERY">Tractor Delivery & Handover</option>
                    <option value="TRAINING">Farmer Training</option>
                    <option value="HARVEST">Harvesting & Threshing</option>
                    <option value="MAINTENANCE">Maintenance & Service</option>
                  </select>
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-tekhaf-600 rounded border-slate-300"
                />
                <label htmlFor="featured-check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Feature prominently on Homepage Gallery highlight
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.title.trim() || !formData.mediaUrl.trim()}
                  className="px-5 py-2 rounded-xl bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? "Save Changes" : "Attach to Gallery"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MEDIA PREVIEW MODAL (LIGHTBOX / VIDEO PLAYER)            */}
      {/* ======================================================== */}
      {previewItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95"
          >
            {/* Media Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {previewItem.type === "VIDEO" ? (
                previewItem.mediaUrl.includes("youtube.com") || previewItem.mediaUrl.includes("youtu.be") ? (
                  <iframe
                    src={previewItem.mediaUrl.replace("watch?v=", "embed/")}
                    title={previewItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={previewItem.mediaUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <img
                  src={previewItem.mediaUrl}
                  alt={previewItem.title}
                  className="w-full h-full object-contain"
                />
              )}

              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {CATEGORY_LABELS[previewItem.category]?.label}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">{previewItem.location}</span>
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900">
                {previewItem.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {previewItem.description}
              </p>

              {(previewItem.tractorModel || previewItem.farmerName) && (
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                  {previewItem.tractorModel && (
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Machinery Model</span>
                      <span className="font-bold text-tekhaf-800">{previewItem.tractorModel}</span>
                    </div>
                  )}
                  {previewItem.farmerName && (
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Farmer / Cooperative</span>
                      <span className="font-bold text-slate-800">{previewItem.farmerName}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
