import { tractorInventory, TractorProduct } from "./data/inventory";
import { prisma } from "./prisma";

export interface SiteCMSData {
  representativeName: string;
  jobTitle: string;
  companyName: string;
  companySlogan: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  officeAddress: string;
  profilePhoto: string;
  customLogoUrl: string | null;
  experienceYears: number;
  biography: string;
  socials: {
    whatsapp: string;
    telegram: string;
    linkedin: string;
    phone: string;
    email: string;
  };
}

let inMemoryCMS: SiteCMSData = {
  representativeName: "Dagim Melese",
  jobTitle: "Agricultural Machinery Specialist",
  companyName: "Tekhaf Trading",
  companySlogan: "Authorized Agricultural Machinery & Tractor Solutions",
  phone: "+251911234567",
  phoneDisplay: "+251 91 123 4567",
  email: "dagim@tekhaf.com",
  officeAddress: "Tekhaf Tower, Bole Medhanialem, Addis Ababa, Ethiopia",
  profilePhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  customLogoUrl: null, // If set, displays custom image; otherwise displays SVG branded logo
  experienceYears: 12,
  biography: "Dagim Melese is an agricultural machinery sales consultant at Tekhaf Trading in Addis Ababa, Ethiopia. With over 12 years of industry experience, Dagim specializes in matching farmers, unions, and commercial enterprises with heavy-duty tractors, genuine implements, and dependable field support across all Ethiopian regions.",
  socials: {
    whatsapp: "https://wa.me/251911234567",
    telegram: "https://t.me/tekhaftractors",
    linkedin: "https://linkedin.com/in/dagim-melese",
    phone: "tel:+251911234567",
    email: "mailto:dagim@tekhaf.com",
  },
};

let inMemoryInventory: TractorProduct[] = [...tractorInventory];

export async function getCMSData(): Promise<SiteCMSData> {
  try {
    const setting = await prisma.siteSetting.findFirst();
    const profile = await prisma.profile.findFirst();

    if (profile || setting) {
      return {
        ...inMemoryCMS,
        representativeName: profile?.fullName || inMemoryCMS.representativeName,
        jobTitle: profile?.jobTitle || inMemoryCMS.jobTitle,
        companyName: profile?.companyName || setting?.companyName || inMemoryCMS.companyName,
        phone: profile?.phone || inMemoryCMS.phone,
        email: profile?.email || inMemoryCMS.email,
        officeAddress: profile?.address || inMemoryCMS.officeAddress,
        profilePhoto: profile?.profilePhoto || inMemoryCMS.profilePhoto,
        biography: profile?.biography || inMemoryCMS.biography,
      };
    }
  } catch {
    // Smooth fallback to memory
  }
  return inMemoryCMS;
}

export async function updateCMSData(updates: Partial<SiteCMSData>): Promise<SiteCMSData> {
  inMemoryCMS = {
    ...inMemoryCMS,
    ...updates,
    socials: {
      ...inMemoryCMS.socials,
      ...(updates.socials || {}),
    },
  };
  return inMemoryCMS;
}

export async function getLiveTractors(): Promise<TractorProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        brand: p.brand,
        modelNumber: p.modelNumber,
        horsepower: p.horsepower,
        engineType: p.engineType,
        fuelType: p.fuelType,
        transmission: p.transmission,
        driveType: p.driveType as "2WD" | "4WD",
        hydraulicLift: p.hydraulicLift || "2,000 kg",
        ptoSpeed: p.ptoSpeed || "540 RPM",
        priceETB: p.price ? Number(p.price) : 3500000,
        priceFormatted: p.price ? `ETB ${Number(p.price).toLocaleString()}` : "Inquire",
        availability: p.availability as TractorProduct["availability"],
        isFeatured: p.isFeatured,
        image: p.images[0]?.url || "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80",
        gallery: p.images.map((img) => img.url),
        summary: p.summary,
        description: p.description,
        keyBenefits: p.keyBenefits,
        specs: (p.specifications as Record<string, string>) || {},
        bestForRegions: ["Oromia", "Amhara", "Sidama", "Somali Region"],
      }));
    }
  } catch {
    // Memory fallback
  }

  return inMemoryInventory;
}

export async function addOrUpdateTractor(product: TractorProduct) {
  const existingIdx = inMemoryInventory.findIndex((p) => p.id === product.id || p.slug === product.slug);
  if (existingIdx >= 0) {
    inMemoryInventory[existingIdx] = product;
  } else {
    inMemoryInventory = [product, ...inMemoryInventory];
  }
  return product;
}
