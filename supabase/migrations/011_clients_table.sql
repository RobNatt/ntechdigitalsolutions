-- ============================================
-- Clients table (CRM) — service role via API only
-- ============================================

CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid,
  name text,
  email text,
  phone text,
  address text,
  details jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_company_created ON public.clients(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct user access to clients" ON public.clients;
CREATE POLICY "No direct user access to clients" ON public.clients
  FOR ALL USING (false);
