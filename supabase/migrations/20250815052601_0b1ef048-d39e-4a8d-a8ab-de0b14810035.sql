-- Create banner_slides table for the hero slider
CREATE TABLE public.banner_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  button_text TEXT,
  button_link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.banner_slides ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for banner_slides
CREATE POLICY "Admins can manage banner slides" 
ON public.banner_slides 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'super_admin'::text]));

CREATE POLICY "Public can view active banner slides" 
ON public.banner_slides 
FOR SELECT 
USING (is_active = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banner_slides_updated_at
BEFORE UPDATE ON public.banner_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default banner slide
INSERT INTO public.banner_slides (title, subtitle, image_url, button_text, button_link, display_order) VALUES
('Discover the World with Prabas Travels', 'Your trusted travel partner for international flights, holiday packages, and visa services. Experience seamless travel with FlightsNepal.com and Prabas Holidays.', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop', 'Book Flights', '/flights-nepal', 1);