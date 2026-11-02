"use client";

import { useState } from "react";
import Image from "next/image";
import { dagimProfile } from "@/lib/data/profile";
import { UserCheck, Save, Phone, MessageSquare, Mail, MapPin, CheckCircle } from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(dagimProfile);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Sales Representative Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update Dagim Melese’s biography, contact phone, WhatsApp link, certifications, and credentials.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        {/* Photo & Identity Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-tekhaf-600 shadow-md shrink-0">
            <Image src={profile.profilePhoto} alt={profile.fullName} fill className="object-cover" />
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-lg font-bold text-slate-900">{profile.fullName}</h2>
            <p className="text-xs text-tekhaf-700 font-semibold">{profile.jobTitle} • {profile.companyName}</p>
            <p className="text-xs text-slate-400">Photo URL managed via Cloudinary Media Manager</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Representative Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              value={profile.jobTitle}
              onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Telephone Number</label>
            <input
              type="text"
              value={profile.phoneDisplay}
              onChange={(e) => setProfile({ ...profile, phoneDisplay: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">WhatsApp URL</label>
            <input
              type="text"
              value={profile.whatsapp}
              onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Office Showroom Location</label>
            <input
              type="text"
              value={profile.officeAddress}
              onChange={(e) => setProfile({ ...profile, officeAddress: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
            />
          </div>
        </div>

        {/* Biography */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Biography & Agricultural Background</label>
          <textarea
            rows={4}
            value={profile.biography}
            onChange={(e) => setProfile({ ...profile, biography: e.target.value })}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 leading-relaxed"
          />
        </div>

        <button
          type="submit"
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </form>
    </div>
  );
}
