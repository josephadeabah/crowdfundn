import {
  Club,
  Member,
  Membership,
  ClubContribution,
  ClubInvestment,
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
  ContributionsResponse,
  VerifyContributionResponse,
  ClubInvestmentCreateRequest,
  ClubInvestmentCertificateStatus,
  ClubInvestmentExecutionResult,
  ClubInvestmentPortfolio,
  ApprovedCampaign,
  CancelInvestmentRequest,
  CancelInvestmentResponse,
  ComprehensiveAnalytics,
  PortfolioInsights,
  FinancialHealthMetrics,
  PredictiveAnalytics,
  ClubInvestmentCreateResponse,
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

  // NEW: Portfolio Insights
  getPortfolioInsights: async (
    token: string,
    clubId: string,
  ): Promise<{ success: boolean; insights: PortfolioInsights }> => {
    return apiCall(`/investment_clubs/${clubId}/portfolio_insights`, token);
  },

  // NEW: Financial Health
  getFinancialHealth: async (
    token: string,
    clubId: string,
  ): Promise<{
    success: boolean;
    financial_health: FinancialHealthMetrics;
  }> => {
    return apiCall(`/investment_clubs/${clubId}/financial_health`, token);
  },

  // NEW: Predictive Analytics
  getPredictiveAnalytics: async (
    token: string,
    clubId: string,
  ): Promise<{
    success: boolean;
    predictive_analytics: PredictiveAnalytics;
  }> => {
    return apiCall(`/investment_clubs/${clubId}/predictive_analytics`, token);
  },

  // NEW: Comprehensive Analytics
  getComprehensiveAnalytics: async (
    token: string,
    clubId: string,
  ): Promise<{ success: boolean; analytics: ComprehensiveAnalytics }> => {
    return apiCall(
      `/investment_clubs/${clubId}/comprehensive_analytics`,
      token,
    );
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
    perPage: number = 6,
  ): Promise<ContributionsResponse> => {
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

  // Verify contribution payment
  verifyContribution: async (
    token: string,
    clubId: string,
    reference: string,
  ): Promise<VerifyContributionResponse> => {
    const endpoint = `/investment_clubs/${clubId}/contributions/verify`;
    return apiCall(endpoint, token, {
      method: 'POST',
      body: JSON.stringify({ reference }),
    });
  },
};

// UPDATED: Club Investments API calls - Enhanced with validation error handling
export const investmentService = {
  // Get club investments with pagination
  getInvestments: async (
    token: string,
    clubId: string,
    status?: string,
    page: number = 1,
    perPage: number = 5,
  ): Promise<{
    success: boolean;
    investments: ClubInvestment[];
    pagination?: PaginationData;
  }> => {
    const endpoint = `/investment_clubs/${clubId}/investments${status ? `?status=${status}` : ''}${status ? '&' : '?'}page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Get specific investment
  getInvestment: async (
    token: string,
    clubId: string,
    investmentId: string,
  ): Promise<{ success: boolean; investment: ClubInvestment }> => {
    return apiCall(
      `/investment_clubs/${clubId}/investments/${investmentId}`,
      token,
    );
  },

  // UPDATED: Create equity investment with enhanced error handling
  createInvestment: async (
    token: string,
    clubId: string,
    investmentData: ClubInvestmentCreateRequest,
  ): Promise<ClubInvestmentCreateResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/investment_clubs/${clubId}/investments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(investmentData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // Return structured error response
        return {
          success: false,
          message: data.error || 'Failed to create investment',
          validationErrors: data.validationErrors,
          code: data.code,
          error: data.error,
        };
      }

      return {
        success: true,
        club_investment: data.club_investment,
        authorization_url: data.authorization_url,
        message: data.message,
      };
    } catch (error: any) {
      console.error('Investment creation error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create investment',
        error: error.message,
      };
    }
  },

  // NEW: Cancel investment endpoint
  cancelInvestment: async (
    token: string,
    clubId: string,
    investmentId: string,
    cancelData: CancelInvestmentRequest,
  ): Promise<CancelInvestmentResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/investment_clubs/${clubId}/investments/${investmentId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cancelData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to cancel investment',
          validationErrors: data.validationErrors,
          code: data.code,
          message: data.error,
        };
      }

      return {
        success: true,
        message: data.message,
        investment: data.investment,
      };
    } catch (error: any) {
      console.error('Investment cancellation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel investment',
        message: error.message,
      };
    }
  },

  // Certificate operations - CORRECT ENDPOINTS
  getCertificateStatus: async (
    token: string,
    clubId: string,
    investmentId: string,
  ): Promise<ClubInvestmentCertificateStatus> => {
    return apiCall(
      `/investment_clubs/${clubId}/investments/${investmentId}/certificate_status`,
      token,
    );
  },

  generateCertificate: async (
    token: string,
    clubId: string,
    investmentId: string,
  ): Promise<{
    success: boolean;
    message: string;
    certificate_url?: string;
  }> => {
    return apiCall(
      `/investment_clubs/${clubId}/investments/${investmentId}/generate_certificate`,
      token,
      {
        method: 'POST',
      },
    );
  },

  downloadCertificate: async (
    token: string,
    clubId: string,
    investmentId: string,
  ): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/investment_clubs/${clubId}/investments/${investmentId}/download_certificate`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to download certificate: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `club_investment_certificate_${investmentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// Portfolio API calls
export const portfolioService = {
  // Get club portfolio
  getClubPortfolio: async (
    token: string,
    clubId: string,
  ): Promise<ClubInvestmentPortfolio> => {
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

// Approved Campaigns API calls - Updated to match the same pattern
export const approvedCampaignsService = {
  // Get approved campaigns for a club
  getApprovedCampaigns: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<{
    success: boolean;
    approved_campaigns: ApprovedCampaign[];
    pagination?: PaginationData;
  }> => {
    const endpoint = `/investment_clubs/${clubId}/approved_campaigns?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Get specific approved campaign
  getApprovedCampaign: async (
    token: string,
    clubId: string,
    campaignId: string,
  ): Promise<{ success: boolean; approved_campaign: ApprovedCampaign }> => {
    return apiCall(
      `/investment_clubs/${clubId}/approved_campaigns/${campaignId}`,
      token,
    );
  },

  // Alias for fetchApprovedCampaigns to maintain backward compatibility
  fetchApprovedCampaigns: async (
    token: string,
    clubId: string,
  ): Promise<ApprovedCampaign[]> => {
    const response = await apiCall(
      `/investment_clubs/${clubId}/approved_campaigns`,
      token,
    );
    return response.success && Array.isArray(response.approved_campaigns)
      ? response.approved_campaigns
      : [];
  },

  // Delete approved campaign
  deleteApprovedCampaign: async (
    token: string,
    clubId: string,
    campaignId: string,
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/investment_clubs/${clubId}/approved_campaigns/${campaignId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error deleting approved campaign:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete approved campaign',
      };
    }
  },
};

// Export the main investmentClubService that includes all analytics methods
export const investmentClubService = {
  // Portfolio Insights
  getPortfolioInsights: async (
    token: string,
    clubId: string, // Now using club ID instead of slug
  ): Promise<PortfolioInsights> => {
    const response = await apiCall(
      `/investment_clubs/${clubId}/portfolio_insights`,
      token,
    );
    return response.insights;
  },

  // Financial Health
  getFinancialHealth: async (
    token: string,
    clubId: string, // Now using club ID instead of slug
  ): Promise<FinancialHealthMetrics> => {
    const response = await apiCall(
      `/investment_clubs/${clubId}/financial_health`,
      token,
    );
    return response.financial_health;
  },

  // Predictive Analytics
  getPredictiveAnalytics: async (
    token: string,
    clubId: string, // Now using club ID instead of slug
  ): Promise<PredictiveAnalytics> => {
    const response = await apiCall(
      `/investment_clubs/${clubId}/predictive_analytics`,
      token,
    );
    return response.predictive_analytics;
  },

  // Comprehensive Analytics - FIXED: Now uses club ID
  getComprehensiveAnalytics: async (
    token: string,
    clubId: string, // Now using club ID instead of slug
  ): Promise<ComprehensiveAnalytics> => {
    const response = await apiCall(
      `/investment_clubs/${clubId}/comprehensive_analytics`,
      token,
    );
    return response.analytics;
  },

  // Get club by ID (for when you need to convert slug to ID)
  getClub: async (token: string, clubId: string): Promise<any> => {
    return apiCall(`/investment_clubs/${clubId}`, token);
  },
};

export { shareChangeService } from './services/shareChangeService';
