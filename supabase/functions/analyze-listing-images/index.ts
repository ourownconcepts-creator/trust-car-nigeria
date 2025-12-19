import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.88.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { listingId, imageUrls } = await req.json();
    
    console.log(`Analyzing images for listing: ${listingId}`);
    console.log(`Number of images to analyze: ${imageUrls?.length || 0}`);

    if (!listingId || !imageUrls || imageUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing listingId or imageUrls' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active listings with images (excluding the current listing)
    const { data: existingListings, error: fetchError } = await supabase
      .from('car_listings')
      .select('id, title, images, vin')
      .neq('id', listingId)
      .not('images', 'is', null);

    if (fetchError) {
      console.error('Error fetching existing listings:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${existingListings?.length || 0} existing listings to compare`);

    const alerts: any[] = [];

    // Check for duplicate VIN
    const { data: currentListing } = await supabase
      .from('car_listings')
      .select('vin, title')
      .eq('id', listingId)
      .single();

    if (currentListing?.vin) {
      const duplicateVin = existingListings?.find(l => l.vin === currentListing.vin);
      if (duplicateVin) {
        console.log(`Duplicate VIN detected: ${currentListing.vin}`);
        alerts.push({
          listing_id: listingId,
          alert_type: 'duplicate_vin',
          severity: 'high',
          message: `Duplicate VIN detected: ${currentListing.vin}. This VIN already exists in listing "${duplicateVin.title}"`,
          related_listing_id: duplicateVin.id,
        });
      }
    }

    // Use AI to analyze image similarity
    if (existingListings && existingListings.length > 0 && imageUrls.length > 0) {
      // Take first image from new listing to compare
      const newListingImage = imageUrls[0];
      
      // Compare against existing listings with images
      for (const existingListing of existingListings.slice(0, 10)) { // Limit to 10 comparisons
        if (!existingListing.images || existingListing.images.length === 0) continue;
        
        const existingImage = existingListing.images[0];
        
        console.log(`Comparing images between listings...`);

        try {
          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'system',
                  content: `You are an image similarity analyzer for a car marketplace. Your job is to detect if two car images might be of the SAME vehicle being fraudulently reposted. 
                  
                  Compare the two images and determine:
                  1. If they appear to be the same vehicle (same car, same photos, or very similar angles of what looks like the identical car)
                  2. Provide a similarity score from 0-100 where 100 means definitely the same car/photo
                  
                  Respond ONLY with valid JSON in this exact format:
                  {"isSimilar": boolean, "score": number, "reason": "brief explanation"}`
                },
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: 'Compare these two car listing images. Are they the same vehicle or a duplicate posting?' },
                    { type: 'image_url', image_url: { url: newListingImage } },
                    { type: 'image_url', image_url: { url: existingImage } }
                  ]
                }
              ],
            }),
          });

          if (!response.ok) {
            if (response.status === 429) {
              console.log('Rate limited, skipping remaining comparisons');
              break;
            }
            console.error(`AI API error: ${response.status}`);
            continue;
          }

          const aiResponse = await response.json();
          const content = aiResponse.choices?.[0]?.message?.content;
          
          if (content) {
            try {
              // Extract JSON from the response
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                console.log(`Similarity result: ${JSON.stringify(result)}`);
                
                if (result.isSimilar && result.score >= 70) {
                  alerts.push({
                    listing_id: listingId,
                    alert_type: 'image_similarity',
                    severity: result.score >= 90 ? 'high' : 'medium',
                    message: `Similar images detected (${result.score}% match): ${result.reason}`,
                    related_listing_id: existingListing.id,
                    similarity_score: result.score,
                  });
                }
              }
            } catch (parseError) {
              console.error('Failed to parse AI response:', content);
            }
          }
        } catch (aiError) {
          console.error('Error calling AI API:', aiError);
        }
      }
    }

    // Insert fraud alerts into database
    if (alerts.length > 0) {
      console.log(`Inserting ${alerts.length} fraud alerts`);
      const { data: insertedAlerts, error: insertError } = await supabase
        .from('fraud_alerts')
        .insert(alerts)
        .select();

      if (insertError) {
        console.error('Error inserting fraud alerts:', insertError);
      }

      // Send email notifications for high-severity alerts
      const highSeverityAlerts = insertedAlerts?.filter(a => a.severity === 'high') || [];
      for (const alert of highSeverityAlerts) {
        try {
          console.log(`Triggering email notification for high-severity alert: ${alert.id}`);
          await supabase.functions.invoke('send-fraud-alert-email', {
            body: {
              alertId: alert.id,
              alertType: alert.alert_type,
              severity: alert.severity,
              message: alert.message,
              listingId: alert.listing_id,
            },
          });
        } catch (emailError) {
          console.error('Failed to send fraud alert email:', emailError);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        alertsCreated: alerts.length,
        alerts: alerts.map(a => ({ type: a.alert_type, severity: a.severity, message: a.message }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-listing-images:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
