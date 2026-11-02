import { Resend } from "resend";
import { dagimProfile } from "./data/profile";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface LeadEmailPayload {
  leadId: string;
  fullName: string;
  phone: string;
  email?: string;
  region: string;
  farmSizeHectares?: number;
  productTitle?: string;
  message: string;
}

export async function sendLeadNotificationEmails(payload: LeadEmailPayload) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "dagim@tekhaf.com";
  const senderEmail = process.env.SENDER_EMAIL || "onboarding@resend.dev";

  console.log(`[Email Dispatch] Processing inquiry from ${payload.fullName} (${payload.phone}) for ${payload.productTitle || "General Tractor Inquiry"}`);

  // 1. Prepare Admin Email (To Dagim Melese)
  const adminSubject = `🚨 New Tractor Lead: ${payload.fullName} - ${payload.region} (${payload.productTitle || "Tractor Inquiry"})`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #005B96; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">Tekhaf Trading CRM • New Lead Alert</h1>
        <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">Inquiry received via Tekhaf Tractor Sales Portal</p>
      </div>
      
      <div style="padding: 24px; background-color: #F5F9FF;">
        <h2 style="color: #0c1b2a; font-size: 18px; margin-top: 0; border-bottom: 2px solid #2B8CFF; padding-bottom: 8px;">Customer Information</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Customer Name:</strong></td>
            <td style="padding: 8px 0; color: #0c1b2a; font-size: 16px;"><strong>${payload.fullName}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Phone Number:</strong></td>
            <td style="padding: 8px 0; color: #005B96; font-size: 16px;">
              <a href="tel:${payload.phone}" style="color: #005B96; text-decoration: none; font-weight: bold;">${payload.phone}</a>
              &nbsp;|&nbsp;
              <a href="https://wa.me/${payload.phone.replace(/[^0-9]/g, "")}" style="color: #25D366; text-decoration: none; font-weight: bold;">WhatsApp Chat</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; color: #0c1b2a;">${payload.email || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Region / Location:</strong></td>
            <td style="padding: 8px 0; color: #0c1b2a; font-weight: bold;">${payload.region}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Farm Size:</strong></td>
            <td style="padding: 8px 0; color: #0c1b2a;">${payload.farmSizeHectares ? `${payload.farmSizeHectares} Hectares` : "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Interested Tractor:</strong></td>
            <td style="padding: 8px 0; color: #0074BD; font-weight: bold;">${payload.productTitle || "General Consultation Request"}</td>
          </tr>
        </table>

        <div style="background-color: white; padding: 16px; border-radius: 6px; border-left: 4px solid #005B96; margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px; color: #0c1b2a; font-size: 15px;">Customer Message / Farm Requirements:</h3>
          <p style="margin: 0; color: #334155; line-height: 1.5; white-space: pre-wrap;">${payload.message || "No additional text provided."}</p>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="https://tekhaftractors.com/admin/leads" style="background-color: #005B96; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Open in CRM Lead Management
          </a>
        </div>
      </div>
      
      <div style="background-color: #e2e8f0; padding: 12px; text-align: center; font-size: 12px; color: #64748b;">
        Tekhaf Trading • Bole Medhanialem, Addis Ababa • Representative: Dagim Melese
      </div>
    </div>
  `;

  // 2. Prepare Customer Confirmation Email
  const customerSubject = `Your Tractor Price Quote Request • Dagim Melese (Tekhaf Trading)`;
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #005B96; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">Tekhaf Trading Ethiopia</h1>
        <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">Reliable Agricultural Machinery & Tractor Solutions</p>
      </div>

      <div style="padding: 24px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #0c1b2a;">Dear <strong>${payload.fullName}</strong>,</p>
        <p style="color: #334155; line-height: 1.6;">
          Thank you for reaching out to <strong>Tekhaf Trading</strong> regarding your agricultural tractor requirements in <strong>${payload.region}</strong>.
        </p>
        <p style="color: #334155; line-height: 1.6;">
          My name is <strong>Dagim Melese</strong>, Agricultural Machinery Sales Specialist. I have received your request for <strong>${payload.productTitle || "agricultural tractors"}</strong> and am reviewing the best horsepower and implement configuration for your farmland.
        </p>

        <div style="background-color: #F5F9FF; border: 1px solid #bae0fd; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px; color: #005B96; font-size: 15px;">What to expect next:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #334155; line-height: 1.6;">
            <li>I will contact you within a few business hours via phone or WhatsApp.</li>
            <li>We will prepare an official proforma invoice with current ETB pricing and delivery schedule.</li>
            <li>Guidance on duty-free exemptions and bank financing support if needed.</li>
          </ul>
        </div>

        <div style="background-color: #005B96; color: white; padding: 16px; border-radius: 6px; text-align: center; margin-top: 24px;">
          <p style="margin: 0 0 8px; font-weight: bold; font-size: 15px;">Need an urgent price quote or field inspection?</p>
          <a href="tel:${dagimProfile.phone}" style="color: #ffffff; text-decoration: underline; font-weight: bold; margin-right: 16px;">Call Dagim: ${dagimProfile.phoneDisplay}</a>
          <a href="${dagimProfile.whatsapp}" style="background-color: #25D366; color: white; padding: 6px 14px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">WhatsApp Now</a>
        </div>

        <p style="color: #64748b; font-size: 13px; margin-top: 24px; line-height: 1.5;">
          Warm regards,<br />
          <strong>Dagim Melese</strong><br />
          Agricultural Machinery Sales Specialist<br />
          Tekhaf Trading • Addis Ababa, Ethiopia
        </p>
      </div>
    </div>
  `;

  if (resend) {
    try {
      // Send to Admin
      await resend.emails.send({
        from: senderEmail,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      });

      // Send to Customer if valid email provided
      if (payload.email && payload.email.includes("@")) {
        await resend.emails.send({
          from: senderEmail,
          to: payload.email,
          subject: customerSubject,
          html: customerHtml,
        });
      }
      return { success: true, mode: "live_resend" };
    } catch (err) {
      console.error("[Resend Error] Failed to dispatch live email:", err);
      return { success: true, mode: "fallback_logged", error: String(err) };
    }
  } else {
    console.log("[Resend Mock] No RESEND_API_KEY detected. Simulated email sent successfully to:", adminEmail);
    return { success: true, mode: "simulated_dev" };
  }
}
