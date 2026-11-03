"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { LeadRecord, LeadNoteItem } from "@/lib/leads-store";
import { generateExcelWorkbook, generateExcelCSV } from "@/lib/export-excel";
import {
  Users,
  Search,
  Download,
  Filter,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Plus,
  Loader2,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  CheckCircle2,
  Trash2,
  Edit3,
  History,
  Send,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Pagination } from "@/components/pagination";

const STATUS_CONFIG: Record<
  LeadRecord["status"],
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  NEW: {
    label: "NEW",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-300",
    desc: "Unreviewed web inquiry",
  },
  PENDING: {
    label: "PENDING",
    bg: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-400",
    desc: "Contacted - awaiting loan, budget, or callback",
  },
  CONTACTED: {
    label: "CONTACTED",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-300",
    desc: "Initial discussion completed",
  },
  INTERESTED: {
    label: "INTERESTED",
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    border: "border-indigo-300",
    desc: "Evaluating specific tractor model & quotation",
  },
  NEGOTIATING: {
    label: "NEGOTIATING",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-300",
    desc: "Commercial terms, payment & delivery review",
  },
  WON: {
    label: "WON",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-300",
    desc: "Contract signed / tractor delivered",
  },
  LOST: {
    label: "LOST",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
    desc: "Inquiry closed without purchase",
  },
};

