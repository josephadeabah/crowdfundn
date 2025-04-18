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
  id: number;
  user_id?: number;
  name: string;
  email: string;
  role: 'founder' | 'advisor' | 'employee';
  title: string;
  description?: string;
  equity_percentage: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
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
}

export interface EquityCampaignState extends CampaignState {
  teamMembers: CampaignTeamMember[];
  investments: EquityInvestment[];
  documents: InvestorDocument[];
  currentDocument: InvestorDocument | null;

  // Campaign actions
  launchCampaign: (id: string) => Promise<void>;
  closeCampaign: (id: string) => Promise<void>;

  // Team member actions
  addTeamMember: (
    campaignId: string,
    member: Omit<CampaignTeamMember, 'id' | 'created_at'>,
  ) => Promise<CampaignTeamMember | null>;
  updateTeamMember: (
    campaignId: string,
    memberId: number,
    updates: Partial<CampaignTeamMember>,
  ) => Promise<CampaignTeamMember | null>;
  removeTeamMember: (campaignId: string, memberId: number) => Promise<void>;
  fetchTeamMembers: (campaignId: string) => Promise<void>;

  // Investment actions
  createInvestment: (
    campaignId: string,
    investment: Omit<EquityInvestment, 'id' | 'created_at'>,
  ) => Promise<EquityInvestment | null>;

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
  ) => Promise<void>;
}
