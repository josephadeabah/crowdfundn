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
      per_page: 6,
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
    perPage: number = 6,
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

  // CRITICAL FIX: Enhanced loadClubDetails that properly refreshes ALL data
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
        clubDetailsResponse, // Add this to get fresh club financials
      ] = await Promise.all([
        membershipService.getMembers(token, club.slug),
        investmentService.getInvestments(token, club.slug),
        portfolioService.getClubPortfolio(token, club.slug),
        clubService.getClub(token, club.slug), // Get fresh club data with updated financials
      ]);

      // Load contributions with pagination
      await loadContributions(club.slug);

      setState((prev) => ({
        ...prev,
        selectedClub: clubDetailsResponse.club, // Use the fresh club data
        members: membersResponse.members,
        investments: investmentsResponse.investments,
        portfolio: portfolioResponse,
      }));

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

  // NEW: Function to specifically reload membership data
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
    token,
    loadUserClubs,
    loadClubDetails,
    reloadMembershipData, // Export the new function
    setMobileMenuOpen,
    loadContributions,
    handleContributionPageChange,
    handleContributionPerPageChange,
  };
};
