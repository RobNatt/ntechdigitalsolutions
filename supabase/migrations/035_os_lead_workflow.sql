-- Lead workflow: touch history, documents, checklists, scheduling fields, storage bucket.

ALTER TABLE public.os_leads
  ADD COLUMN IF NOT EXISTS next_follow_up_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_touch_at timestamptz,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS pipeline_notes text;

CREATE TABLE IF NOT EXISTS public.os_lead_touchpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.os_leads (id) ON DELETE CASCADE,
  channel text NOT NULL,
  outcome text,
  notes text,
  touched_at timestamptz NOT NULL DEFAULT now(),
  next_follow_up_at timestamptz,
  created_by_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_os_lead_touchpoints_lead ON public.os_lead_touchpoints (lead_id, touched_at DESC);

CREATE TABLE IF NOT EXISTS public.os_lead_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.os_leads (id) ON DELETE CASCADE,
  stage text,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  byte_size bigint,
  notes text,
  uploaded_by_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_os_lead_documents_lead ON public.os_lead_documents (lead_id, updated_at DESC);

CREATE OR REPLACE FUNCTION public.touch_os_lead_documents_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_os_lead_documents_updated ON public.os_lead_documents;
CREATE TRIGGER trg_os_lead_documents_updated
  BEFORE UPDATE ON public.os_lead_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_os_lead_documents_updated_at();

CREATE TABLE IF NOT EXISTS public.os_lead_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.os_leads (id) ON DELETE CASCADE,
  stage text NOT NULL,
  item_key text NOT NULL,
  label text NOT NULL,
  completed_at timestamptz,
  notes text,
  UNIQUE (lead_id, stage, item_key)
);

CREATE INDEX IF NOT EXISTS idx_os_lead_checklist_lead ON public.os_lead_checklist (lead_id, stage);

-- RLS: internal team only
ALTER TABLE public.os_lead_touchpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_lead_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_lead_checklist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "os_lead_touchpoints_all" ON public.os_lead_touchpoints;
CREATE POLICY "os_lead_touchpoints_all" ON public.os_lead_touchpoints
  FOR ALL TO authenticated
  USING (public.is_os_internal())
  WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_lead_documents_all" ON public.os_lead_documents;
CREATE POLICY "os_lead_documents_all" ON public.os_lead_documents
  FOR ALL TO authenticated
  USING (public.is_os_internal())
  WITH CHECK (public.is_os_internal());

DROP POLICY IF EXISTS "os_lead_checklist_all" ON public.os_lead_checklist;
CREATE POLICY "os_lead_checklist_all" ON public.os_lead_checklist
  FOR ALL TO authenticated
  USING (public.is_os_internal())
  WITH CHECK (public.is_os_internal());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_lead_touchpoints TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_lead_documents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.os_lead_checklist TO authenticated;

-- Storage bucket for lead files (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('os-lead-documents', 'os-lead-documents', false, 20971520)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "os_lead_docs_storage_select" ON storage.objects;
CREATE POLICY "os_lead_docs_storage_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'os-lead-documents' AND public.is_os_internal());

DROP POLICY IF EXISTS "os_lead_docs_storage_insert" ON storage.objects;
CREATE POLICY "os_lead_docs_storage_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'os-lead-documents' AND public.is_os_internal());

DROP POLICY IF EXISTS "os_lead_docs_storage_delete" ON storage.objects;
CREATE POLICY "os_lead_docs_storage_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'os-lead-documents' AND public.is_os_internal());

-- Replace default pipeline stages in settings + migrate existing lead statuses
UPDATE public.os_settings
SET enum_defaults = jsonb_set(
  COALESCE(enum_defaults, '{}'::jsonb),
  '{lead_stages}',
  '["New", "Contacted", "Discovery Call", "Research", "Proposal Meeting", "Won", "Lost"]'::jsonb,
  true
)
WHERE id = '00000000-0000-4000-8000-000000000001';

UPDATE public.os_leads SET status = 'Discovery Call' WHERE status IN ('Booked', 'Showed');
UPDATE public.os_leads SET status = 'Proposal Meeting' WHERE status = 'Qualified';
UPDATE public.os_leads SET status = 'Won' WHERE status IN ('Closed', 'Closed Won');
UPDATE public.os_leads SET status = 'Lost' WHERE status IN ('Closed Lost', 'Disqualified');
