import { NextRequest, NextResponse } from "next/server";
import {
  getAllGalleryItems,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  GalleryItem,
} from "@/lib/gallery-store";
import { logActivity } from "@/lib/activity-store";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getAllGalleryItems();
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      type,
      mediaUrl,
      thumbnailUrl,
      location,
      farmerName,
      tractorModel,
      category,
      featured,
    } = body;

    if (!title || !mediaUrl || !type) {
      return NextResponse.json(
        { success: false, error: "Title, media URL, and media type are required." },
        { status: 400 }
      );
    }

    const newItem = await addGalleryItem({
      title,
      description: description || "",
      type: type === "VIDEO" ? "VIDEO" : "IMAGE",
      mediaUrl,
      thumbnailUrl: thumbnailUrl || undefined,
      location: location || "Ethiopia",
      farmerName: farmerName || undefined,
      tractorModel: tractorModel || undefined,
      category: category || "FIELD_WORK",
      featured: Boolean(featured),
    });

    await logActivity(
      "GALLERY_ITEM_ADDED",
      "GALLERY",
      `Gallery Media Attached: ${newItem.title}`,
      `New ${newItem.type.toLowerCase()} added from ${newItem.location} (${newItem.category}).`,
      "Dagim Melese"
    );

    revalidatePath("/admin/gallery");
    revalidatePath("/admin/media");
    revalidatePath("/en");
    revalidatePath("/en/gallery");

    return NextResponse.json({
      success: true,
      message: "Gallery media item successfully attached.",
      item: newItem,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add gallery item." },
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
        { success: false, error: "Gallery item ID is required." },
        { status: 400 }
      );
    }

    const updated = await updateGalleryItem(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Gallery item not found." },
        { status: 404 }
      );
    }

    await logActivity(
      "GALLERY_ITEM_UPDATED",
      "GALLERY",
      `Gallery Item Updated: ${updated.title}`,
      `Changes saved for gallery asset (${updated.type}).`,
      "Dagim Melese"
    );

    revalidatePath("/admin/gallery");
    revalidatePath("/en");
    revalidatePath("/en/gallery");

    return NextResponse.json({
      success: true,
      message: "Gallery item successfully updated.",
      item: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update gallery item." },
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
        { success: false, error: "Gallery item ID is required." },
        { status: 400 }
      );
    }

    const deleted = await deleteGalleryItem(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Gallery item not found." },
        { status: 404 }
      );
    }

    await logActivity(
      "GALLERY_ITEM_DELETED",
      "GALLERY",
      `Gallery Item Removed`,
      `Deleted media asset (${id}) from public gallery.`,
      "Dagim Melese"
    );

    revalidatePath("/admin/gallery");
    revalidatePath("/en");
    revalidatePath("/en/gallery");

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete gallery item." },
      { status: 500 }
    );
  }
}
