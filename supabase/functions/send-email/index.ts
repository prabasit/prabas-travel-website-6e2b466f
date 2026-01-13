import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Brand colors and styling
const brandStyles = {
  primaryColor: "#1e3a5f", // Navy blue
  secondaryColor: "#f97316", // Orange
  backgroundColor: "#f8fafc",
  textColor: "#334155",
  lightGray: "#e2e8f0",
};

// Base email template wrapper
const emailWrapper = (content: string, preheader: string = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prabas Travel</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${brandStyles.backgroundColor}; color: ${brandStyles.textColor};">
  <!-- Preheader text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${preheader}
  </div>
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${brandStyles.backgroundColor};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${brandStyles.primaryColor} 0%, #2d4a6f 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                ✈️ Prabas Travel
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">
                Connecting Nepal to the World
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: ${brandStyles.lightGray}; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: ${brandStyles.textColor};">
                <strong>Prabas Travel & Tours Pvt. Ltd.</strong>
              </p>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">
                Chhaya Devi Complex, Shop No. 315-317, Thamel, Kathmandu, Nepal
              </p>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b;">
                📞 +977-1-4700921 ,4700922 | ✉️ info@prabastravel.com
              </p>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #cbd5e1;">
                <a href="https://prabastravel.com" style="color: ${brandStyles.primaryColor}; text-decoration: none; font-size: 13px; font-weight: 500;">
                  Visit our website →
                </a>
              </div>
            </td>
          </tr>
        </table>
        
        <!-- Legal footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-top: 24px;">
          <tr>
            <td style="text-align: center; padding: 0 20px;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                © ${new Date().getFullYear()} Prabas Travel & Tours Pvt. Ltd. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Helper for styled buttons
const styledButton = (text: string, url: string = "#") => `
  <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, ${brandStyles.secondaryColor} 0%, #ea580c 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px 0 rgba(249, 115, 22, 0.4);">
    ${text}
  </a>
`;

// Helper for info box
const infoBox = (title: string, items: { label: string; value: string }[]) => `
  <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin: 24px 0;">
    <h3 style="margin: 0 0 16px 0; color: ${brandStyles.primaryColor}; font-size: 16px; font-weight: 600;">
      ${title}
    </h3>
    ${items.map(item => `
      <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
        <span style="color: #64748b; font-size: 13px;">${item.label}</span>
        <p style="margin: 4px 0 0 0; color: ${brandStyles.textColor}; font-size: 14px; font-weight: 500;">
          ${item.value}
        </p>
      </div>
    `).join('')}
  </div>
`;

// Email Templates
const emailTemplates = {
  // Newsletter - Welcome email to subscriber
  newsletterWelcome: (email: string) => ({
    subject: " Welcome to Prabas Travel Newsletter!",
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${brandStyles.secondaryColor} 0%, #ea580c 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 36px;">🌍</span>
        </div>
        <h2 style="margin: 0 0 8px 0; color: ${brandStyles.primaryColor}; font-size: 24px; font-weight: 700;">
          Welcome Aboard!
        </h2>
        <p style="margin: 0; color: #64748b; font-size: 15px;">
          You're now part of our travel community
        </p>
      </div>
      
      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: ${brandStyles.textColor};">
        Thank you for subscribing to the <strong>Prabas Travel Newsletter</strong>! You've just taken the first step towards your Journey to the World.
      </p>
      
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: ${brandStyles.textColor};">
        Here's what you can expect from us:
      </p>
      
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
          <span style="font-size: 24px; margin-right: 12px;">✨</span>
          <div>
            <strong style="color: ${brandStyles.primaryColor};">Exclusive Travel Deals</strong>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Special discounts on flights, hotels, and packages</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
          <span style="font-size: 24px; margin-right: 12px;">🏔️</span>
          <div>
            <strong style="color: ${brandStyles.primaryColor};">Destination Guides</strong>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Insider tips and hidden gems across World</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start;">
          <span style="font-size: 24px; margin-right: 12px;">📍</span>
          <div>
            <strong style="color: ${brandStyles.primaryColor};">Travel Inspiration</strong>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Stories and photos from fellow travelers</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 32px;">
        ${styledButton("Explore Destinations", "https://prabastravel.com")}
      </div>
    `, "Welcome to Prabas Travel Newsletter! Get ready for exclusive deals and travel inspiration."),
  }),

  // Newsletter - Notification to admin
  newsletterAdmin: (email: string) => ({
    subject: "📬 New Newsletter Subscription",
    html: emailWrapper(`
      <h2 style="margin: 0 0 16px 0; color: ${brandStyles.primaryColor}; font-size: 22px; font-weight: 700;">
        New Newsletter Subscriber
      </h2>
      
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: ${brandStyles.textColor};">
        Someone new has subscribed to your newsletter. Here are the details:
      </p>
      
      ${infoBox("Subscription Details", [
        { label: "Email Address", value: email },
        { label: "Subscribed At", value: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) },
        { label: "Status", value: "✅ Active" }
      ])}
      
      <p style="margin: 24px 0 0 0; font-size: 14px; color: #64748b; text-align: center;">
        You can manage subscribers from your admin dashboard.
      </p>
    `, "New newsletter subscription received"),
  }),

  // Inquiry - Confirmation to sender
  inquiryConfirmation: (name: string, subject: string, message: string) => ({
    subject: "✅ We've Received Your Message - Prabas Travel",
    html: emailWrapper(`
      <h2 style="margin: 0 0 16px 0; color: ${brandStyles.primaryColor}; font-size: 22px; font-weight: 700;">
        Thank You, ${name}!
      </h2>
      
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: ${brandStyles.textColor};">
        We've received your message and our team is already on it! Thank you for Reaching to us.
      </p>
      
      ${infoBox("Your Message Summary", [
        { label: "Subject", value: subject },
        { label: "Message", value: message.substring(0, 200) + (message.length > 200 ? '...' : '') },
        { label: "Submitted On", value: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) }
      ])}
      
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          <strong>💡 Quick Tip:</strong> While you wait, check out Holidays destination we offer!
        </p>
      </div>
      
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: ${brandStyles.textColor};">
        If your inquiry is urgent, feel free to call us directly at <strong>+977-1-4700921</strong>.
      </p>
      
      <div style="text-align: center;">
        ${styledButton("Holiday Packages", "https://prabasholidays.com")}
        ${styledButton("Book your Flights & Hotels", "https://flightsnepal.com")}
      </div>
    `, `Thank you for contacting Prabas Travel! We'll reach you out Shortly.`),
  }),

  // Inquiry - Notification to admin
  inquiryAdmin: (name: string, email: string, phone: string, subject: string, message: string) => ({
    subject: `📩 New Inquiry: ${subject}`,
    html: emailWrapper(`
      <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: 500;">
          🔔 New customer inquiry received
        </p>
      </div>
      
      <h2 style="margin: 0 0 24px 0; color: ${brandStyles.primaryColor}; font-size: 22px; font-weight: 700;">
        ${subject}
      </h2>
      
      ${infoBox("Contact Information", [
        { label: "Full Name", value: name },
        { label: "Email Address", value: email },
        { label: "Phone Number", value: phone || "Not provided" },
        { label: "Received At", value: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) }
      ])}
      
      <div style="background-color: #ffffff; border: 1px solid ${brandStyles.lightGray}; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px 0; color: ${brandStyles.primaryColor}; font-size: 16px; font-weight: 600;">
          Message
        </h3>
        <p style="margin: 0; font-size: 15px; line-height: 1.8; color: ${brandStyles.textColor}; white-space: pre-wrap;">
          ${message}
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:${email}" style="display: inline-block; background: ${brandStyles.primaryColor}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Reply to ${name} →
        </a>
      </div>
    `, `New inquiry from ${name}: ${subject}`),
  }),

  // Career Application - Confirmation to applicant
  careerConfirmation: (name: string, position: string) => ({
    subject: `🎯 Application Received for ${position} - Prabas Travel`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 36px;">📄</span>
        </div>
        <h2 style="margin: 0 0 8px 0; color: ${brandStyles.primaryColor}; font-size: 24px; font-weight: 700;">
          Application Received!
        </h2>
      </div>
      
      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: ${brandStyles.textColor};">
        Dear <strong>${name}</strong>,
      </p>
      
      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: ${brandStyles.textColor};">
        Thank you for applying for the <strong>${position}</strong> position at Prabas Travel! We're excited that you're interested in joining our team.
      </p>
      
      ${infoBox("Application Summary", [
        { label: "Position Applied", value: position },
        { label: "Application Date", value: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) },
        { label: "Status", value: "📋 Under Review" }
      ])}
      
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="margin: 0 0 16px 0; color: #166534; font-size: 16px; font-weight: 600;">
          What happens next?
        </h3>
        <ol style="margin: 0; padding-left: 20px; color: #166534; font-size: 14px; line-height: 1.8;">
          <li>Our HR team will review your application</li>
          <li>If shortlisted, we'll contact you for an interview</li>
          <li>You'll receive updates via email</li>
        </ol>
      </div>
      
      <p style="margin: 24px 0 0 0; font-size: 15px; line-height: 1.7; color: ${brandStyles.textColor};">
        We appreciate your interest in Prabas Travel and will be in touch soon!
      </p>
      
      <p style="margin: 24px 0 0 0; font-size: 15px; line-height: 1.7; color: ${brandStyles.textColor};">
        Best regards,<br>
        <strong>The Prabas Travel HR Team</strong>
      </p>
    `, `Your application for ${position} has been received. We'll review it shortly!`),
  }),

  // Career Application - Notification to admin
  careerAdmin: (name: string, email: string, phone: string, position: string, coverLetter: string, resumeUrl: string) => ({
    subject: `👤 New Job Application: ${position}`,
    html: emailWrapper(`
      <div style="background: linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #86198f; font-weight: 500;">
          👤 New job application received for ${position}
        </p>
      </div>
      
      <h2 style="margin: 0 0 24px 0; color: ${brandStyles.primaryColor}; font-size: 22px; font-weight: 700;">
        Application for ${position}
      </h2>
      
      ${infoBox("Applicant Information", [
        { label: "Full Name", value: name },
        { label: "Email Address", value: email },
        { label: "Phone Number", value: phone || "Not provided" },
        { label: "Applied At", value: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) }
      ])}
      
      <div style="background-color: #ffffff; border: 1px solid ${brandStyles.lightGray}; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px 0; color: ${brandStyles.primaryColor}; font-size: 16px; font-weight: 600;">
          Cover Letter
        </h3>
        <p style="margin: 0; font-size: 15px; line-height: 1.8; color: ${brandStyles.textColor}; white-space: pre-wrap;">
          ${coverLetter}
        </p>
      </div>
      
      ${resumeUrl ? `
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resumeUrl}" style="display: inline-block; background: ${brandStyles.primaryColor}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
            📎 Download Resume
          </a>
        </div>
      ` : `
        <p style="text-align: center; color: #94a3b8; font-size: 14px;">
          No resume attached
        </p>
      `}
      
      <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:${email}" style="display: inline-block; background: ${brandStyles.secondaryColor}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Contact Applicant →
        </a>
      </div>
    `, `New job application from ${name} for ${position}`),
  }),
};

