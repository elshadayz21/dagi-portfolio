import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getCMSData } from "@/lib/cms-store";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCMSData();
  const iconUrl = "/api/favicon";

  return {
    title: `${cms.representativeName} • ${cms.jobTitle} | ${cms.companyName}`,
    description: `Official tractor sales and agricultural machinery platform for ${cms.companyName}, represented by ${cms.representativeName} in Ethiopia.`,
    icons: {
      icon: [
        {
          url: iconUrl,
        },
      ],
      shortcut: [iconUrl],
      apple: [iconUrl],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-[#F5F9FF] text-[#0c1b2a]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
