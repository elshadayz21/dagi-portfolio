import fs from "fs";
import path from "path";

export interface LocationItem {
  id: string;
  name: string;
  region: string;
  regionName?: string;
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  farmingContext: string;
  recommendedHorsepower: string;
  popularTractors: string[];
  hubOffice: string;
  phone: string;
  active: boolean;
  order: number;
  createdAt: string;
}

export const defaultLocations: LocationItem[] = [
  {
    id: "loc-adama",
    name: "Adama",
    region: "Oromia",
    slug: "tractors-adama",
    title: "Tractor Sales & Implement Center in Adama (Nazret)",
    subtitle: "Central Oromia Grain Hub, Wonji Sugar Belt & Fast Implement Supply",
    heroImage: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80",
    description: "Adama serves as the central transport and agricultural gateway connecting East Shewa, Arsi, and the Awash River basin. Tekhaf Trading provides high-torque 4WD tractors, disc ploughs, and rapid maintenance teams dispatched from the expressway corridor.",
    farmingContext: "High-yield maize, teff, sugarcane, haricot bean, and commercial irrigated vegetable farming requiring reliable 4-disc tillage.",
    recommendedHorsepower: "75 HP to 95 HP 4WD",
    popularTractors: ["Massey Ferguson MF 385 4WD", "Lovol TB754 4WD", "Massey Ferguson MF 375"],
    hubOffice: "Adama Expressway Corridor, Wonji Road Junction",
    phone: "+251 91 123 4567",
    active: true,
    order: 1,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 14).toISOString(),
  },
  {
    id: "loc-bishoftu",
    name: "Bishoftu",
    region: "Oromia",
    slug: "tractors-bishoftu",
    title: "Farm Tractors & Horticulture Machinery in Bishoftu (Debre Zeit)",
    subtitle: "Modern Agri-business, Feed Mills & Intensive Teff-Wheat Cultivation",
    heroImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    description: "Located 45 km southeast of Addis Ababa, Bishoftu is a premier commercial farming district. Dagim Melese advises commercial farmers, poultry feed producers, and cooperative unions on compact and medium-duty tractor acquisitions.",
    farmingContext: "Intensive teff, wheat, dairy fodder, and greenhouse horticulture requiring versatile PTO-driven rotary tillers and precision seeders.",
    recommendedHorsepower: "65 HP to 85 HP",
    popularTractors: ["Lovol TB754 4WD", "Massey Ferguson MF 375 (75 HP)"],
    hubOffice: "Old Toll Gate Commercial Zone, Bishoftu",
    phone: "+251 91 123 4567",
    active: true,
    order: 2,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 12).toISOString(),
  },
  {
    id: "loc-bahir-dar",
    name: "Bahir Dar",
    region: "Amhara",
    slug: "tractors-bahir-dar",
    title: "Agricultural Equipment & Tractors in Bahir Dar & Lake Tana Basin",
    subtitle: "Serving West Gojjam, Fogera Plains Rice, and Maize Cooperatives",
    heroImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    description: "Bahir Dar anchors the agricultural mechanization of Northwest Ethiopia. From the rich vertisols of West Gojjam to the Fogera rice plains, Tekhaf Trading delivers tractors fitted with paddy-tread and heavy tillage implements.",
    farmingContext: "Commercial rice harvesting, teff, maize, niger seed, and Gojjam highland wheat needing heavy-duty disc harrows and PTO threshers.",
    recommendedHorsepower: "85 HP to 110 HP 4WD",
    popularTractors: ["Massey Ferguson MF 385 4WD", "Lovol TD904 A/C Cabin", "New Holland TT75"],
    hubOffice: "Felege Hiwot Commercial Strip, Bahir Dar",
    phone: "+251 91 123 4567",
    active: true,
    order: 3,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 10).toISOString(),
  },
  {
    id: "loc-mekele",
    name: "Mekele",
    region: "Tigray",
    slug: "tractors-mekele",
    title: "Tractor Sales & Agricultural Restoration Hub in Mekele",
    subtitle: "Heavy Machinery for Raya Valley, Enderta Highlands & Western Lowlands",
    heroImage: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80",
    description: "Supporting agricultural revival across the fertile Raya Valley and highland commercial farms. Tekhaf Trading provides genuine Perkins-powered tractors with heavy-duty cooling packages and genuine spare parts availability.",
    farmingContext: "Raya valley sorghum, sesame, teff, onion, and highland irrigation requiring rugged mechanical reliability and dust-sealed air filters.",
    recommendedHorsepower: "75 HP to 90 HP",
    popularTractors: ["Massey Ferguson MF 385 4WD", "Lovol TB754 4WD"],
    hubOffice: "Adi Haki Commercial District, Mekele",
    phone: "+251 91 123 4567",
    active: true,
    order: 4,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 8).toISOString(),
  },
  {
    id: "loc-addis-ababa",
    name: "Addis Ababa",
    region: "Addis Ababa",
    slug: "tractors-addis-ababa",
    title: "Tractor Sales & Central Hub in Addis Ababa",
    subtitle: "Tekhaf Trading Central Showroom, Kaliti Yard & Rapid Spare Parts Depot",
    heroImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    description: "Located at Bole Medhanialem in Addis Ababa, Tekhaf Trading serves as Ethiopia's central agricultural machinery headquarters with pre-delivery inspection facilities in Kaliti.",
    farmingContext: "Central dispatch, peri-urban horticulture, contracting fleet management, and nationwide duty-free documentation assistance.",
    recommendedHorsepower: "75 HP to 120 HP (Full Range)",
    popularTractors: ["Massey Ferguson MF 385 4WD", "Lovol TB754 4WD", "New Holland TT75"],
    hubOffice: "Tekhaf Tower, Bole Medhanialem, Addis Ababa",
    phone: "+251 91 123 4567",
    active: true,
    order: 5,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 30).toISOString(),
  },
  {
    id: "loc-oromia",
    name: "Arsi & Bale",
    region: "Oromia",
    slug: "tractors-oromia",
    title: "Heavy-Duty Tractors for Arsi & Bale Wheat Belts",
    subtitle: "Serving Asella, Robe, Dodola, and Shashemene Farming Unions",
    heroImage: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80",
    description: "Oromia's southeastern highlands are Ethiopia's premier cereal grain centers. Heavy clay vertisols require dependable 4WD traction, disc ploughs, and seasonal harvest balers.",
    farmingContext: "Large-scale commercial wheat, barley, canola, and teff production requiring multi-unit tractor fleets and rapid on-farm technician deployment.",
    recommendedHorsepower: "85 HP to 120 HP 4WD",
    popularTractors: ["Massey Ferguson MF 385 4WD", "Lovol TD904 A/C", "Massey Ferguson MF 375"],
    hubOffice: "Service coverage from Asella & Robe regional liaison",
    phone: "+251 91 123 4567",
    active: true,
    order: 6,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 28).toISOString(),
  },
  {
    id: "loc-sidama",
    name: "Hawassa & Sidama",
    region: "Sidama",
    slug: "tractors-sidama",
    title: "Tractors & Farm Machinery in Sidama & Hawassa",
    subtitle: "Equipment for Coffee, Maize, Vegetable, and Enset Belts",
    heroImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    description: "Sidama's fertile volcanic soil and productive cooperatives rely on maneuverable 75 HP utility tractors for inter-row tilling, market transport, and union processing facilities.",
    farmingContext: "Coffee agroforestry, maize cultivation, horticulture near Lake Hawassa, and produce haulage trailers.",
    recommendedHorsepower: "75 HP Utility 4WD",
    popularTractors: ["Lovol TB754 4WD", "Massey Ferguson MF 375", "New Holland TT75"],
    hubOffice: "Hawassa City Center Commercial Zone",
    phone: "+251 91 123 4567",
    active: true,
    order: 7,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 25).toISOString(),
  },
  {
    id: "loc-somali-region",
    name: "Somali & Dire Dawa",
    region: "Somali Region",
    slug: "tractors-somali-region",
    title: "Tractors for Eastern Ethiopia & Wabe Shebelle Irrigation",
    subtitle: "High-Capacity Radiators & Dust-Proof Machinery for Hot Climate Cultivation",
    heroImage: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80",
    description: "Agricultural development along eastern river basins requires tractors engineered for high ambient temperatures, reinforced air intake filters, and air-conditioned operator cabins.",
    farmingContext: "Commercial river basin irrigation, sesame, wheat, onion, and forage farming under intense sunlight.",
    recommendedHorsepower: "85 HP to 110 HP A/C Cabin",
    popularTractors: ["Lovol TD904 A/C Cabin", "Massey Ferguson MF 385 4WD"],
    hubOffice: "Dire Dawa & Jigjiga Regional Coordination",
    phone: "+251 91 123 4567",
    active: true,
    order: 8,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 20).toISOString(),
  },
  {
    id: "loc-all-ethiopia",
    name: "Nationwide Deliveries",
    region: "All-Ethiopia",
    slug: "agricultural-equipment-ethiopia",
    title: "Ethiopia-Wide Machinery Delivery & Duty-Free Clearance",
    subtitle: "Serving Commercial Farms, Unions & Investors in All 12 Regions",
    heroImage: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=1200&q=80",
    description: "Nationwide dispatch covering Afar, Benishangul-Gumuz, Gambella, South West, and Central Ethiopia with duty-free agricultural documentation advisory.",
    farmingContext: "Primary tillage, secondary tillage, disc harrows, precision planting, spraying, and grain harvesting.",
    recommendedHorsepower: "Complete 50 HP to 130 HP Range",
    popularTractors: ["Massey Ferguson MF 385 4WD", "Lovol TB754", "John Deere 5075E"],
    hubOffice: "Addis Ababa Central Depot with On-Farm Flatbed Transport",
    phone: "+251 91 123 4567",
    active: true,
    order: 9,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 35).toISOString(),
  },
];

