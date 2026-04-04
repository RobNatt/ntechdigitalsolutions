-- ============================================
-- Align legacy `clients` (001) with CRM push-to-client API
-- Safe if 011-only clients table: adds missing columns.
-- ============================================

ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS details jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS company_id uuid;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS source_lead_id uuid;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Allow CRM rows without email/name (lead may only have phone)
ALTER TABLE public.clients ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.clients ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.clients ALTER COLUMN user_id DROP NOT NULL;
