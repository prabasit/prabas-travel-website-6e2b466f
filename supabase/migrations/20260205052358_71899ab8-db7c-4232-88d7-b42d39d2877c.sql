-- =============================================
-- SECURITY FIX: Remove Overly Permissive RLS Policies
-- =============================================
-- This migration replaces dangerous "USING (true) WITH CHECK (true)" 
-- policies that allow unauthenticated write access.
--
-- NOTE: Since this application uses a custom authentication system
-- (not Supabase Auth), the policies can only allow public READ access
-- and rely on the admin frontend for write operations through RPC calls.
-- For production, migration to Supabase Auth is recommended.

-- =============================================
-- 1. BANNER_SLIDES - Remove dangerous ALL policy
-- =============================================
DROP POLICY IF EXISTS "Allow all banner operations" ON public.banner_slides;

-- Keep public read access
CREATE POLICY "Public can view banner slides"
ON public.banner_slides FOR SELECT
USING (true);

-- Admin write operations go through the admin interface
-- which validates client-side sessions

-- =============================================
-- 2. BLOG_SEO - Remove dangerous ALL policy
-- =============================================
DROP POLICY IF EXISTS "Admins can manage blog SEO" ON public.blog_seo;

-- Keep public read access (already exists)
-- Public can view blog SEO policy already exists

-- =============================================
-- 3. FLIGHTS_NEPAL - Remove dangerous ALL policy
-- =============================================
DROP POLICY IF EXISTS "Admins can manage flights_nepal" ON public.flights_nepal;

-- Keep public read access (already exists)

-- =============================================
-- 4. GLOBAL_SEO - Remove dangerous ALL policy
-- =============================================
DROP POLICY IF EXISTS "Admins can manage global SEO" ON public.global_seo;

-- Keep public read access (already exists)

-- =============================================
-- 5. PAGE_SEO - Remove dangerous ALL policy
-- =============================================
DROP POLICY IF EXISTS "Admins can manage SEO settings" ON public.page_seo;

-- Keep public read access (active only)
-- Already has "Public can view active SEO settings" policy

-- =============================================
-- 6. PAGES - Remove dangerous ALL policy
-- =============================================
DROP POLICY IF EXISTS "Allow all page operations" ON public.pages;

-- Add public read access for published pages only
CREATE POLICY "Public can view published pages"
ON public.pages FOR SELECT
USING (is_published = true);

-- =============================================
-- 7. PRABAS_HOLIDAYS - Remove dangerous ALL policy
-- =============================================
DROP POLICY IF EXISTS "Admins can manage prabas_holidays" ON public.prabas_holidays;

-- Keep public read access (already exists)

-- =============================================
-- 8. SERVICES - Remove dangerous ALL policy
-- =============================================
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;

-- Keep public read access (active only)
-- Already has "Public can view active services" policy

-- =============================================
-- 9. HOMEPAGE_ADS - Add public read if missing
-- =============================================
-- Already has "Homepage ads are viewable by everyone" SELECT policy

-- =============================================
-- 10. PRABAS_AUSTRALIA - Keep read-only (already correct)
-- =============================================
-- Already has "Prabas Australia is viewable by everyone" SELECT policy

-- =============================================
-- 11. PRABAS_UAE - Keep read-only (already correct)
-- =============================================
-- Already has "Prabas UAE is viewable by everyone" SELECT policy

-- =============================================
-- IMPORTANT NOTE FOR ADMIN OPERATIONS:
-- =============================================
-- With these changes, admin write operations (INSERT, UPDATE, DELETE)
-- will FAIL through direct Supabase client calls.
-- 
-- The admin panel must use one of these approaches:
-- 1. Edge functions with service role key for write operations
-- 2. RPC functions with SECURITY DEFINER
-- 3. Migration to Supabase Auth (recommended for production)
--
-- For now, we'll create RPC functions for admin operations.
-- =============================================

-- Create a function to validate admin session from token
-- This will be called before any admin write operation
CREATE OR REPLACE FUNCTION public.validate_admin_session(p_admin_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  -- Check if the admin exists and is active
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = p_admin_id 
    AND is_active = true
    AND role IN ('admin', 'super_admin', 'superadmin')
  );
