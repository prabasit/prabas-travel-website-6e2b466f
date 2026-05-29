-- Disable RLS on team_members per admin request and clean conflicting policies
DROP POLICY IF EXISTS "Admins can manage" ON public.team_members;
DROP POLICY IF EXISTS "Enable public read access" ON public.team_members;
DROP POLICY IF EXISTS "Public can view basic team info" ON public.team_members;
DROP POLICY IF EXISTS "Admin can manage team members" ON public.team_members;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;