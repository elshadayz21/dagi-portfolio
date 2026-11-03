import { prisma } from "./prisma";
import fs from "fs";
import path from "path";

export interface LeadNoteItem {
  id: string;
  author: string;
  content: string;
  statusAtUpdate?: "NEW" | "CONTACTED" | "PENDING" | "INTERESTED" | "NEGOTIATING" | "WON" | "LOST";
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  region: string;
  farmSizeHectares?: number;
  productTitle?: string;
  message: string;
  status: "NEW" | "CONTACTED" | "PENDING" | "INTERESTED" | "NEGOTIATING" | "WON" | "LOST";
  source: string;
  createdAt: string;
  notes: LeadNoteItem[];
}

const LEADS_FILE_PATH = path.join(process.cwd(), "src", "lib", "data", "leads-state.json");

// Initial demo leads representing Ethiopian farming regions
const defaultInitialLeads: LeadRecord[] = [
  {
    id: "lead-101",
    fullName: "Abebe Girmay",
    email: "abebe.farms@gmail.com",
    phone: "+251911458921",
    region: "Oromia (Arsi - Asella)",
    farmSizeHectares: 45,
    productTitle: "Massey Ferguson MF 385 (4WD, 85 HP)",
    message: "We need 2 units of MF 385 4WD with 4-disc ploughs before the rainy season. Please provide proforma invoice for bank loan application.",
    status: "PENDING",
    source: "Tractor Details Page (/products/massey-ferguson-385-4wd)",
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    notes: [
      {
        id: "note-1",
        author: "Dagim Melese",
        content: "I have contacted this person, it is pending bank loan approval from Awash Bank. Customer requested 5% cooperative implement discount.",
        statusAtUpdate: "PENDING",
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
    ],
  },
  {
    id: "lead-102",
    fullName: "Taye Dejene",
    email: "taye.dejene@yahoo.com",
    phone: "+251922334455",
    region: "Sidama (Hawassa)",
    farmSizeHectares: 25,
    productTitle: "Lovol TB754 Heavy-Duty Tractor (4WD, 75 HP)",
    message: "Interested in the 75 HP Lovol with trailer for maize and coffee farm haulage to Hawassa. Can we inspect the machine in Addis Ababa this Friday?",
    status: "CONTACTED",
    source: "Service Areas (/tractors-sidama)",
    createdAt: new Date(Date.now() - 3600 * 1000 * 14).toISOString(),
    notes: [
      {
        id: "note-2",
        author: "Dagim Melese",
        content: "Spoke with customer by phone. Scheduled machinery yard inspection at Kaliti depot for Friday at 10:00 AM.",
        statusAtUpdate: "CONTACTED",
        createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      },
    ],
  },
  {
    id: "lead-103",
    fullName: "Mukhtar Farah",
    email: "mukhtar.f@somali-agri.org",
    phone: "+251944112233",
    region: "Somali Region (Gode)",
    farmSizeHectares: 120,
    productTitle: "Lovol TD904 Heavy Tractor with A/C Cabin (4WD, 90 HP)",
    message: "Large-scale onion and watermelon irrigation project along Wabe Shebelle. Need 90 HP tractor with air conditioning cabin due to heat.",
    status: "NEGOTIATING",
    source: "Local SEO (/tractors-somali-region)",
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    notes: [
      {
        id: "note-3",
        author: "Dagim Melese",
        content: "Sent formal proforma via WhatsApp. Negotiating flatbed delivery logistics and pre-delivery inspection timeline.",
        statusAtUpdate: "NEGOTIATING",
        createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      },
    ],
  },
  {
    id: "lead-104",
    fullName: "Kebede Wolde",
    email: "kebede.wolde@ethiopianfarms.com",
    phone: "+251912889900",
    region: "Amhara Region (Debre Birhan)",
    farmSizeHectares: 35,
    productTitle: "New Holland TT75 (4WD, 75 HP Turbo)",
    message: "Looking for fuel efficient tractor for barley and wheat. Heard great things about New Holland TT75.",
    status: "WON",
    source: "Homepage Quote Form",
    createdAt: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
    notes: [
      {
        id: "note-4",
        author: "Dagim Melese",
        content: "Deal closed successfully. Full payment cleared. Dispatched tractor with technician to Debre Birhan for field handover.",
        statusAtUpdate: "WON",
        createdAt: new Date(Date.now() - 3600 * 1000 * 70).toISOString(),
      },
    ],
  },
];

function loadPersistedLeads(): LeadRecord[] | null {
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const raw = fs.readFileSync(LEADS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load leads from disk:", err);
  }
  return null;
}

function savePersistedLeads(leads: LeadRecord[]) {
  try {
    const dir = path.dirname(LEADS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save leads to disk:", err);
  }
}

const globalForLeads = globalThis as unknown as {
  inMemoryLeads: LeadRecord[];
};

if (!globalForLeads.inMemoryLeads) {
  const persisted = loadPersistedLeads();
  globalForLeads.inMemoryLeads = persisted || [...defaultInitialLeads];
  if (!persisted) {
    savePersistedLeads(globalForLeads.inMemoryLeads);
  }
}

export async function getAllLeads(): Promise<LeadRecord[]> {
  const persisted = loadPersistedLeads();
  if (persisted && persisted.length > 0) {
    globalForLeads.inMemoryLeads = persisted;
  }

  try {
    const dbLeads = await prisma.lead.findMany({
      include: {
        interestedProduct: true,
        notes: {
          include: {
            author: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbLeads && dbLeads.length > 0) {
      return dbLeads.map((l) => ({
        id: l.id,
        fullName: l.fullName,
        email: l.email || undefined,
        phone: l.phone,
        region: l.region,
        farmSizeHectares: l.farmSizeHectares || undefined,
        productTitle: l.interestedProduct?.title || undefined,
        message: l.message,
        status: l.status as LeadRecord["status"],
        source: l.source,
        createdAt: l.createdAt.toISOString(),
        notes: l.notes.map((n) => ({
          id: n.id,
          author: n.author?.name || "Dagim Melese",
          content: n.content,
          statusAtUpdate: undefined,
          createdAt: n.createdAt.toISOString(),
        })),
      }));
    }
  } catch {
    // If DB is offline, smoothly fallback to disk/memory store
  }

  return globalForLeads.inMemoryLeads;
}

export async function saveNewLead(data: {
  fullName: string;
  email?: string;
  phone: string;
  region: string;
  farmSizeHectares?: number;
  productTitle?: string;
  message: string;
  source?: string;
}): Promise<LeadRecord> {
  const newLead: LeadRecord = {
    id: `lead-${Date.now()}`,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    region: data.region,
    farmSizeHectares: data.farmSizeHectares,
    productTitle: data.productTitle,
    message: data.message,
    status: "NEW",
    source: data.source || "Website Form",
    createdAt: new Date().toISOString(),
    notes: [],
  };

  try {
    const created = await prisma.lead.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        region: data.region,
        farmSizeHectares: data.farmSizeHectares,
        message: data.message,
        source: data.source || "Website Form",
        status: "NEW",
      },
    });
    newLead.id = created.id;
  } catch {
    // Graceful fallback to memory & disk
  }

  globalForLeads.inMemoryLeads = [newLead, ...globalForLeads.inMemoryLeads];
  savePersistedLeads(globalForLeads.inMemoryLeads);
  return newLead;
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadRecord["status"]
): Promise<LeadRecord | null> {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: (newStatus === "PENDING" ? "CONTACTED" : newStatus) as any,
      },
    });
  } catch {
    // Memory fallback
  }

  let updatedLead: LeadRecord | null = null;
  globalForLeads.inMemoryLeads = globalForLeads.inMemoryLeads.map((l) => {
    if (l.id === leadId) {
      updatedLead = { ...l, status: newStatus };
      return updatedLead;
    }
    return l;
  });

  savePersistedLeads(globalForLeads.inMemoryLeads);
  return updatedLead;
}

