import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  type: "PRODUCT" | "MEDIA" | "BOTH";
  description?: string;
  isDefault?: boolean;
  createdAt: string;
}

export const defaultCategories: CategoryItem[] = [
  // Machinery & Equipment Categories
  {
    id: "cat-heavy-4wd",
    name: "Heavy-Duty 4WD Tractors",
    slug: "heavy-duty-4wd-tractors",
    type: "PRODUCT",
    description: "High-horsepower (80 HP+) 4-wheel drive tractors designed for deep ploughing and large commercial grain fields.",
    isDefault: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 30).toISOString(),
  },
  {
    id: "cat-utility-medium",
    name: "Utility & Medium Tractors",
    slug: "utility-medium-tractors",
    type: "PRODUCT",
    description: "Balanced 65-75 HP tractors engineered for multipurpose cultivation, planting, harrowing, and trailer transport.",
    isDefault: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 28).toISOString(),
  },
  {
    id: "cat-row-crop-cabin",
    name: "Deluxe Cabin & Row-Crop Tractors",
    slug: "deluxe-cabin-row-crop-tractors",
    type: "PRODUCT",
    description: "Enclosed air-conditioned cabin tractors for dust-free heavy fieldwork in lowland, sugarcane, and wheat regions.",
    isDefault: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 25).toISOString(),
  },
  {
    id: "cat-implements-plows",
    name: "Implements, Disc Ploughs & Harvesters",
    slug: "implements-disc-ploughs-harvesters",
    type: "BOTH",
    description: "Heavy-duty 3-disc and 4-disc ploughs, rotary tillers, seed drills, balers, and threshing attachments.",
    isDefault: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 22).toISOString(),
  },
  {
    id: "cat-spare-parts",
    name: "Genuine Spare Parts & Powertrain",
    slug: "genuine-spare-parts-powertrain",
    type: "BOTH",
    description: "Factory Perkins filters, hydraulic pumps, clutches, PTO shafts, and authentic manufacturer components.",
    isDefault: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 20).toISOString(),
  },

  // Media Asset Categories
  {
    id: "cat-media-tractors",
    name: "Tractors",
    slug: "tractors",
    type: "MEDIA",
    description: "Field and studio imagery of tractor machinery, cabins, and operational demonstrations.",
    isDefault: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 18).toISOString(),
  },
  {
    id: "cat-media-showroom",
    name: "Showroom & Yard",
    slug: "showroom-yard",
    type: "MEDIA",
    description: "Photos of Tekhaf central showroom, Kaliti machinery yard, and spare parts depot.",
    isDefault: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 15).toISOString(),
  },
  {
    id: "cat-media-branding",
    name: "Branding & Logos",
    slug: "branding-logos",
    type: "MEDIA",
    description: "Brand emblems, vector tractor badges, partner logos, and official certification graphics.",
    isDefault: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 12).toISOString(),
  },
  {
    id: "cat-media-brochures",
    name: "Brochures & Specs",
    slug: "brochures-specs",
    type: "MEDIA",
    description: "Technical datasheets, machinery brochures, and official quotation documents.",
    isDefault: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 10).toISOString(),
  },
  {
    id: "cat-media-handover",
    name: "Field Deliveries & Handover",
    slug: "field-deliveries-handover",
    type: "MEDIA",
    description: "On-farm machinery delivery and customer training photos across Ethiopian farming cooperatives.",
    isDefault: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 5).toISOString(),
  },
];

const CATEGORIES_FILE_PATH = path.join(process.cwd(), "src", "lib", "data", "categories-state.json");

