"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  RefreshCw,
  X,
  ExternalLink,
  Tractor,
  Phone,
  Building,
  Check,
  Eye,
  EyeOff,
  Upload,
  Sparkles,
} from "lucide-react";
import { LocationItem } from "@/lib/location-store";

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formRegion, setFormRegion] = useState("Oromia");
  const [customRegion, setCustomRegion] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formHeroImage, setFormHeroImage] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFarmingContext, setFormFarmingContext] = useState("");
  const [formHP, setFormHP] = useState("75 HP - 90 HP 4WD");
  const [formHubOffice, setFormHubOffice] = useState("");
  const [formPhone, setFormPhone] = useState("+251 91 123 4567");
  const [formActive, setFormActive] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/locations?all=true");
      const data = await res.json();
      if (data.success && data.locations) {
        setLocations(data.locations);
      }
    } catch (err) {
      console.error("Failed to fetch locations", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAddModal = () => {
    setEditingLocation(null);
    setFormName("");
    setFormRegion("Oromia");
    setCustomRegion("");
    setFormSlug("");
    setFormTitle("");
    setFormSubtitle("");
    setFormHeroImage("https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80");
    setFormDescription("");
    setFormFarmingContext("Commercial grain, teff, maize, and vegetable cultivation.");
    setFormHP("75 HP - 95 HP 4WD");
    setFormHubOffice("");
    setFormPhone("+251 91 123 4567");
    setFormActive(true);
    setModalOpen(true);
  };

  const openEditModal = (loc: LocationItem) => {
    setEditingLocation(loc);
    setFormName(loc.name);
    setFormRegion(loc.region);
    setCustomRegion("");
    setFormSlug(loc.slug);
    setFormTitle(loc.title);
    setFormSubtitle(loc.subtitle || "");
    setFormHeroImage(loc.heroImage);
    setFormDescription(loc.description);
    setFormFarmingContext(loc.farmingContext || "");
    setFormHP(loc.recommendedHorsepower || "75 HP - 90 HP");
    setFormHubOffice(loc.hubOffice || "");
    setFormPhone(loc.phone || "+251 91 123 4567");
    setFormActive(loc.active);
    setModalOpen(true);
  };

  // Helper to process uploaded image file
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setFormHeroImage(src);
    };
    reader.readAsDataURL(file);
  };

  // Auto-generate title and slug when city name changes
  const handleNameChange = (nameVal: string) => {
    setFormName(nameVal);
    if (!editingLocation) {
      const clean = nameVal.trim();
      const slugVal = `tractors-${clean.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")}`;
      setFormSlug(slugVal);
      setFormTitle(`Tractor Sales & Agricultural Implements in ${clean}`);
      setFormSubtitle(`Regional machinery supply and field technician support for ${clean}`);
      if (!formHubOffice) {
        setFormHubOffice(`${clean} Regional Office / Commercial Strip`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formDescription.trim()) {
      alert("Please fill in the city name, title, and description.");
      return;
    }

    const resolvedRegion =
      formRegion === "__CUSTOM__" ? customRegion.trim() || "Oromia" : formRegion;

    setSaving(true);
    try {
      if (editingLocation) {
        // PATCH
        const res = await fetch("/api/locations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingLocation.id,
            name: formName.trim(),
            region: resolvedRegion,
            slug: formSlug.trim() || editingLocation.slug,
            title: formTitle.trim(),
            subtitle: formSubtitle.trim(),
            heroImage: formHeroImage.trim(),
            description: formDescription.trim(),
            farmingContext: formFarmingContext.trim(),
            recommendedHorsepower: formHP.trim(),
            hubOffice: formHubOffice.trim(),
            phone: formPhone.trim(),
            active: formActive,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setLocations((prev) =>
            prev.map((l) => (l.id === editingLocation.id ? data.location : l))
          );
          setModalOpen(false);
          showToast(`Location "${formName}" updated successfully!`);
        } else {
          alert(data.error || "Failed to update location.");
        }
      } else {
        // POST
        const res = await fetch("/api/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName.trim(),
            region: resolvedRegion,
            slug: formSlug.trim(),
            title: formTitle.trim(),
            subtitle: formSubtitle.trim(),
            heroImage: formHeroImage.trim(),
            description: formDescription.trim(),
            farmingContext: formFarmingContext.trim(),
            recommendedHorsepower: formHP.trim(),
            hubOffice: formHubOffice.trim(),
            phone: formPhone.trim(),
            active: formActive,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setLocations((prev) => [data.location, ...prev]);
          setModalOpen(false);
          showToast(`New location "${formName}" added to regional network!`);
        } else {
          alert(data.error || "Failed to create location.");
        }
      }
    } catch {
      alert("Error saving location. Please check connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from regional service areas?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/locations?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLocations((prev) => prev.filter((l) => l.id !== id));
        showToast(`Location "${name}" deleted.`);
      } else {
        alert(data.error || "Failed to delete location.");
      }
    } catch {
      alert("Error deleting location.");
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle active / inactive status
  const toggleActive = async (loc: LocationItem) => {
    const newStatus = !loc.active;
    try {
      const res = await fetch("/api/locations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: loc.id,
          active: newStatus,
        }),
      });
      if (res.ok) {
        setLocations((prev) =>
          prev.map((l) => (l.id === loc.id ? { ...l, active: newStatus } : l))
        );
        showToast(`"${loc.name}" is now ${newStatus ? "Visible" : "Hidden"}.`);
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  // Unique list of regions
  const regions = useMemo(() => {
    const set = new Set<string>();
    locations.forEach((l) => {
      if (l.region) set.add(l.region);
    });
    ["Oromia", "Amhara", "Tigray", "Addis Ababa", "Sidama", "Somali Region", "All-Ethiopia"].forEach(
      (r) => set.add(r)
    );
    return Array.from(set);
  }, [locations]);

  // Filtered Locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        loc.name.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q) ||
        loc.title.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q) ||
        loc.hubOffice.toLowerCase().includes(q);

      const matchesRegion =
        selectedRegion === "ALL" || loc.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [locations, searchQuery, selectedRegion]);

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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Regional Service Locations & Hubs
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Backend Connected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage Ethiopian regional service areas (Adama, Bishoftu, Bahir Dar, Mekele, etc.) for direct field support and programmatic landing pages.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Location Hub</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Locations
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{locations.length}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Online
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {locations.filter((l) => l.active).length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Regions Covered
          </span>
          <p className="text-2xl font-black text-tekhaf-700 mt-1">
            {new Set(locations.map((l) => l.region)).size}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Public Route
          </span>
          <Link
            href="/en/service-areas"
            target="_blank"
            className="text-xs font-bold text-tekhaf-700 hover:underline flex items-center gap-1 mt-2"
          >
            <span>/service-areas</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Toolbar: Search & Region Filter Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Adama, Bishoftu, Bahir Dar, Mekele..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
            <button
              onClick={() => setSelectedRegion("ALL")}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedRegion === "ALL"
                  ? "bg-tekhaf-800 text-white shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              All Regions ({locations.length})
            </button>
            {regions.map((reg) => {
              const count = locations.filter((l) => l.region === reg).length;
              if (count === 0 && selectedRegion !== reg) return null;
              return (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedRegion === reg
                      ? "bg-tekhaf-800 text-white shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  <span>{reg}</span>
                  <span className="ml-1.5 text-[10px] opacity-70 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Locations Grid / Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-tekhaf-600" />
          <span>Loading regional locations...</span>
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No locations found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or click &ldquo;Add New Location Hub&rdquo; to add Adama, Bishoftu, Bahir Dar, or Mekele.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                loc.active ? "border-slate-200" : "border-slate-300 opacity-75 bg-slate-50/50"
              }`}
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={loc.heroImage}
                    alt={loc.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Region Badge */}
                  <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {loc.region}
                  </span>

                  {/* Active Indicator */}
                  <button
                    onClick={() => toggleActive(loc)}
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors ${
                      loc.active
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-700 text-slate-200"
                    }`}
                    title={loc.active ? "Click to hide location from web" : "Click to publish location"}
                  >
                    {loc.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{loc.active ? "Active" : "Hidden"}</span>
                  </button>

                  {/* City Name */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-lg font-black tracking-tight">{loc.name}</p>
                    <p className="text-[11px] text-slate-200 line-clamp-1">{loc.subtitle}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1" title={loc.title}>
                      {loc.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {loc.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-tekhaf-600 shrink-0" />
                      <span className="truncate">{loc.hubOffice}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Tractor className="w-3.5 h-3.5 text-tekhaf-600 shrink-0" />
                      <span>{loc.recommendedHorsepower}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-tekhaf-600 shrink-0" />
                      <span>{loc.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={
                    [
                      "tractors-addis-ababa",
                      "tractors-oromia",
                      "tractors-sidama",
                      "tractors-somali-region",
                      "agricultural-equipment-ethiopia",
                    ].includes(loc.slug)
                      ? `/en/${loc.slug}`
                      : `/en/locations/${loc.slug}`
                  }
                  target="_blank"
                  className="text-xs font-bold text-tekhaf-700 hover:text-tekhaf-800 flex items-center gap-1 hover:underline"
                >
                  <span>Preview Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(loc)}
                    className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-tekhaf-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                    title="Edit Location"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(loc.id, loc.name)}
                    disabled={deletingId === loc.id}
                    className="p-1.5 rounded-lg bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors disabled:opacity-50"
                    title="Delete Location"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------- ADD / EDIT MODAL ------------------- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-7 relative border border-slate-200 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-tekhaf-50 text-tekhaf-700 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {editingLocation ? `Edit Location: ${editingLocation.name}` : "Add Regional Location & Hub"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure city/hub, agricultural region, local farming context, and field contact.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City / Hub Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Location Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adama, Bishoftu, Bahir Dar, Mekele"
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 font-bold"
                  />
                </div>

                {/* Region */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Region *
                  </label>
                  <select
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white font-medium"
                  >
                    <option value="Oromia">Oromia</option>
                    <option value="Amhara">Amhara</option>
                    <option value="Tigray">Tigray</option>
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Sidama">Sidama</option>
                    <option value="Somali Region">Somali Region</option>
                    <option value="Southern Ethiopia">Southern Ethiopia</option>
                    <option value="Afar">Afar</option>
                    <option value="All-Ethiopia">All-Ethiopia</option>
                    <option value="__CUSTOM__">+ Other / Custom Region...</option>
                  </select>

                  {formRegion === "__CUSTOM__" && (
                    <input
                      type="text"
                      required
                      placeholder="Type custom region name..."
                      value={customRegion}
                      onChange={(e) => setCustomRegion(e.target.value)}
                      className="mt-2 w-full text-xs p-2.5 rounded-xl border border-tekhaf-400 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-tekhaf-50/20"
                    />
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Page Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tractor Sales & Agricultural Equipment in Adama"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 font-medium"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Central Oromia Grain Hub, Wonji Sugar Belt & Fast Implement Supply"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>

              {/* Hero Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Image URL or Device Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formHeroImage}
                    onChange={(e) => setFormHeroImage(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Overview Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your agricultural presence, tractor deliveries, and technician support in this area..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Local Farming Context */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Local Farming Context
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Teff, wheat, maize, onion, and irrigated horticulture"
                    value={formFarmingContext}
                    onChange={(e) => setFormFarmingContext(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>

                {/* Recommended Horsepower */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recommended Horsepower
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 75 HP to 95 HP 4WD"
                    value={formHP}
                    onChange={(e) => setFormHP(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hub Office Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hub Office / Depot Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Adama Expressway Corridor, Wonji Road"
                    value={formHubOffice}
                    onChange={(e) => setFormHubOffice(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+251 91 123 4567"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 font-mono"
                  />
                </div>
              </div>

              {/* Active Toggle & Slug */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="w-4 h-4 text-tekhaf-700 rounded focus:ring-tekhaf-600"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Publish immediately on web /service-areas
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-tekhaf-700 hover:bg-tekhaf-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 disabled:opacity-75"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{editingLocation ? "Save Changes" : "Create Location"}</span>
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
