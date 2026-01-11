-- Fix admin_login function to work properly
DROP FUNCTION IF EXISTS public.admin_login(text, text);

CREATE OR REPLACE FUNCTION public.admin_login(login_email text, login_password text)
RETURNS TABLE(success boolean, user_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  admin_record public.admin_users%ROWTYPE;
BEGIN
  -- Select admin user with email and active status
  SELECT * INTO admin_record 
  FROM public.admin_users 
  WHERE email = login_email AND is_active = true;
  
  -- Check if user exists and password matches (simple check for demo)
  IF admin_record IS NOT NULL AND admin_record.password_hash = login_password THEN
    RETURN QUERY SELECT true::boolean, jsonb_build_object(
      'id', admin_record.id,
      'email', admin_record.email,
      'role', admin_record.role,
      'is_active', admin_record.is_active
    );
  ELSE
    RETURN QUERY SELECT false::boolean, '{}'::jsonb;
  END IF;
END;
$$;