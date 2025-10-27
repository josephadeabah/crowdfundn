export interface ReportType {
  id: number;
  report_type: string;
  report_type_display: string;
  description: string;
  status: string;
  status_display: string;
  priority: string;
  priority_display: string;
  created_at: string;
  updated_at: string;
  reporter: {
    id: number;
    name: string;
    email: string;
  };
  campaign?: {
    id: number;
    title: string;
    fundraiser_name: string;
  };
  reported_user?: {
    id: number;
    name: string;
    email: string;
  };
  assigned_admin?: {
    id: number;
    name: string;
  };
  action_taken?: string;
  resolution_notes?: string;
  resolved_at?: string;
  evidence_links: string[];
  contact_email?: string;
}

export interface ReportFormData {
  report_type: string;
  description: string;
  campaign_id?: string;
  reported_user_id?: string;
  contact_email: string;
  evidence_links: string[];
}