END;
$$;

-- =============================================
-- CREATE ADMIN-ONLY WRITE POLICIES USING RPC CONTEXT
-- =============================================
-- These policies use a session variable set by admin operations

-- Create policies that check for admin context
-- The admin panel will set this context before operations

-- Banner slides admin operations
CREATE POLICY "Admin can manage banner slides"
ON public.banner_slides
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- Blog SEO admin operations
CREATE POLICY "Admin can manage blog SEO"
ON public.blog_seo
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- Flights Nepal admin operations
CREATE POLICY "Admin can manage flights nepal"
ON public.flights_nepal
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- Global SEO admin operations
CREATE POLICY "Admin can manage global seo"
ON public.global_seo
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- Page SEO admin operations
CREATE POLICY "Admin can manage page seo"
ON public.page_seo
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- Pages admin operations
CREATE POLICY "Admin can manage pages"
ON public.pages
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- Prabas Holidays admin operations
CREATE POLICY "Admin can manage prabas holidays"
ON public.prabas_holidays
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- Services admin operations
CREATE POLICY "Admin can manage services entry"
ON public.services
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- Homepage ads admin operations
CREATE POLICY "Admin can manage homepage ads"
ON public.homepage_ads
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- Prabas Australia admin operations
CREATE POLICY "Admin can manage prabas australia"
ON public.prabas_australia
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- Prabas UAE admin operations
CREATE POLICY "Admin can manage prabas uae"
ON public.prabas_uae
FOR ALL
USING (
  current_setting('app.admin_validated', true)::boolean = true
)
WITH CHECK (
  current_setting('app.admin_validated', true)::boolean = true
);

-- =============================================
-- CREATE HELPER FUNCTION FOR ADMIN OPERATIONS
-- =============================================

-- This function sets the admin context and runs an operation
CREATE OR REPLACE FUNCTION public.admin_operation(
  p_admin_id UUID,
  p_operation TEXT,
  p_table_name TEXT,
  p_data JSONB,
  p_where_clause JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  v_result JSONB;
  v_query TEXT;
BEGIN
  -- Validate admin
  IF NOT validate_admin_session(p_admin_id) THEN
    RAISE EXCEPTION 'Unauthorized: Invalid admin session';
  END IF;
  
  -- Set admin context for RLS policies
  PERFORM set_config('app.admin_validated', 'true', true);
  
  -- Execute operation based on type
  CASE p_operation
    WHEN 'INSERT' THEN
      EXECUTE format(
        'INSERT INTO %I SELECT * FROM jsonb_populate_record(null::%I, $1) RETURNING to_jsonb(%I.*)',
        p_table_name, p_table_name, p_table_name
      ) INTO v_result USING p_data;
      
    WHEN 'UPDATE' THEN
      -- For updates, we need both data and where clause
      IF p_where_clause IS NULL OR p_where_clause->>'id' IS NULL THEN
        RAISE EXCEPTION 'UPDATE requires id in where_clause';
      END IF;
      
      -- Build dynamic update (simplified for id-based updates)
      EXECUTE format(
        'UPDATE %I SET updated_at = now() WHERE id = $1 RETURNING to_jsonb(%I.*)',
        p_table_name, p_table_name
      ) INTO v_result USING (p_where_clause->>'id')::uuid;
      
    WHEN 'DELETE' THEN
      IF p_where_clause IS NULL OR p_where_clause->>'id' IS NULL THEN
        RAISE EXCEPTION 'DELETE requires id in where_clause';
      END IF;
      
      EXECUTE format(
        'DELETE FROM %I WHERE id = $1 RETURNING to_jsonb(%I.*)',
        p_table_name, p_table_name
      ) INTO v_result USING (p_where_clause->>'id')::uuid;
      
    ELSE
      RAISE EXCEPTION 'Invalid operation: %', p_operation;
  END CASE;
  
  -- Clear admin context
  PERFORM set_config('app.admin_validated', 'false', true);
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;