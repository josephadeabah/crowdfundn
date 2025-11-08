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
} from './clubTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Generic API call function with enhanced debugging
const apiCall = async (
  endpoint: string,
  token: string,
  options: RequestInit = {},
) => {
  console.log(
    '🔗 API CALL:',
    `${API_BASE_URL}${endpoint}`,
    options.method || 'GET',
  );

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log(
      '📡 API RESPONSE STATUS:',
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ API ERROR:', errorData);
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API SUCCESS:', data);
    return data;
  } catch (error) {
    console.error('💥 API CALL FAILED:', error);
    throw error;
  }
};

// Investment Club API calls
export const clubService = {
  // Get all clubs
  getClubs: async (token: string): Promise<{ clubs: Club[] }> => {
    return apiCall('/investment_clubs', token);
  },

  // Get user's clubs
  getMyClubs: async (token: string): Promise<{ clubs: Club[] }> => {
    return apiCall('/investment_clubs/my_clubs', token);
  },

  // Discover clubs (not joined)
  getDiscoverClubs: async (token: string): Promise<{ clubs: Club[] }> => {
    return apiCall('/investment_clubs/discover', token);
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
      console.error('Join club error:', error);

      // Check if it's already a membership status response
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

  // Leave club - FIXED: Use correct endpoint
  leaveClub: async (
    token: string,
    clubId: string,
  ): Promise<LeaveClubResponse> => {
    return apiCall(`/investment_clubs/${clubId}/leave`, token, {
      method: 'POST',
    });
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
      // If we get a 404, it means the user is not a member
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
  // Get club members
  getMembers: async (
    token: string,
    clubId: string,
  ): Promise<{ members: Member[] }> => {
    return apiCall(`/investment_clubs/${clubId}/memberships`, token);
  },

  // Get pending members
  getPendingMembers: async (
    token: string,
    clubId: string,
  ): Promise<{ pending_members: Member[] }> => {
    return apiCall(`/investment_clubs/${clubId}/memberships/pending`, token);
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

  // Approve member - FIXED: Return proper type
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

  // Reject member - FIXED: Return proper type with message
  rejectMember: async (
    token: string,
    clubId: string,
    membershipId: string,
  ): Promise<RejectMemberResponse> => {
    console.log('🔄 Rejecting member:', { clubId, membershipId });
    return apiCall(
      `/investment_clubs/${clubId}/memberships/${membershipId}/reject`,
      token,
      {
        method: 'POST',
      },
    );
  },

  // Leave club (via membership endpoint) - FIXED: Return proper type
  leaveClub: async (
    token: string,
    clubId: string,
    membershipId: string,
  ): Promise<LeaveClubResponse> => {
    console.log('🔄 Leaving club via membership:', { clubId, membershipId });
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
    console.log('🔄 Cancelling membership request:', { clubId, membershipId });
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
  // Get club contributions
  getContributions: async (
    token: string,
    clubId: string,
  ): Promise<{ contributions: ClubContribution[] }> => {
    return apiCall(`/investment_clubs/${clubId}/contributions`, token);
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
    return apiCall(`/investment_clubs/${clubId}/contributions`, token, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },
};

// Club Investments API calls
export const investmentService = {
  // Get club investments
  getInvestments: async (
    token: string,
    clubId: string,
  ): Promise<{ investments: ClubInvestment[] }> => {
    return apiCall(`/investment_clubs/${clubId}/investments`, token);
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
  getClubPortfolio: async (token: string, clubId: string): Promise<any> => {
    return apiCall(`/investment_clubs/${clubId}/portfolio`, token);
  },

  // Get club analytics
  getClubAnalytics: async (token: string, clubId: string): Promise<any> => {
    return apiCall(`/investment_clubs/${clubId}/analytics`, token);
  },

  // Get member portfolio
  getMemberPortfolio: async (token: string, clubId: string): Promise<any> => {
    return apiCall(`/investment_clubs/${clubId}/member_portfolio`, token);
  },
};