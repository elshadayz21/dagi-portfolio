import fs from "fs";
import path from "path";
import { tractorInventory } from "./data/inventory";

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  format: string;
  size: string;
  category: string;
  createdAt: string;
}

const MEDIA_FILE_PATH = path.join(process.cwd(), "src", "lib", "data", "media-state.json");

const initialDefaultMedia: MediaAsset[] = [
  ...tractorInventory.flatMap((t, i) => [
    {
      id: `media-tractor-${t.id}-main`,
      title: `${t.title} - Main Studio View`,
      url: t.image,
      format: "JPEG",
      size: "820 KB",
      category: "Tractors",
      createdAt: new Date(Date.now() - 3600 * 1000 * 24 * (i + 1)).toISOString(),
    },
    ...t.gallery.map((g, gi) => ({
      id: `media-tractor-${t.id}-gal-${gi}`,
      title: `${t.title} - Operational Field View ${gi + 1}`,
      url: g,
      format: "JPEG",
      size: "640 KB",
      category: "Tractors",
      createdAt: new Date(Date.now() - 3600 * 1000 * 24 * (i + 1) + gi * 3600000).toISOString(),
    })),
  ]),
  {
    id: "media-brand-logo-emblem",
    title: "Official Dagim Melese Tractor Emblem (Blue)",
    url: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=600&q=80",
    format: "PNG",
    size: "120 KB",
    category: "Branding",
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    id: "media-showroom-addis",
    title: "Tekhaf Trading Showroom & Parts Facility Addis Ababa",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    format: "JPEG",
    size: "1.4 MB",
    category: "Showroom",
    createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
  },
];

function loadPersistedMedia(): MediaAsset[] | null {
  try {
    if (fs.existsSync(MEDIA_FILE_PATH)) {
      const raw = fs.readFileSync(MEDIA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load persisted media:", err);
  }
  return null;
}

function savePersistedMedia(media: MediaAsset[]) {
  try {
    const dir = path.dirname(MEDIA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MEDIA_FILE_PATH, JSON.stringify(media, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save media to disk:", err);
  }
}

const globalForMedia = globalThis as unknown as {
  inMemoryMedia: MediaAsset[];
};

if (!globalForMedia.inMemoryMedia) {
  const persisted = loadPersistedMedia();
  globalForMedia.inMemoryMedia = persisted || [...initialDefaultMedia];
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const persisted = loadPersistedMedia();
  if (persisted && persisted.length > 0) {
    globalForMedia.inMemoryMedia = persisted;
  } else if (!globalForMedia.inMemoryMedia || globalForMedia.inMemoryMedia.length === 0) {
    globalForMedia.inMemoryMedia = [...initialDefaultMedia];
  }
  return globalForMedia.inMemoryMedia;
}

export async function addMediaAsset(
  item: Omit<MediaAsset, "id" | "createdAt">
): Promise<MediaAsset> {
  const newAsset: MediaAsset = {
    ...item,
    id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  globalForMedia.inMemoryMedia = [newAsset, ...globalForMedia.inMemoryMedia];
  savePersistedMedia(globalForMedia.inMemoryMedia);

  return newAsset;
}

export async function updateMediaAsset(
  id: string,
  updates: Partial<Omit<MediaAsset, "id" | "createdAt">>
): Promise<MediaAsset | null> {
  const list = globalForMedia.inMemoryMedia;
  const index = list.findIndex((m) => m.id === id);
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    ...updates,
  };

  savePersistedMedia(globalForMedia.inMemoryMedia);

  return list[index];
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
  const list = globalForMedia.inMemoryMedia;
  const initialLen = list.length;
  globalForMedia.inMemoryMedia = list.filter((m) => m.id !== id);
  const changed = globalForMedia.inMemoryMedia.length < initialLen;

  if (changed) {
    savePersistedMedia(globalForMedia.inMemoryMedia);
  }

  return changed;
}
