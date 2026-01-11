
-- Create newsletter_subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create flights_nepal table for CMS
CREATE TABLE public.flights_nepal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  features JSONB,
  hero_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prabas_holidays table for CMS
CREATE TABLE public.prabas_holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  services JSONB,
  hero_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default data for flights_nepal
INSERT INTO public.flights_nepal (title, description, features, hero_image_url) VALUES (
  'FlightsNepal.com',
  'Nepal''s Leading Flight Booking Platform - Your gateway to domestic and international destinations with the most advanced ticketing system and competitive prices.',
  '[
    {"title": "Domestic & International Flights", "description": "Complete flight booking services for all destinations across Nepal and worldwide", "icon": "Plane"},
    {"title": "Real-time Booking System", "description": "Advanced ticketing system with instant confirmation and e-tickets", "icon": "Clock"},
    {"title": "Secure Payment", "description": "Safe and secure payment gateway with multiple payment options", "icon": "Shield"},
    {"title": "All Airlines", "description": "Partner with all major domestic and international airlines", "icon": "MapPin"}
  ]',
  '/prabas-upload/a3ba01b3-295e-4a69-9e00-85ffbc90571c.png'
);

-- Insert default data for prabas_holidays
INSERT INTO public.prabas_holidays (title, description, services, hero_image_url) VALUES (
  'Prabas Holidays',
  'Your gateway to extraordinary international vacation experiences. We specialize in creating unforgettable holiday packages, visa services, and travel insurance for destinations across the globe.',
  '[
    {"title": "International Holiday Packages", "description": "Customized vacation packages to destinations worldwide including Europe, Asia, America, and Australia", "icon": "Globe"},
    {"title": "Visa Services", "description": "Complete visa assistance and documentation for all international destinations", "icon": "FileText"},
    {"title": "Travel Insurance", "description": "Comprehensive travel insurance coverage for safe and worry-free journeys", "icon": "Shield"},
    {"title": "Customized Tours", "description": "Tailored travel experiences based on your preferences and budget", "icon": "Camera"}
  ]',
  ''
);
