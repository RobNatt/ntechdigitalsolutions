-- ============================================
-- Link leads ↔ clients for CRM conversion
-- ============================================

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS client_id uuid;
CREATE INDEX IF NOT EXISTS idx_leads_client_id ON public.leads(client_id);

ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS source_lead_id uuid;
CREATE INDEX IF NOT EXISTS idx_clients_source_lead ON public.clients(source_lead_id);
