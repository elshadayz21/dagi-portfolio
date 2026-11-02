import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { tractorInventory } from "@/lib/data/inventory";
import { serviceAreas } from "@/lib/data/service-areas";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tekhaftractors.com";
  const routes: MetadataRoute.Sitemap = [];

  const staticPages = [
    "",
    "/products",
    "/about",
    "/service-areas",
    "/contact",
    "/tractors-addis-ababa",
    "/tractors-oromia",
    "/tractors-sidama",
    "/tractors-somali-region",
    "/agricultural-equipment-ethiopia",
  ];

  for (const locale of locales) {
    // Static routes
    for (const page of staticPages) {
      routes.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1.0 : page === "/products" ? 0.9 : 0.8,
      });
    }

    // Dynamic Tractor Product routes
    for (const tractor of tractorInventory) {
      routes.push({
        url: `${baseUrl}/${locale}/products/${tractor.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }

  return routes;
}
