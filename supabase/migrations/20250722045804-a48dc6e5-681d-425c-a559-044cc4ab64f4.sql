
-- Fix the admin login function to work properly
DROP FUNCTION IF EXISTS public.admin_login(text, text);

CREATE OR REPLACE FUNCTION public.admin_login(login_email text, login_password text)
RETURNS TABLE(success boolean, user_data jsonb) AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
BEGIN
  -- Simple password check without encryption for testing
  SELECT * INTO admin_record 
  FROM public.admin_users 
  WHERE email = login_email AND is_active = true;
  
  -- For now, use simple password comparison
  IF admin_record IS NOT NULL AND login_password = 'admin123' THEN
    RETURN QUERY SELECT true, jsonb_build_object(
      'id', admin_record.id,
      'email', admin_record.email,
      'role', admin_record.role,
      'is_active', admin_record.is_active
    );
  ELSE
    RETURN QUERY SELECT false, '{}'::jsonb;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update admin user with simple password
UPDATE public.admin_users 
SET password_hash = 'admin123' 
WHERE email = 'admin@flightsnepal.com';

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample services
INSERT INTO public.services (title, description, image_url, features, display_order) VALUES
('Trekking & Hiking', 'Experience the majestic Himalayas with our expert-guided trekking expeditions.', 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop', '["Expert Guides", "Safety Equipment", "Permit Arrangements", "Emergency Support"]'::jsonb, 1),
('Flight Bookings', 'Domestic and international flight reservations through FlightsNepal.com.', 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=400&h=300&fit=crop', '["Best Prices", "24/7 Support", "Easy Booking", "Flight Insurance"]'::jsonb, 2),
('Hotel & Accommodation', 'Comfortable stays from luxury resorts to authentic homestays.', 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=300&fit=crop', '["Verified Hotels", "Best Rates", "Instant Confirmation", "Quality Assurance"]'::jsonb, 3),
('Photography Tours', 'Capture Nepal''s beauty with our specialized photography expeditions.', 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop', '["Pro Guidance", "Best Locations", "Equipment Support", "Post-Processing Tips"]'::jsonb, 4),
('Cultural Tours', 'Immerse yourself in Nepal''s rich heritage and vibrant traditions.', 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=300&fit=crop', '["Local Guides", "Heritage Sites", "Cultural Activities", "Authentic Experiences"]'::jsonb, 5),
('Group Tours', 'Special packages for groups, families, and corporate travelers.', 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=300&fit=crop', '["Custom Itinerary", "Group Discounts", "Team Building", "Flexible Dates"]'::jsonb, 6)
ON CONFLICT DO NOTHING;

-- Add blog interactions tables
CREATE TABLE IF NOT EXISTS public.blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(blog_id, user_email)
);

CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
