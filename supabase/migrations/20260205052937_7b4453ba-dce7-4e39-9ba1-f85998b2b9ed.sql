-- Enable pgcrypto extension in the extensions schema and make it accessible
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Create wrapper functions in public schema for password hashing
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'extensions', 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN extensions.crypt(password, extensions.gen_salt('bf', 10));
END;
$function$;

-- Update the admin_login_simple function to use extensions schema
CREATE OR REPLACE FUNCTION public.admin_login_simple(login_email text, login_password text)
 RETURNS TABLE(success boolean, user_data jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'extensions', 'public', 'pg_temp'
AS $function$
DECLARE
  v_failed_attempts INTEGER;
  v_user admin_users%ROWTYPE;
  v_password_valid BOOLEAN := false;
BEGIN
  -- Rate limiting: Check failed attempts in last 15 minutes
  SELECT COUNT(*) INTO v_failed_attempts
  FROM login_attempts la
  WHERE la.email = lower(trim(login_email))
  AND la.attempted_at > now() - interval '15 minutes'
  AND la.success = false;
  
  -- Block if more than 5 failed attempts
  IF v_failed_attempts >= 5 THEN
    RETURN QUERY SELECT false AS success, '{}'::jsonb AS user_data;
    RETURN;
  END IF;
  
  -- Find user by email
  SELECT * INTO v_user
  FROM admin_users
  WHERE lower(trim(admin_users.email)) = lower(trim(login_email))
  AND is_active = true
  LIMIT 1;
  
  -- If no user found, log failed attempt and return
  IF v_user.id IS NULL THEN
    INSERT INTO login_attempts (email, success) VALUES (lower(trim(login_email)), false);
    RETURN QUERY SELECT false AS success, '{}'::jsonb AS user_data;
    RETURN;
  END IF;
  
  -- Check password using bcrypt from extensions schema
  IF v_user.password_hash IS NOT NULL AND v_user.password_hash != '' THEN
    v_password_valid := (v_user.password_hash = extensions.crypt(login_password, v_user.password_hash));
  END IF;
  
  IF v_password_valid THEN
    -- Log successful attempt
    INSERT INTO login_attempts (email, success) VALUES (lower(trim(login_email)), true);
    
    RETURN QUERY SELECT 
      true AS success, 
      jsonb_build_object(
        'id', v_user.id, 
        'email', v_user.email, 
        'role', v_user.role, 
        'is_active', v_user.is_active
      ) AS user_data;
  ELSE
    -- Log failed attempt
    INSERT INTO login_attempts (email, success) VALUES (lower(trim(login_email)), false);
    
    RETURN QUERY SELECT false AS success, '{}'::jsonb AS user_data;
  END IF;
END;
$function$;

-- Now update the admin password with the correct hash
UPDATE admin_users 
SET password_hash = extensions.crypt('Prabas@Admin2026!', extensions.gen_salt('bf', 10))
WHERE email = 'admin@flightsnepal.com';