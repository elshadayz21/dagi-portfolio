import { getCMSData } from "@/lib/cms-store";
import { Animated404 } from "@/components/animated-404";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

export default async function GlobalNotFound() {
  const cms = await getCMSData();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F5F9FF]">
      {/* Minimal Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/en" className="flex items-center">
          <Logo
            representativeName={cms.representativeName}
            jobTitle={cms.jobTitle}
            companyName={cms.companyName}
            customLogoUrl={cms.customLogoUrl}
          />
        </Link>
        <Link
          href="/en"
          className="text-xs font-bold text-tekhaf-700 hover:text-tekhaf-800"
        >
          &larr; Back to Platform
        </Link>
      </header>

      {/* Animated 404 Experience */}
      <main className="flex-1 flex items-center justify-center">
        <Animated404
          currentLocale="en"
          phoneDisplay={cms.phoneDisplay}
          phone={cms.phone}
          representativeName={cms.representativeName}
        />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} {cms.companyName} • {cms.representativeName}. All rights reserved.
      </footer>
    </div>
  );
}
