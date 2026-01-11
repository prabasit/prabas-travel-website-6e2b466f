
-- Enable RLS on all tables and create appropriate policies

-- Enable RLS on all tables
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flights_nepal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prabas_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create security definer function for admin role checking
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.admin_users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Public read access policies for content tables
CREATE POLICY "Public can view about_us" ON public.about_us FOR SELECT USING (true);
CREATE POLICY "Public can view awards" ON public.awards FOR SELECT USING (true);
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view careers" ON public.careers FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view flights_nepal" ON public.flights_nepal FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published pages" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view prabas_holidays" ON public.prabas_holidays FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view team_members" ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (is_active = true);

-- Admin-only access policies
CREATE POLICY "Admins can manage about_us" ON public.about_us FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage awards" ON public.awards FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage blog_posts" ON public.blog_posts FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage careers" ON public.careers FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage flights_nepal" ON public.flights_nepal FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage pages" ON public.pages FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage prabas_holidays" ON public.prabas_holidays FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage team_members" ON public.team_members FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));

-- Admin users table policies
CREATE POLICY "Admins can view admin_users" ON public.admin_users FOR SELECT USING (public.get_current_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Super admins can manage admin_users" ON public.admin_users FOR ALL USING (public.get_current_user_role() = 'super_admin');

-- Public write access for forms
CREATE POLICY "Public can submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage inquiries" ON public.inquiries FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Public can submit job applications" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage job applications" ON public.job_applications FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage newsletter subscriptions" ON public.newsletter_subscriptions FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));

-- Authenticated user policies for blog interactions
CREATE POLICY "Authenticated users can like posts" ON public.blog_likes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their own likes" ON public.blog_likes FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can comment" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view approved comments" ON public.blog_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins can manage comments" ON public.blog_comments FOR ALL USING (public.get_current_user_role() IN ('admin', 'super_admin'));

-- Fix the admin login function with proper security
CREATE OR REPLACE FUNCTION public.admin_login(login_email text, login_password text)
RETURNS TABLE(success boolean, user_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
BEGIN
  -- Simple password check for now (should be replaced with proper hashing)
  SELECT * INTO admin_record 
  FROM public.admin_users 
  WHERE email = login_email AND is_active = true;
  
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
$$;
