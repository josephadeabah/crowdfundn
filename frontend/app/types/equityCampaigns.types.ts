// app/types/equityCampaigns.types.ts
import { CampaignResponseDataType, CampaignState } from './campaigns.types';

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

export interface PaginationData {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_count: number;
}

export interface Investment {
  investor_name: string;
  amount: number;
  email?: string;
  date: string;
}

export interface EquityInvestment extends Investment {
  id: number;
  amount: number;
  shares: number;
  percentage: number;
  investor_id: number;
  campaign_id: number;
  created_at: string;
  updated_at: string;

  // Keep the flat property for backward compatibility
  certificate_exists?: boolean;
  certificate_url?: string;
  certificate_number?: string;

  // Add the nested certificate object that your backend returns
  certificate?: {
    exists: boolean;
    url: string | null;
    number: string;
  };

  status: 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded';
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
  current_value?: number;
  campaign: {
    id: number; // Added campaign id
    title: string;
    slug: string;
    status: string;
    valuation: number;
    equity_offered: number;
  };
}

export interface InvestmentPortfolio {
  portfolio: {
    total_invested: number;
    total_shares?: number;
    total_value?: number;
    active_investments: number;
    campaigns_invested: number;
    total_return?: number;
    return_percentage?: number;
  };
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

export interface InvestmentResponseData {
  investment?: EquityInvestment;
  authorization_url?: string;
  redirect_url?: string;
  code?: string;
  shares_available?: number;
}

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

export interface EquityCampaignState extends Omit<CampaignState, 'pagination'> {
  teamMembers: CampaignTeamMember[];
  investments: EquityInvestment[];
  documents: InvestorDocument[];
  currentDocument: InvestorDocument | null;
  portfolio: InvestmentPortfolio | null;
  certificateLoading: boolean;
  certificateError: string | null;
  certificateUrl: string | null;
  pagination: PaginationData;

  // Certificate actions - UPDATED to include campaignId parameter
  generateCertificate: (
    investmentId: string,
    campaignId: string,
  ) => Promise<{ success: boolean; url?: string; error?: string }>;
  downloadCertificate: (
    investmentId: string,
    campaignId: string,
  ) => Promise<void>;
  checkCertificateStatus: (
    investmentId: string,
    campaignId: string,
  ) => Promise<{ exists: boolean; url?: string }>;

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
  fetchPublicInvestments: (
    campaignId: string,
    page: number,
    perPage: number,
  ) => Promise<{
    investments: Investment[];
    pagination: PaginationData;
  }>;
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
  fetchPortfolio: (page: number, perPage: number) => Promise<void>;
  fetchMyInvestments: () => Promise<void>;
}
