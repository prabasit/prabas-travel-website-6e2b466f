-- Completely rewrite the about_us table structure from scratch
-- Remove values and stats columns, keep it simple

DROP TABLE IF EXISTS public.about_us CASCADE;

CREATE TABLE public.about_us (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  story text,
  mission text,
  vision text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view about_us" ON public.about_us
FOR SELECT USING (true);

CREATE POLICY "Admins can manage about_us" ON public.about_us
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'super_admin'::text]));

-- Insert default data
INSERT INTO public.about_us (
  title,
  description,
  story,
  mission,
  vision
) VALUES (
  'About Prabas Travels',
  'Established in 2014, Prabas Travels & Tours has been Nepal''s premier travel company, providing exceptional travel experiences across Nepal and beyond.',
  'Founded with a vision to make Nepal accessible to travelers worldwide, Prabas Travels has grown from a small local agency to one of Nepal''s most trusted travel companies. Our journey began with a simple belief: every traveler deserves an authentic and memorable experience.',
  'To showcase the natural beauty and rich culture of Nepal to the world while promoting sustainable and responsible tourism that benefits local communities.',
  'To be the leading travel company in Nepal, setting new standards in customer service, cultural preservation, and sustainable tourism practices.'
);

-- Create update trigger
CREATE TRIGGER update_about_us_updated_at
  BEFORE UPDATE ON public.about_us
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();