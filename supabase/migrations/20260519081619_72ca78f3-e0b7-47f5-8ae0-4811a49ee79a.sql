-- Allow admin panel (custom session via admin_operation RPC setting app.admin_validated=true)
-- to perform full CRUD on all content tables that currently lack such a policy.

-- team_members
CREATE POLICY "Admin can manage team members"
ON public.team_members FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- about_us
CREATE POLICY "Admin can manage about_us"
ON public.about_us FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- awards
CREATE POLICY "Admin can manage awards"
ON public.awards FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- blog_posts
CREATE POLICY "Admin can manage blog_posts"
ON public.blog_posts FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- blog_comments
CREATE POLICY "Admin can manage blog_comments"
ON public.blog_comments FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- careers
CREATE POLICY "Admin can manage careers"
ON public.careers FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- inquiries
CREATE POLICY "Admin can manage inquiries"
ON public.inquiries FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- job_applications
CREATE POLICY "Admin can manage job_applications"
ON public.job_applications FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- newsletter_subscriptions
CREATE POLICY "Admin can manage newsletter_subscriptions"
ON public.newsletter_subscriptions FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- settings
CREATE POLICY "Admin can manage settings"
ON public.settings FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- testimonials
CREATE POLICY "Admin can manage testimonials"
ON public.testimonials FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);

-- blog_likes (allow admins to update too if ever needed)
CREATE POLICY "Admin can manage blog_likes"
ON public.blog_likes FOR ALL TO public
USING ((current_setting('app.admin_validated', true))::boolean = true)
WITH CHECK ((current_setting('app.admin_validated', true))::boolean = true);