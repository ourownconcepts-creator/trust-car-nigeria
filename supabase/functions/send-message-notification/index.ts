import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MessageNotificationRequest {
  recipientId: string;
  senderName: string;
  listingTitle: string;
  messagePreview: string;
  listingId: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-message-notification function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { recipientId, senderName, listingTitle, messagePreview, listingId }: MessageNotificationRequest = await req.json();

    console.log("Notification request:", { recipientId, senderName, listingTitle });

    // Get recipient's email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", recipientId)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching recipient profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Recipient not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Sending notification email to:", profile.email);

    const emailResponse = await resend.emails.send({
      from: "List Your Car <notifications@resend.dev>",
      to: [profile.email],
      subject: `New message about ${listingTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                <h1 style="color: #18181b; font-size: 24px; margin: 0 0 16px 0;">
                  New Message Received
                </h1>
                
                <p style="color: #71717a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                  Hi ${profile.full_name || 'there'},
                </p>
                
                <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                  <strong>${senderName}</strong> sent you a message about your listing "<strong>${listingTitle}</strong>":
                </p>
                
                <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; margin: 0 0 24px 0;">
                  <p style="color: #3f3f46; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">
                    "${messagePreview.length > 150 ? messagePreview.substring(0, 150) + '...' : messagePreview}"
                  </p>
                </div>
                
                <a href="https://listyourcar.ng/dashboard" 
                   style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  View Message
                </a>
                
                <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
                
                <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
                  You received this email because someone messaged you on List Your Car.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-message-notification function:", error);
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
