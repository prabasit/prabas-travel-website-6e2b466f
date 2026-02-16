
-- Fix 1: Enable RLS on homepage_ads (policies already exist but RLS was disabled)
ALTER TABLE public.homepage_ads ENABLE ROW LEVEL SECURITY;

-- Fix 2: Fix blog_likes and blog_comments RLS for anonymous interactions
-- Drop auth-requiring policies that don't match the email-based design
DROP POLICY IF EXISTS "Authenticated users can like posts" ON public.blog_likes;
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Authenticated users can comment" ON public.blog_comments;

-- blog_likes: allow anonymous insert/delete, public read
CREATE POLICY "Anyone can like posts"
ON public.blog_likes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can unlike posts"
ON public.blog_likes FOR DELETE
USING (true);

CREATE POLICY "Public can view likes"
ON public.blog_likes FOR SELECT
USING (true);

-- blog_comments: allow anonymous insert (moderated via is_approved)
CREATE POLICY "Anyone can submit comments"
ON public.blog_comments FOR INSERT
WITH CHECK (true);
