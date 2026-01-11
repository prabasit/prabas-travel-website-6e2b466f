-- Drop any existing, potentially restrictive policies on the tables.
DROP POLICY IF EXISTS "Admins can manage flights_nepal" ON public.flights_nepal;
DROP POLICY IF EXISTS "Public can view flights_nepal" ON public.flights_nepal;
DROP POLICY IF EXISTS "Admins can manage prabas_holidays" ON public.prabas_holidays;
DROP POLICY IF EXISTS "Public can view prabas_holidays" ON public.prabas_holidays;

-- Create a robust policy that allows anyone with an 'admin' or 'super_admin' role
-- to perform all actions (SELECT, INSERT, UPDATE, DELETE) on the flights_nepal table.
CREATE POLICY "Admins can manage flights_nepal"
ON public.flights_nepal
FOR ALL
USING (
  (get_current_user_role() = ANY (ARRAY['admin'::text, 'super_admin'::text]))
)
WITH CHECK (
  (get_current_user_role() = ANY (ARRAY['admin'::text, 'super_admin'::text]))
);

-- Create a policy that allows the public (your website visitors) to read
-- the data from the flights_nepal table.
CREATE POLICY "Public can view flights_nepal"
ON public.flights_nepal
FOR SELECT
USING (true);

-- Create a similar robust policy for the prabas_holidays table, giving
-- admins full control.
CREATE POLICY "Admins can manage prabas_holidays"
ON public.prabas_holidays
FOR ALL
USING (
  (get_current_user_role() = ANY (ARRAY['admin'::text, 'super_admin'::text]))
)
WITH CHECK (
  (get_current_user_role() = ANY (ARRAY['admin'::text, 'super_admin'::text]))
);

-- Create a policy that allows the public to read data from the
-- prabas_holidays table for the frontend website.
CREATE POLICY "Public can view prabas_holidays"
ON public.prabas_holidays
FOR SELECT
USING (true);
