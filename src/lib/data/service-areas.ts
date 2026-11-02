export interface ServiceAreaInfo {
  slug: string;
  regionName: string;
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  farmingContext: string;
  recommendedHorsepower: string;
  popularTractors: string[];
  hubOffice: string;
  phone: string;
}

export const serviceAreas: ServiceAreaInfo[] = [
  {
    slug: "tractors-addis-ababa",
    regionName: "Addis Ababa & Oromia Special Zone",
    title: "Tractor Sales & Agricultural Equipment in Addis Ababa",
    subtitle: "Tekhaf Trading Central Showroom, Warehouse & Rapid Spare Parts Delivery",
    heroImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    description: "Located at Bole Medhanialem in Addis Ababa, Tekhaf Trading serves as Ethiopia's premier agricultural hub. Dagim Melese personally consults agribusinesses, cooperative unions, and diaspora investors purchasing tractors for their farms nationwide.",
    farmingContext: "Commercial grain logistics, peri-urban horticulture, contracting services, and central parts supply across Dukem, Bishoftu, Sebeta, and Sululta.",
    recommendedHorsepower: "75 HP to 120 HP (4WD recommended for versatile contracting)",
    popularTractors: ["Massey Ferguson MF 385 4WD", "Lovol TB754 4WD", "New Holland TT75"],
    hubOffice: "Tekhaf Tower, Bole, Addis Ababa",
    phone: "+251 91 123 4567",
  },
  {
    slug: "tractors-oromia",
    regionName: "Oromia Region",
    title: "Heavy-Duty Tractors for Oromia Wheat, Teff & Commercial Farms",
    subtitle: "Serving Arsi, Bale, Shewa, Jimma, and Wollega with Field-Ready 4WD Tractors",
    heroImage: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80",
    description: "Oromia is the breadbasket of Ethiopia. Heavy vertisols and expansive wheat fields demand high-torque engines and heavy-duty 4WD transmissions. Tekhaf Trading provides direct on-farm tractor delivery with 1-year warranty and technician deployment.",
    farmingContext: "Highland wheat, barley, teff, maize, and pulse farming requiring 3-disc to 5-disc ploughing in dense black soils.",
    recommendedHorsepower: "75 HP to 90 HP 4WD",
    popularTractors: ["Massey Ferguson MF 385 4WD", "Massey Ferguson MF 375", "Lovol TD904 A/C"],
    hubOffice: "Service coverage from Adama, Asella, Shashemene & Batu",
    phone: "+251 91 123 4567",
  },
  {
    slug: "tractors-sidama",
    regionName: "Sidama Region & Hawassa",
    title: "Tractors & Farm Machinery in Sidama & Hawassa",
    subtitle: "Optimized Agricultural Equipment for Coffee, Enset, Maize, and Vegetable Belts",
    heroImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    description: "Sidama's fertile volcanic soils and mixed farming landscapes benefit from maneuverable 75 HP utility tractors capable of inter-row work, trailer transport to Hawassa markets, and deep tilling for cooperative unions.",
    farmingContext: "Coffee agroforestry, maize cultivation, horticulture near Lake Hawassa, and farm-to-market produce haulage.",
    recommendedHorsepower: "75 HP (High maneuverability)",
    popularTractors: ["Lovol TB754 4WD", "Massey Ferguson MF 375", "New Holland TT75"],
    hubOffice: "Regional liaison in Hawassa city center",
    phone: "+251 91 123 4567",
  },
  {
    slug: "tractors-somali-region",
    regionName: "Somali Region & Dire Dawa",
    title: "Tractors for Somali Region & Eastern Ethiopia Irrigation Basins",
    subtitle: "Robust Cooling Systems & Dust-Sealed Tractors for Wabe Shebelle & Gode Farms",
    heroImage: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80",
    description: "Agricultural investment along the Wabe Shebelle river and eastern river basins requires heavy machinery with heavy-duty cooling radiators, heavy air filtration, and air-conditioned operator cabins. Dagim Melese has facilitated fleet deliveries for commercial irrigated farms in Gode and Jigjiga.",
    farmingContext: "Commercial river basin irrigation, sesame, wheat, onion, watermelon, and fodder production under high ambient temperatures.",
    recommendedHorsepower: "85 HP to 90 HP with Air Conditioning Cab",
    popularTractors: ["Lovol TD904 A/C Cabin", "Massey Ferguson MF 385 4WD"],
    hubOffice: "Jigjiga & Dire Dawa regional coordination",
    phone: "+251 91 123 4567",
  },
  {
    slug: "agricultural-equipment-ethiopia",
    regionName: "All-Ethiopia Mechanization",
    title: "Ethiopia Agricultural Equipment, Implements & Duty-Free Machinery",
    subtitle: "Tekhaf Trading Nationwide Delivery, Disc Ploughs, Harrows, Planters & Balers",
    heroImage: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=1200&q=80",
    description: "From Amhara Region's Gojjam highlands to Southern Ethiopia and Afar, Tekhaf Trading supplies farmers with top-tier agricultural implements and tractors. Under Ethiopian Ministry of Finance duty-free incentives for agricultural machinery, Dagim Melese helps clients navigate documentation seamlessly.",
    farmingContext: "Comprehensive farm mechanization: primary tillage, secondary seedbed preparation, planting, spraying, harvesting, and post-harvest baling.",
    recommendedHorsepower: "Complete range from 50 HP to 130 HP",
    popularTractors: ["Massey Ferguson MF 385 4WD", "Lovol TB754", "John Deere 5075E"],
    hubOffice: "Nationwide dispatch from Addis Ababa Central Depot",
    phone: "+251 91 123 4567",
  },
];
