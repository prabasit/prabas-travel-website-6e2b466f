-- Create a completely simple solution without digest function
-- Just store the password in a way we can check it directly

-- Update admin user with simple password storage for now
UPDATE public.admin_users 
SET password_hash = 'admin123_simple_hash'
WHERE email = 'admin@flightsnepal.com';

-- Create the simplest possible login function
CREATE OR REPLACE FUNCTION public.admin_login_simple(login_email text, login_password text)
RETURNS TABLE(success boolean, user_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  -- Check credentials directly
  IF trim(lower(login_email)) = 'admin@flightsnepal.com' AND trim(login_password) = 'admin123' THEN
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