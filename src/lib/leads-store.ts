import { prisma } from "./prisma";

export interface LeadRecord {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  region: string;
  farmSizeHectares?: number;
  productTitle?: string;
  message: string;
  status: "NEW" | "CONTACTED" | "INTERESTED" | "NEGOTIATING" | "WON" | "LOST";
  source: string;
  createdAt: string;
  notes: { id: string; author: string; content: string; createdAt: string }[];
}

// Initial demo leads representing Ethiopian regions
let initialInMemoryLeads: LeadRecord[] = [
  {
    id: "lead-101",
    fullName: "Abebe Girmay",
    email: "abebe.farms@gmail.com",
    phone: "+251911458921",
    region: "Oromia (Arsi - Asella)",
    farmSizeHectares: 45,
    productTitle: "Massey Ferguson MF 385 (4WD, 85 HP)",
    message: "We need 2 units of MF 385 4WD with 4-disc ploughs before the rainy season. Please provide proforma invoice for bank loan application.",
    status: "NEW",
    source: "Tractor Details Page (/products/massey-ferguson-385-4wd)",
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    notes: [
      {
        id: "note-1",
        author: "Dagim Melese",
        content: "Customer is pre-approved for cooperative credit. Called once; will send formal quotation with implement discount.",
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
    status: "INTERESTED",
    source: "Service Areas (/tractors-sidama)",
    createdAt: new Date(Date.now() - 3600 * 1000 * 14).toISOString(),
    notes: [
      {
        id: "note-2",
        author: "Dagim Melese",
        content: "Scheduled showroom appointment at Tekhaf Tower for Friday 10:00 AM.",
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
        content: "Discussing duty-free customs clearance and direct flatbed transport to Gode.",
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
        content: "Full payment received. Unit dispatched to Debre Birhan with technician for operator training.",
        createdAt: new Date(Date.now() - 3600 * 1000 * 70).toISOString(),
      },
    ],
  },
];

export async function getAllLeads(): Promise<LeadRecord[]> {
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
          createdAt: n.createdAt.toISOString(),
        })),
      }));
    }
  } catch (err) {
    // If DB is offline, smoothly fallback to memory store
    // console.warn("[DB Fallback] Using memory leads store");
  }

  return initialInMemoryLeads;
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
  } catch (err) {
    // Graceful fallback to memory
  }

  initialInMemoryLeads = [newLead, ...initialInMemoryLeads];
  return newLead;
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadRecord["status"]
): Promise<boolean> {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: newStatus as any },
    });
  } catch (err) {
    // Memory fallback
  }

  initialInMemoryLeads = initialInMemoryLeads.map((l) =>
    l.id === leadId ? { ...l, status: newStatus } : l
  );
  return true;
}

export async function addLeadNote(
  leadId: string,
  author: string,
  content: string
): Promise<boolean> {
  const noteObj = {
    id: `note-${Date.now()}`,
    author,
    content,
    createdAt: new Date().toISOString(),
  };

  try {
    await prisma.leadNote.create({
      data: {
        leadId,
        content,
      },
    });
  } catch (err) {
    // Memory fallback
  }

  initialInMemoryLeads = initialInMemoryLeads.map((l) =>
    l.id === leadId ? { ...l, notes: [noteObj, ...l.notes] } : l
  );
  return true;
}
