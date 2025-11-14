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

export const useClubInvestmentService = () => {
  const { token } = useAuth();

  const fetchClubInvestments = async (
    clubSlug: string,
    status?: string,
  ): Promise<ClubInvestment[]> => {
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

  const fetchApprovedCampaigns = async (
    clubSlug: string,
  ): Promise<ApprovedCampaign[]> => {
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

  const castVote = async (
    investmentId: string,
    voteType: 'yes' | 'no',
    votingSessionId: string,
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/votes/ClubInvestment/${investmentId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote_type: voteType,
          voting_session_id: votingSessionId,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to cast vote');
    }

    const data = await response.json();
    return data;
  };

  return {
    fetchClubInvestments,
    fetchApprovedCampaigns,
    castVote,
  };
};
