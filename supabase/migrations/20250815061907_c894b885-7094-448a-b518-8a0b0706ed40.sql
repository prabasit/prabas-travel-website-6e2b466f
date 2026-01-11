
-- Fix admin_users table to ensure proper password handling and constraints
ALTER TABLE public.admin_users 
ADD CONSTRAINT unique_admin_email UNIQUE (email);

-- Add missing newsletter_subscriptions table constraint
ALTER TABLE public.newsletter_subscriptions 
ADD CONSTRAINT unique_newsletter_email UNIQUE (email);

-- Update banner_slides table to ensure proper constraints
ALTER TABLE public.banner_slides 
ADD CONSTRAINT valid_display_order CHECK (display_order >= 0);

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_banner_slides_order ON public.banner_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscriptions(email);

-- Fix the admin_login function to handle better error cases
CREATE OR REPLACE FUNCTION public.admin_login(login_email text, login_password text)
RETURNS TABLE(success boolean, user_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Validate inputs
  IF login_email IS NULL OR login_password IS NULL OR 
     trim(login_email) = '' OR trim(login_password) = '' THEN
    RETURN QUERY SELECT false as success, '{}'::jsonb as user_data;
    RETURN;
  END IF;

  -- Check if user exists and credentials match
  IF EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = trim(lower(login_email))
    AND password_hash = login_password 
    AND is_active = true
  ) THEN
    RETURN QUERY 
    SELECT 
      true as success,
      jsonb_build_object(
        'id', au.id,
        'email', au.email,
        'role', au.role,
        'is_active', au.is_active
      ) as user_data
    FROM public.admin_users au
    WHERE au.email = trim(lower(login_email)) 
    AND au.is_active = true
    LIMIT 1;
  ELSE
    RETURN QUERY SELECT false as success, '{}'::jsonb as user_data;
  END IF;
END;
$function$;

-- Ensure proper RLS policies for testimonials
DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
CREATE POLICY "Public can view testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_active = true);

-- Add proper triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to all relevant tables
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON public.admin_users 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_banner_slides_updated_at ON public.banner_slides;
CREATE TRIGGER update_banner_slides_updated_at 
    BEFORE UPDATE ON public.banner_slides 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON public.testimonials 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON public.team_members;
CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON public.team_members 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_awards_updated_at ON public.awards;
CREATE TRIGGER update_awards_updated_at 
    BEFORE UPDATE ON public.awards 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_careers_updated_at ON public.careers;
CREATE TRIGGER update_careers_updated_at 
    BEFORE UPDATE ON public.careers 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
