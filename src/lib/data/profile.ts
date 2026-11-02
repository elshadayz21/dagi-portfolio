export interface SalesConsultantProfile {
  fullName: string;
  jobTitle: string;
  companyName: string;
  companySlogan: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappNumberOnly: string;
  email: string;
  officeAddress: string;
  experienceYears: number;
  profilePhoto: string;
  biography: string;
  expertise: string[];
  certifications: string[];
  metrics: {
    tractorsDelivered: number;
    satisfiedFarmers: number;
    regionsCovered: number;
    serviceResponseHours: number;
  };
}

export const dagimProfile: SalesConsultantProfile = {
  fullName: "Dagim Melese",
  jobTitle: "Agricultural Machinery Sales Specialist",
  companyName: "Tekhaf Trading",
  companySlogan: "Authorized Distributor & Agricultural Mechanization Partner in Ethiopia",
  phone: "+251911234567",
  phoneDisplay: "+251 91 123 4567",
  whatsapp: "https://wa.me/251911234567",
  whatsappNumberOnly: "251911234567",
  email: "dagim@tekhaf.com",
  officeAddress: "Tekhaf Tower, 4th Floor, Bole Medhanialem, Addis Ababa, Ethiopia",
  experienceYears: 12,
  profilePhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  biography: "Dagim Melese is a leading agricultural machinery consultant in Ethiopia with over 12 years of hands-on experience empowering commercial grain growers, smallholder farmer unions, and agricultural investors. Operating at Tekhaf Trading, Dagim specializes in matching farmers with the exact horsepower, implements, and financing solutions suited to Ethiopian soil typologies—from the deep Vertisols of Arsi and Bale to the fertile volcanic plateaus of Gojjam and the expanding river basins of Somali Region. His dedication extends well beyond delivery, providing operator training, genuine OEM spare parts, and on-farm mechanic support.",
  expertise: [
    "Tractor Sizing & Soil Match Analysis",
    "Ethiopian Duty-Free Agricultural Machinery Exemption Guidance",
    "Cooperative & Commercial Farm Mechanization Planning",
    "Heavy-Duty Implement Pairing (Ploughs, Harrows, Planters, Balers)",
    "Genuine Perkins, New Holland & Lovol Spare Parts Logistics",
    "On-Site Field Delivery & Operator Safety Certification",
  ],
  certifications: [
    "Certified Agricultural Mechanization Specialist (Ethiopian Institute of Agricultural Research / MoA Partner)",
    "Senior Heavy Equipment Sales & Field Diagnostics Consultant",
    "ISO 9001 Agricultural Equipment Quality & Compliance Advisor",
  ],
  metrics: {
    tractorsDelivered: 480,
    satisfiedFarmers: 620,
    regionsCovered: 8,
    serviceResponseHours: 24,
  },
};
