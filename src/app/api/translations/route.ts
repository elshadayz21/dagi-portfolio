import { NextRequest, NextResponse } from "next/server";
import {
  getAllDictionaries,
  updateDictionary,
  Dictionary,
} from "@/lib/i18n/dictionaries";
import { Locale, locales } from "@/lib/i18n/config";
import { getCMSData, updateCMSData } from "@/lib/cms-store";
import { logActivity } from "@/lib/activity-store";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const dictionaries = getAllDictionaries();
    const cms = await getCMSData();
    return NextResponse.json({
      success: true,
      dictionaries,
      enabledLocales: cms.enabledLocales,
      defaultLocale: cms.defaultLocale,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load translations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { locale, updates, enabledLocales, defaultLocale } = body as {
      locale?: Locale;
      updates?: Partial<Dictionary>;
      enabledLocales?: string[];
      defaultLocale?: string;
    };

    if (enabledLocales || defaultLocale) {
      await updateCMSData({
        enabledLocales: enabledLocales,
        defaultLocale: defaultLocale,
      });
    }

    if (locale && updates && locales.includes(locale)) {
      updateDictionary(locale, updates);
      await logActivity(
        "TRANSLATION_UPDATED",
        "SYSTEM",
        `Translations Updated: ${locale.toUpperCase()}`,
        `Custom phrasing for locale '${locale}' saved in CMS translation store.`,
        "Dagim Melese"
      );
    }

    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      dictionaries: getAllDictionaries(),
      message: "Language and translation settings updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update translations" },
      { status: 500 }
    );
  }
}
