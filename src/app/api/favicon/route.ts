import { NextRequest, NextResponse } from "next/server";
import { getCMSData } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cms = await getCMSData();

  if (cms.customLogoUrl) {
    const logoUrl = cms.customLogoUrl.trim();

    // 1. Data URI handling (e.g. uploaded images or base64 data)
    if (logoUrl.startsWith("data:")) {
      try {
        const matches = logoUrl.match(/^data:([^;,]+)(?:;charset=[^;,]+)?(?:;(base64))?,(.*)$/);
        if (matches) {
          const mimeType = matches[1] || "image/png";
          const isBase64 = matches[2] === "base64";
          const rawData = matches[3];

          const buffer = isBase64
            ? Buffer.from(rawData, "base64")
            : Buffer.from(decodeURIComponent(rawData), "utf-8");

          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": mimeType,
              "Cache-Control": "public, max-age=120, s-maxage=120, stale-while-revalidate=300",
            },
          });
        }
      } catch (err) {
        console.error("Error decoding custom logo data URI for favicon:", err);
      }
    }

    // 2. Absolute HTTP/HTTPS URLs (Cloudinary, Imgur, S3, etc.)
    if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
      try {
        return NextResponse.redirect(new URL(logoUrl), 307);
      } catch (err) {
        console.error("Invalid custom logo URL for favicon redirect:", err);
      }
    }

    // 3. Local relative paths (e.g. /images/...)
    if (logoUrl.startsWith("/")) {
      try {
        return NextResponse.redirect(new URL(logoUrl, req.url), 307);
      } catch (err) {
        console.error("Invalid relative logo path for favicon redirect:", err);
      }
    }
  }

  // 4. Default: vector tractor emblem in official Tekhaf Blue (#005B96)
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
