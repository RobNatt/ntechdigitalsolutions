-- ============================================
-- Custom Auth: ID + password, 2FA via SMS
-- No sign-up; profiles created by admin/developer only
-- Run in Supabase SQL Editor
-- ============================================

-- Add login_id (ID number) and phone_number to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS login_id text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number text;

-- Add developer role (admin and developer can create profiles)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
UPDATE public.profiles SET role = 'member' WHERE role IS NULL OR role NOT IN ('ceo', 'admin', 'developer', 'member');
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('ceo', 'admin', 'developer', 'member'));

-- Index for fast login lookup (bypasses RLS via service role)
CREATE INDEX IF NOT EXISTS idx_profiles_login_id ON public.profiles(login_id) WHERE login_id IS NOT NULL;

-- 2FA verification codes (temporary, expire after 10 min)
CREATE TABLE IF NOT EXISTS public.auth_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '10 minutes'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.auth_verification_codes ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (no user access)
DROP POLICY IF EXISTS "No direct user access" ON public.auth_verification_codes;
CREATE POLICY "No direct user access" ON public.auth_verification_codes
  FOR ALL USING (false);

-- Cleanup expired codes (optional: run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void AS $$
  DELETE FROM public.auth_verification_codes WHERE expires_at < now();
$$ LANGUAGE sql SECURITY DEFINER;

-- Update handle_new_user to set login_id and phone_number from metadata (when admin creates user)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, login_id, phone_number)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member'),
    NEW.raw_user_meta_data->>'login_id',
    NEW.raw_user_meta_data->>'phone_number'
  )
  ON CONFLICT (id) DO UPDATE SET
    login_id = COALESCE(EXCLUDED.login_id, public.profiles.login_id),
    phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
