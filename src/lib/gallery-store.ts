import fs from "fs";
import path from "path";

export type GalleryMediaType = "IMAGE" | "VIDEO";
export type GalleryCategory =
  | "FIELD_WORK"
  | "DELIVERY"
  | "TRAINING"
  | "HARVEST"
  | "MAINTENANCE";

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  type: GalleryMediaType;
  mediaUrl: string; // Image URL / base64 or video URL (mp4 / YouTube embed / Vimeo)
  thumbnailUrl?: string; // Poster or thumbnail
  location: string; // e.g. "Arsi - Asella, Oromia"
  farmerName?: string; // e.g. "Ato Abebe Girmay & Union Members"
  tractorModel?: string; // e.g. "Deutz-Fahr 120HP 4WD"
  category: GalleryCategory;
  featured?: boolean;
  createdAt: string;
}

const GALLERY_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "lib",
  "data",
  "gallery-state.json"
);

const defaultInitialGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Massey Ferguson 385 4WD Land Preparation in Bale Robe",
    description:
      "Deep soil disc plowing across wheat farmland in Bale highlands. The 85HP engine demonstrates exceptional traction and low fuel consumption in heavy clay soil.",
    type: "IMAGE",
    mediaUrl:
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80",
    location: "Bale Robe, Oromia",
    farmerName: "Ato Tadesse & Robe Cooperative Union",
    tractorModel: "Massey Ferguson MF 385 (4WD, 85 HP)",
    category: "FIELD_WORK",
    featured: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 3).toISOString(),
  },
  {
    id: "gal-2",
    title: "Deutz-Fahr 120HP Commercial Tillage & Reversible Plough Demonstration",
    description:
      "Field demonstration in Asella showcasing 4-disc reversible ploughing. Farmers evaluated turning radius, hydraulic responsiveness, and draft control.",
    type: "VIDEO",
    mediaUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    location: "Asella, Arsi Zone",
    farmerName: "Tekhaf Field Demonstrations Team & Arsi Farmers",
    tractorModel: "Deutz-Fahr Agrofarm 115G / 120HP",
    category: "FIELD_WORK",
    featured: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 5).toISOString(),
  },
  {
    id: "gal-3",
    title: "Official Machinery Handover & Union Inspection Ceremony",
    description:
      "Dagim Melese presiding over pre-delivery inspection and formal key handover to agricultural union representatives with full toolkits and warranties.",
    type: "IMAGE",
    mediaUrl:
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80",
    location: "Kaliti Machinery Depot, Addis Ababa",
    farmerName: "Oromia & Sidama Cooperative Union Delegations",
    tractorModel: "Lovol TB754 (75 HP 4WD)",
    category: "DELIVERY",
    featured: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 8).toISOString(),
  },
  {
    id: "gal-4",
    title: "Wheat & Teff Combine Harvesting Operations in Gojjam",
    description:
      "Seasonal wheat harvesting in East Gojjam with high threshing efficiency, minimal seed loss, and high grain tank capacity.",
    type: "IMAGE",
    mediaUrl:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    location: "Debre Markos, East Gojjam",
    farmerName: "Ato Mengistu Worku & Family",
    tractorModel: "Tekhaf Grain Harvester 140HP",
    category: "HARVEST",
    featured: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 12).toISOString(),
  },
  {
    id: "gal-5",
    title: "Operator Training on 3-Point Hitch Balancing & Implement Coupling",
    description:
      "Hands-on technical workshop for tractor drivers on hydraulic pressure adjustment, PTO safety, and regular preventive maintenance routines.",
    type: "VIDEO",
    mediaUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=1200&q=80",
    location: "Hawassa Liaison Center, Sidama",
    farmerName: "Southern Cooperative Drivers Group",
    tractorModel: "Massey Ferguson MF 375 (75 HP)",
    category: "TRAINING",
    featured: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 15).toISOString(),
  },
  {
    id: "gal-6",
    title: "Commercial Maize Field Cultivation with Tekhaf Heavy Disc Harrow",
    description:
      "Inter-row cultivation and seedbed preparation in Bako agricultural corridor using 24-disc trailing heavy harrow for maximum aeration.",
    type: "IMAGE",
    mediaUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
    location: "Bako, West Shewa",
    farmerName: "Bako Research Extension Farmers",
    tractorModel: "Lovol TB754 & Tekhaf 24-Disc Harrow",
    category: "FIELD_WORK",
    featured: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 20).toISOString(),
  },
];

function loadPersistedGallery(): GalleryItem[] | null {
  try {
    if (fs.existsSync(GALLERY_FILE_PATH)) {
      const raw = fs.readFileSync(GALLERY_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load persisted gallery:", err);
  }
  return null;
}

function savePersistedGallery(items: GalleryItem[]) {
  try {
    const dir = path.dirname(GALLERY_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(GALLERY_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save gallery to disk:", err);
  }
}

const globalForGallery = globalThis as unknown as {
  inMemoryGallery: GalleryItem[];
};

if (!globalForGallery.inMemoryGallery) {
  const persisted = loadPersistedGallery();
  globalForGallery.inMemoryGallery = persisted || [...defaultInitialGallery];
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const persisted = loadPersistedGallery();
  if (persisted && persisted.length > 0) {
    globalForGallery.inMemoryGallery = persisted;
  }
  return globalForGallery.inMemoryGallery;
}

export async function addGalleryItem(
  data: Omit<GalleryItem, "id" | "createdAt">
): Promise<GalleryItem> {
  const newItem: GalleryItem = {
    ...data,
    id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  globalForGallery.inMemoryGallery = [
    newItem,
    ...globalForGallery.inMemoryGallery,
  ];
  savePersistedGallery(globalForGallery.inMemoryGallery);
  return newItem;
}

export async function updateGalleryItem(
  id: string,
  updates: Partial<Omit<GalleryItem, "id" | "createdAt">>
): Promise<GalleryItem | null> {
  let updated: GalleryItem | null = null;
  globalForGallery.inMemoryGallery = globalForGallery.inMemoryGallery.map(
    (item) => {
      if (item.id === id) {
        updated = { ...item, ...updates };
        return updated;
      }
      return item;
    }
  );

  if (updated) {
    savePersistedGallery(globalForGallery.inMemoryGallery);
  }
  return updated;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const initialLen = globalForGallery.inMemoryGallery.length;
  globalForGallery.inMemoryGallery = globalForGallery.inMemoryGallery.filter(
    (item) => item.id !== id
  );
  const changed = globalForGallery.inMemoryGallery.length < initialLen;
  if (changed) {
    savePersistedGallery(globalForGallery.inMemoryGallery);
  }
  return changed;
}
