import { useAuth } from '@/app/context/auth/AuthContext';

export interface ClubInvestment {
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
  };
  investment_amount: number;
  status: 'pending' | 'voting' | 'approved' | 'rejected';
  voting_session_id: string;
  voting_stats: {
    total_votes: number;
    yes_votes: number;
    no_votes: number;
    approval_percentage: number;
    threshold_met: boolean;
  };
}

export interface ApprovedCampaign {
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
    voting_stats: any;
  };
  approved_at: string;
}

export interface AIInvestment {
  id: string;
  company: string;
  description: string;
  amount: string;
  sector: string;
  votes: number;
  threshold: number;
  match_score?: number;
  reasoning?: string;
  ai_analysis?: any;
  status?: 'voting' | 'approved' | 'rejected';
  voting_stats?: any;
  club_investment_id?: string;
  campaign_id?: string;
}

export const useClubInvestmentService = () => {
  const { token } = useAuth();

  const fetchClubInvestments = async (clubSlug: string, status?: string): Promise<ClubInvestment[]> => {
    const url = status 
      ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${clubSlug}/investments?status=${status}`
      : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${clubSlug}/investments`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch club investments');
    }

    const data = await response.json();
    return data.success ? data.investments : [];
  };

  const fetchApprovedCampaigns = async (clubSlug: string): Promise<ApprovedCampaign[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${clubSlug}/approved_campaigns`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch approved campaigns');
    }

    const data = await response.json();
    return data.success ? data.approved_campaigns : [];
  };

  const castVote = async (clubSlug: string, investmentId: string, voteType: 'yes' | 'no') => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${clubSlug}/investments/${investmentId}/vote`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote_type: voteType,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to cast vote');
    }

    const data = await response.json();
    return data;
  };

  const generateProposals = async (clubSlug: string, limit: number = 5): Promise<AIInvestment[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${clubSlug}/investments/generate_proposals`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to generate proposals');
    }

    const data = await response.json();
    return data.success ? data.proposals : [];
  };

  const fetchPortfolioData = async (clubSlug: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${clubSlug}/portfolio`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch portfolio data');
    }

    const data = await response.json();
    return data.success ? data.portfolio : null;
  };

  return {
    fetchClubInvestments,
    fetchApprovedCampaigns,
    castVote,
    generateProposals,
    fetchPortfolioData,
  };
};