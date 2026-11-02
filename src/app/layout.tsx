import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tekhaf Trading • Dagim Melese Tractor Sales Ethiopia",
  description: "Official tractor sales and agricultural machinery platform for Tekhaf Trading, represented by Dagim Melese in Ethiopia.",
};

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
