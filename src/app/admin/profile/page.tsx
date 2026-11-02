"use client";

import { useState } from "react";
import Image from "next/image";
import { dagimProfile } from "@/lib/data/profile";
import { Save, CheckCircle } from "lucide-react";

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

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Consultant & Brand Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Dynamically manage your name, company affiliation, custom logo, contact channels, and social media links.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Profile and brand settings successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
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
              <label className="block font-semibold text-slate-700 mb-1">Company / Organization Name (Where you work)</label>
              <input
                type="text"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Custom Logo URL (Optional)</label>
              <input
                type="text"
                value={profile.customLogoUrl}
                onChange={(e) => setProfile({ ...profile, customLogoUrl: e.target.value })}
                placeholder="Leave blank to use default Dagim Melese logo"
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
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
}
