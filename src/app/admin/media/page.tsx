"use client";

import { useState } from "react";
import Image from "next/image";
import { tractorInventory } from "@/lib/data/inventory";
import { Upload, Image as ImageIcon, Trash2, Copy, Check, Cloud } from "lucide-react";

export default function AdminMediaPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mediaItems = tractorInventory.flatMap((t, i) => [
    {
      id: `media-${i}-1`,
      title: `${t.title} - Main View`,
      url: t.image,
      format: "JPEG",
      size: "820 KB",
    },
    ...t.gallery.map((g, gi) => ({
      id: `media-${i}-gal-${gi}`,
      title: `${t.title} - Detail Angle ${gi + 1}`,
      url: g,
      format: "JPEG",
      size: "640 KB",
    })),
  ]);

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Media Manager (Cloudinary CDN)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store, optimize, and organize tractor gallery images, brochures, and machinery spec sheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all">
            <Upload className="w-4 h-4" />
            <span>Upload New Media Asset</span>
          </button>
        </div>
      </div>

      {/* Cloudinary Status Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Cloudinary CDN: tekhaf-trading
            </span>
            <span className="text-[11px] text-slate-400">
              Auto-compression (f_auto, q_auto) enabled for high-speed delivery in Ethiopia
            </span>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Connected
        </span>
      </div>

      {/* Media Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group flex flex-col justify-between"
          >
            <div className="relative h-40 bg-slate-100">
              <Image src={item.url} alt={item.title} fill className="object-cover" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyUrl(item.url, item.id)}
                  className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white shadow text-xs font-bold flex items-center gap-1"
                  title="Copy URL"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 text-xs">
              <h3 className="font-bold text-slate-800 line-clamp-1">{item.title}</h3>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>{item.format}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
