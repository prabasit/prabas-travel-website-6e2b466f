
-- Enable RLS on all tables
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
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

-- Create RLS policies for admin access
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies for all tables
CREATE POLICY "Admins can do everything on admin_users" ON public.admin_users FOR ALL TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins can do everything on pages" ON public.pages FOR ALL TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins can do everything on about_us" ON public.about_us FOR ALL TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins can do everything on team_members" ON public.team_members FOR ALL TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins can do everything on careers" ON public.careers FOR ALL TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins can do everything on blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins can do everything on testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins can do everything on awards" ON public.awards FOR ALL TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins can do everything on inquiries" ON public.inquiries FOR ALL TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins can do everything on settings" ON public.settings FOR ALL TO authenticated USING (public.is_admin_user());

-- Public read policies for frontend
CREATE POLICY "Public can read published pages" ON public.pages FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Public can read about_us" ON public.about_us FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read active team_members" ON public.team_members FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public can read active careers" ON public.careers FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public can read published blog_posts" ON public.blog_posts FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Public can read active testimonials" ON public.testimonials FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public can read active awards" ON public.awards FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public can insert inquiries" ON public.inquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can read general settings" ON public.settings FOR SELECT TO anon USING (category = 'general');

-- Insert default admin user (you'll need to create this user first)
INSERT INTO public.admin_users (user_id, email, role) 
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@prabastravel.com' LIMIT 1),
  'admin@prabastravel.com',
  'admin'
) ON CONFLICT (email) DO NOTHING;

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

-- Insert default settings
INSERT INTO public.settings (key, value, description, category) VALUES
('site_title', '"Prabas Travels & Tours"', 'Website title', 'general'),
('site_description', '"Premier travel company in Nepal"', 'Website description', 'general'),
('contact_email', '"info@prabastravel.com"', 'Main contact email', 'contact'),
('contact_phone', '"+977-1-4445566"', 'Main contact phone', 'contact'),
('address', '"Thamel, Kathmandu, Nepal 44600"', 'Office address', 'contact'),
('social_facebook', '""', 'Facebook URL', 'social'),
('social_instagram', '""', 'Instagram URL', 'social'),
('social_twitter', '""', 'Twitter URL', 'social');