const LOCATIONS_FILE_PATH = path.join(process.cwd(), "src", "lib", "data", "locations-state.json");

function loadPersistedLocations(): LocationItem[] | null {
  try {
    if (fs.existsSync(LOCATIONS_FILE_PATH)) {
      const raw = fs.readFileSync(LOCATIONS_FILE_PATH, "utf-8");
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

function savePersistedLocations(locations: LocationItem[]) {
  try {
    const dir = path.dirname(LOCATIONS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCATIONS_FILE_PATH, JSON.stringify(locations, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save locations to disk:", err);
  }
}

const globalForLocations = globalThis as unknown as {
  inMemoryLocations: LocationItem[];
};

if (!globalForLocations.inMemoryLocations) {
  const persisted = loadPersistedLocations();
  globalForLocations.inMemoryLocations = persisted || [...defaultLocations];
  if (!persisted) {
    savePersistedLocations(globalForLocations.inMemoryLocations);
  }
}

export function slugifyLocation(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.startsWith("tractors-") ? base : `tractors-${base}`;
}

export async function getAllLocations(onlyActive = true): Promise<LocationItem[]> {
  const persisted = loadPersistedLocations();
  if (persisted && persisted.length > 0) {
    globalForLocations.inMemoryLocations = persisted;
  }
  const list = globalForLocations.inMemoryLocations;
  const filtered = onlyActive ? list.filter((l) => l.active) : list;
  return [...filtered]
    .map((l) => ({
      ...l,
      regionName: l.regionName || `${l.name} (${l.region})`,
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getLocationById(id: string): Promise<LocationItem | null> {
  const list = await getAllLocations(false);
  return list.find((l) => l.id === id) || null;
}

export async function getLocationBySlug(slug: string): Promise<LocationItem | null> {
  const list = await getAllLocations(false);
  return list.find((l) => l.slug === slug) || null;
}

export async function addLocation(data: {
  name: string;
  region: string;
  slug?: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  description: string;
  farmingContext?: string;
  recommendedHorsepower?: string;
  popularTractors?: string[];
  hubOffice?: string;
  phone?: string;
  active?: boolean;
}): Promise<LocationItem> {
  const cleanName = data.name.trim();
  const rawSlug = data.slug?.trim() || slugifyLocation(cleanName);

  let slug = rawSlug;
  let counter = 1;
  while (globalForLocations.inMemoryLocations.some((l) => l.slug === slug)) {
    slug = `${rawSlug}-${counter++}`;
  }

  const defaultImage =
    data.heroImage?.trim() ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

  const newLocation: LocationItem = {
    id: `loc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    region: data.region.trim(),
    slug,
    title: data.title.trim(),
    subtitle: data.subtitle?.trim() || `Regional machinery and field support for ${cleanName}`,
    heroImage: defaultImage,
    description: data.description.trim(),
    farmingContext: data.farmingContext?.trim() || "Commercial agriculture and tractor mechanization.",
    recommendedHorsepower: data.recommendedHorsepower?.trim() || "75 HP - 90 HP 4WD",
    popularTractors: data.popularTractors && data.popularTractors.length > 0
      ? data.popularTractors
      : ["Massey Ferguson MF 385 4WD", "Lovol TB754 4WD"],
    hubOffice: data.hubOffice?.trim() || `${cleanName} Regional Liaison`,
    phone: data.phone?.trim() || "+251 91 123 4567",
    active: data.active !== undefined ? data.active : true,
    order: globalForLocations.inMemoryLocations.length + 1,
    createdAt: new Date().toISOString(),
  };

  globalForLocations.inMemoryLocations.unshift(newLocation);
  savePersistedLocations(globalForLocations.inMemoryLocations);
  return newLocation;
}

export async function updateLocation(
  id: string,
  updates: Partial<Omit<LocationItem, "id" | "createdAt">>
): Promise<LocationItem | null> {
  const idx = globalForLocations.inMemoryLocations.findIndex((l) => l.id === id);
  if (idx === -1) return null;

  const current = globalForLocations.inMemoryLocations[idx];
  const updated: LocationItem = {
    ...current,
    ...updates,
    id: current.id,
    createdAt: current.createdAt,
  };

  globalForLocations.inMemoryLocations[idx] = updated;
  savePersistedLocations(globalForLocations.inMemoryLocations);
  return updated;
}

export async function deleteLocation(id: string): Promise<boolean> {
  const initialLen = globalForLocations.inMemoryLocations.length;
  globalForLocations.inMemoryLocations = globalForLocations.inMemoryLocations.filter(
    (l) => l.id !== id
  );

  if (globalForLocations.inMemoryLocations.length < initialLen) {
    savePersistedLocations(globalForLocations.inMemoryLocations);
    return true;
  }
  return false;
}
