import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FraudAlertRequest {
  alertId: string;
  alertType: string;
  severity: string;
  message: string;
  listingId?: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { alertId, alertType, severity, message, listingId }: FraudAlertRequest = await req.json();

    console.log("Processing fraud alert email:", { alertId, alertType, severity });

    // Only send emails for high-severity alerts
    if (severity !== "high") {
      console.log("Skipping email for non-high severity alert");
      return new Response(JSON.stringify({ skipped: true, reason: "Not high severity" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get admin emails from Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all admin user IDs
    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .in("role", ["super_admin", "support_admin", "verification_admin"]);

    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
      throw rolesError;
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admin users found");
      return new Response(JSON.stringify({ skipped: true, reason: "No admins found" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get admin emails from profiles
    const adminUserIds = adminRoles.map(r => r.user_id);
    const { data: adminProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("email")
      .in("id", adminUserIds);

    if (profilesError) {
      console.error("Error fetching admin profiles:", profilesError);
      throw profilesError;
    }

    const adminEmails = adminProfiles?.map(p => p.email).filter(Boolean) || [];

    if (adminEmails.length === 0) {
      console.log("No admin emails found");
      return new Response(JSON.stringify({ skipped: true, reason: "No admin emails" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Sending fraud alert email to admins:", adminEmails);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🚨 High Severity Fraud Alert</h1>
        </div>
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="margin-top: 0;"><strong>Alert Type:</strong> ${alertType}</p>
          <p><strong>Severity:</strong> <span style="color: #dc2626; font-weight: bold;">HIGH</span></p>
          <p><strong>Message:</strong></p>
          <p style="background: white; padding: 12px; border-radius: 4px; border: 1px solid #e5e7eb;">${message}</p>
          ${listingId ? `<p><strong>Listing ID:</strong> ${listingId}</p>` : ""}
          <p style="margin-bottom: 0; color: #6b7280; font-size: 14px;">
            Please review this alert immediately in the admin dashboard.
          </p>
        </div>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "List Your Car <onboarding@resend.dev>",
        to: adminEmails,
        subject: `🚨 HIGH SEVERITY FRAUD ALERT: ${alertType}`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();

    console.log("Fraud alert email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-fraud-alert-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