interface EmailRequest {
  type: 'newsletter' | 'inquiry' | 'career';
  data: {
    // Common fields
    email: string;
    name?: string;
    
    // Inquiry specific
    phone?: string;
    subject?: string;
    message?: string;
    
    // Career specific
    position?: string;
    coverLetter?: string;
    resumeUrl?: string;
  };
  adminEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, adminEmail = "info@prabastravel.com" }: EmailRequest = await req.json();

    console.log(`Processing ${type} email for:`, data.email);

    const emailsToSend: Array<{ to: string; subject: string; html: string; replyTo?: string }> = [];

    switch (type) {
      case 'newsletter': {
        // Email to subscriber
        const welcomeEmail = emailTemplates.newsletterWelcome(data.email);
        emailsToSend.push({
          to: data.email,
          subject: welcomeEmail.subject,
          html: welcomeEmail.html,
          replyTo: adminEmail,
        });

        // Email to admin
        const adminNotification = emailTemplates.newsletterAdmin(data.email);
        emailsToSend.push({
          to: adminEmail,
          subject: adminNotification.subject,
          html: adminNotification.html,
          replyTo: data.email,
        });
        break;
      }

      case 'inquiry': {
        // Confirmation to sender
        const confirmationEmail = emailTemplates.inquiryConfirmation(
          data.name || "Customer",
          data.subject || "General Inquiry",
          data.message || ""
        );
        emailsToSend.push({
          to: data.email,
          subject: confirmationEmail.subject,
          html: confirmationEmail.html,
          replyTo: adminEmail,
        });

        // Notification to admin
        const adminNotification = emailTemplates.inquiryAdmin(
          data.name || "Unknown",
          data.email,
          data.phone || "",
          data.subject || "General Inquiry",
          data.message || ""
        );
        emailsToSend.push({
          to: adminEmail,
          subject: adminNotification.subject,
          html: adminNotification.html,
          replyTo: data.email,
        });
        break;
      }

      case 'career': {
        // Confirmation to applicant
        const confirmationEmail = emailTemplates.careerConfirmation(
          data.name || "Applicant",
          data.position || "Open Position"
        );
        emailsToSend.push({
          to: data.email,
          subject: confirmationEmail.subject,
          html: confirmationEmail.html,
          replyTo: adminEmail,
        });

        // Notification to admin
        const adminNotification = emailTemplates.careerAdmin(
          data.name || "Unknown",
          data.email,
          data.phone || "",
          data.position || "Open Position",
          data.coverLetter || "",
          data.resumeUrl || ""
        );
        emailsToSend.push({
          to: adminEmail,
          subject: adminNotification.subject,
          html: adminNotification.html,
          replyTo: data.email,
        });
        break;
      }

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    // Send all emails
    const results = await Promise.all(
      emailsToSend.map((email) =>
        resend.emails.send({
          // IMPORTANT: To send from info@prabastravel.com, you MUST verify prabastravel.com in Resend.
          // Otherwise Resend will keep you in "testing" mode and block sends to external recipients.
          from: "Prabas Travel <info@prabastravel.com>",
          to: [email.to],
          subject: email.subject,
          html: email.html,
          replyTo: email.replyTo,
        })
      )
    );

    const failed = results
      .map((r, idx) => ({ idx, error: r.error }))
      .filter((x) => x.error);

    if (failed.length > 0) {
      console.error("One or more emails failed:", failed);
      return new Response(
        JSON.stringify({ success: false, results }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Emails sent successfully:", results);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
