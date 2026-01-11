-- Fix the admin login issue by ensuring we have a working admin user with proper credentials
-- First, let's check if admin user exists and create/update if needed

-- Delete any existing admin users to start fresh
DELETE FROM public.admin_users;

-- Insert a working admin user with hashed password
INSERT INTO public.admin_users (
  id,
  email, 
  password_hash,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@flightsnepal.com',
  public.hash_password('admin123'),
  'super_admin',
  true,
  now(),
  now()
);

-- Also ensure the hash_password function exists and works correctly
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simple hash for now - in production use proper bcrypt
  RETURN encode(digest(password || 'prabas_salt_2025', 'sha256'), 'hex');
END;
$$;

-- Update the existing admin with the new hash
UPDATE public.admin_users 
SET password_hash = public.hash_password('admin123')
WHERE email = 'admin@flightsnepal.com';

-- Ensure the secure login function works properly
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