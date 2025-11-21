// app/account/investor-clubs/hooks/useClubData.ts
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
  PortfolioApiResponse,
  PortfolioInvestment,
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

// Helper function to safely convert string numbers to numbers
const safeNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Enhanced transformation function for investment data - FIXED to preserve cancellation properties
const transformInvestmentData = (investment: any): ClubInvestment => {
  // Handle amount conversion - parse "50.0K" to 50000, etc.
  const parseFormattedAmount = (amount: string): number => {
    if (!amount) return 0;

    // Remove any non-numeric characters except decimal and K/M
    const cleanAmount = amount.toString().replace(/[^\d.KM]/g, '');

    if (cleanAmount.includes('K')) {
      return parseFloat(cleanAmount.replace('K', '')) * 1000;
    } else if (cleanAmount.includes('M')) {
      return parseFloat(cleanAmount.replace('M', '')) * 1000000;
    } else {
      return parseFloat(cleanAmount) || 0;
    }
  };

  // Use proposed_amount as investment_amount if available, otherwise parse the formatted amount
  const investmentAmount = investment.proposed_amount
    ? safeNumber(investment.proposed_amount)
    : parseFormattedAmount(investment.amount);

  const currentValue = safeNumber(investment.current_value) || investmentAmount;

  // Create the transformed investment with ALL properties from the API
  const transformedInvestment: ClubInvestment = {
    id: investment.id.toString(),
    investment_amount: investmentAmount,
    shares: investment.shares ? safeNumber(investment.shares) : undefined,
    percentage: investment.percentage
      ? safeNumber(investment.percentage)
      : undefined,
    status: investment.status as any,
    investment_date: investment.investment_date || undefined,
    current_value: currentValue,
    total_returns: safeNumber(investment.total_returns),
    roi: safeNumber(investment.roi),
    currency: investment.currency || 'USD',
    currency_symbol: investment.currency_symbol || '$',
    campaign: {
      id: investment.campaign_id?.toString() || investment.id.toString(),
      title:
        investment.company ||
        investment.campaign?.title ||
        'Unknown Investment',
      company_name:
        investment.company ||
        investment.campaign?.company_name ||
        'Unknown Company',
      valuation: safeNumber(investment.valuation) || investmentAmount,
      equity_offered: 0,
      currency: investment.currency || 'USD',
      currency_symbol: investment.currency_symbol || '$',
      category: investment.sector || investment.campaign?.category,
    },
    created_at:
      investment.investment_date ||
      investment.created_at ||
      new Date().toISOString(),
    updated_at:
      investment.investment_date ||
      investment.updated_at ||
      new Date().toISOString(),
    is_equity_investment:
      investment.is_equity_investment !== undefined
        ? investment.is_equity_investment
        : true,
    certificate_url: investment.certificate_url,
    certificate_number: investment.certificate_number,

    // PRESERVE ALL API PROPERTIES
    company: investment.company,
    description: investment.description,
    amount: investment.amount,
    sector: investment.sector,
    club_investment_id: investment.club_investment_id,
    campaign_id: investment.campaign_id,
    campaign_slug: investment.campaign_slug,
    proposed_amount: investment.proposed_amount,

    // CRITICAL: Preserve cancellation properties
    can_be_cancelled: investment.can_be_cancelled,
    cancel_window_expires_at: investment.cancel_window_expires_at,
    committed_at: investment.committed_at,
    time_remaining_for_cancellation: investment.time_remaining_for_cancellation,
    cancellation_reason: investment.cancellation_reason,
    cancelled_at: investment.cancelled_at,
  };

  // Debug log for cancellable investments
  if (investment.can_be_cancelled) {
    console.log('🔄 TRANSFORMED CANCELLABLE INVESTMENT:', {
      id: transformedInvestment.id,
      status: transformedInvestment.status,
      can_be_cancelled: transformedInvestment.can_be_cancelled,
      time_remaining: transformedInvestment.time_remaining_for_cancellation,
    });
  }

  return transformedInvestment;
};

