// app/account/investor-clubs/clubservice.ts
import {
  Club,
  Member,
  Membership,
  ClubContribution,
  ClubInvestment,
  Vote,
  JoinClubResponse,
  MembershipStatusResponse,
  BaseResponse,
  LeaveClubResponse,
  RejectMemberResponse,
  CancelRequestResponse,
  ApproveMemberResponse,
  ClubsResponse,
  MyClubsResponse,
  DiscoverClubsResponse,
  PaginationData,
} from './clubTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Generic API call function with pagination support
const apiCall = async (
  endpoint: string,
  token: string,
  options: RequestInit = {},
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return await response.json();
};

// Investment Club API calls
export const clubService = {
  // Get all clubs with pagination
  getClubs: async (
    token: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<ClubsResponse> => {
    const endpoint = `/investment_clubs?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Get user's clubs with pagination
  getMyClubs: async (
    token: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<MyClubsResponse> => {
    const endpoint = `/investment_clubs/my_clubs?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Discover clubs (not joined) with pagination
  getDiscoverClubs: async (
    token: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<DiscoverClubsResponse> => {
    const endpoint = `/investment_clubs/discover?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Get club details
  getClub: async (token: string, clubId: string): Promise<{ club: Club }> => {
    return apiCall(`/investment_clubs/${clubId}`, token);
  },

  // Create new club
  createClub: async (
    token: string,
    clubData: any,
  ): Promise<{ success: boolean; club: Club }> => {
    return apiCall('/investment_clubs', token, {
      method: 'POST',
      body: JSON.stringify(clubData),
    });
  },

  // Update club
  updateClub: async (
    token: string,
    clubId: string,
    clubData: any,
  ): Promise<{ success: boolean; club: Club }> => {
    return apiCall(`/investment_clubs/${clubId}`, token, {
      method: 'PUT',
      body: JSON.stringify(clubData),
    });
  },

  // Join club
  joinClub: async (
    token: string,
    clubId: string,
  ): Promise<JoinClubResponse> => {
    try {
      const response = await apiCall(
        `/investment_clubs/${clubId}/join`,
        token,
        {
          method: 'POST',
        },
      );

      return {
        ...response,
        is_member: response.is_member !== undefined ? response.is_member : true,
      };
    } catch (error: any) {
      if (error.message && error.message.includes('Already a member')) {
        return {
          success: false,
          is_member: true,
          message: error.message,
        };
      }

      if (error.message.includes('capacity')) {
        throw new Error('This club has reached its maximum member limit.');
      } else {
        throw new Error('Failed to join club. Please try again.');
      }
    }
  },

  // Leave club
  leaveClub: async (
    token: string,
    clubId: string,
  ): Promise<LeaveClubResponse> => {
    try {
      const response = await apiCall(
        `/investment_clubs/${clubId}/leave`,
        token,
        {
          method: 'POST',
        },
      );
      return response;
    } catch (error: any) {
      // Enhanced error handling for creator leaving
      if (error.message.includes('transfer ownership')) {
        throw new Error(error.message);
      }
      throw new Error('Failed to leave club. Please try again.');
    }
  },

  // Delete club (creator only)
  deleteClub: async (token: string, clubId: string): Promise<BaseResponse> => {
    return apiCall(`/investment_clubs/${clubId}`, token, {
      method: 'DELETE',
    });
  },

  // Get membership status
  getMyMembershipStatus: async (
    token: string,
    clubId: string,
  ): Promise<MembershipStatusResponse> => {
    try {
      const response = await apiCall(
        `/investment_clubs/${clubId}/my_membership_status`,
        token,
      );
      return response;
    } catch (error: any) {
      if (
        error.message.includes('404') ||
        error.message.includes('Not a member')
      ) {
        return {
          success: false,
          is_member: false,
          message: 'Not a member of this club',
        };
      }
      throw error;
    }
  },

  // Transfer ownership
  transferOwnership: async (
    token: string,
    clubId: string,
    newAdminId: string,
  ): Promise<BaseResponse> => {
    return apiCall(`/investment_clubs/${clubId}/transfer_ownership`, token, {
      method: 'POST',
      body: JSON.stringify({ new_admin_id: newAdminId }),
    });
  },
};

// Club Memberships API calls
export const membershipService = {
  // Get club members with pagination
  getMembers: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ members: Member[]; pagination: PaginationData }> => {
    const endpoint = `/investment_clubs/${clubId}/memberships?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Get pending members with pagination
  getPendingMembers: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ pending_members: Member[]; pagination: PaginationData }> => {
    const endpoint = `/investment_clubs/${clubId}/memberships/pending?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Get my membership
  getMyMembership: async (
    token: string,
    clubId: string,
  ): Promise<{ membership: Membership }> => {
    return apiCall(
      `/investment_clubs/${clubId}/memberships/my_membership`,
      token,
    );
  },

  // Update member role
  updateMember: async (
    token: string,
    clubId: string,
    membershipId: string,
    data: any,
  ): Promise<{ success: boolean; membership: Member }> => {
    return apiCall(
      `/investment_clubs/${clubId}/memberships/${membershipId}`,
      token,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );
  },

  // Remove member
  removeMember: async (
    token: string,
    clubId: string,
    membershipId: string,
  ): Promise<BaseResponse> => {
    return apiCall(
      `/investment_clubs/${clubId}/memberships/${membershipId}`,
      token,
      {
        method: 'DELETE',
      },
    );
  },

  // Approve member
  approveMember: async (
    token: string,
    clubId: string,
    membershipId: string,
  ): Promise<ApproveMemberResponse> => {
    return apiCall(
      `/investment_clubs/${clubId}/memberships/${membershipId}/approve`,
      token,
      {
        method: 'POST',
      },
    );
  },

  // Reject member
  rejectMember: async (
    token: string,
    clubId: string,
    membershipId: string,
  ): Promise<RejectMemberResponse> => {
    return apiCall(
      `/investment_clubs/${clubId}/memberships/${membershipId}/reject`,
      token,
      {
        method: 'POST',
      },
    );
  },

  // Leave club (via membership endpoint)
  leaveClub: async (
    token: string,
    clubId: string,
    membershipId: string,
  ): Promise<LeaveClubResponse> => {
    return apiCall(
      `/investment_clubs/${clubId}/memberships/${membershipId}/leave`,
      token,
      {
        method: 'POST',
      },
    );
  },

  // Cancel membership request (alias for leave for pending members)
  cancelRequest: async (
    token: string,
    clubId: string,
    membershipId: string,
  ): Promise<CancelRequestResponse> => {
    return apiCall(
      `/investment_clubs/${clubId}/memberships/${membershipId}/leave`,
      token,
      {
        method: 'POST',
      },
    );
  },
};

// Club Contributions API calls
export const contributionService = {
  // Get club contributions with pagination
  getContributions: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<{
    contributions: ClubContribution[];
    pagination: PaginationData;
  }> => {
    const endpoint = `/investment_clubs/${clubId}/contributions?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Create contribution
  createContribution: async (
    token: string,
    clubId: string,
    amount: number,
  ): Promise<{
    success: boolean;
    contribution: ClubContribution;
    authorization_url: string;
    reference: string;
  }> => {
    const endpoint = `/investment_clubs/${clubId}/contributions`;
    return apiCall(endpoint, token, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  // Verify contribution payment - UPDATED RESPONSE TYPE
  verifyContribution: async (
    token: string,
    clubId: string,
    reference: string,
  ): Promise<{
    success: boolean;
    contribution: ClubContribution;
    transaction_status?: string;
    paystack_error?: string;
  }> => {
    const endpoint = `/investment_clubs/${clubId}/contributions/verify`;
    return apiCall(endpoint, token, {
      method: 'POST',
      body: JSON.stringify({ reference }),
    });
  },
};

// Club Investments API calls
export const investmentService = {
  // Get club investments with pagination
  getInvestments: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ investments: ClubInvestment[]; pagination: PaginationData }> => {
    const endpoint = `/investment_clubs/${clubId}/investments?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Create investment proposal
  createInvestment: async (
    token: string,
    clubId: string,
    campaignId: string,
    investmentAmount: number,
  ): Promise<{
    success: boolean;
    club_investment: ClubInvestment;
    voting_session_id: string;
  }> => {
    return apiCall(`/investment_clubs/${clubId}/investments`, token, {
      method: 'POST',
      body: JSON.stringify({
        campaign_id: campaignId,
        investment_amount: investmentAmount,
      }),
    });
  },

  // Vote on investment
  voteOnInvestment: async (
    token: string,
    clubId: string,
    investmentId: string,
    voteType: string,
    reason?: string,
  ): Promise<{
    success: boolean;
    vote: Vote;
    voting_stats: any;
    approved: boolean;
  }> => {
    return apiCall(
      `/investment_clubs/${clubId}/investments/${investmentId}/vote`,
      token,
      {
        method: 'POST',
        body: JSON.stringify({ vote_type: voteType, reason }),
      },
    );
  },

  // Execute approved investment
  executeInvestment: async (
    token: string,
    clubId: string,
    investmentId: string,
  ): Promise<{
    success: boolean;
    club_investment: ClubInvestment;
    transfer_reference: string;
  }> => {
    return apiCall(
      `/investment_clubs/${clubId}/investments/${investmentId}/execute`,
      token,
      {
        method: 'POST',
      },
    );
  },

  // Get AI recommendation
  getAIRecommendation: async (
    token: string,
    clubId: string,
    investmentId: string,
  ): Promise<any> => {
    return apiCall(
      `/investment_clubs/${clubId}/investments/${investmentId}/ai_recommendation`,
      token,
    );
  },

  // Get voting insights
  getVotingInsights: async (
    token: string,
    clubId: string,
    investmentId: string,
  ): Promise<any> => {
    return apiCall(
      `/investment_clubs/${clubId}/investments/${investmentId}/voting_insights`,
      token,
    );
  },
};

// Portfolio API calls
export const portfolioService = {
  // Get club portfolio
  getClubPortfolio: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<any> => {
    const endpoint = `/investment_clubs/${clubId}/portfolio?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Get club analytics
  getClubAnalytics: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<any> => {
    const endpoint = `/investment_clubs/${clubId}/analytics?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Get member portfolio
  getMemberPortfolio: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<any> => {
    const endpoint = `/investment_clubs/${clubId}/member_portfolio?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },
};
