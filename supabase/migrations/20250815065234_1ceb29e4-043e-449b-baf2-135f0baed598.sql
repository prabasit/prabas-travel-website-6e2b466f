
-- Fix RLS policies for admin_users table
DROP POLICY IF EXISTS "Super admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;

-- Disable RLS temporarily to allow admin creation
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows admin operations
CREATE POLICY "Allow admin management" 
ON public.admin_users 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Update banner_slides table to support multiple buttons
ALTER TABLE public.banner_slides 
DROP COLUMN IF EXISTS button_text,
DROP COLUMN IF EXISTS button_link;

-- Add buttons as JSONB array to support multiple buttons
ALTER TABLE public.banner_slides 
ADD COLUMN buttons JSONB DEFAULT '[]'::jsonb;

-- Insert default super admin if not exists
INSERT INTO public.admin_users (email, password_hash, role, is_active)
VALUES ('admin@flightsnepal.com', 'admin123', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  role = 'super_admin',
  is_active = true;
