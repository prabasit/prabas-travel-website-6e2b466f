-- Fix the multiple rows issue by keeping only one row
DELETE FROM public.about_us WHERE id NOT IN (
  SELECT id FROM public.about_us ORDER BY created_at DESC LIMIT 1
);