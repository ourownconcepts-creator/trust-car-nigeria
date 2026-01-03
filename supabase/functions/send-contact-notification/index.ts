import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

async function sendEmail(to: string[], subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AutoTrust Nigeria <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }
  
  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message }: ContactNotificationRequest = await req.json();
    
    console.log("Sending contact notification for:", { name, email, subject });

    // Send confirmation email to the user
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AutoTrust Nigeria</h1>
          </div>
          <div class="content">
            <h2>Thank you for contacting us, ${name}!</h2>
            <p>We have received your message regarding: <strong>${subject}</strong></p>
            <p>Our team will review your inquiry and get back to you within 24 hours.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p><strong>Your message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} AutoTrust Nigeria. All rights reserved.</p>
            <p>This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const userEmailResponse = await sendEmail(
      [email],
      "We received your message - AutoTrust Nigeria",
      userEmailHtml
    );

    console.log("User confirmation email sent:", userEmailResponse);

    // Send notification to admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="info-row">
              <span class="label">Name:</span> ${name}
            </div>
            <div class="info-row">
              <span class="label">Email:</span> ${email}
            </div>
            ${phone ? `<div class="info-row"><span class="label">Phone:</span> ${phone}</div>` : ''}
            <div class="info-row">
              <span class="label">Subject:</span> ${subject}
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <div class="info-row">
              <span class="label">Message:</span>
            </div>
            <p style="background: white; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminEmailResponse = await sendEmail(
      ["support@listyourcar.ng"],
      `New Contact Form Submission: ${subject}`,
      adminEmailHtml
    );

    console.log("Admin notification email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        userEmail: userEmailResponse,
        adminEmail: adminEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-notification function:", error);
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
