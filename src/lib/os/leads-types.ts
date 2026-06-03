export type OsLeadRow = {
  id: string;
  lead_name: string;
  business_name: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  temperature: string;
  tags: string[] | null;
  assigned_user_id: string | null;
  linked_client_id: string | null;
  next_follow_up_at: string | null;
  last_touch_at: string | null;
  linkedin_url: string | null;
  pipeline_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OsActivityRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  message: string | null;
  created_at: string;
};

export type AssigneeOption = { id: string; label: string };
