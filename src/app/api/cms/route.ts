import { NextRequest, NextResponse } from "next/server";
import { getCMSData, updateCMSData, SiteCMSData } from "@/lib/cms-store";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  const data = await getCMSData();
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<SiteCMSData>;

    // Update in-memory store
    const updated = await updateCMSData(body);

    // If database is available, persist updates
    try {
      const existingProfile = await prisma.profile.findFirst();
      if (existingProfile) {
        await prisma.profile.update({
          where: { id: existingProfile.id },
          data: {
            fullName: body.representativeName ?? existingProfile.fullName,
            jobTitle: body.jobTitle ?? existingProfile.jobTitle,
            companyName: body.companyName ?? existingProfile.companyName,
            phone: body.phone ?? existingProfile.phone,
            phoneDisplay: body.phoneDisplay ?? existingProfile.phoneDisplay,
            email: body.email ?? existingProfile.email,
            address: body.officeAddress ?? existingProfile.address,
            biography: body.biography ?? existingProfile.biography,
            whatsapp: body.socials?.whatsapp ?? existingProfile.whatsapp,
            telegram: body.socials?.telegram ?? existingProfile.telegram,
            linkedin: body.socials?.linkedin ?? existingProfile.linkedin,
          },
        });
      }

      const existingSetting = await prisma.siteSetting.findFirst();
      if (existingSetting) {
        await prisma.siteSetting.update({
          where: { id: existingSetting.id },
          data: {
            companyName: body.companyName ?? existingSetting.companyName,
            phone: body.phone ?? existingSetting.phone,
            email: body.email ?? existingSetting.email,
            address: body.officeAddress ?? existingSetting.address,
            logoUrl: body.customLogoUrl !== undefined ? body.customLogoUrl : existingSetting.logoUrl,
          },
        });
      }
    } catch {
      // In-memory fallback took care of it
    }

    // Invalidate cached layouts so logo and favicon update across all pages
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update brand & logo settings" },
      { status: 500 }
    );
  }
}
