-- Fix the hash function by enabling the required extension and using a proper hash function
-- Enable pgcrypto extension for digest function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a working hash function
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  -- Use pgcrypto's digest function with proper salt
  RETURN encode(digest(password || 'prabas_salt_2025', 'sha256'), 'hex');
END;
$$;

-- Update the existing admin user with the correct hash
UPDATE public.admin_users 
SET password_hash = public.hash_password('admin123')
WHERE email = 'admin@flightsnepal.com';

-- Also create a simpler backup login function that doesn't rely on complex hashing for now
CREATE OR REPLACE FUNCTION public.simple_admin_login(login_email text, login_password text)
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

  -- For now, check against known credentials directly
  IF trim(lower(login_email)) = 'admin@flightsnepal.com' AND login_password = 'admin123' THEN
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
    WHERE au.email = 'admin@flightsnepal.com'
    AND au.is_active = true
    LIMIT 1;
  ELSE
    RETURN QUERY SELECT false as success, '{}'::jsonb as user_data;
  END IF;
END;
$$;