import { CampaignResponseDataType, CampaignState } from './campaigns.types';

// app/types/equityCampaigns.types.ts
export interface InvestorDocument {
  id: number;
  user_id: number;
  campaign_id: number;
  document_type: string;
  display_name: string;
  files: {
    url: string;
    filename: string;
    content_type: string;
    byte_size: number;
    human_size: string;
    uploaded_at: string;
  }[];
  created_at: string;
  updated_at: string;
  required: boolean;
}

export interface CampaignTeamMember {
  id?: number;
  user_id?: number;
  name: string;
  email: string;
  role: 'founder' | 'advisor' | 'employee';
  title: string;
  description?: string;
  equity_percentage: number;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EquityCampaignResponseDataType
  extends CampaignResponseDataType {
  valuation: number;
  equity_offered: number;
  minimum_investment: number;
  maximum_investment: number;
  equity_status:
    | 'draft'
    | 'pending_approval'
    | 'live'
    | 'funded'
    | 'failed'
    | 'closed';
  shares_available: number;
  percentage_raised: number;
  total_investors: number;
  team_members: CampaignTeamMember[];
  documents: InvestorDocument[];
  company_info: {
    name: string;
    description: string;
    headquarters: string;
    website: string;
    contract_term: string;
  };
  investment_range: {
    minimum: number;
    maximum: number;
  };
}

export interface EquityInvestment {
  id: number;
  amount: number;
  shares: number;
  investor_id: number;
  campaign_id: number;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  payment_method?: string;
  transaction_id?: string;
  investor_details?: {
    name: string;
    email: string;
    phone?: string;
  };
  campaign_details?: {
    title: string;
    equity_offered: number;
    valuation: number;
  };
}

export interface InvestmentPortfolio {
  total_invested: number;
  total_shares: number;
  active_investments: number;
  campaigns_invested: number;
  investments: EquityInvestment[];
}

export interface ShareCertificate {
  id: string;
  campaign_id: number;
  investor_id: number;
  shares: number;
  issue_date: string;
  certificate_number: string;
  status: 'issued' | 'pending' | 'cancelled';
  document_url?: string;
}

export interface InvestmentCreatePayload {
  amount: number;
  shares?: number;
  email?: string;
  phone?: string;
  full_name?: string;
  metadata?: any;
  payment_method?: string;
}

// Add this interface for the investment response data
export interface InvestmentResponseData {
  investment?: EquityInvestment;
  authorization_url?: string;
  redirect_url?: string;
  code?: string;
  shares_available?: number;
}

// Update the InvestmentCreateResponse interface
export interface InvestmentCreateResponse {
  success: boolean;
  data?: InvestmentResponseData;
  error?: string;
  validationErrors?: Record<string, string[] | string>;
  code?: string;
}

export interface InvestmentUpdatePayload {
  amount?: number;
  shares?: number;
  status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
  metadata?: any;
}

export interface EquityCampaignState extends CampaignState {
  teamMembers: CampaignTeamMember[];
  investments: EquityInvestment[];
  documents: InvestorDocument[];
  currentDocument: InvestorDocument | null;
  portfolio: InvestmentPortfolio | null;
  shareCertificates: ShareCertificate[];

  // Campaign actions
  fetchPendingReviewCampaigns: () => Promise<EquityCampaignResponseDataType[]>;
  submitForApproval: (
    id: string,
  ) => Promise<{ success: boolean; error?: string }>;
  approveCampaign: (
    id: string,
  ) => Promise<{ success: boolean; error?: string }>;
  rejectCampaign: (
    id: string,
    rejectionReason: string,
  ) => Promise<{ success: boolean; error?: string }>;
  launchCampaign: (id: string) => Promise<{ success: boolean; error?: string }>;
  closeCampaign: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Team member actions
  addTeamMember: (
    campaignId: string,
    formData: FormData,
  ) => Promise<CampaignTeamMember | null>;
  updateTeamMember: (
    campaignId: string,
    memberId: number,
    updates: Partial<CampaignTeamMember>,
  ) => Promise<CampaignTeamMember | null>;
  removeTeamMember: (campaignId: string, memberId: number) => Promise<void>;
  fetchTeamMembers: (campaignId: string) => Promise<void>;

  // Investment actions
  fetchInvestments: (campaignId: string) => Promise<void>;
  fetchPublicInvestments: (campaignId: string) => Promise<void>;
  createInvestment: (
    campaignId: string,
    investment: InvestmentCreatePayload,
  ) => Promise<InvestmentCreateResponse>;
  fetchInvestmentDetails: (
    investmentId: string,
  ) => Promise<EquityInvestment | null>;
  updateInvestment: (
    investmentId: string,
    updates: InvestmentUpdatePayload,
  ) => Promise<{ success: boolean; data?: EquityInvestment; error?: string }>;
  deleteInvestment: (
    investmentId: string,
  ) => Promise<{ success: boolean; error?: string }>;

  // Document actions
  fetchDocuments: (campaignId: string) => Promise<void>;
  getDocument: (campaignId: string, documentId: number) => Promise<void>;
  createDocument: (
    campaignId: string,
    documentType: string,
    files: File[],
  ) => Promise<InvestorDocument | null>;
  updateDocument: (
    campaignId: string,
    documentId: number,
    documentType: string,
    files: File[],
  ) => Promise<InvestorDocument | null>;
  deleteDocument: (campaignId: string, documentId: number) => Promise<void>;

  // Portfolio actions
  fetchPortfolio: () => Promise<void>;
  fetchMyInvestments: () => Promise<void>;

  // Share certificate actions
  fetchShareCertificates: (campaignId: string) => Promise<void>;
  fetchShareCertificateById: (
    campaignId: string,
    certificateId: string,
  ) => Promise<ShareCertificate | null>;
}
