-- Fix critical security vulnerability in job_applications table
-- Remove the overly permissive public access policy that allows anyone to read/modify all job applications

-- Drop the dangerous policy that allows public access to all job applications
DROP POLICY IF EXISTS "Allow public access to job applications" ON public.job_applications;

-- The remaining policies are:
-- 1. "Admins can manage job applications" - allows admins full access
-- 2. "Public can submit job applications" - allows public to INSERT only
-- This ensures applicants can submit applications but only admins can view them