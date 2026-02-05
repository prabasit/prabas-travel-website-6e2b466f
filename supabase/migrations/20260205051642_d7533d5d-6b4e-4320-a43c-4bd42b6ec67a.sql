-- =============================================
-- SECURITY FIX MIGRATION
-- =============================================
-- This migration addresses multiple error-level security findings:
-- 1. Enable RLS on tables with policies but RLS disabled
-- 2. Fix admin login to use proper password hashing
-- 3. Add database-level rate limiting for login
-- 4. Remove public read access from inquiries table
-- 5. Remove public update/delete from storage bucket

-- =============================================
-- 1. ENABLE RLS ON ALL TABLES WITH POLICIES
-- =============================================

-- Enable RLS on tables that have policies but RLS disabled
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. FIX INQUIRIES TABLE - REMOVE PUBLIC READ
-- =============================================

-- Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Enable public read access" ON public.inquiries;

-- =============================================
-- 3. FIX JOB APPLICATIONS - REMOVE PUBLIC READ
-- =============================================

-- Drop the overly permissive public read policy on job_applications
DROP POLICY IF EXISTS "Enable public read access" ON public.job_applications;

-- =============================================
-- 4. FIX NEWSLETTER SUBSCRIPTIONS - REMOVE PUBLIC READ
-- =============================================

-- Drop the overly permissive public read policy on newsletter_subscriptions
DROP POLICY IF EXISTS "Enable public read access" ON public.newsletter_subscriptions;

-- =============================================
-- 5. ENABLE PGCRYPTO FOR PASSWORD HASHING
-- =============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================
-- 6. CREATE LOGIN ATTEMPTS TABLE FOR RATE LIMITING
-- =============================================

CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT now(),
  success BOOLEAN DEFAULT false
);

-- Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_login_attempts_email_time ON public.login_attempts(email, attempted_at);

-- Enable RLS on login_attempts
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Only allow the login function to insert/read attempts
CREATE POLICY "No public access to login_attempts"
  ON public.login_attempts
  FOR ALL
  USING (false);

-- =============================================
-- 7. UPDATE ADMIN LOGIN FUNCTION WITH PROPER SECURITY
-- =============================================

-- Update the admin_login_simple function to:
-- 1. Use bcrypt password hashing
-- 2. Add database-level rate limiting
-- 3. Remove hardcoded credentials
CREATE OR REPLACE FUNCTION public.admin_login_simple(login_email text, login_password text)
RETURNS TABLE(success boolean, user_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  v_failed_attempts INTEGER;
  v_user admin_users%ROWTYPE;
  v_password_valid BOOLEAN := false;
BEGIN
  -- Rate limiting: Check failed attempts in last 15 minutes
  SELECT COUNT(*) INTO v_failed_attempts
  FROM login_attempts
  WHERE email = lower(trim(login_email))
  AND attempted_at > now() - interval '15 minutes'
  AND success = false;
  
  -- Block if more than 5 failed attempts
  IF v_failed_attempts >= 5 THEN
    RETURN QUERY SELECT false, '{}'::jsonb;
    RETURN;
  END IF;
  
  -- Find user by email
  SELECT * INTO v_user
  FROM admin_users
  WHERE lower(trim(email)) = lower(trim(login_email))
  AND is_active = true
  LIMIT 1;
  
  -- If no user found, log failed attempt and return
  IF v_user.id IS NULL THEN
    INSERT INTO login_attempts (email, success) VALUES (lower(trim(login_email)), false);
    RETURN QUERY SELECT false, '{}'::jsonb;
    RETURN;
  END IF;
  
  -- Check password using bcrypt
  -- If password_hash exists and is not null, verify against it
  IF v_user.password_hash IS NOT NULL AND v_user.password_hash != '' THEN
    v_password_valid := (v_user.password_hash = crypt(login_password, v_user.password_hash));
  END IF;
  
  IF v_password_valid THEN
    -- Log successful attempt
    INSERT INTO login_attempts (email, success) VALUES (lower(trim(login_email)), true);
    
    RETURN QUERY SELECT 
      true, 
      jsonb_build_object(
        'id', v_user.id, 
        'email', v_user.email, 
        'role', v_user.role, 
        'is_active', v_user.is_active
      );
  ELSE
    -- Log failed attempt
    INSERT INTO login_attempts (email, success) VALUES (lower(trim(login_email)), false);
    
    RETURN QUERY SELECT false, '{}'::jsonb;
  END IF;
END;
$$;

-- =============================================
-- 8. CREATE HELPER FUNCTION TO HASH PASSWORDS
-- =============================================

CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 10));
END;
$$;

-- =============================================
-- 9. UPDATE EXISTING ADMIN PASSWORD TO USE HASHING
-- =============================================

-- Update admin user to use hashed password
-- NOTE: Using the existing password 'admin123' but now hashed
-- User should change this immediately after this migration
UPDATE public.admin_users 
SET password_hash = crypt('admin123', gen_salt('bf', 10))
WHERE email = 'admin@flightsnepal.com'
AND (password_hash IS NULL OR password_hash = '' OR password_hash NOT LIKE '$2%');

-- =============================================
-- 10. STORAGE SECURITY - REMOVE PUBLIC UPDATE/DELETE
-- =============================================

-- Remove dangerous public update and delete policies
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Add admin-only update and delete policies
CREATE POLICY "Admin can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'uploads' AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid() 
    AND admin_users.role IN ('admin', 'super_admin', 'superadmin')
    AND admin_users.is_active = true
  )
);

CREATE POLICY "Admin can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'uploads' AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid() 
    AND admin_users.role IN ('admin', 'super_admin', 'superadmin')
    AND admin_users.is_active = true
  )
);

-- =============================================
-- 11. CLEANUP OLD LOGIN ATTEMPTS (SCHEDULED)
-- =============================================

-- Create function to clean up old login attempts (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_old_login_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  DELETE FROM login_attempts WHERE attempted_at < now() - interval '24 hours';
END;
$$;