REVOKE SELECT (password_hash) ON public.admin_users FROM anon, authenticated;
REVOKE SELECT (author_email) ON public.blog_comments FROM anon, authenticated;
REVOKE SELECT (user_email) ON public.blog_likes FROM anon, authenticated;