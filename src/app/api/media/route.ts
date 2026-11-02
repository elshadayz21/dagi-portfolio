import { NextRequest, NextResponse } from "next/server";
import {
  getMediaAssets,
  addMediaAsset,
  updateMediaAsset,
  deleteMediaAsset,
  MediaAsset,
} from "@/lib/media-store";
import { logActivity } from "@/lib/activity-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getMediaAssets();
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load media assets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.url) {
      return NextResponse.json(
        { success: false, error: "Title and Image URL/File are required" },
        { status: 400 }
      );
    }

    const newAsset = await addMediaAsset({
      title: body.title,
      url: body.url,
      format: body.format || "JPEG",
      size: body.size || "750 KB",
      category: body.category || "Tractors",
    });

    // Record in activity log
    await logActivity(
      "MEDIA_UPLOADED",
      "MEDIA",
      `New Media Uploaded: ${newAsset.title}`,
      `Asset uploaded to ${newAsset.category} (${newAsset.size}, ${newAsset.format}).`,
      "Dagim Melese"
    );

    return NextResponse.json({
      success: true,
      message: "Media asset successfully uploaded to library",
      asset: newAsset,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload media asset" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, url, category, format, size } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Media Asset ID is required" },
        { status: 400 }
      );
    }

    const updated = await updateMediaAsset(id, {
      ...(title && { title }),
      ...(url && { url }),
      ...(category && { category }),
      ...(format && { format }),
      ...(size && { size }),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Media asset not found" },
        { status: 404 }
      );
    }

    // Record in activity log
    await logActivity(
      "MEDIA_UPDATED",
      "MEDIA",
      `Media Asset Updated: ${updated.title}`,
      url
        ? `Image replaced with new upload/URL in ${updated.category}.`
        : `Metadata updated for ${updated.title}.`,
      "Dagim Melese"
    );

    return NextResponse.json({
      success: true,
      message: "Media asset successfully updated",
      asset: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update media asset" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Media ID is required" },
        { status: 400 }
      );
    }

    const allMedia = await getMediaAssets();
    const itemToDelete = allMedia.find((m) => m.id === id);
    const title = itemToDelete ? itemToDelete.title : id;

    const deleted = await deleteMediaAsset(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Media asset not found" },
        { status: 404 }
      );
    }

    // Record in activity log
    await logActivity(
      "MEDIA_DELETED",
      "MEDIA",
      `Media Asset Removed: ${title}`,
      `Asset permanently removed from the library.`,
      "Dagim Melese"
    );

    return NextResponse.json({
      success: true,
      message: "Media asset deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete media asset" },
      { status: 500 }
    );
  }
}
