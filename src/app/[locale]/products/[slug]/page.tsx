import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLiveTractors, getCMSData } from "@/lib/cms-store";
import { getProductSchema } from "@/lib/seo/schema";
import { Breadcrumb } from "@/components/breadcrumb";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import {
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface ProductDetailsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const tractors = await getLiveTractors();
  const paths = [];
  for (const locale of locales) {
    for (const tractor of tractors) {
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
  const tractors = await getLiveTractors();
  const product = tractors.find((p) => p.slug === slug);
  const cms = await getCMSData();

  if (!product) return {};

  return {
    title: `${product.title} | ${cms.representativeName}`,
    description: `${product.title} (${product.horsepower} HP, ${product.driveType}) presented by ${cms.representativeName} at ${cms.companyName}.`,
    alternates: {
      canonical: `https://tekhaftractors.com/${currentLocale}/products/${slug}`,
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { locale, slug } = await params;
  const currentLocale = (locales.includes(locale as Locale) ? locale : "en") as Locale;
  const dict = getDictionary(currentLocale);

  const cms = await getCMSData();
  const tractors = await getLiveTractors();
  const product = tractors.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const productSchema = getProductSchema(product);
  const relatedTractors = tractors
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const whatsappInquiryUrl = `${cms.socials.whatsapp}?text=${encodeURIComponent(
    `Hello Dagim, I would like to inquire about the ${product.title} from Tekhaf Trading.`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Breadcrumb
        items={[
          { label: dict.nav.home, href: `/${currentLocale}` },
          { label: dict.nav.tractors, href: `/${currentLocale}/products` },
          { label: product.title },
        ]}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-xs font-semibold px-3 py-1 rounded-md">
              {product.brand} • {product.horsepower} HP
            </div>
          </div>

          {product.gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {product.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-20 rounded-xl overflow-hidden border border-slate-200"
                >
                  <Image src={img} alt={`${product.title} view ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Info & Direct Contact */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tekhaf-700 block">
              {product.brand} • Model {product.modelNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {product.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Drive: <strong>{product.driveType}</strong> • Fuel: <strong>{product.fuelType}</strong>
            </p>
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Horsepower</span>
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
              <span className="text-slate-400 block font-medium">Availability</span>
              <span className="font-bold text-tekhaf-700">
                {product.availability === "IN_STOCK" ? "In Stock" : "Pre-Order"}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact via WhatsApp</span>
            </a>

            <a
              href={`tel:${cms.phone}`}
              className="w-full bg-tekhaf-700 hover:bg-tekhaf-800 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call Dagim ({cms.phoneDisplay})</span>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-900">{cms.representativeName}</div>
            <div className="text-slate-500">{cms.jobTitle} • {cms.companyName}</div>
          </div>
        </div>
      </div>

      {/* Description & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {product.description}
            </p>

            <h3 className="text-sm font-bold text-slate-900 pt-3">Key Features:</h3>
            <ul className="space-y-2">
              {product.keyBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Technical Specifications
            </h2>
            <div className="divide-y divide-slate-100 text-xs">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{k}</span>
                  <span className="text-slate-900 font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Capture Form Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Send Direct Inquiry
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Regarding {product.title}
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
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Related Tractors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedTractors.map((tractor) => (
            <div
              key={tractor.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-40 bg-slate-100">
                <Image src={tractor.image} alt={tractor.title} fill className="object-cover" />
                <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  {tractor.horsepower} HP
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{tractor.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{tractor.summary}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/${currentLocale}/products/${tractor.slug}`}
                    className="text-xs font-semibold text-tekhaf-700 hover:underline flex items-center gap-1"
                  >
                    <span>View details</span>
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