// Helper to transform portfolio investments to match ClubInvestment type
const transformPortfolioInvestment = (
  investment: PortfolioInvestment,
): ClubInvestment => {
  return {
    id: investment.id.toString(),
    investment_amount: safeNumber(investment.investment_amount),
    shares: investment.shares ? safeNumber(investment.shares) : undefined,
    percentage: investment.percentage
      ? safeNumber(investment.percentage)
      : undefined,
    status: investment.status as any,
    investment_date: investment.investment_date || undefined,
    current_value: safeNumber(investment.current_value),
    roi: safeNumber(investment.roi),
    currency: investment.campaign.currency || 'USD',
    currency_symbol: investment.campaign.currency_symbol || '$',
    campaign: {
      id: investment.campaign.id.toString(),
      title: investment.campaign.title,
      company_name: investment.campaign.company_name,
      valuation: safeNumber(investment.campaign.valuation),
      equity_offered: 0, // Not provided in portfolio API
      currency: investment.campaign.currency || 'USD',
      currency_symbol: investment.campaign.currency_symbol || '$',
      category: investment.campaign.category,
    },
    created_at: investment.investment_date || new Date().toISOString(),
    updated_at: investment.investment_date || new Date().toISOString(),
    is_equity_investment: true, // Assume true for portfolio investments
  };
};

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

  // Default empty portfolio
  const defaultPortfolio: ClubInvestmentPortfolio = {
    total_invested: 0,
    total_value: 0,
    total_return: 0,
    return_percentage: 0,
    active_investments: 0,
    investments: [],
    campaigns_invested: 0,
    successful_count: 0,
  };

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
        // Transform the API response to match ClubInvestment type
        const transformedInvestments = (response.investments || []).map(
          transformInvestmentData,
        );

        console.log('🔄 TRANSFORMED INVESTMENTS WITH CANCELLATION DATA:');
        transformedInvestments.forEach((inv) => {
          if (inv.can_be_cancelled) {
            console.log('✅ CANCELLABLE:', {
              id: inv.id,
              status: inv.status,
              can_be_cancelled: inv.can_be_cancelled,
              time_remaining: inv.time_remaining_for_cancellation,
            });
          }
        });

        setInvestments({
          data: transformedInvestments,
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
          investments: transformedInvestments,
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
      const response = (await portfolioService.getClubPortfolio(
        token,
        clubSlug,
      )) as unknown as PortfolioApiResponse;

      // Set portfolio directly from API response with proper type conversion
      if (response.success && response.portfolio) {
        const portfolioData: ClubInvestmentPortfolio = {
          total_invested: safeNumber(response.portfolio.total_invested),
          total_value: safeNumber(response.portfolio.total_value),
          total_return: safeNumber(response.portfolio.total_return),
          return_percentage: safeNumber(response.portfolio.return_percentage),
          active_investments: response.portfolio.active_investments || 0,
          investments: response.portfolio.investments || [],
          campaigns_invested: response.portfolio.campaigns_invested || 0,
          successful_count: response.portfolio.successful_count || 0,
        };

        setState((prev) => ({
          ...prev,
          portfolio: portfolioData,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          portfolio: defaultPortfolio,
        }));
      }
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      setState((prev) => ({
        ...prev,
        portfolio: defaultPortfolio,
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
        investmentService.getInvestments(token, club.slug, undefined, 1, 10),
        portfolioService.getClubPortfolio(
          token,
          club.slug,
        ) as unknown as Promise<PortfolioApiResponse>,
        clubService.getClub(token, club.slug),
      ]);

      // Load contributions with pagination and approved campaigns
      await Promise.all([
        loadContributions(club.slug),
        loadApprovedCampaigns(club.slug),
      ]);

      // Process investments data with transformation
      const transformedInvestments = (
        investmentsResponse.investments || []
      ).map(transformInvestmentData);

      // Process portfolio data
      const portfolioData: ClubInvestmentPortfolio =
        portfolioResponse.success && portfolioResponse.portfolio
          ? {
              total_invested: safeNumber(
                portfolioResponse.portfolio.total_invested,
              ),
              total_value: safeNumber(portfolioResponse.portfolio.total_value),
              total_return: safeNumber(
                portfolioResponse.portfolio.total_return,
              ),
              return_percentage: safeNumber(
                portfolioResponse.portfolio.return_percentage,
              ),
              active_investments:
                portfolioResponse.portfolio.active_investments || 0,
              investments: portfolioResponse.portfolio.investments || [],
              campaigns_invested:
                portfolioResponse.portfolio.campaigns_invested || 0,
              successful_count:
                portfolioResponse.portfolio.successful_count || 0,
            }
          : defaultPortfolio;

      setState((prev) => ({
        ...prev,
        selectedClub: clubDetailsResponse.club,
        members: membersResponse.members,
        investments: transformedInvestments,
        portfolio: portfolioData,
      }));

      // Update investments state with pagination
      setInvestments({
        data: transformedInvestments,
        pagination: investmentsResponse.pagination || {
          current_page: 1,
          total_pages: 1,
          total_count: investmentsResponse.investments?.length || 0,
          per_page: 5,
        },
        loading: false,
      });
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
    investments: investments.data,
    investmentsPagination: investments.pagination,
    investmentsLoading: investments.loading,
    approvedCampaigns,
    approvedCampaignsLoading,
    token,
    loadUserClubs,
    loadClubDetails,
    loadInvestments,
    loadPortfolio,
    loadApprovedCampaigns,
    refreshApprovedCampaigns,
    reloadMembershipData,
    setMobileMenuOpen,
    loadContributions,
    handleContributionPageChange,
    handleContributionPerPageChange,
    handleInvestmentPageChange,
    handleInvestmentPerPageChange,
  };
};
