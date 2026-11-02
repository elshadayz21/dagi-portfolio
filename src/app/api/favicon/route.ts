import { NextRequest, NextResponse } from "next/server";
import { getCMSData } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cms = await getCMSData();

  // If a custom logo URL is configured in CMS, redirect to it
  if (cms.customLogoUrl) {
    return NextResponse.redirect(new URL(cms.customLogoUrl, req.url), 307);
  }

  // Otherwise, serve the vector tractor emblem favicon in brand Tekhaf blue
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="10" fill="#005B96"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 34h36" />
    <path d="M14 34v-8h12l4 8" />
    <path d="M26 26V16h-8l-4 10" />
    <path d="M20 16v-6h4" />
    <path d="M24 10V6" />
    <circle cx="12" cy="34" r="5" fill="#005B96" stroke="#FFFFFF" stroke-width="3" />
    <circle cx="35" cy="34" r="4" fill="#005B96" stroke="#FFFFFF" stroke-width="3" />
  </g>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