export async function addLeadNote(
  leadId: string,
  author: string,
  content: string,
  statusAtUpdate?: LeadRecord["status"]
): Promise<{ success: boolean; lead: LeadRecord | null; note: LeadNoteItem }> {
  const noteObj: LeadNoteItem = {
    id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    author: author || "Dagim Melese",
    content,
    statusAtUpdate,
    createdAt: new Date().toISOString(),
  };

  try {
    await prisma.leadNote.create({
      data: {
        leadId,
        content: statusAtUpdate ? `[Status: ${statusAtUpdate}] ${content}` : content,
      },
    });

    if (statusAtUpdate) {
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          status: (statusAtUpdate === "PENDING" ? "CONTACTED" : statusAtUpdate) as any,
        },
      });
    }
  } catch {
    // Memory & disk fallback
  }

  let targetLead: LeadRecord | null = null;
  globalForLeads.inMemoryLeads = globalForLeads.inMemoryLeads.map((l) => {
    if (l.id === leadId) {
      targetLead = {
        ...l,
        status: statusAtUpdate || l.status,
        notes: [noteObj, ...l.notes],
      };
      return targetLead;
    }
    return l;
  });

  savePersistedLeads(globalForLeads.inMemoryLeads);
  return { success: true, lead: targetLead, note: noteObj };
}

export async function deleteLeadNote(
  leadId: string,
  noteId: string
): Promise<{ success: boolean; lead: LeadRecord | null }> {
  try {
    await prisma.leadNote.delete({
      where: { id: noteId },
    });
  } catch {
    // Fallback
  }

  let updatedLead: LeadRecord | null = null;
  globalForLeads.inMemoryLeads = globalForLeads.inMemoryLeads.map((l) => {
    if (l.id === leadId) {
      updatedLead = {
        ...l,
        notes: l.notes.filter((n) => n.id !== noteId),
      };
      return updatedLead;
    }
    return l;
  });

  savePersistedLeads(globalForLeads.inMemoryLeads);
  return { success: true, lead: updatedLead };
}

export async function deleteLead(leadId: string): Promise<boolean> {
  try {
    await prisma.lead.delete({
      where: { id: leadId },
    });
  } catch {
    // Fallback
  }

  const initialLen = globalForLeads.inMemoryLeads.length;
  globalForLeads.inMemoryLeads = globalForLeads.inMemoryLeads.filter((l) => l.id !== leadId);
  const changed = globalForLeads.inMemoryLeads.length < initialLen;
  if (changed) {
    savePersistedLeads(globalForLeads.inMemoryLeads);
  }
  return changed;
}