function loadPersistedCategories(): CategoryItem[] | null {
  try {
    if (fs.existsSync(CATEGORIES_FILE_PATH)) {
      const raw = fs.readFileSync(CATEGORIES_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return null;
}

function savePersistedCategories(categories: CategoryItem[]) {
  try {
    const dir = path.dirname(CATEGORIES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify(categories, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save categories to disk:", err);
  }
}

const globalForCategories = globalThis as unknown as {
  inMemoryCategories: CategoryItem[];
};

if (!globalForCategories.inMemoryCategories) {
  const persisted = loadPersistedCategories();
  globalForCategories.inMemoryCategories = persisted || [...defaultCategories];
}

let dbAvailable: boolean | null = null;
let lastDbCheck = 0;

async function canQueryDb(): Promise<boolean> {
  const now = Date.now();
  if (dbAvailable === false && now - lastDbCheck < 60000) {
    return false;
  }
  try {
    lastDbCheck = now;
    await prisma.$queryRaw`SELECT 1`;
    dbAvailable = true;
    return true;
  } catch {
    dbAvailable = false;
    return false;
  }
}

export function slugifyCategory(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getCategories(
  typeFilter?: "PRODUCT" | "MEDIA" | "BOTH" | "ALL"
): Promise<CategoryItem[]> {
  const list = globalForCategories.inMemoryCategories;

  if (!typeFilter || typeFilter === "ALL") {
    return list;
  }

  if (typeFilter === "PRODUCT") {
    return list.filter((c) => c.type === "PRODUCT" || c.type === "BOTH");
  }

  if (typeFilter === "MEDIA") {
    return list.filter((c) => c.type === "MEDIA" || c.type === "BOTH");
  }

  return list.filter((c) => c.type === typeFilter);
}

export async function addCategory(data: {
  name: string;
  slug?: string;
  type?: "PRODUCT" | "MEDIA" | "BOTH";
  description?: string;
}): Promise<CategoryItem> {
  const cleanName = data.name.trim();
  const rawSlug = data.slug?.trim() || slugifyCategory(cleanName);

  // Ensure unique slug
  let slug = rawSlug;
  let counter = 1;
  while (globalForCategories.inMemoryCategories.some((c) => c.slug === slug)) {
    slug = `${rawSlug}-${counter++}`;
  }

  const newCategory: CategoryItem = {
    id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    slug,
    type: data.type || "BOTH",
    description: data.description?.trim() || "",
    isDefault: false,
    createdAt: new Date().toISOString(),
  };

  globalForCategories.inMemoryCategories = [newCategory, ...globalForCategories.inMemoryCategories];
  savePersistedCategories(globalForCategories.inMemoryCategories);

  // Sync to Prisma DB if available
  try {
    if (await canQueryDb()) {
      await prisma.category.create({
        data: {
          id: newCategory.id,
          name: newCategory.name,
          slug: newCategory.slug,
          description: newCategory.description,
        },
      });
    }
  } catch {
    // Non-blocking in-memory fallback
  }

  return newCategory;
}

export async function updateCategory(
  id: string,
  updates: Partial<Pick<CategoryItem, "name" | "slug" | "type" | "description">>
): Promise<CategoryItem | null> {
  const idx = globalForCategories.inMemoryCategories.findIndex((c) => c.id === id);
  if (idx < 0) return null;

  const current = globalForCategories.inMemoryCategories[idx];
  const updated: CategoryItem = {
    ...current,
    name: updates.name ? updates.name.trim() : current.name,
    slug: updates.slug ? slugifyCategory(updates.slug) : current.slug,
    type: updates.type || current.type,
    description: updates.description !== undefined ? updates.description.trim() : current.description,
  };

  globalForCategories.inMemoryCategories[idx] = updated;
  savePersistedCategories(globalForCategories.inMemoryCategories);

  try {
    if (await canQueryDb()) {
      await prisma.category.update({
        where: { id },
        data: {
          name: updated.name,
          slug: updated.slug,
          description: updated.description,
        },
      });
    }
  } catch {
    // Non-blocking
  }

  return updated;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const exists = globalForCategories.inMemoryCategories.some((c) => c.id === id);
  if (!exists) return false;

  globalForCategories.inMemoryCategories = globalForCategories.inMemoryCategories.filter(
    (c) => c.id !== id
  );
  savePersistedCategories(globalForCategories.inMemoryCategories);

  try {
    if (await canQueryDb()) {
      await prisma.category.delete({
        where: { id },
      });
    }
  } catch {
    // Non-blocking
  }

  return true;
}
