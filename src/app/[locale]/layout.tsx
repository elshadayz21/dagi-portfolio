import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingSocials } from "@/components/floating-socials";
import { Locale, locales } from "@/lib/i18n/config";
import { getCMSData, getLiveTractors } from "@/lib/cms-store";
import {
  getLocalBusinessSchema,
  getFAQSchema,
} from "@/lib/seo/schema";

export const dynamic = "force-dynamic";

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
  const cms = await getCMSData();

  const title = `${cms.representativeName} • ${cms.jobTitle} | ${cms.companyName}`;
  const description = `${cms.representativeName}, ${cms.jobTitle} at ${cms.companyName} in Ethiopia. Commercial agricultural tractors, implements, and direct on-farm support.`;

  const iconUrl = "/api/favicon";

  return {
    title: {
      default: title,
      template: `%s | ${cms.representativeName} - ${cms.companyName}`,
    },
    description,
    authors: [{ name: cms.representativeName }, { name: cms.companyName }],
    creator: cms.representativeName,
    publisher: cms.companyName,
    metadataBase: new URL("https://tekhaftractors.com"),
    icons: {
      icon: [
        {
          url: iconUrl,
        },
      ],
      shortcut: [iconUrl],
      apple: [iconUrl],
    },
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
      title,
      description,
      siteName: `${cms.representativeName} - ${cms.companyName}`,
      images: [
        {
          url: cms.profilePhoto,
          width: 1200,
          height: 630,
          alt: `${cms.representativeName} - ${cms.companyName}`,
        },
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

  const cms = await getCMSData();
  const tractors = await getLiveTractors();

  const localBusinessSchema = getLocalBusinessSchema();
  const faqSchema = getFAQSchema();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF] text-[#0c1b2a] antialiased">
      <script
        id="schema-local-business"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        id="schema-faq"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Dynamic Navbar */}
      <Navbar
        currentLocale={currentLocale}
        representativeName={cms.representativeName}
        jobTitle={cms.jobTitle}
        companyName={cms.companyName}
        phoneDisplay={cms.phoneDisplay}
        phone={cms.phone}
        customLogoUrl={cms.customLogoUrl}
        enabledLocales={cms.enabledLocales}
      />

      {/* Floating Social Icons on the Left (WhatsApp, Telegram, LinkedIn, Phone, Email) */}
      <FloatingSocials socials={cms.socials} />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Dynamic Footer: tractors and company details from CMS */}
      <Footer
        currentLocale={currentLocale}
        tractors={tractors}
        representativeName={cms.representativeName}
        jobTitle={cms.jobTitle}
        companyName={cms.companyName}
        officeAddress={cms.officeAddress}
        phoneDisplay={cms.phoneDisplay}
        phone={cms.phone}
        email={cms.email}
        customLogoUrl={cms.customLogoUrl}
        locations={cms.locations}
        phones={cms.phones}
        emails={cms.emails}
      />
    </div>
  );
}
