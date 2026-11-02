"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { dagimProfile } from "@/lib/data/profile";
import { Save, CheckCircle, Globe, RefreshCw, Sparkles, Check } from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    fullName: dagimProfile.fullName,
    jobTitle: dagimProfile.jobTitle,
    companyName: dagimProfile.companyName,
    phoneDisplay: dagimProfile.phoneDisplay,
    whatsapp: "https://wa.me/251911234567",
    telegram: "https://t.me/tekhaftractors",
    linkedin: "https://linkedin.com/in/dagim-melese",
    email: dagimProfile.email,
    officeAddress: dagimProfile.officeAddress,
    customLogoUrl: "",
    profilePhoto: dagimProfile.profilePhoto,
    biography: dagimProfile.biography,
  });

  const [loading, setLoading] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");

  // Fetch current live CMS configuration on mount
  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setProfile((prev) => ({
            ...prev,
            fullName: d.representativeName || prev.fullName,
            jobTitle: d.jobTitle || prev.jobTitle,
            companyName: d.companyName || prev.companyName,
            phoneDisplay: d.phoneDisplay || prev.phoneDisplay,
            email: d.email || prev.email,
            officeAddress: d.officeAddress || prev.officeAddress,
            customLogoUrl: d.customLogoUrl || "",
            profilePhoto: d.profilePhoto || prev.profilePhoto,
            biography: d.biography || prev.biography,
            whatsapp: d.socials?.whatsapp || prev.whatsapp,
            telegram: d.socials?.telegram || prev.telegram,
            linkedin: d.socials?.linkedin || prev.linkedin,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          representativeName: profile.fullName,
          jobTitle: profile.jobTitle,
          companyName: profile.companyName,
          phone: profile.phoneDisplay.replace(/\s+/g, ""),
          phoneDisplay: profile.phoneDisplay,
          email: profile.email,
          officeAddress: profile.officeAddress,
          customLogoUrl: profile.customLogoUrl.trim() || null,
          profilePhoto: profile.profilePhoto,
          biography: profile.biography,
          socials: {
            whatsapp: profile.whatsapp,
            telegram: profile.telegram,
            linkedin: profile.linkedin,
            phone: `tel:${profile.phoneDisplay.replace(/\s+/g, "")}`,
            email: `mailto:${profile.email}`,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNoticeMessage("Brand configuration and favicon successfully updated across all pages!");
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 4000);
      } else {
        alert(data.error || "Failed to update brand settings");
      }
    } catch {
      alert("Error saving settings. Please verify connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Consultant & Brand Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Dynamically manage your name, company affiliation, custom logo, synchronized favicon, and direct contact channels.
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
              The site logo, browser tab favicon, and mobile touch icon are synchronized in real time.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        {/* Photo Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
            <Image src={profile.profilePhoto} alt={profile.fullName} fill className="object-cover" />
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-base font-bold text-slate-900">{profile.fullName}</h2>
            <p className="text-xs text-tekhaf-700 font-semibold">{profile.jobTitle} • {profile.companyName}</p>
          </div>
        </div>

        {/* Brand Logo & Synchronized Favicon Section */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-tekhaf-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Logo & Favicon Synchronization
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-tekhaf-700 bg-tekhaf-50 px-2.5 py-1 rounded-lg border border-tekhaf-200">
              Auto-Synced Favicon
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The browser tab favicon and mobile icon automatically mirror your brand logo. Enter a custom image URL below, or leave it blank to use the official Dagim Melese tractor emblem.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Logo URL (Cloudinary / CDN / Image URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profile.customLogoUrl}
                  onChange={(e) => setProfile({ ...profile, customLogoUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or leave blank for default"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white"
                />
                {profile.customLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, customLogoUrl: "" })}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white border border-slate-200 rounded-xl transition-colors"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
            </div>

            {/* Live Dual Preview: Header Logo + Browser Tab Favicon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Header Logo Preview */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Header Logo Preview
                </span>
                <div className="h-12 flex items-center">
                  {profile.customLogoUrl ? (
                    <div className="relative h-10 w-40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={profile.customLogoUrl}
                        alt="Custom Logo"
                        className="h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-tekhaf-700 flex items-center justify-center text-white shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                          <path d="M3 17h18" />
                          <path d="M7 17v-4h6l2 4" />
                          <path d="M13 13V8h-4l-2 5" />
                          <path d="M10 8V5h2" />
                          <circle cx="6" cy="17" r="3" />
                          <circle cx="17.5" cy="17" r="2" />
                          <path d="M12 5V3" />
                        </svg>
                      </div>
                      <div className="flex flex-col leading-none">
                        <span className="text-xs font-black uppercase text-slate-900">{profile.fullName}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{profile.jobTitle} • <strong className="text-tekhaf-700">{profile.companyName}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Browser Tab Favicon Preview */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Browser Tab Favicon Preview (Live)
                </span>
                <div className="h-12 flex items-center">
                  {/* Simulated Browser Tab */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 max-w-xs shadow-sm">
                    {/* Live Favicon Icon */}
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
                      {profile.fullName} • {profile.companyName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Identity */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Identity & Organization
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name (Main Title)</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Role / Job Title</label>
              <input
                type="text"
                value={profile.jobTitle}
                onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Organization Name</label>
              <input
                type="text"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office Showroom Location</label>
              <input
                type="text"
                value={profile.officeAddress}
                onChange={(e) => setProfile({ ...profile, officeAddress: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>
          </div>
        </div>

        {/* Social Media & Contact */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Floating Social Channels & Contact Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telephone Number</label>
              <input
                type="text"
                value={profile.phoneDisplay}
                onChange={(e) => setProfile({ ...profile, phoneDisplay: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp Link</label>
              <input
                type="text"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telegram Link</label>
              <input
                type="text"
                value={profile.telegram}
                onChange={(e) => setProfile({ ...profile, telegram: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile Link</label>
              <input
                type="text"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Consultant Biography
          </label>
          <textarea
            rows={4}
            value={profile.biography}
            onChange={(e) => setProfile({ ...profile, biography: e.target.value })}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors disabled:opacity-75"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Update Brand & Favicon</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
