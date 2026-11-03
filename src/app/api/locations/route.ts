import { NextRequest, NextResponse } from "next/server";
import {
  getAllLocations,
  addLocation,
  updateLocation,
  deleteLocation,
  LocationItem,
} from "@/lib/location-store";
import { logActivity } from "@/lib/activity-store";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("all") === "true";
    const regionFilter = searchParams.get("region");

    let locations = await getAllLocations(!includeInactive);

    if (regionFilter && regionFilter !== "ALL") {
      locations = locations.filter(
        (l) => l.region.toLowerCase() === regionFilter.toLowerCase()
      );
    }

    return NextResponse.json({ success: true, locations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      region,
      slug,
      title,
      subtitle,
      heroImage,
      description,
      farmingContext,
      recommendedHorsepower,
      popularTractors,
      hubOffice,
      phone,
      active,
    } = body;

    if (!name || !region || !title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Location name, region, title, and description are required.",
        },
        { status: 400 }
      );
    }

    const newLoc = await addLocation({
      name,
      region,
      slug,
      title,
      subtitle,
      heroImage,
      description,
      farmingContext,
      recommendedHorsepower,
      popularTractors,
      hubOffice,
      phone,
      active: active !== undefined ? Boolean(active) : true,
    });

    await logActivity(
      "LOCATION_ADDED",
      "LOCATIONS",
      `New Location Hub Added: ${newLoc.name} (${newLoc.region})`,
      `Created regional tractor service area "${newLoc.name}" with dedicated field dispatch.`,
      "Dagim Melese"
    );

    revalidatePath("/admin/locations");
    revalidatePath("/en/service-areas");
    revalidatePath("/am/service-areas");
    revalidatePath("/or/service-areas");
    revalidatePath("/so/service-areas");
    revalidatePath("/sid/service-areas");

    return NextResponse.json(
      {
        success: true,
        message: `Location "${newLoc.name}" successfully created.`,
        location: newLoc,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create location." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Location ID is required." },
        { status: 400 }
      );
    }

    const updated = await updateLocation(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Location not found." },
        { status: 404 }
      );
    }

    await logActivity(
      "LOCATION_UPDATED",
      "LOCATIONS",
      `Location Updated: ${updated.name}`,
      `Modified regional settings and details for ${updated.name} (${updated.region}).`,
      "Dagim Melese"
    );

    revalidatePath("/admin/locations");
    revalidatePath("/en/service-areas");
    revalidatePath("/am/service-areas");
    revalidatePath("/or/service-areas");

    return NextResponse.json({
      success: true,
      message: "Location successfully updated.",
      location: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update location." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Location ID is required." },
        { status: 400 }
      );
    }

    const deleted = await deleteLocation(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Location not found." },
        { status: 404 }
      );
    }

    await logActivity(
      "LOCATION_DELETED",
      "LOCATIONS",
      `Location Removed: ${id}`,
      `Deleted regional hub entry (${id}) from active service catalog.`,
      "Dagim Melese"
    );

    revalidatePath("/admin/locations");
    revalidatePath("/en/service-areas");

    return NextResponse.json({
      success: true,
      message: "Location successfully deleted.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete location." },
      { status: 500 }
    );
  }
}
