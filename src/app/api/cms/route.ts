import { NextRequest, NextResponse } from "next/server";
import { getCMSData, updateCMSData, SiteCMSData } from "@/lib/cms-store";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity-store";

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
            email: body.email ?? existingProfile.email,
            address: body.officeAddress ?? existingProfile.address,
            profilePhoto: body.profilePhoto ?? existingProfile.profilePhoto,
            biography: body.biography ?? existingProfile.biography,
            whatsapp: body.socials?.whatsapp ?? existingProfile.whatsapp,
          },
        });
      }

      const existingSetting = await prisma.siteSetting.findFirst();
      if (existingSetting) {
        await prisma.siteSetting.update({
          where: { id: existingSetting.id },
          data: {
            companyName: body.companyName ?? existingSetting.companyName,
            companySlogan: body.companySlogan ?? existingSetting.companySlogan,
            salesRepresentative: body.representativeName ?? existingSetting.salesRepresentative,
            representativeRole: body.jobTitle ?? existingSetting.representativeRole,
            primaryPhone: body.phone ?? existingSetting.primaryPhone,
            whatsappNumber: body.socials?.whatsapp ?? existingSetting.whatsappNumber,
            contactEmail: body.email ?? existingSetting.contactEmail,
            officeAddress: body.officeAddress ?? existingSetting.officeAddress,
            facebookUrl: body.socials?.facebook ?? existingSetting.facebookUrl,
            telegramUrl: body.socials?.telegram ?? existingSetting.telegramUrl,
          },
        });
      }
    } catch {
      // In-memory fallback took care of it
    }

    // Invalidate cached layouts so logo and favicon update across all pages
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/api/favicon");

    // Log activity
    if (body.customLogoUrl !== undefined) {
      await logActivity(
        "LOGO_UPDATED",
        "BRAND",
        body.customLogoUrl ? "Custom Brand Logo & Favicon Updated" : "Brand Logo Reset to Default Emblem",
        body.customLogoUrl
          ? `Active logo and favicon URL updated to: ${body.customLogoUrl}`
          : "Active logo and favicon restored to official tractor emblem SVG.",
        "Dagim Melese"
      );
    } else {
      await logActivity(
        "PROFILE_UPDATED",
        "BRAND",
        "Representative Profile Updated",
        `Profile details for ${updated.representativeName} (${updated.jobTitle} at ${updated.companyName}) saved.`,
        "Dagim Melese"
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update brand & logo settings" },
      { status: 500 }
    );
  }
}
