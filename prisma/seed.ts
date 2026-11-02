import { PrismaClient, Role, LeadStatus, TractorAvailability } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Tekhaf Trading database for Dagim Melese...");

  // 1. Seed Super Admin User (Dagim Melese)
  const passwordHash = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "dagim@tekhaf.com" },
    update: {},
    create: {
      email: "dagim@tekhaf.com",
      name: "Dagim Melese",
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  // 2. Seed Dagim Melese Profile
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      fullName: "Dagim Melese",
      jobTitle: "Agricultural Machinery Sales Specialist",
      companyName: "Tekhaf Trading",
      phone: "+251911234567",
      whatsapp: "https://wa.me/251911234567",
      email: "dagim@tekhaf.com",
      address: "Tekhaf Tower, Bole Medhanialem, Addis Ababa, Ethiopia",
      experienceYears: 12,
      profilePhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
      biography:
        "Dagim Melese is a leading agricultural machinery consultant in Ethiopia with over 12 years of hands-on experience empowering commercial grain growers, smallholder farmer unions, and agricultural investors at Tekhaf Trading.",
      expertise: [
        "Tractor Sizing & Soil Match Analysis",
        "Ethiopian Duty-Free Agricultural Machinery Exemption Guidance",
        "Cooperative & Commercial Farm Mechanization Planning",
        "Heavy-Duty Implement Pairing (Ploughs, Harrows, Planters, Balers)",
        "Genuine Perkins, New Holland & Lovol Spare Parts Logistics",
        "On-Site Field Delivery & Operator Safety Certification",
      ],
      certifications: [
        "Certified Agricultural Mechanization Specialist (EIAR / MoA Partner)",
        "Senior Heavy Equipment Sales & Field Diagnostics Consultant",
        "ISO 9001 Agricultural Equipment Quality & Compliance Advisor",
      ],
    },
  });

  // 3. Seed Site Settings
  await prisma.siteSetting.deleteMany();
  await prisma.siteSetting.create({
    data: {
      companyName: "Tekhaf Trading",
      companySlogan: "Authorized Distributor & Agricultural Mechanization Partner in Ethiopia",
      salesRepresentative: "Dagim Melese",
      representativeRole: "Tractor Sales Specialist",
      primaryPhone: "+251 91 123 4567",
      whatsappNumber: "+251 91 123 4567",
      contactEmail: "dagim@tekhaf.com",
      officeAddress: "Tekhaf Tower, Bole Medhanialem, Addis Ababa, Ethiopia",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
