-- ============================================
-- nTech Digital Solutions - Initial Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- 1. PROFILES (extends auth.users)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'member' CHECK (role IN ('ceo', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure profiles has required columns (handles existing Supabase default profiles table)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'member';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Allow company_id to be null so backfill works (your schema may require it; set per-user later)
ALTER TABLE public.profiles ALTER COLUMN company_id DROP NOT NULL;

-- Replace role check to allow ceo, admin, member (your schema may have different allowed values)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
-- Fix existing rows with invalid role values (e.g. 'user', 'owner') before adding new constraint
UPDATE public.profiles SET role = 'member' WHERE role IS NULL OR role NOT IN ('ceo', 'admin', 'member');
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('ceo', 'admin', 'member'));

-- Backfill existing users (run once if you already have users)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''), 'ceo'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, full_name = EXCLUDED.full_name, role = EXCLUDED.role;


-- 2. CALENDAR EVENTS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  date date NOT NULL,
  hour int NOT NULL DEFAULT 0,
  duration int NOT NULL DEFAULT 1,
  start_minutes int NOT NULL DEFAULT 0,
  end_minutes int NOT NULL DEFAULT 60,
  notes text,
  color text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own calendar events" ON public.calendar_events;
CREATE POLICY "Users can manage own calendar events" ON public.calendar_events
  FOR ALL USING (auth.uid() = user_id);


-- 3. EMAILS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "from" text NOT NULL,
  "to" text NOT NULL,
  subject text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  date timestamptz NOT NULL DEFAULT now(),
  folder text NOT NULL DEFAULT 'inbox' CHECK (folder IN ('inbox', 'sent', 'drafts', 'spam')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own emails" ON public.emails;
CREATE POLICY "Users can manage own emails" ON public.emails
  FOR ALL USING (auth.uid() = user_id);


-- 4. BUSINESS PERMISSIONS (CEO tab)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.business_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.business_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own permissions" ON public.business_permissions;
CREATE POLICY "Users can manage own permissions" ON public.business_permissions
  FOR ALL USING (auth.uid() = user_id);


-- 5. STRIPE EARNINGS (CEO tab)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.stripe_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  amount decimal(12,2) NOT NULL DEFAULT 0,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'refunded')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.stripe_earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own earnings" ON public.stripe_earnings;
CREATE POLICY "Users can manage own earnings" ON public.stripe_earnings
  FOR ALL USING (auth.uid() = user_id);


-- 6. CLIENTS (CEO tab)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  company text DEFAULT '',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own clients" ON public.clients;
CREATE POLICY "Users can manage own clients" ON public.clients
  FOR ALL USING (auth.uid() = user_id);
