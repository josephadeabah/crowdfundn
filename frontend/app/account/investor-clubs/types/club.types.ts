// Core club types
export interface Club {
  id: string;
  slug: string;
  name: string;
  mission: string;
  investment_focus: string;
  current_members_count: number;
  total_contributions: number;
  total_invested: number;
  current_balance: number;
  currency: string;
  currency_symbol: string;
  status: 'active' | 'inactive' | 'suspended';
  access_type: 'open' | 'restricted' | 'certified';
  created_at: string;
  updated_at: string;
}

export interface ClubMembership {
  id: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  role: 'member' | 'admin' | 'creator';
  status: 'pending' | 'active' | 'inactive';
  total_contributed: number;
  contributed_share: number;
  joined_at: string;
  can_manage: boolean;
  can_vote: boolean;
  can_contribute: boolean;
}

export interface ClubContribution {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  user: {
    id: string;
    full_name: string;
  };
  transaction_reference: string;
  created_at: string;
}

// Portfolio and analytics types
export interface ClubPortfolioData {
  approved_campaigns_count: number;
  pending_investments: number;
  total_contributions: number;
  current_balance: number;
}

export interface VotingStats {
  total_votes: number;
  yes_votes: number;
  no_votes: number;
  approval_percentage: number;
  threshold_met: boolean;
}

// Extended types for dashboard display
export interface DashboardApprovedCampaign {
  id: string;
  campaign: {
    id: string;
    title: string;
    description: string;
    category: string;
    goal_amount: number;
    current_amount: number;
    currency: string;
    currency_symbol: string;
    fundraiser: {
      id: string;
      name: string;
    };
  };
  club_investment: {
    id: string;
    proposed_amount: number;
    proposed_share_percentage: number;
    voting_stats: VotingStats;
  };
  approved_at: string;
  voting_stats?: VotingStats;
}

// Props types
export interface ClubDashboardProps {
  club: Club;
}

export interface InvestmentProposalProps {
  club: Club;
  onClose: () => void;
}

export interface ClubMembersListProps {
  club: Club;
  members: ClubMembership[];
}

export interface ClubContributionsProps {
  club: Club;
  contributions: ClubContribution[];
}