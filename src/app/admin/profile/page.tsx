"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle,
  RefreshCw,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Phone,
  MapPin,
  Mail,
  Building2,
  Share2,
  Clock,
  ExternalLink,
  Globe,
  Upload,
  Camera,
  User,
  Image as ImageIcon,
} from "lucide-react";
import {
  ContactPhone,
  OfficeLocation,
  ContactEmail,
  SocialLinks,
  SiteCMSData,
} from "@/lib/cms-store";
import { Logo } from "@/components/logo";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<{
    representativeName: string;
    jobTitle: string;
    companyName: string;
    companySlogan: string;
    workingHours: string;
    biography: string;
    profilePhoto: string;
    customLogoUrl: string;
    phones: ContactPhone[];
    locations: OfficeLocation[];
    emails: ContactEmail[];
    socials: SocialLinks;
    enabledLocales: string[];
    defaultLocale: string;
  }>({
    representativeName: "Dagim Melese",
    jobTitle: "Agricultural Machinery Specialist",
    companyName: "Tekhaf Trading",
    companySlogan: "Authorized Agricultural Machinery & Heavy Tractor Solutions",
    workingHours: "Monday – Saturday: 8:30 AM – 6:00 PM (EAT)",
    biography: "",
    profilePhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    customLogoUrl: "",
    phones: [],
    locations: [],
    emails: [],
    socials: {
      whatsapp: "",
      telegram: "",
      linkedin: "",
      facebook: "",
      youtube: "",
      tiktok: "",
    },
    enabledLocales: ["en", "am", "or", "so", "sid"],
    defaultLocale: "en",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Helper to downscale and optimize large device camera uploads
  const processImageFile = (
    file: File,
    maxDim: number = 1400
  ): Promise<{ dataUrl: string; size: string; format: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
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
      reader.readAsDataURL(file);
    });
  };

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const processed = await processImageFile(file, 1200);

      // Save to media library so it's persisted in media-state.json
      try {
        await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${profile.representativeName} - Profile Portrait`,
            url: processed.dataUrl,
            category: "Showroom",
            format: processed.format,
            size: processed.size,
          }),
        });
      } catch (err) {
        console.warn("Failed to sync photo to media library", err);
      }

      setProfile((prev) => ({ ...prev, profilePhoto: processed.dataUrl }));
      setNoticeMessage("Profile photo uploaded from device! Click 'Save All CMS Settings' to apply.");
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 4500);
    } catch {
      alert("Failed to process photo upload.");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const isSvg = file.type.includes("svg") || file.name.endsWith(".svg");
      let dataUrl = "";
      let format = "PNG";
      let sizeStr = `${Math.round(file.size / 1024)} KB`;

      if (isSvg) {
        const text = await file.text();
        dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
        format = "SVG";
      } else {
        const processed = await processImageFile(file, 800);
        dataUrl = processed.dataUrl;
        format = processed.format;
        sizeStr = processed.size;
      }

      // Automatically sync to media library
      try {
        await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${profile.companyName} - Custom Brand Logo & Favicon`,
            url: dataUrl,
            category: "Branding",
            format,
            size: sizeStr,
          }),
        });
      } catch (err) {
        console.warn("Failed to sync logo to media library", err);
      }

      setProfile((prev) => ({ ...prev, customLogoUrl: dataUrl }));
      setNoticeMessage("Brand logo uploaded from device! Click 'Save All CMS Settings' to sync logo & favicon.");
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 4500);
    } catch {
      alert("Failed to process logo upload.");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  // Fetch current live CMS configuration on mount
  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const d: SiteCMSData = res.data;
          setProfile({
            representativeName: d.representativeName || "Dagim Melese",
            jobTitle: d.jobTitle || "Agricultural Machinery Specialist",
            companyName: d.companyName || "Tekhaf Trading",
            companySlogan: d.companySlogan || "Authorized Agricultural Machinery & Heavy Tractor Solutions",
            workingHours: d.workingHours || "Monday – Saturday: 8:30 AM – 6:00 PM",
            biography: d.biography || "",
            profilePhoto: d.profilePhoto || "",
            customLogoUrl: d.customLogoUrl || "",
            phones: d.phones || [],
            locations: d.locations || [],
            emails: d.emails || [],
            socials: {
              whatsapp: d.socials?.whatsapp || "",
              telegram: d.socials?.telegram || "",
              linkedin: d.socials?.linkedin || "",
              facebook: d.socials?.facebook || "",
              youtube: d.socials?.youtube || "",
              tiktok: d.socials?.tiktok || "",
            },
            enabledLocales: d.enabledLocales && d.enabledLocales.length > 0
              ? d.enabledLocales
              : ["en", "am", "or", "so", "sid"],
            defaultLocale: d.defaultLocale || "en",
          });
        }
      })
      .catch((err) => console.error("CMS load error:", err))
      .finally(() => setFetching(false));
  }, []);

  // Phone helper functions
  const addPhone = () => {
    const newP: ContactPhone = {
      id: `phone-${Date.now()}`,
      label: "Support Line",
      phone: "+251911000000",
      display: "+251 91 100 0000",
      isPrimary: profile.phones.length === 0,
    };
    setProfile({ ...profile, phones: [...profile.phones, newP] });
  };

  const removePhone = (id: string) => {
    setProfile({
      ...profile,
      phones: profile.phones.filter((p) => p.id !== id),
    });
  };

  const setPrimaryPhone = (id: string) => {
    setProfile({
      ...profile,
      phones: profile.phones.map((p) => ({
        ...p,
        isPrimary: p.id === id,
      })),
    });
  };

  // Location helper functions
  const addLocation = () => {
    const newL: OfficeLocation = {
      id: `loc-${Date.now()}`,
      title: "Regional Depot / Service Center",
      address: "Industrial Zone",
      city: "Addis Ababa",
      country: "Ethiopia",
      operatingHours: "Mon - Sat: 8:30 AM - 5:30 PM",
      mapUrl: "",
      isHeadquarters: profile.locations.length === 0,
    };
    setProfile({ ...profile, locations: [...profile.locations, newL] });
  };

  const removeLocation = (id: string) => {
    setProfile({
      ...profile,
      locations: profile.locations.filter((l) => l.id !== id),
    });
  };

  const setHeadquarters = (id: string) => {
    setProfile({
      ...profile,
      locations: profile.locations.map((l) => ({
        ...l,
        isHeadquarters: l.id === id,
      })),
    });
  };

  // Email helper functions
  const addEmail = () => {
    const newE: ContactEmail = {
      id: `email-${Date.now()}`,
      label: "Customer Service",
      email: "info@tekhaf.com",
      isPrimary: profile.emails.length === 0,
    };
    setProfile({ ...profile, emails: [...profile.emails, newE] });
  };

  const removeEmail = (id: string) => {
    setProfile({
      ...profile,
      emails: profile.emails.filter((e) => e.id !== id),
    });
  };

  const toggleLocale = (code: string) => {
    if (profile.enabledLocales.includes(code)) {
      if (profile.enabledLocales.length === 1) {
        alert("At least one language must remain active on the platform.");
        return;
      }
      setProfile({
        ...profile,
        enabledLocales: profile.enabledLocales.filter((c) => c !== code),
      });
    } else {
      setProfile({
        ...profile,
        enabledLocales: [...profile.enabledLocales, code],
      });
    }
  };

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const primaryPhone = profile.phones.find((p) => p.isPrimary) || profile.phones[0];
      const primaryLoc = profile.locations.find((l) => l.isHeadquarters) || profile.locations[0];
      const primaryEmail = profile.emails.find((e) => e.isPrimary) || profile.emails[0];

      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          representativeName: profile.representativeName,
          jobTitle: profile.jobTitle,
          companyName: profile.companyName,
          companySlogan: profile.companySlogan,
          workingHours: profile.workingHours,
          biography: profile.biography,
          profilePhoto: profile.profilePhoto,
          customLogoUrl: profile.customLogoUrl.trim() || null,
          phones: profile.phones,
          locations: profile.locations,
          emails: profile.emails,
          enabledLocales: profile.enabledLocales,
          defaultLocale: profile.defaultLocale,
          socials: {
            ...profile.socials,
            phone: primaryPhone ? `tel:${primaryPhone.phone}` : undefined,
            email: primaryEmail ? `mailto:${primaryEmail.email}` : undefined,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNoticeMessage("Dynamic CMS contact, locations, socials, and brand data updated across all pages!");
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 4500);
      } else {
        alert(data.error || "Failed to update CMS settings");
      }
    } catch {
      alert("Error saving CMS settings. Please verify connectivity.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-tekhaf-600" />
        <span>Loading dynamic CMS configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Dynamic CMS, Contact & Brand Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Full control over multiple phone numbers, facility addresses, social media channels, working hours, and site branding.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold">{noticeMessage}</p>
            <p className="text-emerald-700 text-[11px] mt-0.5">
              The public contact page, footer, header, floating social dock, and favicon are live.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: Brand & Representative Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-tekhaf-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Brand & Consultant Identity
            </h2>
          </div>

          {/* Consultant Profile Photo & Avatar Management */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-tekhaf-600 shadow-md shrink-0 bg-slate-200">
              {profile.profilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profilePhoto}
                  alt={profile.representativeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-8 h-8" />
                </div>
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Consultant Portrait Photo
                </span>
                <span className="text-[11px] text-slate-500">
                  Displayed on the homepage hero, consultant bio card, contact hub, and social share previews.
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingPhoto ? "Processing..." : "Upload Photo from Device"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      profilePhoto:
                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
                    })
                  }
                  className="px-2.5 py-1.5 border border-slate-200 hover:bg-white text-slate-600 font-semibold text-xs rounded-xl transition-colors"
                >
                  Reset Default Photo
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Representative Name (Primary Headline) *
              </label>
              <input
                type="text"
                required
                value={profile.representativeName}
                onChange={(e) => setProfile({ ...profile, representativeName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Role / Job Title *
              </label>
              <input
                type="text"
                required
                value={profile.jobTitle}
                onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Company / Organization Name (Subline) *
              </label>
              <input
                type="text"
                required
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 font-semibold text-tekhaf-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Company Slogan / Mission
              </label>
              <input
                type="text"
                value={profile.companySlogan}
                onChange={(e) => setProfile({ ...profile, companySlogan: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Official Working Hours (Contact Page & Footer)
              </label>
              <input
                type="text"
                value={profile.workingHours}
                onChange={(e) => setProfile({ ...profile, workingHours: e.target.value })}
                placeholder="e.g. Monday – Saturday: 8:30 AM – 6:00 PM (EAT)"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Consultant Biography & Expertise Summary
              </label>
              <textarea
                rows={3}
                value={profile.biography}
                onChange={(e) => setProfile({ ...profile, biography: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 leading-relaxed text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Dynamic Multi-Phone Numbers */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-tekhaf-700" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Dynamic Contact Phone Numbers ({profile.phones.length})
                </h2>
                <p className="text-[11px] text-slate-400">
                  Add multiple direct lines (e.g. Sales Consultant, Showroom Desk, Spare Parts Line).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addPhone}
              className="bg-tekhaf-50 hover:bg-tekhaf-100 text-tekhaf-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto border border-tekhaf-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phone Number</span>
            </button>
          </div>

          <div className="space-y-3">
            {profile.phones.map((p, idx) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Phone #{idx + 1} {p.isPrimary && "• (Primary Direct Line)"}
                  </span>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="radio"
                        name="primaryPhone"
                        checked={p.isPrimary}
                        onChange={() => setPrimaryPhone(p.id)}
                        className="text-tekhaf-700 focus:ring-tekhaf-600"
                      />
                      <span>Set as Primary</span>
                    </label>

                    {profile.phones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhone(p.id)}
                        className="text-rose-600 hover:text-rose-700 p-1"
                        title="Delete this phone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">Label / Purpose</label>
                    <input
                      type="text"
                      value={p.label}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          phones: profile.phones.map((item) =>
                            item.id === p.id ? { ...item, label: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="e.g. Direct Sales, Showroom Desk"
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">Dial Number (No Spaces)</label>
                    <input
                      type="text"
                      value={p.phone}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          phones: profile.phones.map((item) =>
                            item.id === p.id ? { ...item, phone: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="+251911234567"
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">Display Format</label>
                    <input
                      type="text"
                      value={p.display}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          phones: profile.phones.map((item) =>
                            item.id === p.id ? { ...item, display: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="+251 91 123 4567"
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Dynamic Multi-Locations & Showroom Facilities */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-tekhaf-700" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Dynamic Facilities & Depot Locations ({profile.locations.length})
                </h2>
                <p className="text-[11px] text-slate-400">
                  Configure multiple physical locations (Headquarters, Regional Depots, PDI Yards).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addLocation}
              className="bg-tekhaf-50 hover:bg-tekhaf-100 text-tekhaf-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto border border-tekhaf-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Facility Location</span>
            </button>
          </div>

          <div className="space-y-4">
            {profile.locations.map((loc, idx) => (
              <div
                key={loc.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Facility #{idx + 1} {loc.isHeadquarters && "• (Primary Headquarters)"}
                  </span>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="radio"
                        name="primaryHeadquarters"
                        checked={loc.isHeadquarters}
                        onChange={() => setHeadquarters(loc.id)}
                        className="text-tekhaf-700 focus:ring-tekhaf-600"
                      />
                      <span>Set as Headquarters</span>
                    </label>

                    {profile.locations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLocation(loc.id)}
                        className="text-rose-600 hover:text-rose-700 p-1"
                        title="Delete location"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-slate-500 mb-1 font-medium">Facility Name</label>
                    <input
                      type="text"
                      value={loc.title}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          locations: profile.locations.map((item) =>
                            item.id === loc.id ? { ...item, title: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="e.g. Headquarters Showroom, Kaliti Depot"
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 mb-1 font-medium">Street / Building Address</label>
                    <input
                      type="text"
                      value={loc.address}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          locations: profile.locations.map((item) =>
                            item.id === loc.id ? { ...item, address: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="e.g. Tekhaf Tower, 4th Floor, Bole Medhanialem"
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">City / Region</label>
                    <input
                      type="text"
                      value={loc.city}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          locations: profile.locations.map((item) =>
                            item.id === loc.id ? { ...item, city: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="Addis Ababa"
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">Operating Hours</label>
                    <input
                      type="text"
                      value={loc.operatingHours || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          locations: profile.locations.map((item) =>
                            item.id === loc.id ? { ...item, operatingHours: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="Monday – Saturday: 8:30 AM – 6:00 PM"
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">Google Maps URL</label>
                    <input
                      type="text"
                      value={loc.mapUrl || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          locations: profile.locations.map((item) =>
                            item.id === loc.id ? { ...item, mapUrl: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: Dynamic Multi-Emails */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-tekhaf-700" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  4. Dynamic Email Channels ({profile.emails.length})
                </h2>
                <p className="text-[11px] text-slate-400">
                  Multiple email points of contact (Sales Inquiries, Parts Department, Management).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addEmail}
              className="bg-tekhaf-50 hover:bg-tekhaf-100 text-tekhaf-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto border border-tekhaf-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Email Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {profile.emails.map((e, idx) => (
              <div
                key={e.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Email #{idx + 1} {e.isPrimary && "• (Primary)"}
                  </span>
                  {profile.emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmail(e.id)}
                      className="text-rose-600 hover:text-rose-700"
                      title="Delete email"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={e.label}
                  onChange={(ev) =>
                    setProfile({
                      ...profile,
                      emails: profile.emails.map((item) =>
                        item.id === e.id ? { ...item, label: ev.target.value } : item
                      ),
                    })
                  }
                  placeholder="Label (e.g. Direct Quotations)"
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                />

                <input
                  type="email"
                  value={e.email}
                  onChange={(ev) =>
                    setProfile({
                      ...profile,
                      emails: profile.emails.map((item) =>
                        item.id === e.id ? { ...item, email: ev.target.value } : item
                      ),
                    })
                  }
                  placeholder="name@tekhaf.com"
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white font-medium"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: Dynamic Social Media Suite */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Share2 className="w-4 h-4 text-tekhaf-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                5. Social Media & Direct Chat Channels
              </h2>
              <p className="text-[11px] text-slate-400">
                These links populate the left-floating dock, contact page pills, and footer icons dynamically.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Direct Link (e.g. https://wa.me/251911234567)
              </label>
              <input
                type="text"
                value={profile.socials.whatsapp || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socials: { ...profile.socials, whatsapp: e.target.value },
                  })
                }
                placeholder="https://wa.me/251911234567"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Telegram Channel / Username (e.g. https://t.me/tekhaftractors)
              </label>
              <input
                type="text"
                value={profile.socials.telegram || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socials: { ...profile.socials, telegram: e.target.value },
                  })
                }
                placeholder="https://t.me/tekhaftractors"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={profile.socials.linkedin || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socials: { ...profile.socials, linkedin: e.target.value },
                  })
                }
                placeholder="https://linkedin.com/in/dagim-melese"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Facebook Business Page
              </label>
              <input
                type="text"
                value={profile.socials.facebook || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socials: { ...profile.socials, facebook: e.target.value },
                  })
                }
                placeholder="https://facebook.com/tekhaftrading"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                YouTube Channel
              </label>
              <input
                type="text"
                value={profile.socials.youtube || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socials: { ...profile.socials, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/@tekhaftractors"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                TikTok Profile
              </label>
              <input
                type="text"
                value={profile.socials.tiktok || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socials: { ...profile.socials, tiktok: e.target.value },
                  })
                }
                placeholder="https://tiktok.com/@tekhaftractors"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: Synchronized Logo & Favicon */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-tekhaf-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                6. Logo & Favicon Synchronization
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-tekhaf-700 bg-tekhaf-50 px-2.5 py-1 rounded-lg border border-tekhaf-200">
              Auto-Synced Favicon
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The browser tab favicon and mobile touch icon dynamically mirror your brand logo. Enter a custom image URL below, or leave it blank to use the official Dagim Melese tractor emblem.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Brand Emblem / Logo Source
              </label>
              
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingLogo ? "Processing..." : "Upload Logo from Device"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>

                {profile.customLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, customLogoUrl: "" })}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white border border-slate-200 rounded-xl transition-colors"
                  >
                    Reset to Default Emblem
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={profile.customLogoUrl}
                  onChange={(e) => setProfile({ ...profile, customLogoUrl: e.target.value })}
                  placeholder="Or paste direct image URL (https://res.cloudinary.com/... or data:image/...)"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white font-mono"
                />
              </div>
            </div>

            {/* Live Dual Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Header Logo Preview */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Header Logo Preview
                </span>
                <div className="h-12 flex items-center">
                  <Logo
                    representativeName={profile.representativeName}
                    jobTitle={profile.jobTitle}
                    companyName={profile.companyName}
                    customLogoUrl={profile.customLogoUrl || null}
                  />
                </div>
              </div>

              {/* Browser Tab Favicon Preview */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Browser Tab Favicon Preview (Live)
                </span>
                <div className="h-12 flex items-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 max-w-xs shadow-sm">
                    {profile.customLogoUrl ? (
                      <div className="w-4 h-4 rounded overflow-hidden shrink-0 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={profile.customLogoUrl}
                          alt="Favicon"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded bg-tekhaf-700 flex items-center justify-center text-white shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                          <path d="M3 17h18" />
                          <circle cx="6" cy="17" r="3" />
                          <circle cx="17.5" cy="17" r="2" />
                        </svg>
                      </div>
                    )}
                    <span className="text-[11px] font-medium text-slate-700 truncate">
                      {profile.representativeName} • {profile.companyName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: Regional Languages & Dynamic Multilingual Controls */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-tekhaf-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                7. Regional Languages & Dynamic Multilingual Setup
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-tekhaf-700 bg-tekhaf-50 px-2.5 py-1 rounded-lg border border-tekhaf-200">
              {profile.enabledLocales.length} Languages Active
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Choose which languages are active on the platform. The site navigation and mobile drawer will dynamically show only enabled languages in the language switcher.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { code: "en", label: "English", desc: "Default commercial and trade language" },
              { code: "am", label: "Amharic (አማርኛ)", desc: "Federal working language of Ethiopia" },
              { code: "or", label: "Afaan Oromoo", desc: "Oromia Region agricultural belt & wheat farmers" },
              { code: "so", label: "Somali (Soomaali)", desc: "Somali Regional State farming & agro-pastoral zones" },
              { code: "sid", label: "Sidama (Sidaamu Afoo)", desc: "Sidama agrarian belt & Hawassa coffee growers" },
            ].map((loc) => {
              const isEnabled = profile.enabledLocales.includes(loc.code);
              const isDefault = profile.defaultLocale === loc.code;
              return (
                <div
                  key={loc.code}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isEnabled
                      ? "bg-slate-50 border-tekhaf-300"
                      : "bg-white border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => toggleLocale(loc.code)}
                        className="mt-0.5 rounded border-slate-300 text-tekhaf-600 focus:ring-tekhaf-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{loc.label}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">
                            [{loc.code}]
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {loc.desc}
                        </div>
                      </div>
                    </label>

                    {isEnabled && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, defaultLocale: loc.code })}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors shrink-0 ${
                          isDefault
                            ? "bg-tekhaf-700 text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isDefault ? "Default" : "Set Default"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-6 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 hidden sm:block">
            Saves all dynamic phone numbers, locations, emails, and brand settings across the site.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-3 px-8 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-75"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving All CMS Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Dynamic CMS Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