const QUICK_PROGRESS_SNIPPETS = [
  "Contacted customer via phone - Pending CBE bank loan approval.",
  "Spoke with customer - Highly interested in 120HP Deutz-Fahr; requested proforma invoice.",
  "Followed up on proforma invoice - Customer reviewing quotation with union board.",
  "Customer confirmed visit to Tekhaf yard in Addis Ababa next week.",
  "Price and delivery negotiation in progress - Awaiting management discount approval.",
  "Customer requested a follow-up phone call in 3 days.",
];

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  // Update Writing State
  const [updateStatus, setUpdateStatus] = useState<LeadRecord["status"]>("PENDING");
  const [updateNote, setUpdateNote] = useState("");
  const [authorName, setAuthorName] = useState("Dagim Melese");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);

  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const noteInputRef = useRef<HTMLTextAreaElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Failed to load leads", err);
    } finally {
      setLoading(false);
    }
  };

  // When a lead is selected, sync the default update status to match or default to PENDING
  const selectLeadForUpdate = (lead: LeadRecord, focusWriting = false) => {
    setSelectedLead(lead);
    setUpdateStatus(lead.status === "NEW" ? "PENDING" : lead.status);
    if (focusWriting) {
      setTimeout(() => {
        noteInputRef.current?.focus();
        noteInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadRecord["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus, author: authorName }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
          setUpdateStatus(newStatus);
        }
        showToast(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Add Progress Note and update status
  const handleSaveProgressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !updateNote.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead.id,
          note: updateNote.trim(),
          author: authorName.trim() || "Dagim Melese",
          status: updateStatus,
          statusAtUpdate: updateStatus,
        }),
      });

      const data = await res.json();
      if (data.success && data.lead) {
        setSelectedLead(data.lead);
        setLeads((prev) =>
          prev.map((l) => (l.id === data.lead.id ? data.lead : l))
        );
        setUpdateNote("");
        showToast(`Progress update recorded [${updateStatus}] for ${data.lead.fullName}!`);
      } else if (data.success) {
        // Fallback local update
        const newNoteObj: LeadNoteItem = {
          id: `note-${Date.now()}`,
          author: authorName || "Dagim Melese",
          content: updateNote.trim(),
          statusAtUpdate: updateStatus,
          createdAt: new Date().toISOString(),
        };

        const updatedLead: LeadRecord = {
          ...selectedLead,
          status: updateStatus,
          notes: [newNoteObj, ...selectedLead.notes],
        };

        setSelectedLead(updatedLead);
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? updatedLead : l))
        );
        setUpdateNote("");
        showToast(`Progress update saved [${updateStatus}]!`);
      }
    } catch (err) {
      console.error("Failed to add note", err);
      showToast("Error saving progress update.");
    } finally {
      setSubmittingNote(false);
    }
  };

  // Delete a specific history note
  const handleDeleteNote = async (noteId: string) => {
    if (!selectedLead) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this progress history entry? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setDeletingNoteId(noteId);
    try {
      const res = await fetch(
        `/api/leads?leadId=${encodeURIComponent(selectedLead.id)}&noteId=${encodeURIComponent(noteId)}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.success) {
        const updatedNotes = selectedLead.notes.filter((n) => n.id !== noteId);
        const updatedLead = { ...selectedLead, notes: updatedNotes };
        setSelectedLead(updatedLead);
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? updatedLead : l))
        );
        showToast("Progress entry deleted from history.");
      } else {
        alert(data.error || "Failed to delete history entry");
      }
    } catch (err) {
      console.error("Failed to delete history note", err);
      showToast("Error deleting history entry");
    } finally {
      setDeletingNoteId(null);
    }
  };

  // Delete entire lead
  const handleDeleteLead = async (leadId: string, leadName: string) => {
    const confirmDelete = window.confirm(
      `Delete inquiry for "${leadName}"? All contact history and records will be permanently removed.`
    );
    if (!confirmDelete) return;

    setDeletingLeadId(leadId);
    try {
      const res = await fetch(`/api/leads?leadId=${encodeURIComponent(leadId)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
        if (selectedLead?.id === leadId) {
          setSelectedLead(null);
        }
        showToast(`Inquiry for "${leadName}" removed.`);
      } else {
        alert(data.error || "Failed to delete lead");
      }
    } catch (err) {
      console.error("Failed to delete lead", err);
      showToast("Error deleting inquiry.");
    } finally {
      setDeletingLeadId(null);
    }
  };

  // Download Contacted Clients in Excel (.xls)
  const downloadContactedExcel = () => {
    setExportMenuOpen(false);
    const contacted = leads.filter(
      (l) =>
        l.status === "CONTACTED" ||
        l.status === "PENDING" ||
        l.status === "INTERESTED" ||
        l.status === "NEGOTIATING" ||
        l.status === "WON"
    );

    if (contacted.length === 0) {
      alert("No contacted or pending leads found yet.");
      return;
    }

    const xml = generateExcelWorkbook(contacted, "Contacted & Pending Clients");
    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tekhaf_Contacted_Clients_${new Date().toISOString().split("T")[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded ${contacted.length} contacted & pending clients in Excel (.xls)!`);
  };

  // Download All Inquiries in Excel (.xls)
  const downloadAllExcel = () => {
    setExportMenuOpen(false);
    if (leads.length === 0) {
      alert("No inquiries to download.");
      return;
    }

    const xml = generateExcelWorkbook(leads, "All Customer Inquiries");
    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tekhaf_All_Inquiries_${new Date().toISOString().split("T")[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded all ${leads.length} inquiries in Excel (.xls)!`);
  };

  // CSV Export with UTF-8 BOM
  const exportToCSV = () => {
    setExportMenuOpen(false);
    if (leads.length === 0) return;

    const csvContent = generateExcelCSV(leads);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tekhaf_Tractor_Leads_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Exported ${leads.length} leads to CSV.`);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        lead.fullName.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.region.toLowerCase().includes(q) ||
        (lead.productTitle && lead.productTitle.toLowerCase().includes(q)) ||
        (lead.notes && lead.notes.some((n) => n.content.toLowerCase().includes(q)));

      const matchesStatus =
        statusFilter === "ALL" || lead.status === statusFilter;

      const matchesRegion =
        regionFilter === "ALL" || lead.region.includes(regionFilter);

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [leads, searchQuery, statusFilter, regionFilter]);

  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  const uniqueRegions = useMemo(() => {
    const list = Array.from(new Set(leads.map((l) => l.region)));
    return ["ALL", ...list];
  }, [leads]);

  // Counts by status
  const counts = useMemo(() => {
    return {
      ALL: leads.length,
      NEW: leads.filter((l) => l.status === "NEW").length,
      PENDING: leads.filter((l) => l.status === "PENDING").length,
      CONTACTED: leads.filter((l) => l.status === "CONTACTED").length,
      INTERESTED: leads.filter((l) => l.status === "INTERESTED").length,
      NEGOTIATING: leads.filter((l) => l.status === "NEGOTIATING").length,
      WON: leads.filter((l) => l.status === "WON").length,
      LOST: leads.filter((l) => l.status === "LOST").length,
    };
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Inquiries & Contact Progress
            </h1>
            <span className="bg-tekhaf-100 text-tekhaf-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              CRM Hub
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Log progress updates, maintain complete contact history, track pending follow-ups, and export records.
          </p>
        </div>

        {/* Excel & CSV Download Actions */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              onClick={downloadContactedExcel}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              title="Download contacted & pending clients to Excel (.xls)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Contacted (Excel)</span>
            </button>

            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold p-2.5 rounded-xl text-xs flex items-center justify-center shadow-sm transition-all"
              title="More export options"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {exportMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
              <button
                onClick={downloadContactedExcel}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold block">Contacted & Pending (.xls)</span>
                  <span className="text-[10px] text-slate-400">All active client leads ({counts.CONTACTED + counts.PENDING + counts.INTERESTED + counts.NEGOTIATING + counts.WON})</span>
                </div>
              </button>

              <button
                onClick={downloadAllExcel}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 border-t border-slate-100"
              >
                <FileSpreadsheet className="w-4 h-4 text-tekhaf-600" />
                <div>
                  <span className="font-bold block">All Inquiries (.xls)</span>
                  <span className="text-[10px] text-slate-400">Complete inquiry registry ({leads.length})</span>
                </div>
              </button>

              <button
                onClick={exportToCSV}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 border-t border-slate-100"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="font-bold block">Standard CSV (.csv)</span>
                  <span className="text-[10px] text-slate-400">UTF-8 encoded format</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Filter Tabs (Status Pipeline) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {(
          [
            { id: "ALL", label: "All Inquiries", count: counts.ALL },
            { id: "NEW", label: "New", count: counts.NEW },
            { id: "PENDING", label: "Pending", count: counts.PENDING },
            { id: "CONTACTED", label: "Contacted", count: counts.CONTACTED },
            { id: "INTERESTED", label: "Interested", count: counts.INTERESTED },
            { id: "NEGOTIATING", label: "Negotiating", count: counts.NEGOTIATING },
            { id: "WON", label: "Won", count: counts.WON },
            { id: "LOST", label: "Lost", count: counts.LOST },
          ] as const
        ).map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-tekhaf-800 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, phone, notes, tractor..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-slate-50/50"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
          >
            <option value="ALL">All Statuses ({leads.length})</option>
            <option value="NEW">NEW ({counts.NEW})</option>
            <option value="PENDING">PENDING ({counts.PENDING})</option>
            <option value="CONTACTED">CONTACTED ({counts.CONTACTED})</option>
            <option value="INTERESTED">INTERESTED ({counts.INTERESTED})</option>
            <option value="NEGOTIATING">NEGOTIATING ({counts.NEGOTIATING})</option>
            <option value="WON">WON ({counts.WON})</option>
            <option value="LOST">LOST ({counts.LOST})</option>
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <select
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
          >
            <option value="ALL">All Regions</option>
            {uniqueRegions
              .filter((r) => r !== "ALL")
              .map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Main Table & Detail View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leads Table (7 or 12 Cols) */}
        <div className={`${selectedLead ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-tekhaf-700" />
                <span>Loading CRM Inquiries...</span>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No inquiries match your current filters.</p>
                {statusFilter !== "ALL" && (
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className="text-tekhaf-700 font-bold hover:underline"
                  >
                    Clear status filter
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Tractor & Inquiry</th>
                      <th className="p-4">Region</th>
                      <th className="p-4">Pipeline Status</th>
                      <th className="p-4">Latest Progress Update</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedLeads.map((lead) => {
                      const isSelected = selectedLead?.id === lead.id;
                      const latestNote = lead.notes && lead.notes.length > 0 ? lead.notes[0] : null;
                      const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;

                      return (
                        <tr
                          key={lead.id}
                          onClick={() => selectLeadForUpdate(lead)}
                          className={`hover:bg-tekhaf-50/50 cursor-pointer transition-colors ${
                            isSelected ? "bg-tekhaf-50/90 font-medium border-l-4 border-l-tekhaf-600" : ""
                          }`}
                        >
                          {/* Customer */}
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{lead.fullName}</div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{lead.phone}</span>
                            </div>
                            {lead.email && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                {lead.email}
                              </div>
                            )}
                          </td>

                          {/* Tractor / Farm */}
                          <td className="p-4">
                            <div className="font-semibold text-tekhaf-700 line-clamp-1">
                              {lead.productTitle || "General Machinery"}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lead.farmSizeHectares ? `${lead.farmSizeHectares} Ha` : "Size not specified"}
                            </div>
                          </td>

                          {/* Region */}
                          <td className="p-4">
                            <span className="font-medium text-slate-700">{lead.region}</span>
                          </td>

                          {/* Status */}
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value as any)
                              }
                              className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                            >
                              <option value="NEW">NEW</option>
                              <option value="PENDING">PENDING</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="INTERESTED">INTERESTED</option>
                              <option value="NEGOTIATING">NEGOTIATING</option>
                              <option value="WON">WON</option>
                              <option value="LOST">LOST</option>
                            </select>
                          </td>

                          {/* Latest Progress Snippet */}
                          <td className="p-4 max-w-[220px]">
                            {latestNote ? (
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  {latestNote.statusAtUpdate && (
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                        STATUS_CONFIG[latestNote.statusAtUpdate]?.bg || "bg-slate-100"
                                      } ${STATUS_CONFIG[latestNote.statusAtUpdate]?.text || "text-slate-700"}`}
                                    >
                                      {latestNote.statusAtUpdate}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(latestNote.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-700 line-clamp-2 leading-tight">
                                  {latestNote.content}
                                </p>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                No progress notes yet
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => selectLeadForUpdate(lead, true)}
                                className="px-2 py-1 rounded-lg bg-tekhaf-50 hover:bg-tekhaf-100 text-tekhaf-700 font-bold text-[11px] flex items-center gap-1 border border-tekhaf-200 transition-colors"
                                title="Update Contact Progress"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Update</span>
                              </button>

                              <a
                                href={`tel:${lead.phone}`}
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-tekhaf-100 hover:text-tekhaf-800 transition-colors"
                                title="Call Customer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id, lead.fullName)}
                                disabled={deletingLeadId === lead.id}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filteredLeads.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredLeads.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[5, 10, 20, 50]}
                itemName="inquiries"
              />
            )}
          </div>
        </div>

        {/* Lead Detail & Contact Progress Writing Sidebar (5 Cols) */}
        {selectedLead && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-6 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Contacted Client Card
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedLead.fullName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      STATUS_CONFIG[selectedLead.status]?.bg
                    } ${STATUS_CONFIG[selectedLead.status]?.text} ${
                      STATUS_CONFIG[selectedLead.status]?.border
                    }`}
                  >
                    {selectedLead.status}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {selectedLead.region}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100"
                title="Close drawer"
              >
                &times; Close
              </button>
            </div>

            {/* Direct Contact Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex items-center justify-center gap-1.5 bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-sm transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="truncate">Call ({selectedLead.phone})</span>
              </a>
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-sm transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Customer Inquiry Summary */}
            <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Interested Tractor:</span>
                <span className="font-bold text-tekhaf-700">{selectedLead.productTitle || "General Machinery"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Farm Size:</span>
                <span className="font-semibold text-slate-800">
                  {selectedLead.farmSizeHectares ? `${selectedLead.farmSizeHectares} Hectares` : "Not specified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">First Contact:</span>
                <span className="font-mono text-slate-600">
                  {new Date(selectedLead.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Acquisition Channel:</span>
                <span className="text-slate-700 font-medium">{selectedLead.source}</span>
              </div>
              {selectedLead.message && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium block mb-1">Customer Requirements:</span>
                  <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] leading-relaxed">
                    &ldquo;{selectedLead.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* ============================================================== */}
            {/* WRITE CONTACT PROGRESS UPDATE (User Requested Capability)     */}
            {/* ============================================================== */}
            <div className="bg-gradient-to-br from-tekhaf-50/70 to-slate-50 p-4 rounded-2xl border-2 border-tekhaf-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-tekhaf-700" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Write Contact Progress Update
                  </h4>
                </div>
                <span className="text-[10px] text-tekhaf-700 font-bold bg-tekhaf-100/80 px-2 py-0.5 rounded-full">
                  Live Audit Trail
                </span>
              </div>

              <form onSubmit={handleSaveProgressUpdate} className="space-y-3">
                {/* Status Picker for this update */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Contact Progress Status:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        "PENDING",
                        "CONTACTED",
                        "INTERESTED",
                        "NEGOTIATING",
                        "WON",
                        "LOST",
                      ] as const
                    ).map((st) => {
                      const isSel = updateStatus === st;
                      const conf = STATUS_CONFIG[st];
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setUpdateStatus(st)}
                          className={`text-[10px] font-bold py-1.5 px-2 rounded-lg border text-center transition-all ${
                            isSel
                              ? `${conf.bg} ${conf.text} ${conf.border} ring-2 ring-tekhaf-600 shadow-xs font-black scale-[1.02]`
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {st === "PENDING" ? "⏳ PENDING" : st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Presets for fast typing */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">
                    Quick Snippets (Click to insert):
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {QUICK_PROGRESS_SNIPPETS.map((snippet, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setUpdateNote((prev) =>
                            prev ? `${prev}\n${snippet}` : snippet
                          );
                          noteInputRef.current?.focus();
                        }}
                        className="text-[10px] bg-white hover:bg-tekhaf-100 text-slate-700 hover:text-tekhaf-900 px-2 py-1 rounded-md border border-slate-200 transition-colors text-left"
                      >
                        + {snippet.length > 36 ? `${snippet.substring(0, 36)}...` : snippet}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea for note writing */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    What happened during contact:
                  </label>
                  <textarea
                    ref={noteInputRef}
                    rows={3}
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    placeholder="Write contact progress (e.g. 'I have contacted this person, it is pending bank loan approval. Follow up next Tuesday after CBE meeting.')..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tekhaf-600 bg-white shadow-inner"
                  />
                </div>

                {/* Author & Submit Button */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <UserCheck className="w-3.5 h-3.5 text-tekhaf-600" />
                    <span className="font-semibold text-slate-700">Dagim Melese</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingNote || !updateNote.trim()}
                    className="bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submittingNote ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Save Update ({updateStatus})</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* ============================================================== */}
            {/* CONTACT HISTORY TIMELINE (User Requested View & Delete)        */}
            {/* ============================================================== */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <History className="w-4 h-4 text-tekhaf-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Contact History ({selectedLead.notes?.length || 0})
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400">
                  Add & delete past entries
                </span>
              </div>

              {/* Notes Feed */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {!selectedLead.notes || selectedLead.notes.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                    No contact progress logged yet. Use the update writing section above to record your first update.
                  </div>
                ) : (
                  selectedLead.notes.map((note) => {
                    const statusConfig = note.statusAtUpdate
                      ? STATUS_CONFIG[note.statusAtUpdate]
                      : null;

                    return (
                      <div
                        key={note.id}
                        className="p-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs space-y-1.5 shadow-xs transition-all relative group"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-tekhaf-800">
                              {note.author || "Dagim Melese"}
                            </span>
                            {statusConfig && (
                              <span
                                className={`font-bold px-1.5 py-0.2 rounded border text-[9px] ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                              >
                                {note.statusAtUpdate}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              disabled={deletingNoteId === note.id}
                              className="text-slate-300 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                              title="Delete this history entry"
                            >
                              {deletingNoteId === note.id ? (
                                <Loader2 className="w-3 h-3 animate-spin text-rose-600" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[11px]">
                          {note.content}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
