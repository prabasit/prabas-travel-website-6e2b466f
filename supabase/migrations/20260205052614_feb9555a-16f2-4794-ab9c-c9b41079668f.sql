
-- Update admin password to a new secure password
UPDATE admin_users 
SET password_hash = crypt('Prabas@Admin2026!', gen_salt('bf'))
WHERE email = 'admin@flightsnepal.com';
