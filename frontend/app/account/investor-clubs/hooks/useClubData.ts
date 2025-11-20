import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  Club,
  Member,
  ClubInvestment,
  ClubContribution,
  PaginationData,
  ClubInvestmentPortfolio,
  ApprovedCampaign,
} from '../clubTypes';
import {
  clubService,
  investmentService,
  membershipService,
  portfolioService,
  contributionService,
  approvedCampaignsService,
} from '../clubservice';

interface ContributionsState {
  data: ClubContribution[];
  pagination: PaginationData;
  loading: boolean;
}

interface InvestmentsState {
  data: ClubInvestment[];
  pagination: PaginationData;
  loading: boolean;
}

interface DashboardState {
  clubs: Club[];
  selectedClub: Club | null;
  members: Member[];
  investments: ClubInvestment[];
  portfolio: ClubInvestmentPortfolio | null;
  loading: boolean;
  mobileMenuOpen: boolean;
}

export const useClubData = () => {
  const { user, token } = useAuth();
  const [state, setState] = useState<DashboardState>({
    clubs: [],
    selectedClub: null,
    members: [],
    investments: [],
    portfolio: null,
    loading: true,
    mobileMenuOpen: false,
  });

  const [contributions, setContributions] = useState<ContributionsState>({
    data: [],
    pagination: {
      current_page: 1,
      total_pages: 0,
      total_count: 0,
      per_page: 5,
    },
    loading: false,
  });

  const [investments, setInvestments] = useState<InvestmentsState>({
    data: [],
    pagination: {
      current_page: 1,
      total_pages: 0,
      total_count: 0,
      per_page: 5,
    },
    loading: false,
  });

  const [approvedCampaigns, setApprovedCampaigns] = useState<
    ApprovedCampaign[]
  >([]);
  const [approvedCampaignsLoading, setApprovedCampaignsLoading] =
    useState(false);

  const loadUserClubs = async () => {
    if (!token || !user) return;

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await clubService.getMyClubs(token);
      setState((prev) => ({ ...prev, clubs: response.clubs }));

      if (response.clubs.length > 0) {
        await loadClubDetails(response.clubs[0]);
      }
    } catch (error) {
      console.error('Failed to load clubs:', error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Function to load investments specifically with pagination
  const loadInvestments = async (
    clubSlug: string,
    status?: string,
    page: number = 1,
    perPage: number = 5,
  ) => {
    if (!token) return;

    try {
      console.log('🔄 Loading investments for club:', clubSlug, 'page:', page);
      setInvestments((prev) => ({ ...prev, loading: true }));

      const response = await investmentService.getInvestments(
        token,
        clubSlug,
        status,
        page,
        perPage,
      );

      if (response.success) {
        setInvestments({
          data: response.investments || [],
          pagination: response.pagination || {
            current_page: page,
            total_pages: 1,
            total_count: response.investments?.length || 0,
            per_page: perPage,
          },
          loading: false,
        });

        // Also update the state for backward compatibility
        setState((prev) => ({
          ...prev,
          investments: response.investments || [],
        }));
      } else {
        console.error('Failed to load investments:', response);
        setInvestments((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Failed to load investments:', error);
      setInvestments((prev) => ({ ...prev, loading: false }));
    }
  };

  // Function to handle investment page change
  const handleInvestmentPageChange = (page: number) => {
    if (state.selectedClub) {
      loadInvestments(
        state.selectedClub.slug,
        undefined,
        page,
        investments.pagination.per_page,
      );
    }
  };

  // Function to handle investment per page change
  const handleInvestmentPerPageChange = (perPage: number) => {
    if (state.selectedClub) {
      loadInvestments(state.selectedClub.slug, undefined, 1, perPage);
    }
  };

  // Function to load portfolio specifically
  const loadPortfolio = async (clubSlug: string) => {
    if (!token) return;

    try {
      console.log('🔄 Loading portfolio for club:', clubSlug);
      const portfolioResponse = await portfolioService.getClubPortfolio(
        token,
        clubSlug,
      );

      // Set portfolio directly from API response
      setState((prev) => ({
        ...prev,
        portfolio: portfolioResponse,
      }));
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      // Set empty portfolio on error
      setState((prev) => ({
        ...prev,
        portfolio: {
          total_invested: 0,
          total_value: 0,
          total_return: 0,
          return_percentage: 0,
          active_investments: 0,
          investments: [],
          campaigns_invested: 0,
          successful_count: 0,
        },
      }));
    }
  };

  const loadContributions = async (
    clubSlug: string,
    page: number = 1,
    perPage: number = 5,
  ) => {
    if (!token) return;

    try {
      console.log('🔄 Loading contributions for:', clubSlug, 'page:', page);
      setContributions((prev) => ({ ...prev, loading: true }));
      const response = await contributionService.getContributions(
        token,
        clubSlug,
        page,
        perPage,
      );
      setContributions({
        data: response.contributions,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to load contributions:', error);
      setContributions((prev) => ({ ...prev, loading: false }));
    }
  };

  // Add function to load approved campaigns
  const loadApprovedCampaigns = async (clubSlug: string) => {
    if (!token) return;

    try {
      setApprovedCampaignsLoading(true);
      const campaigns = await approvedCampaignsService.fetchApprovedCampaigns(
        token,
        clubSlug,
      );
      setApprovedCampaigns(campaigns);
    } catch (error) {
      console.error('Error loading approved campaigns:', error);
      setApprovedCampaigns([]);
    } finally {
      setApprovedCampaignsLoading(false);
    }
  };

  // Add refresh function for approved campaigns
  const refreshApprovedCampaigns = async () => {
    if (state.selectedClub) {
      await loadApprovedCampaigns(state.selectedClub.slug);
    }
  };

  // Enhanced loadClubDetails that properly refreshes ALL data including approved campaigns
  const loadClubDetails = async (club: Club) => {
    if (!token) return;

    try {
      console.log('🔄 Loading club details for:', club.slug);
      setState((prev) => ({ ...prev, selectedClub: club }));

      // Load ALL data in parallel to ensure consistency
      const [
        membersResponse,
        investmentsResponse,
        portfolioResponse,
        clubDetailsResponse,
      ] = await Promise.all([
        membershipService.getMembers(token, club.slug),
        investmentService.getInvestments(token, club.slug, undefined, 1, 10), // Load first page by default
        portfolioService.getClubPortfolio(token, club.slug),
        clubService.getClub(token, club.slug),
      ]);

      // Load contributions with pagination and approved campaigns
      await Promise.all([
        loadContributions(club.slug),
        loadApprovedCampaigns(club.slug), // Load approved campaigns
      ]);

      setState((prev) => ({
        ...prev,
        selectedClub: clubDetailsResponse.club,
        members: membersResponse.members,
        investments: investmentsResponse.investments || [],
        portfolio: portfolioResponse,
      }));

      // Update investments state with pagination
      setInvestments({
        data: investmentsResponse.investments || [],
        pagination: investmentsResponse.pagination || {
          current_page: 1,
          total_pages: 1,
          total_count: investmentsResponse.investments?.length || 0,
          per_page: 5,
        },
        loading: false,
      });

      // Debug: Log membership data to verify updates
      const myMember = membersResponse.members.find(
        (m) => m.user.id === String(user?.id),
      );
      if (myMember) {
        console.log('📊 Current Membership Data After Reload:', {
          total_contributed: myMember.total_contributed,
          contributed_share: myMember.contributed_share,
          memberId: myMember.id,
        });
      }
    } catch (error) {
      console.error('Failed to load club details:', error);
    }
  };

  // Function to specifically reload membership data
  const reloadMembershipData = async (clubSlug: string) => {
    if (!token) return;

    try {
      console.log('🔄 Specifically reloading membership data');
      const [membersResponse, clubDetailsResponse] = await Promise.all([
        membershipService.getMembers(token, clubSlug),
        clubService.getClub(token, clubSlug),
      ]);

      setState((prev) => ({
        ...prev,
        selectedClub: clubDetailsResponse.club,
        members: membersResponse.members,
      }));

      return membersResponse.members;
    } catch (error) {
      console.error('Failed to reload membership data:', error);
      return null;
    }
  };

  const setMobileMenuOpen = (open: boolean) => {
    setState((prev) => ({ ...prev, mobileMenuOpen: open }));
  };

  const handleContributionPageChange = (page: number) => {
    if (state.selectedClub) {
      loadContributions(
        state.selectedClub.slug,
        page,
        contributions.pagination.per_page,
      );
    }
  };

  const handleContributionPerPageChange = (perPage: number) => {
    if (state.selectedClub) {
      loadContributions(state.selectedClub.slug, 1, perPage);
    }
  };

  useEffect(() => {
    if (token) {
      loadUserClubs();
    }
  }, [token]);

  return {
    ...state,
    contributions: contributions.data,
    contributionsPagination: contributions.pagination,
    contributionsLoading: contributions.loading,
    investments: investments.data, // Return paginated investments
    investmentsPagination: investments.pagination,
    investmentsLoading: investments.loading,
    approvedCampaigns,
    approvedCampaignsLoading,
    token,
    loadUserClubs,
    loadClubDetails,
    loadInvestments, // Export the new function
    loadPortfolio, // Export the new function
    loadApprovedCampaigns, // Export the new function
    refreshApprovedCampaigns, // Export the refresh function
    reloadMembershipData,
    setMobileMenuOpen,
    loadContributions,
    handleContributionPageChange,
    handleContributionPerPageChange,
    handleInvestmentPageChange, // Export investment pagination handlers
    handleInvestmentPerPageChange,
  };
};
