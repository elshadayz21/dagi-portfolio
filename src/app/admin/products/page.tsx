"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { tractorInventory, TractorProduct } from "@/lib/data/inventory";
import { Tractor, Plus, Edit, Check, Clock, ShieldAlert } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<TractorProduct[]>(tractorInventory);
  const [notification, setNotification] = useState("");

  const toggleAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus =
            p.availability === "IN_STOCK"
              ? "PRE_ORDER"
              : p.availability === "PRE_ORDER"
              ? "OUT_OF_STOCK"
              : "IN_STOCK";
          return { ...p, availability: nextStatus };
        }
        return p;
      })
    );
    showNotice("Tractor stock status updated.");
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tractor Inventory & Product Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage tractor models, horsepower, pricing in ETB, and showroom availability in Addis Ababa.
          </p>
        </div>

        <button
          onClick={() => showNotice("Add New Tractor form opened.")}
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Tractor Model</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
          {notification}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Tractor Model</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Horsepower</th>
                <th className="p-4">Price (ETB)</th>
                <th className="p-4">Showroom Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((tractor) => (
                <tr key={tractor.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <Image src={tractor.image} alt={tractor.title} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{tractor.title}</div>
                      <div className="text-[10px] text-slate-400">{tractor.modelNumber}</div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{tractor.brand}</td>
                  <td className="p-4 font-bold text-tekhaf-700">{tractor.horsepower} HP</td>
                  <td className="p-4 font-bold text-slate-900">{tractor.priceFormatted}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleAvailability(tractor.id)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        tractor.availability === "IN_STOCK"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : tractor.availability === "PRE_ORDER"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                      }`}
                    >
                      {tractor.availability.replace("_", " ")}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/en/products/${tractor.slug}`}
                        target="_blank"
                        className="text-xs font-bold text-tekhaf-700 hover:underline"
                      >
                        Preview
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
