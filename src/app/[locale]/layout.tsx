import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingContact } from "@/components/floating-contact";
import { Locale, locales } from "@/lib/i18n/config";
import {
  getLocalBusinessSchema,
  getFAQSchema,
  getTestimonialReviewsSchema,
} from "@/lib/seo/schema";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;

  const titles: Record<Locale, string> = {
    en: "Dagim Melese • Tractor Sales & Agricultural Equipment | Tekhaf Trading Ethiopia",
    am: "ዳግም መለሰ • የትራክተር ሽያጭ እና የግብርና ማሽነሪዎች | ቴክሃፍ ትሬዲንግ ኢትዮጵያ",
    or: "Daagim Mallasaa • Gurgurtaa Tiraakterootaa fi Meeshaalee Qonnaa | Tekhaf Trading",
    so: "Dagim Melese • Iibka Cagafyada iyo Qalabka Beeraha | Tekhaf Trading Itoobiya",
    sid: "Daagim Mallase • Tiraakiterrete Hiranna Gashshootu Maashine | Tekhaf Trading",
  };

  const descriptions: Record<Locale, string> = {
    en: "Leading tractor sales consultant in Ethiopia. Buy Massey Ferguson, Lovol, New Holland, and John Deere tractors with genuine Perkins spare parts, duty-free guidance, and 1-year field warranty.",
    am: "በኢትዮጵያ ቀዳሚ የትራክተር ሽያጭ አማካሪ። ሜሲ ፈርጉሰን፣ ሎቮል፣ ኒው ሆላንድ እና ጆን ዲር ትራክተሮችን ከኦሪጅናል መለዋወጫዎች፣ ከቀረጥ ነፃ የግዢ ማማከር እና የ1 ዓመት ዋስትና ጋር ይግዙ።",
    or: "Ogeessa gurgurtaa tiraakterootaa Itoophiyaa keessaa. Tiraakteroota Massey Ferguson, Lovol, New Holland fi John Deere gatii madaalawaan bitadhaa.",
    so: "Khabiirka iibka cagafyada ee Itoobiya. Iibso cagafyada Massey Ferguson, Lovol, New Holland damaanad buuxda leh.",
    sid: "Itoophiyu giddo roore tiraakiterrete hiraano. Massey Ferguson, Lovol nna New Holland tiraakiterre dancha woxxanni bitidhe.",
  };

  const localizedTitle = titles[currentLocale] || titles.en;
  const localizedDesc = descriptions[currentLocale] || descriptions.en;

  return {
    title: {
      default: localizedTitle,
      template: "%s | Tekhaf Trading - Dagim Melese",
    },
    description: localizedDesc,
    keywords: [
      "Tractor Ethiopia",
      "Tractor Sales Ethiopia",
      "Buy Tractor Ethiopia",
      "Tekhaf Trading",
      "Agricultural Equipment Ethiopia",
      "Farm Machinery Ethiopia",
      "Tractor Dealer Addis Ababa",
      "Tractors for Sale Ethiopia",
      "Dagim Melese Tractor Sales",
      "Heavy Equipment Ethiopia",
      "Massey Ferguson 385 Ethiopia",
      "Lovol Tractor Ethiopia",
    ],
    authors: [{ name: "Dagim Melese" }, { name: "Tekhaf Trading" }],
    creator: "Dagim Melese",
    publisher: "Tekhaf Trading",
    metadataBase: new URL("https://tekhaftractors.com"),
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}`,
      languages: {
        en: "https://tekhaftractors.com/en",
        am: "https://tekhaftractors.com/am",
        or: "https://tekhaftractors.com/or",
        so: "https://tekhaftractors.com/so",
        sid: "https://tekhaftractors.com/sid",
      } as Record<string, string>,
    },
    openGraph: {
      type: "website",
      locale: currentLocale,
      url: `https://tekhaftractors.com/${currentLocale}`,
      title: localizedTitle,
      description: localizedDesc,
      siteName: "Tekhaf Trading - Dagim Melese Tractor Sales",
      images: [
        {
          url: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "Tekhaf Trading Tractor Sales Ethiopia - Dagim Melese",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: localizedTitle,
      description: localizedDesc,
      images: [
        "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;

  const localBusinessSchema = getLocalBusinessSchema();
  const faqSchema = getFAQSchema();
  const reviewsSchema = getTestimonialReviewsSchema();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF] text-[#0c1b2a]">
      {/* Structured Data JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />

      <Navbar currentLocale={currentLocale} />
      <main className="flex-1">{children}</main>
      <Footer currentLocale={currentLocale} />
      <FloatingContact />
    </div>
  );
}
