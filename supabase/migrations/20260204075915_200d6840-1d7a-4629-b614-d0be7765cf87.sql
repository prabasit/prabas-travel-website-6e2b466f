-- Create homepage_ads table for managing ad banners
CREATE TABLE public.homepage_ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  media_url TEXT NOT NULL,
  media_type VARCHAR(50) NOT NULL DEFAULT 'image', -- 'image', 'video', 'gif'
  link_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_ads ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Homepage ads are viewable by everyone" 
ON public.homepage_ads 
FOR SELECT 
USING (true);

-- Create prabas_australia table
CREATE TABLE public.prabas_australia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  hero_image_url TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  offers JSONB DEFAULT '[]'::jsonb,
  why_choose_us JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prabas_australia ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Prabas Australia is viewable by everyone" 
ON public.prabas_australia 
FOR SELECT 
USING (true);

-- Create prabas_uae table
CREATE TABLE public.prabas_uae (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  hero_image_url TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  contact_info JSONB DEFAULT '{}'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prabas_uae ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Prabas UAE is viewable by everyone" 
ON public.prabas_uae 
FOR SELECT 
USING (true);

-- Insert initial data for Australia
INSERT INTO public.prabas_australia (title, description, services, offers, why_choose_us)
VALUES (
  'Prabas Travel Australia',
  'Your trusted partner for unforgettable Australian adventures. From the iconic Sydney landmarks to the pristine beaches, from the ancient outback to the tropical rainforests, we transform your travel dreams into reality.',
  '[{"title": "Domestic & International Flights", "icon": "Plane", "features": ["24/7 Support", "Best Price Guarantee", "In-flight / Onboard Assistance"]}, {"title": "Tour Packages", "icon": "Map", "features": ["Airport Pick off and Drop off", "Customise Deal", "Great Hotel Options with Breakfast", "Affordable Rate"]}, {"title": "Cruise Booking", "icon": "Ship", "features": ["Onboard Entertainment & Activities", "Family & Couple Friendly Deals", "Flexible Dates & Itinerary", "Cruise Options – Budget to Luxury"]}]'::jsonb,
  '[{"title": "Colourful Europe", "description": "Experience the best of Europe in one unforgettable journey!", "duration": "22 days", "price": "$6,000", "originalPrice": "$7,000", "savings": "Save $1000"}, {"title": "A Fantastic Route Europe", "description": "Explore the best of Europe in 16 unforgettable days!", "duration": "16 Days", "price": "$3,900", "originalPrice": "$4,500", "savings": "Save $600"}, {"title": "Dream Bali Holiday", "description": "5-Night Bali Escape – Stay in a 4-star luxury hotel", "duration": "6 Days / 5 Nights", "price": "$900", "originalPrice": "$1,200", "savings": "Save $300"}]'::jsonb,
  '[{"title": "Expert Local Knowledge", "description": "Deep understanding of Australia''s hidden gems and popular destinations"}, {"title": "Personalized Service", "description": "Tailored travel experiences designed around your preferences"}, {"title": "Trusted Excellence", "description": "Years of experience delivering exceptional travel moments"}]'::jsonb
);

-- Insert initial data for UAE
INSERT INTO public.prabas_uae (title, description, services, contact_info, highlights)
VALUES (
  'Prabas Travel UAE',
  'Your gateway to seamless travel experiences from the United Arab Emirates. We specialize in flights, tours, and complete travel solutions for the Nepali community and beyond.',
  '[{"title": "Flight Bookings", "icon": "Plane", "description": "Domestic and international flight bookings with best price guarantee"}, {"title": "Hotel Reservations", "icon": "Building2", "description": "Premium hotel bookings across UAE and worldwide destinations"}, {"title": "Tour Packages", "icon": "Globe", "description": "Customized tour packages for families, couples, and groups"}]'::jsonb,
  '{"phone": "04-2365211", "whatsapp": ["050-8804799", "055-3115044"], "email": "info@prabastravel.ae", "location": "4th Floor, AL Souq AL Kabeer, 3 mins from Sharaf DG Metro, Exit 3"}'::jsonb,
  '["Direct flights to Nepal from UAE", "Visa assistance and documentation", "Corporate travel solutions", "Group travel discounts", "24/7 customer support", "Best price guarantee"]'::jsonb
);