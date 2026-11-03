import { tractorInventory, TractorProduct } from "./data/inventory";
import { prisma } from "./prisma";

export interface ContactPhone {
  id: string;
  label: string; // e.g. "Primary Direct Line", "Showroom Hotline", "Spare Parts & Tech Support", "Oromia Field Desk"
  phone: string; // "+251911234567"
  display: string; // "+251 91 123 4567"
  isPrimary?: boolean;
}

export interface OfficeLocation {
  id: string;
  title: string; // e.g. "Main Showroom & Headquarters", "Kaliti Machinery Yard & Depot", "Hawassa Regional Liaison"
  address: string; // "Tekhaf Tower, 4th Floor, Bole Medhanialem"
  city: string; // "Addis Ababa"
  country: string; // "Ethiopia"
  operatingHours?: string; // "Mon - Sat: 8:30 AM - 6:00 PM"
  mapUrl?: string; // Google Maps URL
  isHeadquarters?: boolean;
}

export interface ContactEmail {
  id: string;
  label: string; // e.g. "Direct Sales Consultant", "Spare Parts & Service Desk", "Union Relations"
  email: string; // "dagim@tekhaf.com"
  isPrimary?: boolean;
}

export interface SocialLinks {
  whatsapp?: string;
  telegram?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  phone?: string;
  email?: string;
}

export interface SiteCMSData {
  representativeName: string;
  jobTitle: string;
  companyName: string;
  companySlogan: string;
  profilePhoto: string;
  customLogoUrl: string | null;
  experienceYears: number;
  biography: string;
  workingHours: string;

  // Multiple Phone Numbers
  phones: ContactPhone[];

  // Multiple Office & Yard Locations
  locations: OfficeLocation[];

  // Multiple Emails
  emails: ContactEmail[];

  // Dynamic Social Media Links
  socials: SocialLinks;

  // Dynamic Language Options
  enabledLocales: string[];
  defaultLocale: string;

  // Backwards-compatible convenience properties (derived from primary entries)
  phone: string;
  phoneDisplay: string;
  email: string;
  officeAddress: string;
}

let inMemoryCMS: SiteCMSData = {
  representativeName: "Dagim Melese",
  jobTitle: "Agricultural Machinery Specialist",
  companyName: "Tekhaf Trading",
  companySlogan: "Authorized Agricultural Machinery & Heavy Tractor Solutions",
  profilePhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  customLogoUrl: null,
  experienceYears: 12,
  biography: "Dagim Melese is an agricultural machinery sales consultant at Tekhaf Trading in Addis Ababa, Ethiopia. With over 12 years of industry experience, Dagim specializes in matching farmers, unions, and commercial enterprises with heavy-duty tractors, genuine implements, and dependable field support across all Ethiopian regions.",
  workingHours: "Monday – Saturday: 8:30 AM – 6:00 PM (EAT)",

  // Initial Multiple Phone Numbers
  phones: [
    {
      id: "phone-1",
      label: "Direct Sales Consultant (Dagim)",
      phone: "+251911234567",
      display: "+251 91 123 4567",
      isPrimary: true,
    },
    {
      id: "phone-2",
      label: "Tekhaf Showroom Desk",
      phone: "+251922334455",
      display: "+251 92 233 4455",
      isPrimary: false,
    },
    {
      id: "phone-3",
      label: "Spare Parts & Field Tech Support",
      phone: "+251116678900",
      display: "+251 11 667 8900",
      isPrimary: false,
    },
  ],

  // Initial Multiple Locations
  locations: [
    {
      id: "loc-1",
      title: "Headquarters & Machinery Showroom",
      address: "Tekhaf Tower, 4th Floor, Bole Medhanialem",
      city: "Addis Ababa",
      country: "Ethiopia",
      operatingHours: "Monday – Saturday: 8:30 AM – 6:00 PM",
      mapUrl: "https://maps.google.com/?q=Bole+Medhanialem+Addis+Ababa",
      isHeadquarters: true,
    },
    {
      id: "loc-2",
      title: "Kaliti Heavy Machinery Yard & Pre-Delivery Inspection Depot",
      address: "Kaliti Industrial Zone, Near Ring Road Junction",
      city: "Addis Ababa",
      country: "Ethiopia",
      operatingHours: "Monday – Friday: 8:00 AM – 5:30 PM",
      mapUrl: "https://maps.google.com/?q=Kaliti+Industrial+Addis+Ababa",
      isHeadquarters: false,
    },
    {
      id: "loc-3",
      title: "Hawassa Regional Cooperative Liaison & Service Center",
      address: "Menaheria Commercial District, Hawassa",
      city: "Sidama",
      country: "Ethiopia",
      operatingHours: "Monday – Saturday: 8:30 AM – 5:00 PM",
      mapUrl: "https://maps.google.com/?q=Hawassa+Sidama+Ethiopia",
      isHeadquarters: false,
    },
  ],

  // Initial Multiple Emails
  emails: [
    {
      id: "email-1",
      label: "Direct Sales & Quotations",
      email: "dagim@tekhaf.com",
      isPrimary: true,
    },
    {
      id: "email-2",
      label: "Spare Parts & Logistics Department",
      email: "sales@tekhaf.com",
      isPrimary: false,
    },
  ],

  // Dynamic Social Links
  socials: {
    whatsapp: "https://wa.me/251911234567",
    telegram: "https://t.me/tekhaftractors",
    linkedin: "https://linkedin.com/in/dagim-melese",
    facebook: "https://facebook.com/tekhaftrading",
    youtube: "https://youtube.com/@tekhaftractors",
    tiktok: "https://tiktok.com/@tekhaftractors",
    phone: "tel:+251911234567",
    email: "mailto:dagim@tekhaf.com",
  },

  // Dynamic Language Options
  enabledLocales: ["en", "am", "or", "so", "sid"],
  defaultLocale: "en",

  // Auto-calculated defaults
  phone: "+251911234567",
  phoneDisplay: "+251 91 123 4567",
  email: "dagim@tekhaf.com",
  officeAddress: "Tekhaf Tower, 4th Floor, Bole Medhanialem, Addis Ababa, Ethiopia",
};

