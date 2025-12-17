-- Create fraud_alerts table to store detected issues
CREATE TABLE public.fraud_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.car_listings(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  message TEXT NOT NULL,
  related_listing_id UUID REFERENCES public.car_listings(id) ON DELETE SET NULL,
  similarity_score NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage fraud alerts
CREATE POLICY "Admins can view fraud alerts"
ON public.fraud_alerts
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage fraud alerts"
ON public.fraud_alerts
FOR ALL
USING (is_admin(auth.uid()));

-- Enable realtime for admin notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.car_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.verifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fraud_alerts;