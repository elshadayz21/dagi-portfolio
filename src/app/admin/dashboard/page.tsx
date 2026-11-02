import Link from "next/link";
import { getAllLeads } from "@/lib/leads-store";
import { tractorInventory } from "@/lib/data/inventory";
import { dagimProfile } from "@/lib/data/profile";
import {
  Users,
  Tractor,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const leads = await getAllLeads();
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const wonLeads = leads.filter((l) => l.status === "WON").length;
  const negotiatingLeads = leads.filter((l) => l.status === "NEGOTIATING").length;
  const inStockTractors = tractorInventory.filter((t) => t.availability === "IN_STOCK").length;

  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-tekhaf-900 via-tekhaf-800 to-tekhaf-700 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-tekhaf-300 uppercase tracking-wider">
            Tekhaf Trading • Executive Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Welcome back, {dagimProfile.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage customer inquiries, tractor inventory, regional sales pipelines, and translations across Ethiopia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="bg-white hover:bg-slate-100 text-tekhaf-900 text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-tekhaf-700" />
            <span>Manage All Leads ({totalLeads})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Total Leads</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalLeads}</div>
            <span className="text-[11px] font-semibold text-tekhaf-600">All registered inquiries</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* New Inquiries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">New Inquiries</span>
            <div className="text-3xl font-black text-amber-600 mt-1">{newLeads}</div>
            <span className="text-[11px] font-semibold text-amber-700">Action required</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Closed Won Deals */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Won Tractors</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">{wonLeads}</div>
            <span className="text-[11px] font-semibold text-emerald-700">Conversion: {conversionRate}%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Tractors in Stock */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Available Inventory</span>
            <div className="text-3xl font-black text-tekhaf-700 mt-1">{inStockTractors} Models</div>
            <span className="text-[11px] font-semibold text-slate-500">In Addis Ababa depot</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-tekhaf-50 text-tekhaf-700 flex items-center justify-center">
            <Tractor className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pipeline Status Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Active Sales Pipeline Stages
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[11px] font-bold text-amber-800 uppercase block">New</span>
            <span className="text-xl font-black text-amber-900">{newLeads}</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <span className="text-[11px] font-bold text-blue-800 uppercase block">Contacted</span>
            <span className="text-xl font-black text-blue-900">
              {leads.filter((l) => l.status === "CONTACTED").length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
            <span className="text-[11px] font-bold text-indigo-800 uppercase block">Interested</span>
            <span className="text-xl font-black text-indigo-900">
              {leads.filter((l) => l.status === "INTERESTED").length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-[11px] font-bold text-purple-800 uppercase block">Negotiating</span>
            <span className="text-xl font-black text-purple-900">{negotiatingLeads}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">Won</span>
            <span className="text-xl font-black text-emerald-900">{wonLeads}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-600 uppercase block">Lost</span>
            <span className="text-xl font-black text-slate-700">
              {leads.filter((l) => l.status === "LOST").length}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Inquiries Feed */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Customer Inquiries
            </h2>
            <p className="text-xs text-slate-500">
              Direct inquiries from farmers and agribusinesses across Ethiopian regions
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-tekhaf-700 hover:text-tekhaf-800 flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {leads.slice(0, 5).map((lead) => (
            <div
              key={lead.id}
              className="p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{lead.fullName}</h3>
                  <span className="text-xs bg-tekhaf-100 text-tekhaf-800 font-semibold px-2 py-0.5 rounded">
                    {lead.region}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      lead.status === "NEW"
                        ? "bg-amber-100 text-amber-800"
                        : lead.status === "WON"
                        ? "bg-emerald-100 text-emerald-800"
                        : lead.status === "NEGOTIATING"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-4">
                  <span className="font-semibold text-tekhaf-700">
                    Model: {lead.productTitle || "General Consultation"}
                  </span>
                  {lead.farmSizeHectares && (
                    <span>• {lead.farmSizeHectares} Hectares</span>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-1 italic">
                  &ldquo;{lead.message}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center">
                <a
                  href={`tel:${lead.phone}`}
                  className="p-2 rounded-lg bg-tekhaf-50 text-tekhaf-700 hover:bg-tekhaf-100 transition-colors"
                  title="Call Customer"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                  title="Chat on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <Link
                  href="/admin/leads"
                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
