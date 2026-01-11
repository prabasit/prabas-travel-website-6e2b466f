-- Test and debug the admin login function
SELECT 
  email, 
  password_hash, 
  is_active,
  CASE WHEN password_hash = 'admin123' THEN 'Password matches' ELSE 'Password does not match' END as password_check
FROM admin_users 
WHERE email = 'admin@flightsnepal.com' AND is_active = true;