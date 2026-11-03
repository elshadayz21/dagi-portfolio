"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Tractor,
  FolderTree,
  UserCheck,
  Search,
  Languages,
  Image as ImageIcon,
  History,
  Film,
  MapPin,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { dagimProfile } from "@/lib/data/profile";
import { BackToTop } from "@/components/back-to-top";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render clean layout without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/leads", label: "CRM Leads & Inquiries", icon: Users },
    { href: "/admin/products", label: "Tractor Inventory", icon: Tractor },
    { href: "/admin/categories", label: "Categories Manager", icon: FolderTree },
    { href: "/admin/locations", label: "Regional Locations & Hubs", icon: MapPin },
    { href: "/admin/profile", label: "Representative Profile", icon: UserCheck },
    { href: "/admin/seo", label: "SEO & Meta Settings", icon: Search },
    { href: "/admin/translations", label: "CMS Translations (5 Lang)", icon: Languages },
    { href: "/admin/media", label: "Media Manager & Assets", icon: ImageIcon },
    { href: "/admin/gallery", label: "Field Gallery & Videos", icon: Film },
    { href: "/admin/activity", label: "Activity & Audit Log", icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-tekhaf-950 text-slate-300 border-r border-tekhaf-900 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-tekhaf-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tekhaf-700 text-white flex items-center justify-center font-bold">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <div className="text-white font-black text-sm tracking-tight">
              TEKHAF CRM
            </div>
            <div className="text-[11px] text-tekhaf-400 font-semibold">
              Dagim Melese Portal
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-tekhaf-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-tekhaf-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Site Link & Profile Footer */}
        <div className="p-4 border-t border-tekhaf-900 space-y-2">
          <Link
            href="/en"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-tekhaf-300 hover:bg-tekhaf-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>View Live Website</span>
            </span>
            <span className="text-[10px] bg-tekhaf-800 px-1.5 py-0.5 rounded">/en</span>
          </Link>

          <div className="pt-2 border-t border-tekhaf-900/50 flex items-center justify-between px-3">
            <div className="text-xs">
              <span className="text-white font-bold block">{dagimProfile.fullName}</span>
              <span className="text-[10px] text-slate-500">Super Admin</span>
            </div>
            <Link
              href="/admin/login"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-tekhaf-900 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-tekhaf-950 text-white p-4 flex items-center justify-between border-b border-tekhaf-900">
          <div className="flex items-center gap-2">
            <Tractor className="w-5 h-5 text-tekhaf-400" />
            <span className="font-bold text-sm">Tekhaf CRM</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Sidebar Dropdown */}
        {sidebarOpen && (
          <div className="lg:hidden bg-tekhaf-950 p-4 border-b border-tekhaf-900 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-tekhaf-900"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-tekhaf-900">
              <Link
                href="/en"
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-tekhaf-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Public Site</span>
              </Link>
            </div>
          </div>
        )}

        {/* Child Content */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">{children}</main>

        {/* Go to top button */}
        <BackToTop />
      </div>
    </div>
  );
}
