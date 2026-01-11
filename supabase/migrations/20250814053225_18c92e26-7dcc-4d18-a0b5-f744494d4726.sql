-- Create a much simpler admin login function
DROP FUNCTION IF EXISTS public.admin_login(text, text);

CREATE OR REPLACE FUNCTION public.admin_login(login_email text, login_password text)
RETURNS TABLE(success boolean, user_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Simple direct approach
  IF EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = login_email 
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
    WHERE au.email = login_email AND au.is_active = true;
  ELSE
    RETURN QUERY SELECT false as success, '{}'::jsonb as user_data;
  END IF;
END;
$$;