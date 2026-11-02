import { tractorInventory } from "./data/inventory";

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  format: string;
  size: string;
  category: "Tractors" | "Implements" | "Showroom" | "Branding" | "Brochures";
  createdAt: string;
}

let inMemoryMedia: MediaAsset[] = [
  ...tractorInventory.flatMap((t, i) => [
    {
      id: `media-tractor-${t.id}-main`,
      title: `${t.title} - Main Studio View`,
      url: t.image,
      format: "JPEG",
      size: "820 KB",
      category: "Tractors" as const,
      createdAt: new Date(Date.now() - 3600 * 1000 * 24 * (i + 1)).toISOString(),
    },
    ...t.gallery.map((g, gi) => ({
      id: `media-tractor-${t.id}-gal-${gi}`,
      title: `${t.title} - Operational Field View ${gi + 1}`,
      url: g,
      format: "JPEG",
      size: "640 KB",
      category: "Tractors" as const,
      createdAt: new Date(Date.now() - 3600 * 1000 * 24 * (i + 1) + gi * 3600000).toISOString(),
    })),
  ]),
  {
    id: "media-brand-logo-emblem",
    title: "Official Dagim Melese Tractor Emblem (Blue)",
    url: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=600&q=80",
    format: "PNG",
    size: "120 KB",
    category: "Branding" as const,
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    id: "media-showroom-addis",
    title: "Tekhaf Trading Showroom & Parts Facility Addis Ababa",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    format: "JPEG",
    size: "1.4 MB",
    category: "Showroom" as const,
    createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
  },
];

export async function getMediaAssets(): Promise<MediaAsset[]> {
  return inMemoryMedia;
}

export async function addMediaAsset(
  item: Omit<MediaAsset, "id" | "createdAt">
): Promise<MediaAsset> {
  const newAsset: MediaAsset = {
    ...item,
    id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  inMemoryMedia = [newAsset, ...inMemoryMedia];
  return newAsset;
}

export async function updateMediaAsset(
  id: string,
  updates: Partial<Omit<MediaAsset, "id" | "createdAt">>
): Promise<MediaAsset | null> {
  const index = inMemoryMedia.findIndex((m) => m.id === id);
  if (index === -1) return null;

  inMemoryMedia[index] = {
    ...inMemoryMedia[index],
    ...updates,
  };

  return inMemoryMedia[index];
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
  const initialLen = inMemoryMedia.length;
  inMemoryMedia = inMemoryMedia.filter((m) => m.id !== id);
  return inMemoryMedia.length < initialLen;
}
