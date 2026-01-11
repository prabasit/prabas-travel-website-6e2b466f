-- Insert initial data for flights_nepal table
INSERT INTO public.flights_nepal (title, description, features, hero_image_url, is_active)
VALUES (
  'FlightsNepal - Your Gateway to the Himalayas',
  'Experience seamless air travel to Nepal with our comprehensive flight booking services. We connect you to the breathtaking landscapes and rich culture of Nepal.',
  '[
    {
      "title": "Domestic Flights",
      "description": "Connect to major cities across Nepal with reliable domestic flight services",
      "icon": "Plane"
    },
    {
      "title": "International Connections",
      "description": "Book international flights to and from Nepal with competitive rates",
      "icon": "Globe"
    },
    {
      "title": "24/7 Support",
      "description": "Round-the-clock customer support for all your travel needs",
      "icon": "Headphones"
    }
  ]'::jsonb,
  '/prabas-upload/fe486199-47e1-4c3e-8157-0abaf40c7087.png',
  true
)
ON CONFLICT DO NOTHING;

-- Insert initial data for prabas_holidays table
INSERT INTO public.prabas_holidays (title, description, services, hero_image_url, is_active)
VALUES (
  'Prabas Holidays - Discover Nepal',
  'Embark on unforgettable journeys through Nepal with our expertly crafted holiday packages. From mountain adventures to cultural explorations, we create memories that last a lifetime.',
  '[
    {
      "title": "Trekking Adventures",
      "description": "Explore world-famous trekking routes including Everest Base Camp and Annapurna Circuit",
      "icon": "Mountain"
    },
    {
      "title": "Cultural Tours",
      "description": "Immerse yourself in Nepal''s rich heritage with guided cultural experiences",
      "icon": "Camera"
    },
    {
      "title": "Adventure Sports",
      "description": "Experience thrilling activities like paragliding, rafting, and bungee jumping",
      "icon": "Zap"
    },
    {
      "title": "Luxury Stays",
      "description": "Enjoy premium accommodations in the heart of Nepal''s most beautiful locations",
      "icon": "Star"
    }
  ]'::jsonb,
  '/prabas-upload/a3ba01b3-295e-4a69-9e00-85ffbc90571c.png',
  true
)
ON CONFLICT DO NOTHING;