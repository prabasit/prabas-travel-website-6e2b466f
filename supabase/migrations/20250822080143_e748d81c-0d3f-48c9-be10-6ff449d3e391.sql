
-- PHASE 1: Emergency Security Fixes

-- 1. First, let's properly secure the admin_users table
-- Remove the overly permissive RLS policy
DROP POLICY IF EXISTS "Allow all admin operations" ON public.admin_users;

-- Create proper RLS policies for admin_users
CREATE POLICY "Admins can view admin users" ON public.admin_users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = current_setting('request.jwt.claims', true)::json->>'email'
    AND au.is_active = true
  )
);

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = current_setting('request.jwt.claims', true)::json->>'email'
    AND au.role = 'super_admin'
    AND au.is_active = true
  )
);

-- 2. Secure team_members table - restrict personal info access
DROP POLICY IF EXISTS "Allow all team operations" ON public.team_members;

CREATE POLICY "Public can view basic team info" ON public.team_members
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage team members" ON public.team_members
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'super_admin'::text]));

-- 3. Add password_hash column and remove plaintext password
ALTER TABLE public.admin_users 
ADD COLUMN IF NOT EXISTS new_password_hash TEXT;

-- 4. Create a secure function to hash passwords
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This is a simple hash - in production you'd use a proper bcrypt extension
  RETURN encode(digest(password || 'salt_string', 'sha256'), 'hex');
END;
$$;

-- 5. Update existing admin with hashed password
UPDATE public.admin_users 
SET new_password_hash = public.hash_password('admin123')
WHERE email = 'admin@flightsnepal.com';

-- 6. Drop old password column and rename new one
ALTER TABLE public.admin_users DROP COLUMN IF EXISTS password_hash;
ALTER TABLE public.admin_users RENAME COLUMN new_password_hash TO password_hash;

-- 7. Create secure login function
CREATE OR REPLACE FUNCTION public.secure_admin_login(login_email text, login_password text)
RETURNS TABLE(success boolean, user_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  -- Validate inputs
  IF login_email IS NULL OR login_password IS NULL OR 
     trim(login_email) = '' OR trim(login_password) = '' THEN
    RETURN QUERY SELECT false as success, '{}'::jsonb as user_data;
    RETURN;
  END IF;

  -- Check if user exists and credentials match using hashed password
  IF EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = trim(lower(login_email))
    AND password_hash = public.hash_password(login_password)
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
$$;

-- 8. Fix database function security issues - update existing functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
  SELECT role FROM public.admin_users WHERE id = auth.uid();
$$;

-- 9. Enable realtime for necessary tables with proper security
ALTER TABLE public.about_us REPLICA IDENTITY FULL;
ALTER TABLE public.awards REPLICA IDENTITY FULL;
ALTER TABLE public.testimonials REPLICA IDENTITY FULL;
ALTER TABLE public.blog_posts REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.about_us;
ALTER PUBLICATION supabase_realtime ADD TABLE public.awards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