let inMemoryInventory: TractorProduct[] = [...tractorInventory];

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

export async function getCMSData(): Promise<SiteCMSData> {
  try {
    if (await canQueryDb()) {
      const setting = await prisma.siteSetting.findFirst();
      const profile = await prisma.profile.findFirst();

      if (profile || setting) {
        const primaryPhone = inMemoryCMS.phones.find((p) => p.isPrimary) || inMemoryCMS.phones[0];
        const primaryLoc = inMemoryCMS.locations.find((l) => l.isHeadquarters) || inMemoryCMS.locations[0];
        const primaryEmail = inMemoryCMS.emails.find((e) => e.isPrimary) || inMemoryCMS.emails[0];

        return {
          ...inMemoryCMS,
          representativeName: profile?.fullName || inMemoryCMS.representativeName,
          jobTitle: profile?.jobTitle || inMemoryCMS.jobTitle,
          companyName: profile?.companyName || setting?.companyName || inMemoryCMS.companyName,
          phone: profile?.phone || primaryPhone?.phone || inMemoryCMS.phone,
          phoneDisplay: primaryPhone?.display || inMemoryCMS.phoneDisplay,
          email: profile?.email || primaryEmail?.email || inMemoryCMS.email,
          officeAddress: profile?.address || `${primaryLoc?.address}, ${primaryLoc?.city}, ${primaryLoc?.country}` || inMemoryCMS.officeAddress,
          profilePhoto: profile?.profilePhoto || inMemoryCMS.profilePhoto,
          biography: profile?.biography || inMemoryCMS.biography,
        };
      }
    }
  } catch {
    dbAvailable = false;
  }

  // Ensure primary values stay synchronized
  const primaryPhone = inMemoryCMS.phones.find((p) => p.isPrimary) || inMemoryCMS.phones[0];
  const primaryLoc = inMemoryCMS.locations.find((l) => l.isHeadquarters) || inMemoryCMS.locations[0];
  const primaryEmail = inMemoryCMS.emails.find((e) => e.isPrimary) || inMemoryCMS.emails[0];

  return {
    ...inMemoryCMS,
    phone: primaryPhone ? primaryPhone.phone : inMemoryCMS.phone,
    phoneDisplay: primaryPhone ? primaryPhone.display : inMemoryCMS.phoneDisplay,
    email: primaryEmail ? primaryEmail.email : inMemoryCMS.email,
    officeAddress: primaryLoc
      ? `${primaryLoc.address}, ${primaryLoc.city}, ${primaryLoc.country}`
      : inMemoryCMS.officeAddress,
  };
}

export async function updateCMSData(updates: Partial<SiteCMSData>): Promise<SiteCMSData> {
  const mergedPhones = updates.phones ?? inMemoryCMS.phones;
  const mergedLocations = updates.locations ?? inMemoryCMS.locations;
  const mergedEmails = updates.emails ?? inMemoryCMS.emails;

  const primaryPhone = mergedPhones.find((p) => p.isPrimary) || mergedPhones[0];
  const primaryLoc = mergedLocations.find((l) => l.isHeadquarters) || mergedLocations[0];
  const primaryEmail = mergedEmails.find((e) => e.isPrimary) || mergedEmails[0];

  inMemoryCMS = {
    ...inMemoryCMS,
    ...updates,
    phones: mergedPhones,
    locations: mergedLocations,
    emails: mergedEmails,
    socials: {
      ...inMemoryCMS.socials,
      ...(updates.socials || {}),
    },
    phone: primaryPhone ? primaryPhone.phone : updates.phone || inMemoryCMS.phone,
    phoneDisplay: primaryPhone ? primaryPhone.display : updates.phoneDisplay || inMemoryCMS.phoneDisplay,
    email: primaryEmail ? primaryEmail.email : updates.email || inMemoryCMS.email,
    officeAddress: primaryLoc
      ? `${primaryLoc.address}, ${primaryLoc.city}, ${primaryLoc.country}`
      : updates.officeAddress || inMemoryCMS.officeAddress,
  };

  return inMemoryCMS;
}

export async function getLiveTractors(): Promise<TractorProduct[]> {
  try {
    if (await canQueryDb()) {
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
    }
  } catch {
    dbAvailable = false;
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
  return inMemoryInventory;
}

export async function patchTractor(id: string, updates: Partial<TractorProduct>) {
  const existingIdx = inMemoryInventory.findIndex((p) => p.id === id);
  if (existingIdx >= 0) {
    inMemoryInventory[existingIdx] = {
      ...inMemoryInventory[existingIdx],
      ...updates,
    };
    return inMemoryInventory[existingIdx];
  }
  return null;
}

export async function deleteTractor(id: string) {
  inMemoryInventory = inMemoryInventory.filter((p) => p.id !== id);
  return inMemoryInventory;
}
