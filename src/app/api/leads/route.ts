import { NextRequest, NextResponse } from "next/server";
import { saveNewLead, getAllLeads, updateLeadStatus, addLeadNote } from "@/lib/leads-store";
import { sendLeadNotificationEmails } from "@/lib/email";

export async function GET() {
  try {
    const leads = await getAllLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
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
    const { leadId, status, note, author } = body;

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: "Lead ID is required" },
        { status: 400 }
      );
    }

    if (status) {
      await updateLeadStatus(leadId, status);
    }

    if (note) {
      await addLeadNote(leadId, author || "Dagim Melese", note);
    }

    return NextResponse.json({ success: true, message: "Lead updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
