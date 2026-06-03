export type OsLeadTouchpointRow = {
  id: string;
  lead_id: string;
  channel: string;
  outcome: string | null;
  notes: string | null;
  touched_at: string;
  next_follow_up_at: string | null;
  created_at: string;
};

export type OsLeadDocumentRow = {
  id: string;
  lead_id: string;
  stage: string | null;
  file_name: string;
  storage_path: string;
  mime_type: string | null;
  byte_size: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  download_url?: string | null;
};

export type OsLeadChecklistRow = {
  id: string;
  lead_id: string;
  stage: string;
  item_key: string;
  label: string;
  completed_at: string | null;
  notes: string | null;
};

export type OsLeadEventRow = {
  id: string;
  title: string;
  date_start: string;
  date_end: string;
  event_type: string;
  status: string;
  meeting_link: string | null;
};

export type LeadWorkspaceData = {
  touchpoints: OsLeadTouchpointRow[];
  documents: OsLeadDocumentRow[];
  checklist: OsLeadChecklistRow[];
  events: OsLeadEventRow[];
  next_follow_up_at: string | null;
  last_touch_at: string | null;
  linkedin_url: string | null;
  pipeline_notes: string | null;
};
