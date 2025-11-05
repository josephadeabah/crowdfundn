// types/clubTypes.ts
export interface Club {
  id: string;
  slug: string;
  name: string;
  mission: string;
  description?: string; // Added to match your modal
  investment_focus: string;
  access_type: 'public' | 'private';
  status: 'active' | 'inactive';
  minimum_monthly_contribution: number;
  max_members: number;
  current_members_count: number;
  financials: {
    total_contributions: number;
    total_invested: number;
    current_balance: number;
  };
  creator: {
    id: string;
    name: string;
  };
  is_member: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
  role: 'creator' | 'admin' | 'member';
  status: 'pending' | 'active' | 'inactive';
  total_contributed: number;
  current_share: number;
  joined_at: string;
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

export interface ClubInvestment {
  id: string;
  campaign: {
    id: string;
    title: string;
    category: string;
    goal_amount: number;
    current_amount: number;
  };
  investment_amount: number;
  status:
    | 'pending'
    | 'voting'
    | 'approved'
    | 'rejected'
    | 'executed'
    | 'failed';
  shares_acquired: number | null;
  percentage_acquired: number | null;
  voting_session_id: string;
  created_at: string;
  executed_at: string | null;
}

export interface Vote {
  id: string;
  vote_type: 'invest' | 'pass' | 'yes' | 'no';
  reason: string | null;
  user: {
    id: string;
    full_name: string;
  };
  created_at: string;
}
