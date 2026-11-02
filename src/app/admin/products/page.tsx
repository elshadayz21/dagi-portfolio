"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { tractorInventory, TractorProduct } from "@/lib/data/inventory";
import { Plus, X, CheckCircle2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<TractorProduct[]>(tractorInventory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notice, setNotice] = useState("");

  const [newTractor, setNewTractor] = useState({
    title: "",
    brand: "Massey Ferguson",
    modelNumber: "",
    horsepower: 75,
    engineType: "Perkins Diesel 4-Cylinder",
    transmission: "8 Forward + 2 Reverse",
    image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80",
    summary: "",
  });

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
    showNotice("Stock status updated.");
  };

  const handleAddTractor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTractor.title || !newTractor.modelNumber) return;

    const slug = newTractor.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created: TractorProduct = {
      id: `prod-${Date.now()}`,
      slug,
      title: newTractor.title,
      brand: newTractor.brand,
      modelNumber: newTractor.modelNumber,
      horsepower: Number(newTractor.horsepower),
      engineType: newTractor.engineType,
      fuelType: "Diesel",
      transmission: newTractor.transmission,
      driveType: "4WD",
      hydraulicLift: "2,145 kg",
      ptoSpeed: "540 RPM",
      priceETB: 3500000,
      priceFormatted: "Inquire",
      availability: "IN_STOCK",
      isFeatured: true,
      image: newTractor.image,
      gallery: [newTractor.image],
      summary: newTractor.summary || "High performance agricultural tractor available from Tekhaf Trading.",
      description: "Tested and verified for Ethiopian farming conditions with complete manufacturer warranty and parts support.",
      keyBenefits: [
        "Fuel efficient powertrain",
        "Heavy-duty 4WD traction",
        "Spare parts in stock in Addis Ababa",
      ],
      specs: {
        "Horsepower": `${newTractor.horsepower} HP`,
        "Transmission": newTractor.transmission,
        "Engine": newTractor.engineType,
      },
      bestForRegions: ["Oromia", "Amhara", "Sidama"],
    };

    setProducts([created, ...products]);
    setShowAddModal(false);
    showNotice("New tractor added successfully and added to the footer & catalog.");
    setNewTractor({
      title: "",
      brand: "Massey Ferguson",
      modelNumber: "",
      horsepower: 75,
      engineType: "Perkins Diesel 4-Cylinder",
      transmission: "8 Forward + 2 Reverse",
      image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80",
      summary: "",
    });
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tractor Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage machinery catalog and availability. Newly added tractors automatically display on the website and footer.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tractor</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative border border-slate-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4">
              Add New Tractor Model
            </h3>

            <form onSubmit={handleAddTractor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTractor.title}
                  onChange={(e) => setNewTractor({ ...newTractor, title: e.target.value })}
                  placeholder="e.g. Massey Ferguson MF 385 (4WD, 85 HP)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <select
                    value={newTractor.brand}
                    onChange={(e) => setNewTractor({ ...newTractor, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  >
                    <option value="Massey Ferguson">Massey Ferguson</option>
                    <option value="Lovol">Lovol</option>
                    <option value="New Holland">New Holland</option>
                    <option value="John Deere">John Deere</option>
                    <option value="Sonalika">Sonalika</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model Number</label>
                  <input
                    type="text"
                    required
                    value={newTractor.modelNumber}
                    onChange={(e) => setNewTractor({ ...newTractor, modelNumber: e.target.value })}
                    placeholder="e.g. MF 385 4WD"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Horsepower (HP)</label>
                  <input
                    type="number"
                    value={newTractor.horsepower}
                    onChange={(e) => setNewTractor({ ...newTractor, horsepower: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transmission</label>
                  <input
                    type="text"
                    value={newTractor.transmission}
                    onChange={(e) => setNewTractor({ ...newTractor, transmission: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newTractor.image}
                  onChange={(e) => setNewTractor({ ...newTractor, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brief Summary</label>
                <textarea
                  rows={2}
                  value={newTractor.summary}
                  onChange={(e) => setNewTractor({ ...newTractor, summary: e.target.value })}
                  placeholder="Key operating capabilities..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tekhaf-700 text-white rounded-xl font-bold hover:bg-tekhaf-800"
                >
                  Save Tractor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Tractor Model</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Horsepower</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((tractor) => (
                <tr key={tractor.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <Image src={tractor.image} alt={tractor.title} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{tractor.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{tractor.modelNumber}</div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{tractor.brand}</td>
                  <td className="p-4 font-bold text-tekhaf-700">{tractor.horsepower} HP</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleAvailability(tractor.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        tractor.availability === "IN_STOCK"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : tractor.availability === "PRE_ORDER"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {tractor.availability === "IN_STOCK" ? "In Stock" : "Pre-Order"}
                    </button>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/en/products/${tractor.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-tekhaf-700 hover:underline"
                    >
                      View Live &rarr;
                    </Link>
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
