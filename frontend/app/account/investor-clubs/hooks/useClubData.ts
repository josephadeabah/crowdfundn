// app/account/investor-clubs/hooks/useClubData.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  Club,
  Member,
  ClubInvestment,
  ClubContribution,
  PaginationData,
} from '../clubTypes';
import {
  clubService,
  investmentService,
  membershipService,
  portfolioService,
  contributionService,
} from '../clubservice';

interface ContributionsState {
  data: ClubContribution[];
  pagination: PaginationData;
  loading: boolean;
}

interface DashboardState {
  clubs: Club[];
  selectedClub: Club | null;
  members: Member[];
  investments: ClubInvestment[];
  portfolio: any;
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
      per_page: 10,
    },
    loading: false,
  });

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

  const loadContributions = async (
    clubSlug: string,
    page: number = 1,
    perPage: number = 10,
  ) => {
    if (!token) return;

    try {
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

  const loadClubDetails = async (club: Club) => {
    if (!token) return;

    try {
      setState((prev) => ({ ...prev, selectedClub: club }));

      // Load members, investments, and portfolio
      const [membersResponse, investmentsResponse, portfolioResponse] =
        await Promise.all([
          membershipService.getMembers(token, club.slug),
          investmentService.getInvestments(token, club.slug),
          portfolioService.getClubPortfolio(token, club.slug),
        ]);

      // Load contributions with pagination
      await loadContributions(club.slug);

      setState((prev) => ({
        ...prev,
        members: membersResponse.members,
        investments: investmentsResponse.investments,
        portfolio: portfolioResponse,
      }));
    } catch (error) {
      console.error('Failed to load club details:', error);
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
    token,
    loadUserClubs,
    loadClubDetails,
    setMobileMenuOpen,
    loadContributions,
    handleContributionPageChange,
    handleContributionPerPageChange,
  };
};
