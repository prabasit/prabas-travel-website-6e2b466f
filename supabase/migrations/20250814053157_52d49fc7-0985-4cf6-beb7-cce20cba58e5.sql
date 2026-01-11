-- Clear and recreate admin user with proper setup
DELETE FROM admin_users WHERE email = 'admin@flightsnepal.com';

-- Insert the admin user again
INSERT INTO admin_users (email, password_hash, role, is_active)
VALUES ('admin@flightsnepal.com', 'admin123', 'super_admin', true);

-- Test the function again immediately
SELECT 
  'Direct query test:' as test_type,
  email, 
  password_hash, 
  is_active,
  (password_hash = 'admin123') as password_matches
FROM admin_users 
WHERE email = 'admin@flightsnepal.com';

-- Test function call
SELECT 
  'Function test:' as test_type,
  success,
  user_data
FROM admin_login('admin@flightsnepal.com', 'admin123');