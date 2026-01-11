-- Fix and test admin_login function
CREATE OR REPLACE FUNCTION public.admin_login(login_email text, login_password text)
RETURNS TABLE(success boolean, user_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
BEGIN
  -- Debug: Log the input parameters
  RAISE NOTICE 'Login attempt for email: %, password: %', login_email, login_password;
  
  -- Select admin user with email and active status
  SELECT * INTO admin_record 
  FROM public.admin_users 
  WHERE email = login_email AND is_active = true;
  
  -- Debug: Log what was found
  IF admin_record IS NOT NULL THEN
    RAISE NOTICE 'Found user: %, stored password: %', admin_record.email, admin_record.password_hash;
  ELSE
    RAISE NOTICE 'No user found for email: %', login_email;
  END IF;
  
  -- Check if user exists and password matches
  IF admin_record IS NOT NULL AND admin_record.password_hash = login_password THEN
    RAISE NOTICE 'Login successful';
    RETURN QUERY SELECT true::boolean, jsonb_build_object(
      'id', admin_record.id,
      'email', admin_record.email,
      'role', admin_record.role,
      'is_active', admin_record.is_active
    );
  ELSE
    RAISE NOTICE 'Login failed - password mismatch or user not found';
    RETURN QUERY SELECT false::boolean, '{}'::jsonb;
  END IF;
END;
$$;

-- Test the function
SELECT * FROM admin_login('admin@flightsnepal.com', 'admin123');