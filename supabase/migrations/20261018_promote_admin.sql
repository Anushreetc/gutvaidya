-- =========================================================
-- Promote the first administrator for production.
--
-- Run this ONCE in Supabase SQL Editor AFTER:
--   1. The target person has signed up on the site (so a row in
--      public.profiles exists for them, created by the handle_new_user trigger).
--   2. 20260930_launch_fixes.sql and 20260930_security_advisor.sql have run.
--
-- Replace the email with the admin's real email before running.
-- =========================================================

update public.profiles
set role = 'admin',
    updated_at = timezone('utc'::text, now())
where email = 'REPLACE_ME@thegutvaidya.com';

-- Verify
select id, email, name, role, created_at
from public.profiles
where role = 'admin';
