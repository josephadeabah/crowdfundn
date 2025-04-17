import { CampaignResponseDataType, CampaignState } from "./campaigns.types";

// app/types/equityCampaigns.types.ts
export interface EquityCampaignResponseDataType extends CampaignResponseDataType {
    valuation: number;
    equity_offered: number;
    minimum_investment: number;
    equity_status: 'draft' | 'pending_approval' | 'live' | 'funded' | 'failed' | 'closed';
    shares_available: number;
    percentage_raised: number;
    total_investors: number;
    team_members: CampaignTeamMember[];
  }
  
  export interface CampaignTeamMember {
    id: number;
    user_id: number;
    name: string;
    email: string;
    role: 'founder' | 'advisor' | 'employee';
    title: string;
    equity_percentage: number;
    avatar_url?: string;
    created_at: string;
  }
  
  export interface EquityInvestment {
    id: number;
    amount: number;
    shares: number;
    investor_id: number;
    campaign_id: number;
    created_at: string;
  }
  
  export interface EquityCampaignState extends CampaignState {
    teamMembers: CampaignTeamMember[];
    investments: EquityInvestment[];
    launchCampaign: (id: string) => Promise<void>;
    closeCampaign: (id: string) => Promise<void>;
    addTeamMember: (member: Omit<CampaignTeamMember, 'id' | 'created_at'>) => Promise<void>;
    updateTeamMember: (id: number, updates: Partial<CampaignTeamMember>) => Promise<void>;
    removeTeamMember: (id: number) => Promise<void>;
    createInvestment: (investment: Omit<EquityInvestment, 'id' | 'created_at'>) => Promise<void>;
  }