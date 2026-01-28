-- Create page_seo table for comprehensive SEO management
CREATE TABLE public.page_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_identifier TEXT NOT NULL UNIQUE, -- e.g., 'home', 'about', 'contact', 'blog', 'careers', etc.
  page_title TEXT NOT NULL, -- Display name in admin
  
  -- Basic Meta Tags
  meta_title TEXT, -- <title> tag
  meta_description TEXT, -- <meta name="description">
  meta_keywords TEXT, -- <meta name="keywords">
  
  -- Open Graph Tags
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website', -- website, article, product, etc.
  og_url TEXT,
  og_site_name TEXT DEFAULT 'Prabas Travel',
  og_locale TEXT DEFAULT 'en_US',
  
  -- Twitter Card Tags
  twitter_card TEXT DEFAULT 'summary_large_image', -- summary, summary_large_image, app, player
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  twitter_site TEXT, -- @username
  twitter_creator TEXT, -- @username
  
  -- Technical SEO
  canonical_url TEXT,
  robots TEXT DEFAULT 'index, follow', -- index, noindex, follow, nofollow
  
  -- Structured Data (JSON-LD)
  structured_data JSONB, -- For schema.org markup
  
  -- Additional Meta Tags (flexible)
  additional_meta JSONB, -- For any custom meta tags
  
  -- Status and Timestamps
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

-- Public can read SEO data (needed for frontend)
CREATE POLICY "Public can view active SEO settings"
ON public.page_seo
FOR SELECT
USING (is_active = true);

-- Admins can manage SEO settings
CREATE POLICY "Admins can manage SEO settings"
ON public.page_seo
FOR ALL
USING (true)
WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_page_seo_updated_at
BEFORE UPDATE ON public.page_seo
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default SEO entries for all pages
INSERT INTO public.page_seo (page_identifier, page_title, meta_title, meta_description, og_type) VALUES
('home', 'Home Page', 'Prabas Travel - Your Gateway to Nepal & Beyond', 'Discover Nepal with Prabas Travel. We offer flights, holiday packages, and travel services connecting Nepal to the world.', 'website'),
('about', 'About Us', 'About Prabas Travel - Leading Travel Agency in Nepal', 'Learn about Prabas Travel, Nepal''s trusted travel partner since establishment. Our mission, vision, and story.', 'website'),
('services', 'Our Services', 'Travel Services - Flights, Hotels & Tours | Prabas Travel', 'Explore our comprehensive travel services including flight bookings, hotel reservations, tour packages, and more.', 'website'),
('contact', 'Contact Us', 'Contact Prabas Travel - Get in Touch', 'Contact Prabas Travel for all your travel needs. Located in Thamel, Kathmandu. Call us or send an inquiry.', 'website'),
('blog', 'Blog', 'Travel Blog - Tips & Guides | Prabas Travel', 'Read our travel blog for destination guides, travel tips, and insights about Nepal and international destinations.', 'website'),
('careers', 'Careers', 'Careers at Prabas Travel - Join Our Team', 'Explore career opportunities at Prabas Travel. Join Nepal''s leading travel company.', 'website'),
('team', 'Our Team', 'Meet Our Team - Prabas Travel', 'Meet the dedicated team behind Prabas Travel. Our experienced professionals are here to serve you.', 'website'),
('testimonials', 'Testimonials', 'Customer Reviews & Testimonials | Prabas Travel', 'Read what our customers say about their travel experiences with Prabas Travel.', 'website'),
('awards', 'Awards & Recognition', 'Awards & Recognition - Prabas Travel', 'View the awards and recognition earned by Prabas Travel for excellence in travel services.', 'website'),
('flights-nepal', 'Flights Nepal', 'Flights Nepal - Domestic & International Flights', 'Book domestic and international flights with Flights Nepal, a Prabas Travel venture.', 'website'),
('prabas-holidays', 'Prabas Holidays', 'Prabas Holidays - Tour Packages & Holiday Deals', 'Explore holiday packages and tour deals with Prabas Holidays. Your perfect vacation awaits.', 'website'),
('inquiries', 'Inquiries', 'Travel Inquiries - Prabas Travel', 'Submit your travel inquiries. Our team will assist you with bookings and travel planning.', 'website');

-- Create blog_seo table for individual blog post SEO
CREATE TABLE public.blog_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Meta Tags
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  
  -- Open Graph
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  
  -- Twitter
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  
  -- Technical
  canonical_url TEXT,
  robots TEXT DEFAULT 'index, follow',
  
  -- Article-specific structured data
  structured_data JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for blog_seo
ALTER TABLE public.blog_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view blog SEO"
ON public.blog_seo
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage blog SEO"
ON public.blog_seo
FOR ALL
USING (true)
WITH CHECK (true);

-- Trigger for blog_seo updated_at
CREATE TRIGGER update_blog_seo_updated_at
BEFORE UPDATE ON public.blog_seo
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create global_seo table for site-wide settings
CREATE TABLE public.global_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Site-wide defaults
  site_name TEXT DEFAULT 'Prabas Travel',
  site_tagline TEXT DEFAULT 'Connecting Nepal to the World',
  default_og_image TEXT,
  
  -- Social profiles
  twitter_handle TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  
  -- Verification codes
  google_site_verification TEXT,
  bing_site_verification TEXT,
  
  -- Analytics
  google_analytics_id TEXT,
  google_tag_manager_id TEXT,
  facebook_pixel_id TEXT,
  
  -- Organization Schema
  organization_schema JSONB,
  
  -- Favicon and icons
  favicon_url TEXT,
  apple_touch_icon TEXT,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for global_seo
ALTER TABLE public.global_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view global SEO"
ON public.global_seo
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage global SEO"
ON public.global_seo
FOR ALL
USING (true)
WITH CHECK (true);

-- Insert default global SEO settings
INSERT INTO public.global_seo (
  site_name, 
  site_tagline, 
  organization_schema
) VALUES (
  'Prabas Travel',
  'Connecting Nepal to the World',
  '{
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Prabas Travel",
    "url": "https://prabastravel.com",
    "logo": "https://prabastravel.com/prabas-upload/prabaslogo.png",
    "description": "Leading travel agency in Nepal offering flights, hotels, and holiday packages.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Chhaya Devi Complex, Shop No. 315-317, Thamel",
      "addressLocality": "Kathmandu",
      "addressCountry": "Nepal"
    },
    "telephone": "+977-1-4700921",
    "email": "info@prabastravel.com"
  }'::jsonb
);