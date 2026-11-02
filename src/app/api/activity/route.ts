import { NextResponse } from "next/server";
import { getActivityLogs } from "@/lib/activity-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await getActivityLogs(200);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load activity logs" },
      { status: 500 }
    );
  }
}
