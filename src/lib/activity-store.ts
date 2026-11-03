export interface ActivityLogItem {
  id: string;
  action:
    | "LEAD_RECEIVED"
    | "LEAD_STATUS_CHANGED"
    | "LEAD_NOTE_ADDED"
    | "LEAD_NOTE_DELETED"
    | "LEAD_DELETED"
    | "MEDIA_UPLOADED"
    | "MEDIA_UPDATED"
    | "MEDIA_DELETED"
    | "GALLERY_ITEM_ADDED"
    | "GALLERY_ITEM_UPDATED"
    | "GALLERY_ITEM_DELETED"
    | "LOGO_UPDATED"
    | "PROFILE_UPDATED"
    | "PRODUCT_ADDED"
    | "PRODUCT_UPDATED"
    | "PRODUCT_DELETED"
    | "CATEGORY_ADDED"
    | "CATEGORY_UPDATED"
    | "CATEGORY_DELETED"
    | "TRANSLATION_UPDATED";
  category: "LEADS" | "MEDIA" | "GALLERY" | "BRAND" | "PRODUCTS" | "SYSTEM";
  title: string;
  details: string;
  actor: string;
  timestamp: string;
}

// Initial activity logs for realistic platform history
let inMemoryActivities: ActivityLogItem[] = [
  {
    id: "act-1",
    action: "LEAD_RECEIVED",
    category: "LEADS",
    title: "New Machinery Inquiry: Abebe Girmay",
    details: "Inquired for Massey Ferguson MF 385 (4WD, 85 HP) from Oromia (Arsi - Asella). Requested proforma invoice for 2 units.",
    actor: "Customer (Web Portal)",
    timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
  },
  {
    id: "act-2",
    action: "LEAD_NOTE_ADDED",
    category: "LEADS",
    title: "Internal Note Added: Abebe Girmay",
    details: "Dagim Melese noted: 'Customer is pre-approved for cooperative credit. Called once; will send formal quotation with implement discount.'",
    actor: "Dagim Melese",
    timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: "act-3",
    action: "LOGO_UPDATED",
    category: "BRAND",
    title: "Brand Logo & Favicon Synchronized",
    details: "Default tractor emblem logo synchronized with dynamic SVG favicon across all 5 language routes.",
    actor: "Dagim Melese",
    timestamp: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: "act-4",
    action: "LEAD_STATUS_CHANGED",
    category: "LEADS",
    title: "Lead Status Updated: Taye Dejene",
    details: "Status changed to 'INTERESTED'. Inspection appointment confirmed at Tekhaf Tower, Addis Ababa.",
    actor: "Dagim Melese",
    timestamp: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
  },
  {
    id: "act-5",
    action: "MEDIA_UPLOADED",
    category: "MEDIA",
    title: "Media Asset Added: MF 385 Heavy Plough Angle",
    details: "Uploaded high-resolution JPEG (840 KB) to media library for tractor catalog.",
    actor: "Dagim Melese",
    timestamp: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
  },
  {
    id: "act-6",
    action: "LEAD_STATUS_CHANGED",
    category: "LEADS",
    title: "Deal Closed (WON): Kebede Wolde",
    details: "Status changed to 'WON'. New Holland TT75 unit dispatched to Debre Birhan with technician orientation.",
    actor: "Dagim Melese",
    timestamp: new Date(Date.now() - 3600 * 1000 * 70).toISOString(),
  },
];

export async function getActivityLogs(limit = 100): Promise<ActivityLogItem[]> {
  return inMemoryActivities.slice(0, limit);
}

export async function logActivity(
  action: ActivityLogItem["action"],
  category: ActivityLogItem["category"],
  title: string,
  details: string,
  actor = "Dagim Melese"
): Promise<ActivityLogItem> {
  const newActivity: ActivityLogItem = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action,
    category,
    title,
    details,
    actor,
    timestamp: new Date().toISOString(),
  };

  inMemoryActivities = [newActivity, ...inMemoryActivities];
  return newActivity;
}
