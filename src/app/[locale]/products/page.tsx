import { Metadata } from "next";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { tractorInventory } from "@/lib/data/inventory";
import { ProductsFilterView } from "@/components/products-filter-view";
import { Breadcrumb } from "@/components/breadcrumb";
import { ShieldCheck, Truck, Wrench } from "lucide-react";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;

  return {
    title: "Agricultural Tractors for Sale in Ethiopia | Tekhaf Trading",
    description:
      "Browse brand-new Massey Ferguson, Lovol, New Holland, and John Deere tractors in Ethiopia. 75 HP to 120 HP, 4WD heavy duty, duty-free proforma invoices and genuine spare parts.",
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/products`,
    },
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.tractors },
        ]}
      />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-tekhaf-900 to-tekhaf-800 text-white p-8 sm:p-12 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-300">
            Tekhaf Trading Central Inventory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {dict.productsPage.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {dict.productsPage.subtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-tekhaf-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-tekhaf-300" />
              <span>1-Year Comprehensive Warranty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-tekhaf-300" />
              <span>Direct Farm Gate Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-tekhaf-300" />
              <span>Spare Parts in Addis Ababa</span>
            </div>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-tekhaf-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Interactive Filterable Catalog */}
      <ProductsFilterView
        currentLocale={currentLocale}
        initialProducts={tractorInventory}
      />
    </div>
  );
}
