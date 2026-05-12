-- Client-facing CRUD for projects, clients (own), events; activity log for os_client/os_project/os_payment/os_event.

ALTER TABLE public.os_payments
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.touch_os_projects_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_os_projects_updated ON public.os_projects;
CREATE TRIGGER trg_os_projects_updated
  BEFORE UPDATE ON public.os_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_os_projects_updated_at();

CREATE OR REPLACE FUNCTION public.touch_os_events_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_os_events_updated ON public.os_events;
CREATE TRIGGER trg_os_events_updated
  BEFORE UPDATE ON public.os_events
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_os_events_updated_at();

CREATE OR REPLACE FUNCTION public.touch_os_payments_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_os_payments_updated ON public.os_payments;
CREATE TRIGGER trg_os_payments_updated
  BEFORE UPDATE ON public.os_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_os_payments_updated_at();

-- os_clients: portal user may update their own directory row
DROP POLICY IF EXISTS "os_clients_update" ON public.os_clients;
CREATE POLICY "os_clients_update" ON public.os_clients
  FOR UPDATE TO authenticated
  USING (
    public.is_os_internal()
    OR id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
  )
  WITH CHECK (
    public.is_os_internal()
    OR id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
  );

-- os_projects: split write policy so clients can update (e.g. kanban) but not insert/delete
DROP POLICY IF EXISTS "os_projects_write" ON public.os_projects;
CREATE POLICY "os_projects_insert" ON public.os_projects
  FOR INSERT TO authenticated
  WITH CHECK (public.is_os_internal());

CREATE POLICY "os_projects_update" ON public.os_projects
  FOR UPDATE TO authenticated
  USING (
    public.is_os_internal()
    OR client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
  )
  WITH CHECK (
    public.is_os_internal()
    OR client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
  );

CREATE POLICY "os_projects_delete" ON public.os_projects
  FOR DELETE TO authenticated
  USING (public.is_os_internal());

-- os_payments: internal-only writes; clients read-only
DROP POLICY IF EXISTS "os_payments_write" ON public.os_payments;
CREATE POLICY "os_payments_insert" ON public.os_payments
  FOR INSERT TO authenticated
  WITH CHECK (public.is_os_internal());

CREATE POLICY "os_payments_update" ON public.os_payments
  FOR UPDATE TO authenticated
  USING (public.is_os_internal())
  WITH CHECK (public.is_os_internal());

CREATE POLICY "os_payments_delete" ON public.os_payments
  FOR DELETE TO authenticated
  USING (public.is_os_internal());

-- os_events: clients see + edit own / linked; cannot delete
DROP POLICY IF EXISTS "os_events_select" ON public.os_events;
CREATE POLICY "os_events_select" ON public.os_events
  FOR SELECT TO authenticated
  USING (
    public.is_os_internal()
    OR created_by_user_id = auth.uid()
    OR related_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
    OR related_lead_id IN (
      SELECT l.id FROM public.os_leads l
      WHERE l.linked_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
         OR l.assigned_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "os_events_write" ON public.os_events;
CREATE POLICY "os_events_insert" ON public.os_events
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_os_internal()
    OR (
      created_by_user_id = auth.uid()
      AND (
        related_client_id IS NULL
        OR related_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
      )
    )
  );

CREATE POLICY "os_events_update" ON public.os_events
  FOR UPDATE TO authenticated
  USING (
    public.is_os_internal()
    OR created_by_user_id = auth.uid()
    OR related_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
  )
  WITH CHECK (
    public.is_os_internal()
    OR created_by_user_id = auth.uid()
    OR related_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
  );

CREATE POLICY "os_events_delete" ON public.os_events
  FOR DELETE TO authenticated
  USING (public.is_os_internal());

-- Activity log: broaden SELECT/INSERT for non-internal users on their entities
DROP POLICY IF EXISTS "os_activity_log_select" ON public.os_activity_log;
CREATE POLICY "os_activity_log_select" ON public.os_activity_log
  FOR SELECT TO authenticated
  USING (
    public.is_os_internal()
    OR (
      entity_type = 'os_lead'
      AND EXISTS (
        SELECT 1 FROM public.os_leads l
        WHERE l.id = os_activity_log.entity_id
          AND (
            l.assigned_user_id = auth.uid()
            OR l.linked_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
          )
      )
    )
    OR (
      entity_type = 'os_client'
      AND entity_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
    )
    OR (
      entity_type = 'os_project'
      AND EXISTS (
        SELECT 1 FROM public.os_projects pr
        WHERE pr.id = os_activity_log.entity_id
          AND pr.client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
      )
    )
    OR (
      entity_type = 'os_payment'
      AND EXISTS (
        SELECT 1 FROM public.os_payments pay
        WHERE pay.id = os_activity_log.entity_id
          AND pay.client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
      )
    )
    OR (
      entity_type = 'os_event'
      AND EXISTS (
        SELECT 1 FROM public.os_events e
        WHERE e.id = os_activity_log.entity_id
          AND (
            e.created_by_user_id = auth.uid()
            OR e.related_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
          )
      )
    )
  );

DROP POLICY IF EXISTS "os_activity_log_insert" ON public.os_activity_log;
CREATE POLICY "os_activity_log_insert" ON public.os_activity_log
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_os_internal()
    OR (
      entity_type = 'os_lead'
      AND EXISTS (
        SELECT 1 FROM public.os_leads l
        WHERE l.id = entity_id
          AND (
            l.assigned_user_id = auth.uid()
            OR l.linked_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
          )
      )
    )
    OR (
      entity_type = 'os_client'
      AND entity_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
    )
    OR (
      entity_type = 'os_project'
      AND EXISTS (
        SELECT 1 FROM public.os_projects pr
        WHERE pr.id = entity_id
          AND pr.client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
      )
    )
    OR (
      entity_type = 'os_payment'
      AND EXISTS (
        SELECT 1 FROM public.os_payments pay
        WHERE pay.id = entity_id
          AND pay.client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
      )
    )
    OR (
      entity_type = 'os_event'
      AND EXISTS (
        SELECT 1 FROM public.os_events e
        WHERE e.id = entity_id
          AND (
            e.created_by_user_id = auth.uid()
            OR e.related_client_id = (SELECT p.os_client_id FROM public.profiles p WHERE p.id = auth.uid())
          )
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_os_payments_date ON public.os_payments (date);

GRANT UPDATE ON public.os_payments TO authenticated;
