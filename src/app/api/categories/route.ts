import { NextRequest, NextResponse } from "next/server";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  CategoryItem,
} from "@/lib/category-store";
import { getLiveTractors } from "@/lib/cms-store";
import { getMediaAssets } from "@/lib/media-store";
import { logActivity } from "@/lib/activity-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as "PRODUCT" | "MEDIA" | "BOTH" | "ALL" | null;

    const categories = await getCategories(type || "ALL");
    const [tractors, media] = await Promise.all([
      getLiveTractors().catch(() => []),
      getMediaAssets().catch(() => []),
    ]);

    // Attach real-time usage counts
    const enriched = categories.map((cat) => {
      const productMatches = tractors.filter((t) => {
        if (!t.category) return false;
        return (
          t.category.toLowerCase() === cat.name.toLowerCase() ||
          t.category.toLowerCase() === cat.slug.toLowerCase()
        );
      }).length;

      const mediaMatches = media.filter((m) => {
        if (!m.category) return false;
        return (
          m.category.toLowerCase() === cat.name.toLowerCase() ||
          m.category.toLowerCase() === cat.slug.toLowerCase()
        );
      }).length;

      return {
        ...cat,
        productCount: productMatches,
        mediaCount: mediaMatches,
        totalItems: productMatches + mediaMatches,
      };
    });

    return NextResponse.json({ success: true, categories: enriched });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, type, description } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const newCategory = await addCategory({
      name: name.trim(),
      slug: slug ? slug.trim() : undefined,
      type: type || "BOTH",
      description: description ? description.trim() : "",
    });

    await logActivity(
      "CATEGORY_ADDED",
      "PRODUCTS",
      `New Category Created: ${newCategory.name}`,
      `Created category "${newCategory.name}" (${newCategory.type}) for catalog and asset management.`,
      "Dagim Melese"
    );

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, slug, type, description } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Category ID is required for update" },
        { status: 400 }
      );
    }

    const updated = await updateCategory(id, { name, slug, type, description });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    await logActivity(
      "CATEGORY_UPDATED",
      "PRODUCTS",
      `Category Updated: ${updated.name}`,
      `Updated category details for "${updated.name}" (${updated.type}).`,
      "Dagim Melese"
    );

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // query param was preferred
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required for deletion" },
        { status: 400 }
      );
    }

    // Find category name before deletion for audit logging
    const all = await getCategories("ALL");
    const target = all.find((c) => c.id === id);

    const deleted = await deleteCategory(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Category not found or already deleted" },
        { status: 404 }
      );
    }

    await logActivity(
      "CATEGORY_DELETED",
      "PRODUCTS",
      `Category Removed: ${target ? target.name : id}`,
      `Category "${target ? target.name : id}" was permanently deleted from the system.`,
      "Dagim Melese"
    );

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
