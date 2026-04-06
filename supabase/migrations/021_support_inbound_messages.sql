-- ============================================
-- Support inbox — inbound email / webhook storage (CEO dashboard)
-- ============================================

CREATE TABLE IF NOT EXISTS public.support_inbound_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies (id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients (id) ON DELETE SET NULL,
  from_email text NOT NULL,
  from_name text,
  to_email text,
  subject text,
  body_text text,
  body_html text,
  raw jsonb NOT NULL DEFAULT '{}',
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_inbound_created
  ON public.support_inbound_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_inbound_client
  ON public.support_inbound_messages (client_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_inbound_company
  ON public.support_inbound_messages (company_id, created_at DESC);

ALTER TABLE public.support_inbound_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct access support_inbound_messages" ON public.support_inbound_messages;
CREATE POLICY "No direct access support_inbound_messages" ON public.support_inbound_messages
  FOR ALL USING (false);
