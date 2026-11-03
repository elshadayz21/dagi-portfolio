import { NextRequest, NextResponse } from "next/server";
import {
  getLiveTractors,
  addOrUpdateTractor,
  patchTractor,
  deleteTractor,
} from "@/lib/cms-store";
import { TractorProduct } from "@/lib/data/inventory";
import { logActivity } from "@/lib/activity-store";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const products = await getLiveTractors();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch tractor inventory" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TractorProduct;
    if (!body.title || !body.brand || !body.horsepower) {
      return NextResponse.json(
        { success: false, error: "Title, brand, and horsepower are required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const newProduct: TractorProduct = {
      id: body.id || `prod-${Date.now()}`,
      slug,
      title: body.title,
      brand: body.brand,
      category: body.category || undefined,
      modelNumber: body.modelNumber || body.title,
      horsepower: Number(body.horsepower),
      engineType: body.engineType || "Perkins / Tier II Diesel Engine",
      fuelType: body.fuelType || "Diesel",
      transmission: body.transmission || "Mechanical Synchromesh",
      driveType: body.driveType || "4WD",
      hydraulicLift: body.hydraulicLift || "2,145 kg",
      ptoSpeed: body.ptoSpeed || "540 / 1000 RPM",
      priceETB: body.priceETB || 3500000,
      priceFormatted: body.priceFormatted || "Inquire",
      availability: body.availability || "IN_STOCK",
      isFeatured: body.isFeatured !== undefined ? body.isFeatured : true,
      image:
        body.image ||
        "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80",
      gallery: body.gallery && body.gallery.length > 0 ? body.gallery : [body.image || ""],
      summary: body.summary || `${body.title} - High performance agricultural machinery by ${body.brand}.`,
      description:
        body.description ||
        `Reliable ${body.horsepower} HP agricultural tractor for Ethiopian soils and farming operations. Genuine warranty and parts support backed by Dagim Melese at Tekhaf Trading.`,
      keyBenefits: body.keyBenefits || [
        "Fuel efficient high-torque diesel engine",
        "Genuine spare parts stocked in Addis Ababa",
        "Pre-delivery inspection & on-farm operator orientation",
      ],
      specs: body.specs || {
        "Horsepower": `${body.horsepower} HP`,
        "Drive System": body.driveType || "4WD",
        "Engine": body.engineType || "Diesel",
        "Transmission": body.transmission || "Mechanical",
      },
      bestForRegions: body.bestForRegions || ["Oromia", "Amhara", "Sidama", "Somali Region"],
    };

    const isExisting = (await getLiveTractors()).some((p) => p.id === newProduct.id);

    await addOrUpdateTractor(newProduct);

    // Invalidate site cache so footer, products page, and homepage immediately reflect the update
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/products", "page");

    // Log activity
    await logActivity(
      isExisting ? "PRODUCT_UPDATED" : "PRODUCT_ADDED",
      "PRODUCTS",
      isExisting
        ? `Tractor Updated: ${newProduct.title}`
        : `New Tractor Added to Inventory: ${newProduct.title}`,
      `${newProduct.brand} (${newProduct.horsepower} HP, ${newProduct.driveType}). Stock status: ${newProduct.availability}. Synced to footer and product catalog.`,
      "Dagim Melese"
    );

    const updatedCatalog = await getLiveTractors();
    return NextResponse.json({
      success: true,
      product: newProduct,
      products: updatedCatalog,
      message: `Tractor ${newProduct.title} saved and synchronized with footer & catalog.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save tractor" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product id is required" },
        { status: 400 }
      );
    }

    const patched = await patchTractor(id, updates);
    if (!patched) {
      return NextResponse.json(
        { success: false, error: "Tractor product not found" },
        { status: 404 }
      );
    }

    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/products", "page");

    await logActivity(
      "PRODUCT_UPDATED",
      "PRODUCTS",
      `Tractor Status Updated: ${patched.title}`,
      `Availability: ${patched.availability}. Featured: ${patched.isFeatured ? "Yes" : "No"}.`,
      "Dagim Melese"
    );

    return NextResponse.json({ success: true, product: patched });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update tractor" },
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
        { success: false, error: "Product id is required" },
        { status: 400 }
      );
    }

    const currentCatalog = await getLiveTractors();
    const targetProduct = currentCatalog.find((p) => p.id === id);

    await deleteTractor(id);

    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/products", "page");

    await logActivity(
      "PRODUCT_DELETED",
      "PRODUCTS",
      `Tractor Removed: ${targetProduct?.title || id}`,
      `Removed from live catalog and footer listings.`,
      "Dagim Melese"
    );

    return NextResponse.json({
      success: true,
      message: `Tractor ${targetProduct?.title || id} removed from inventory and footer.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete tractor" },
      { status: 500 }
    );
  }
}
