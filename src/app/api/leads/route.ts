import { NextRequest, NextResponse } from "next/server";
import {
  saveNewLead,
  getAllLeads,
  updateLeadStatus,
  addLeadNote,
  deleteLeadNote,
  deleteLead,
  LeadRecord,
} from "@/lib/leads-store";
import { sendLeadNotificationEmails } from "@/lib/email";
import { logActivity } from "@/lib/activity-store";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leads = await getAllLeads();
    return NextResponse.json({ success: true, leads });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.fullName || !body.phone || !body.region) {
      return NextResponse.json(
        { success: false, error: "Name, phone number, and region are required." },
        { status: 400 }
      );
    }

    const savedLead = await saveNewLead({
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      region: body.region,
      farmSizeHectares: body.farmSizeHectares ? parseFloat(body.farmSizeHectares) : undefined,
      productTitle: body.productTitle,
      message: body.message || "",
      source: body.source || "Website Inquiry",
    });

    // Asynchronously dispatch Resend notification emails
    sendLeadNotificationEmails({
      leadId: savedLead.id,
      fullName: savedLead.fullName,
      phone: savedLead.phone,
      email: savedLead.email,
      region: savedLead.region,
      farmSizeHectares: savedLead.farmSizeHectares,
      productTitle: savedLead.productTitle,
      message: savedLead.message,
    }).catch((err) => console.error("Email notification background error:", err));

    // Log activity
    await logActivity(
      "LEAD_RECEIVED",
      "LEADS",
      `New Lead Inquiry: ${savedLead.fullName}`,
      `Interested in ${savedLead.productTitle || "Tractor Consultation"} from ${savedLead.region}. Phone: ${savedLead.phone}`,
      "Customer (Web Portal)"
    );

    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Inquiry successfully recorded. Dagim Melese will contact you shortly.",
      lead: savedLead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error while saving lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, status, note, author, statusAtUpdate } = body;

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: "Lead ID is required" },
        { status: 400 }
      );
    }

    let updatedLead: LeadRecord | null = null;
    let newNoteObj = null;

    if (note) {
      const result = await addLeadNote(
        leadId,
        author || "Dagim Melese",
        note,
        (status || statusAtUpdate) as LeadRecord["status"] | undefined
      );
      updatedLead = result.lead;
      newNoteObj = result.note;

      await logActivity(
        "LEAD_NOTE_ADDED",
        "LEADS",
        `Contact Progress Updated: ${updatedLead?.fullName || leadId}`,
        `[${status || statusAtUpdate || "UPDATE"}] "${note.substring(0, 100)}${note.length > 100 ? "..." : ""}"`,
        author || "Dagim Melese"
      );
    } else if (status) {
      updatedLead = await updateLeadStatus(leadId, status);
      await logActivity(
        "LEAD_STATUS_CHANGED",
        "LEADS",
        `Lead Status Updated: ${updatedLead?.fullName || leadId}`,
        `Pipeline stage updated to ${status}`,
        author || "Dagim Melese"
      );
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Contact progress updated successfully",
      lead: updatedLead,
      note: newNoteObj,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update lead progress" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let leadId = searchParams.get("leadId");
    let noteId = searchParams.get("noteId");

    if (!leadId) {
      const body = await req.json().catch(() => ({}));
      leadId = body.leadId;
      noteId = body.noteId;
    }

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: "Lead ID is required" },
        { status: 400 }
      );
    }

    // If noteId is specified, delete that specific history note entry
    if (noteId) {
      const result = await deleteLeadNote(leadId, noteId);
      await logActivity(
        "LEAD_NOTE_DELETED",
        "LEADS",
        `Contact History Entry Deleted`,
        `Removed progress note (${noteId}) from contact inquiry ${leadId}.`,
        "Dagim Melese"
      );

      revalidatePath("/admin/leads");

      return NextResponse.json({
        success: true,
        message: "Contact history entry deleted successfully",
        lead: result.lead,
      });
    }

    // Otherwise, delete the entire lead
    const deleted = await deleteLead(leadId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    await logActivity(
      "LEAD_DELETED",
      "LEADS",
      `Lead Removed: ${leadId}`,
      `Lead inquiry deleted from CRM platform.`,
      "Dagim Melese"
    );

    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      success: true,
      message: "Lead inquiry deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete lead or history entry" },
      { status: 500 }
    );
  }
}
