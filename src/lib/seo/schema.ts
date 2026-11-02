import { TractorProduct } from "../data/inventory";
import { dagimProfile } from "../data/profile";
import { customerTestimonials } from "../data/testimonials";

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://tekhaftractors.com/#business",
    name: "Tekhaf Trading - Dagim Melese Tractor Sales",
    image: [
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80",
      dagimProfile.profilePhoto,
    ],
    telephone: dagimProfile.phone,
    email: dagimProfile.email,
    url: "https://tekhaftractors.com",
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tekhaf Tower, Bole Medhanialem",
      addressLocality: "Addis Ababa",
      addressRegion: "Addis Ababa",
      addressCountry: "ET",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.0019,
      longitude: 38.7845,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:30",
        closes: "18:00",
      },
    ],
    employee: {
      "@type": "Person",
      name: dagimProfile.fullName,
      jobTitle: dagimProfile.jobTitle,
      telephone: dagimProfile.phone,
      email: dagimProfile.email,
      image: dagimProfile.profilePhoto,
    },
    sameAs: [
      "https://facebook.com/tekhaftrading",
      "https://t.me/tekhaftractors",
    ],
  };
}

export function getProductSchema(product: TractorProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [product.image, ...product.gallery],
    description: product.summary,
    sku: product.modelNumber,
    mpn: product.modelNumber,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `https://tekhaftractors.com/en/products/${product.slug}`,
      priceCurrency: "ETB",
      price: product.priceETB,
      priceValidUntil: "2027-12-31",
      availability:
        product.availability === "IN_STOCK"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Tekhaf Trading",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Horsepower",
        value: `${product.horsepower} HP`,
      },
      {
        "@type": "PropertyValue",
        name: "Drive Type",
        value: product.driveType,
      },
      {
        "@type": "PropertyValue",
        name: "Engine",
        value: product.engineType,
      },
    ],
  };
}

export function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I buy a tractor duty-free in Ethiopia through Tekhaf Trading?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Under Ethiopian Ministry of Finance and Ministry of Agriculture directives, commercial agricultural investors, cooperative unions, and licensed mechanized service providers are eligible for customs duty and excise tax exemptions on tractors and farm implements. Dagim Melese at Tekhaf Trading assists clients with the required documentation, proforma invoices, and customs clearance support.",
        },
      },
      {
        "@type": "Question",
        name: "Are genuine spare parts available for Massey Ferguson and Lovol tractors in Ethiopia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Tekhaf Trading maintains a central spare parts depot in Addis Ababa stocked with genuine Perkins filters, hydraulic pumps, piston kits, clutches, and electrical components. We provide rapid dispatch to regional hubs including Adama, Hawassa, Bahir Dar, and Dire Dawa.",
        },
      },
      {
        "@type": "Question",
        name: "Does Tekhaf Trading provide field delivery and operator training?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every tractor purchased through Dagim Melese includes free on-farm delivery anywhere in Ethiopia, initial fuel and oil service, and a comprehensive 2-day operator safety and maintenance orientation for farm drivers.",
        },
      },
      {
        "@type": "Question",
        name: "What warranty coverage is included with new agricultural tractors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All new tractors sold by Tekhaf Trading include a 1-Year or 1,200-Hour comprehensive manufacturer powertrain warranty backed by mobile technician service across Ethiopian regions.",
        },
      },
    ],
  };
}

export function getTestimonialReviewsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tekhaf Trading Tractor Sales Ethiopia",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "68",
      bestRating: "5",
      worstRating: "1",
    },
    review: customerTestimonials.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.customerName,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating.toString(),
        bestRating: "5",
      },
      reviewBody: t.quote,
    })),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
