-- Leads CRM: uncontacted stage setting, client lead updates, activity log visibility, indexes, updated_at.

ALTER TABLE public.os_settings
  ADD COLUMN IF NOT EXISTS uncontacted_stage text NOT NULL DEFAULT 'New';

CREATE OR REPLACE FUNCTION public.touch_os_leads_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_os_leads_updated ON public.os_leads;
CREATE TRIGGER trg_os_leads_updated
  BEFORE UPDATE ON public.os_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_os_leads_updated_at();

CREATE INDEX IF NOT EXISTS idx_os_leads_created_at ON public.os_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_os_leads_status ON public.os_leads (status);
CREATE INDEX IF NOT EXISTS idx_os_leads_email_lower ON public.os_leads (lower(nullif(trim(email), '')));
CREATE INDEX IF NOT EXISTS idx_os_leads_phone_digits ON public.os_leads (regexp_replace(coalesce(phone, ''), '\D', '', 'g'));

-- Clients may update leads they are assigned to or linked via client record.
DROP POLICY IF EXISTS "os_leads_update" ON public.os_leads;
CREATE POLICY "os_leads_update" ON public.os_leads
  FOR UPDATE TO authenticated
  USING (
    public.is_os_internal()
    OR assigned_user_id = auth.uid()
    OR linked_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
  )
  WITH CHECK (
    public.is_os_internal()
    OR assigned_user_id = auth.uid()
    OR linked_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
  );

-- Activity: internal sees all; clients see rows tied to leads they can access.
DROP POLICY IF EXISTS "os_activity_log_select" ON public.os_activity_log;
CREATE POLICY "os_activity_log_select" ON public.os_activity_log
  FOR SELECT TO authenticated
  USING (
    public.is_os_internal()
    OR (
      entity_type = 'os_lead'
      AND EXISTS (
        SELECT 1
        FROM public.os_leads l
        WHERE l.id = os_activity_log.entity_id
          AND (
            l.assigned_user_id = auth.uid()
            OR l.linked_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
          )
      )
    )
  );

-- Activity insert: internal or owner of the referenced lead (for audit trail on client edits).
DROP POLICY IF EXISTS "os_activity_log_insert" ON public.os_activity_log;
CREATE POLICY "os_activity_log_insert" ON public.os_activity_log
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_os_internal()
    OR (
      entity_type = 'os_lead'
      AND EXISTS (
        SELECT 1
        FROM public.os_leads l
        WHERE l.id = entity_id
          AND (
            l.assigned_user_id = auth.uid()
            OR l.linked_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
          )
      )
    )
  );
