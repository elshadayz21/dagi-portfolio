"use client";

import { useState, useEffect, useMemo } from "react";
import { LeadRecord } from "@/lib/leads-store";
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
} from "lucide-react";
import { Pagination } from "@/components/pagination";

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [newNote, setNewNote] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleStatusChange = async (leadId: string, newStatus: LeadRecord["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead.id,
          note: newNote,
          author: "Dagim Melese",
        }),
      });

      if (res.ok) {
        const newNoteObj = {
          id: `note-${Date.now()}`,
          author: "Dagim Melese",
          content: newNote,
          createdAt: new Date().toISOString(),
        };

        const updatedLead = {
          ...selectedLead,
          notes: [newNoteObj, ...selectedLead.notes],
        };

        setSelectedLead(updatedLead);
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? updatedLead : l))
        );
        setNewNote("");
      }
    } catch (err) {
      console.error("Failed to add note", err);
    } finally {
      setSubmittingNote(false);
    }
  };

  // Download Contacted Clients in Excel (.xls)
  const downloadContactedExcel = () => {
    setExportMenuOpen(false);
    const contacted = leads.filter(
      (l) =>
        l.status === "CONTACTED" ||
        l.status === "INTERESTED" ||
        l.status === "NEGOTIATING" ||
        l.status === "WON"
    );

    if (contacted.length === 0) {
      alert("No contacted leads found yet.");
      return;
    }

    const xml = generateExcelWorkbook(contacted, "Contacted Clients");
    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tekhaf_Contacted_Clients_${new Date().toISOString().split("T")[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded ${contacted.length} contacted clients in Excel (.xls)!`);
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
        (lead.productTitle && lead.productTitle.toLowerCase().includes(q));

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Customer Inquiries & Lead Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track inquiries, update sales pipeline status, and maintain private notes per farmer.
          </p>
        </div>

        {/* Excel & CSV Download Actions */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              onClick={downloadContactedExcel}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              title="Download contacted, interested, negotiating and won clients to Excel"
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
                  <span className="font-bold block">Contacted Information (.xls)</span>
                  <span className="text-[10px] text-slate-400">All contacted / active client leads</span>
                </div>
              </button>

              <button
                onClick={downloadAllExcel}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 border-t border-slate-100"
              >
                <FileSpreadsheet className="w-4 h-4 text-tekhaf-600" />
                <div>
                  <span className="font-bold block">All Inquiries (.xls)</span>
                  <span className="text-[10px] text-slate-400">Complete inquiry registry</span>
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
            placeholder="Search by customer name, phone, region, or tractor..."
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
            <option value="NEW">NEW ({leads.filter((l) => l.status === "NEW").length})</option>
            <option value="CONTACTED">CONTACTED ({leads.filter((l) => l.status === "CONTACTED").length})</option>
            <option value="INTERESTED">INTERESTED ({leads.filter((l) => l.status === "INTERESTED").length})</option>
            <option value="NEGOTIATING">NEGOTIATING ({leads.filter((l) => l.status === "NEGOTIATING").length})</option>
            <option value="WON">WON ({leads.filter((l) => l.status === "WON").length})</option>
            <option value="LOST">LOST ({leads.filter((l) => l.status === "LOST").length})</option>
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
            {uniqueRegions.filter((r) => r !== "ALL").map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table & Detail View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leads Table (7 or 12 Cols) */}
        <div className={`${selectedLead ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-tekhaf-700" />
                <span>Loading CRM Inquiries...</span>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No inquiries match your current filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Tractor / Farm</th>
                      <th className="p-4">Region</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedLeads.map((lead) => {
                      const isSelected = selectedLead?.id === lead.id;
                      return (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`hover:bg-tekhaf-50/50 cursor-pointer transition-colors ${
                            isSelected ? "bg-tekhaf-50/80 font-medium" : ""
                          }`}
                        >
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{lead.fullName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{lead.phone}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-tekhaf-700 line-clamp-1">
                              {lead.productTitle || "General Inquiry"}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lead.farmSizeHectares ? `${lead.farmSizeHectares} Ha` : "Size not specified"}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-slate-700">{lead.region}</span>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value as any)
                              }
                              className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                lead.status === "NEW"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : lead.status === "WON"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : lead.status === "NEGOTIATING"
                                  ? "bg-purple-50 text-purple-800 border-purple-300"
                                  : lead.status === "INTERESTED"
                                  ? "bg-indigo-50 text-indigo-800 border-indigo-300"
                                  : lead.status === "CONTACTED"
                                  ? "bg-blue-50 text-blue-800 border-blue-300"
                                  : "bg-slate-100 text-slate-700 border-slate-300"
                              }`}
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="INTERESTED">INTERESTED</option>
                              <option value="NEGOTIATING">NEGOTIATING</option>
                              <option value="WON">WON</option>
                              <option value="LOST">LOST</option>
                            </select>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`tel:${lead.phone}`}
                                className="p-1.5 rounded-lg bg-tekhaf-50 text-tekhaf-700 hover:bg-tekhaf-100"
                                title="Call"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                title="WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
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

        {/* Lead Detail & Private Notes Sidebar (5 Cols) */}
        {selectedLead && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Lead Details
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedLead.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Close &times;
              </button>
            </div>

            {/* Contact Actions */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex items-center justify-center gap-1.5 bg-tekhaf-700 text-white font-bold py-2 px-3 rounded-xl text-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call ({selectedLead.phone})</span>
              </a>
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white font-bold py-2 px-3 rounded-xl text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Info Table */}
            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Interested Tractor:</span>
                <span className="font-bold text-tekhaf-700">{selectedLead.productTitle || "General"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Region:</span>
                <span className="font-semibold text-slate-800">{selectedLead.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Farm Size:</span>
                <span className="font-semibold text-slate-800">
                  {selectedLead.farmSizeHectares ? `${selectedLead.farmSizeHectares} Ha` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Inquiry Date:</span>
                <span className="font-mono text-slate-600">
                  {new Date(selectedLead.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Lead Source:</span>
                <span className="text-slate-600">{selectedLead.source}</span>
              </div>
            </div>

            {/* Customer Message */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-1">Customer Requirements:</h4>
              <p className="text-xs text-slate-600 bg-white border border-slate-200 p-3 rounded-xl leading-relaxed italic">
                &ldquo;{selectedLead.message || "No specific comments provided."}&rdquo;
              </p>
            </div>

            {/* Internal Notes Timeline */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-tekhaf-600" />
                <span>Private Sales & Follow-Up Notes</span>
              </h4>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record customer discussion, proforma sent, bank status..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tekhaf-600"
                />
                <button
                  type="submit"
                  disabled={submittingNote || !newNote.trim()}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              </form>

              {/* Existing Notes Feed */}
              <div className="space-y-2 max-h-48 overflow-y-auto pt-2">
                {selectedLead.notes.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No notes logged yet.</p>
                ) : (
                  selectedLead.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-tekhaf-50/50 border border-tekhaf-100 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-tekhaf-800">{note.author}</span>
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
