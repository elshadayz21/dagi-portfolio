import { Metadata } from "next";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLiveTractors, getCMSData } from "@/lib/cms-store";
import { ProductsFilterView } from "@/components/products-filter-view";
import { Breadcrumb } from "@/components/breadcrumb";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const cms = await getCMSData();

  return {
    title: `Agricultural Tractors | ${cms.representativeName} - ${cms.companyName}`,
    description: `Agricultural tractors available through ${cms.representativeName} at ${cms.companyName} in Ethiopia. Massey Ferguson, Lovol, New Holland, and John Deere models.`,
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/products`,
    },
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);
  const tractors = await getLiveTractors();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.tractors },
        ]}
      />

      {/* Page Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {dict.productsPage.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {dict.productsPage.subtitle}
        </p>
      </div>

      {/* Filterable Catalog */}
      <ProductsFilterView
        currentLocale={currentLocale}
        initialProducts={tractors}
      />
    </div>
  );
}
