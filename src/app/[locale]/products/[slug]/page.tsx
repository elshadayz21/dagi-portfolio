import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { tractorInventory } from "@/lib/data/inventory";
import { dagimProfile } from "@/lib/data/profile";
import { getProductSchema } from "@/lib/seo/schema";
import { Breadcrumb } from "@/components/breadcrumb";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import {
  Tractor,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Wrench,
  Download,
  Share2,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface ProductDetailsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const paths = [];
  for (const locale of locales) {
    for (const tractor of tractorInventory) {
      paths.push({ locale, slug: tractor.slug });
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const product = tractorInventory.find((p) => p.slug === slug);

  if (!product) return {};

  return {
    title: `${product.title} - Price & Specs Ethiopia | Tekhaf Trading`,
    description: `${product.title} for sale in Ethiopia by Dagim Melese at Tekhaf Trading. ${product.horsepower} HP, ${product.driveType}, ${product.engineType}. 1-year warranty and genuine spare parts.`,
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/products/${slug}`,
    },
    openGraph: {
      title: `${product.title} in Ethiopia | Tekhaf Trading`,
      description: product.summary,
      images: [{ url: product.image, width: 1000, height: 600 }],
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { locale, slug } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);

  const product = tractorInventory.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const productSchema = getProductSchema(product);
  const relatedTractors = tractorInventory
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const whatsappInquiryUrl = `${dagimProfile.whatsapp}?text=${encodeURIComponent(
    `Hello Dagim, I am interested in purchasing the ${product.title} from Tekhaf Trading. Please send me the official proforma invoice and availability details.`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.tractors, href: `/${currentLocale}/products` },
          { label: product.title },
        ]}
      />

      {/* Top Product Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Gallery / Image View (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-80 sm:h-[450px] rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 group">
            <Image
              src={product.image}
              alt={`${product.title} Ethiopia Tractor Sales`}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-tekhaf-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
              {product.brand} • {product.horsepower} HP
            </div>
            <div className="absolute top-4 right-4">
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  product.availability === "IN_STOCK"
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {product.availability === "IN_STOCK"
                  ? dict.common.inStock
                  : dict.common.preOrder}
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {product.gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {product.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                >
                  <Image src={img} alt={`${product.title} view ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Regional Suitability Highlight */}
          <div className="p-4 rounded-2xl bg-tekhaf-50/70 border border-tekhaf-100 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-tekhaf-600 shrink-0" />
            <div className="text-xs text-slate-700">
              <strong className="text-tekhaf-900 font-bold">Recommended for regions:</strong>{" "}
              {product.bestForRegions.join(", ")}
            </div>
          </div>
        </div>

        {/* Pricing, Actions & Consultant Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-tekhaf-600 mb-1">
              {product.brand} • Model {product.modelNumber}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {product.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Drive Type: <strong>{product.driveType}</strong> • Fuel: <strong>{product.fuelType}</strong>
            </p>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs text-slate-500 font-medium">Indicative Showroom Price (Addis Ababa Depot):</div>
            <div className="text-3xl font-black text-tekhaf-700">{product.priceFormatted}</div>
            <div className="text-[11px] text-slate-400">
              * Official proforma invoices available for bank loans, cooperatives, and duty-free exemption holders.
            </div>
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Engine Output</span>
              <span className="font-bold text-slate-800">{product.horsepower} HP</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Hydraulic Lift</span>
              <span className="font-bold text-slate-800">{product.hydraulicLift}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">PTO Speed</span>
              <span className="font-bold text-slate-800">{product.ptoSpeed}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Warranty</span>
              <span className="font-bold text-emerald-600">1 Year Comprehensive</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Get WhatsApp Quote from Dagim</span>
            </a>

            <a
              href={`tel:${dagimProfile.phone}`}
              className="w-full bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call Dagim: {dagimProfile.phoneDisplay}</span>
            </a>
          </div>

          {/* Consultant Guarantee Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-tekhaf-300">
              <Image src={dagimProfile.profilePhoto} alt={dagimProfile.fullName} fill className="object-cover" />
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-slate-900">{dagimProfile.fullName}</h4>
              <p className="text-slate-500">{dagimProfile.jobTitle} • Tekhaf Trading</p>
              <p className="text-tekhaf-700 font-semibold mt-0.5">
                Direct field inspections & tractor handover guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Benefits Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          {/* Detailed Description */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Description & Performance
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {product.description}
            </p>

            <h3 className="text-base font-bold text-slate-900 pt-4">Key Operator Benefits:</h3>
            <ul className="space-y-2.5">
              {product.keyBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specifications Table */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Technical Specifications
            </h2>
            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {Object.entries(product.specs).map(([specKey, specVal]) => (
                <div key={specKey} className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{specKey}</span>
                  <span className="text-slate-900 font-bold">{specVal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Capture Form Sidebar (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-tekhaf-200 shadow-lg sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Request Proforma Invoice
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Dagim Melese will generate an official quotation for {product.title}.
            </p>

            <LeadCaptureForm
              currentLocale={currentLocale}
              defaultProductTitle={product.title}
              sourceContext={`Product Page: ${product.title}`}
            />
          </div>
        </div>
      </div>

      {/* Related Tractors */}
      <div className="pt-8 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Explore Related Agricultural Tractors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedTractors.map((tractor) => (
            <div
              key={tractor.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-100">
                <Image src={tractor.image} alt={tractor.title} fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-tekhaf-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {tractor.horsepower} HP
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{tractor.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{tractor.summary}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-tekhaf-700">{tractor.priceFormatted}</span>
                  <Link
                    href={`/${currentLocale}/products/${tractor.slug}`}
                    className="text-xs font-bold text-tekhaf-700 hover:text-tekhaf-800 flex items-center gap-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
