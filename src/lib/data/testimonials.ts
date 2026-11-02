export interface CustomerTestimonial {
  id: string;
  customerName: string;
  farmOrOrg: string;
  region: string;
  quote: string;
  rating: number;
  tractorPurchased: string;
  image: string;
}

export const customerTestimonials: CustomerTestimonial[] = [
  {
    id: "test-1",
    customerName: "Ato Tsegaye Bekele",
    farmOrOrg: "Arsi Wheat Growers Union",
    region: "Asella, Oromia",
    quote: "Dagim Melese helped our cooperative acquire two Massey Ferguson 385 4WD tractors before the main Meher planting season. His advice on tyre sizing for our black clay soil was spot on. Tekhaf Trading delivered on time and even sent a technician for initial setup.",
    rating: 5,
    tractorPurchased: "Massey Ferguson MF 385 4WD",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "test-2",
    customerName: "W/ro Aster Hailu",
    farmOrOrg: "Awash Valley Agribusiness",
    region: "Addis Ababa / Eastern Corridor",
    quote: "Purchasing equipment through Dagim was smooth and completely transparent. He provided full documentation for our duty-free processing and arranged delivery directly to our farm site. Tekhaf Trading's spare parts stock gives us huge peace of mind.",
    rating: 5,
    tractorPurchased: "Lovol TB754 4WD",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "test-3",
    customerName: "Dr. Birhanu Kebede",
    farmOrOrg: "Sidama Commercial Coffee & Seed Estate",
    region: "Hawassa, Sidama",
    quote: "We needed a dependable 75 HP tractor with strong PTO output for our pulp processing and trailer transport. Dagim recommended the New Holland TT75. The fuel economy is exceptional and Tekhaf Trading's after-sales service is genuine.",
    rating: 5,
    tractorPurchased: "New Holland TT75 4WD",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "test-4",
    customerName: "Ahmed Mahamed",
    farmOrOrg: "Shabelle Irrigation Project",
    region: "Gode, Somali Region",
    quote: "In our hot dry climate, engine cooling and cabin air conditioning are critical. Dagim guided us to the Lovol TD904 with A/C cabin. Our operators work in complete comfort and the tractor has handled 600 hours without a hiccup.",
    rating: 5,
    tractorPurchased: "Lovol TD904 A/C Cabin",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
];
