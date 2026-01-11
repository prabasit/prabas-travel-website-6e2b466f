
-- Drop all existing tables and start fresh
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.pages CASCADE;
DROP TABLE IF EXISTS public.about_us CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.careers CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.awards CASCADE;
DROP TABLE IF EXISTS public.inquiries CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.is_admin_user();
DROP FUNCTION IF EXISTS public.admin_login(text, text);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pages table for dynamic page management
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create about_us table
CREATE TABLE public.about_us (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  story TEXT,
  mission TEXT,
  vision TEXT,
  values JSONB,
  stats JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  email TEXT,
  phone TEXT,
  image_url TEXT,
  social_links JSONB,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create careers table
CREATE TABLE public.careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  job_type TEXT,
  salary_range TEXT,
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  application_deadline DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  category TEXT,
  tags TEXT[],
  author_id UUID REFERENCES public.team_members(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_location TEXT,
  client_image_url TEXT,
  testimonial_text TEXT NOT NULL,
  trip_type TEXT,
  rating INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create awards table
CREATE TABLE public.awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  year INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create inquiries table
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  category TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin login function with simple password check
CREATE OR REPLACE FUNCTION public.admin_login(login_email TEXT, login_password TEXT)
RETURNS TABLE(success BOOLEAN, user_data JSONB) AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
BEGIN
  SELECT * INTO admin_record 
  FROM public.admin_users 
  WHERE email = login_email AND is_active = true;
  
  IF admin_record IS NOT NULL AND admin_record.password_hash = crypt(login_password, admin_record.password_hash) THEN
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

-- Insert admin user with credentials: admin@flightsnepal.com / admin123
INSERT INTO public.admin_users (email, password_hash, role, is_active) VALUES (
  'admin@flightsnepal.com',
  crypt('admin123', gen_salt('bf')),
  'admin',
  true
);

-- Insert default about us content
INSERT INTO public.about_us (title, description, story, mission, vision, values, stats) VALUES (
  'About Prabas Travels',
  'Established in 1995, Prabas Travels & Tours has been Nepal''s premier travel company.',
  'Founded with a vision to make Nepal accessible to travelers worldwide, Prabas Travels has grown from a small local agency to one of Nepal''s most trusted travel companies.',
  'To showcase the natural beauty and rich culture of Nepal to the world.',
  'To be the leading travel company in Nepal, promoting sustainable tourism.',
  '["Trust & Safety", "Personalized Service", "Expert Guidance", "Award Winning"]'::jsonb,
  '{"years": 25, "customers": 10000, "team": 50, "rating": 4.9}'::jsonb
);

-- Insert default pages
INSERT INTO public.pages (slug, title, content, meta_description, is_published) VALUES
('privacy-policy', 'Privacy Policy', '<h1>Privacy Policy</h1><p>Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information.</p>', 'Privacy Policy - Prabas Travels', true),
('terms-of-service', 'Terms of Service', '<h1>Terms of Service</h1><p>These terms govern your use of our website and services.</p>', 'Terms of Service - Prabas Travels', true),
('flights-nepal', 'FlightsNepal', '<h1>FlightsNepal</h1><p>Book your flights with FlightsNepal - your trusted partner for domestic and international flights.</p>', 'FlightsNepal - Flight Booking Service', true),
('prabas-holidays', 'Prabas Holidays', '<h1>Prabas Holidays</h1><p>Discover amazing holiday packages with Prabas Holidays. Experience the best of Nepal and beyond.</p>', 'Prabas Holidays - Holiday Packages', true);

-- Insert sample team members
INSERT INTO public.team_members (name, position, bio, email, is_active, display_order) VALUES
('John Doe', 'CEO & Founder', 'Experienced travel industry professional with 20+ years of expertise in Nepal tourism.', 'john@prabastravel.com', true, 1),
('Jane Smith', 'Operations Manager', 'Handles all operational aspects of tours and travel arrangements with attention to detail.', 'jane@prabastravel.com', true, 2),
('Ram Sharma', 'Senior Guide', 'Expert trekking guide with extensive knowledge of Himalayan routes.', 'ram@prabastravel.com', true, 3);

-- Insert sample testimonials
INSERT INTO public.testimonials (client_name, client_location, testimonial_text, trip_type, rating, is_featured, is_active) VALUES
('Sarah Johnson', 'USA', 'Amazing experience with Prabas Travels! The team was professional and the tour was well-organized. Highly recommend for anyone visiting Nepal.', 'Everest Base Camp Trek', 5, true, true),
('Michael Chen', 'Canada', 'Highly recommend Prabas Travels for Nepal adventures. Great service and knowledgeable guides made our trip unforgettable.', 'Annapurna Circuit', 5, true, true),
('Emma Wilson', 'UK', 'Fantastic service from start to finish. The team took care of everything and made our Nepal trip stress-free.', 'Kathmandu Cultural Tour', 5, false, true);

-- Insert sample awards
INSERT INTO public.awards (title, organization, year, description, category, is_active) VALUES
('Best Travel Agency Nepal 2023', 'Nepal Tourism Board', 2023, 'Recognized for outstanding contribution to Nepal tourism industry and excellent customer service.', 'Tourism', true),
('Excellence in Customer Service', 'Travel Industry Association', 2022, 'Awarded for maintaining highest standards of customer satisfaction and service quality.', 'Service', true),
('Sustainable Tourism Award', 'Eco Tourism Nepal', 2021, 'Recognition for promoting eco-friendly and sustainable tourism practices.', 'Environment', true);

-- Insert sample careers
INSERT INTO public.careers (title, department, location, job_type, description, requirements, benefits, is_active) VALUES
('Travel Consultant', 'Sales', 'Kathmandu', 'Full-time', 'Help customers plan their perfect Nepal adventure. Provide expert advice on destinations, packages, and logistics.', 'Excellent communication skills, Knowledge of Nepal tourism, Customer service experience', 'Competitive salary, Travel opportunities, Health insurance', true),
('Tour Guide', 'Operations', 'Kathmandu', 'Full-time', 'Lead groups on amazing tours around Nepal. Ensure safety and provide informative experiences.', 'Fluent in English, Physical fitness, First aid certification preferred', 'Performance bonuses, Training provided, Flexible schedule', true),
('Marketing Executive', 'Marketing', 'Kathmandu', 'Full-time', 'Develop and execute marketing strategies to promote our travel packages and services.', 'Marketing degree, Digital marketing skills, Creative thinking', 'Career growth opportunities, Modern office, Team outings', true);

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, is_published, published_at) VALUES
('Best Time to Visit Nepal', 'best-time-visit-nepal', 'Discover the perfect seasons for your Nepal adventure and what each time of year offers.', '<h1>Best Time to Visit Nepal</h1><p>Nepal offers something special in every season. From clear mountain views in autumn to blooming rhododendrons in spring, each time has its charm...</p>', 'Travel Tips', true, now()),
('Everest Base Camp Trek Guide', 'everest-base-camp-trek-guide', 'Complete guide to the famous Everest Base Camp trek including preparation, itinerary, and tips.', '<h1>Everest Base Camp Trek Guide</h1><p>Everything you need to know about the world''s most famous trek. From training to gear, we cover it all...</p>', 'Trekking', true, now()),
('Nepal Cultural Heritage Sites', 'nepal-cultural-heritage-sites', 'Explore the rich cultural heritage of Nepal through its UNESCO World Heritage Sites.', '<h1>Nepal Cultural Heritage Sites</h1><p>Nepal is home to numerous UNESCO World Heritage Sites that showcase its rich history and culture...</p>', 'Culture', true, now());

-- Insert sample inquiries
INSERT INTO public.inquiries (name, email, phone, subject, message, status) VALUES
('Alice Brown', 'alice@email.com', '+1-555-0123', 'Everest Trek Inquiry', 'Hi, I am interested in the Everest Base Camp trek. Could you please send me more details about the itinerary and pricing?', 'pending'),
('David Kumar', 'david@email.com', '+977-9841234567', 'Group Booking', 'We are a group of 8 people looking to book a cultural tour of Kathmandu valley. Please provide group rates.', 'responded'),
('Maria Garcia', 'maria@email.com', '+34-600-123456', 'Custom Package', 'Looking for a custom 2-week Nepal tour including trekking and cultural experiences. Please contact me.', 'pending');

-- Insert default settings
INSERT INTO public.settings (key, value, description, category) VALUES
('site_title', '"Prabas Travels & Tours"', 'Website title', 'general'),
('site_description', '"Premier travel company in Nepal offering amazing tours and trekking experiences"', 'Website description', 'general'),
('contact_email', '"info@prabastravel.com"', 'Main contact email', 'contact'),
('contact_phone', '"+977-1-4445566"', 'Main contact phone', 'contact'),
('address', '"Thamel, Kathmandu, Nepal 44600"', 'Office address', 'contact'),
('social_facebook', '"https://facebook.com/prabastravel"', 'Facebook URL', 'social'),
('social_instagram', '"https://instagram.com/prabastravel"', 'Instagram URL', 'social'),
('social_twitter', '"https://twitter.com/prabastravel"', 'Twitter URL', 'social');
