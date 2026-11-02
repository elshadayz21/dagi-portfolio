"use client";

import { useState, useEffect, useMemo } from "react";
import {
  History,
  Search,
  Filter,
  Download,
  Users,
  Image as ImageIcon,
  Sparkles,
  ShieldAlert,
  Clock,
  RefreshCw,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import { ActivityLogItem } from "@/lib/activity-store";

export default function AdminActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/activity");
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to load activity logs", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !searchQuery ||
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "ALL" || log.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [logs, searchQuery, selectedCategory]);

  const metrics = useMemo(() => {
    return {
      total: logs.length,
      leads: logs.filter((l) => l.category === "LEADS").length,
      media: logs.filter((l) => l.category === "MEDIA").length,
      brand: logs.filter((l) => l.category === "BRAND").length,
    };
  }, [logs]);

  // Export Audit Log to CSV
  const exportLogCSV = () => {
    if (filteredLogs.length === 0) return;

    const headers = ["Activity ID", "Category", "Action", "Title", "Actor", "Timestamp", "Details"];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.category}"`,
      `"${l.action}"`,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.actor}"`,
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Tekhaf_Activity_Log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: ActivityLogItem["action"]) => {
    switch (action) {
      case "LEAD_RECEIVED":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Inquiry Received</span>;
      case "LEAD_STATUS_CHANGED":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Status Changed</span>;
      case "LEAD_NOTE_ADDED":
        return <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Note Added</span>;
      case "MEDIA_UPLOADED":
        return <span className="bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Media Uploaded</span>;
      case "MEDIA_UPDATED":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Media Replaced</span>;
      case "MEDIA_DELETED":
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Media Deleted</span>;
      case "LOGO_UPDATED":
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Logo & Favicon</span>;
      case "PROFILE_UPDATED":
        return <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Profile Update</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-bold">{action}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Activity & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time audit log tracking customer inquiries, CRM pipeline updates, media modifications, and brand configurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={exportLogCSV}
            className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Logged Events
          </span>
          <span className="text-2xl font-black text-slate-900">{metrics.total}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Customer Lead Events
          </span>
          <span className="text-2xl font-black text-emerald-600">{metrics.leads}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Media & Asset Actions
          </span>
          <span className="text-2xl font-black text-violet-600">{metrics.media}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Brand & Logo Updates
          </span>
          <span className="text-2xl font-black text-indigo-600">{metrics.brand}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search activities by actor, title, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {["ALL", "LEADS", "MEDIA", "BRAND"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-tekhaf-700 text-white"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {cat === "ALL" ? "All Activities" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Log Timeline List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-tekhaf-600" />
          <span>Loading activity log...</span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No activity records match your criteria</h3>
          <p className="text-xs text-slate-400">
            Activity logs are created automatically when leads are submitted or platform content is modified.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredLogs.map((log) => {
            const date = new Date(log.timestamp);
            return (
              <div
                key={log.id}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getActionBadge(log.action)}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {log.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {log.details}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <span>By:</span>
                      <strong className="text-tekhaf-700">{log.actor}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </span>
                    <span>•</span>
                    <span>{date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-center">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {log.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
