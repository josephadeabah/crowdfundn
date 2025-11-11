// app/account/investor-clubs/hooks/useClubData.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Club, Member, ClubInvestment, ClubContribution } from '../clubTypes';
import {
  clubService,
  investmentService,
  membershipService,
  portfolioService,
  contributionService, // Add this import
} from '../clubservice';
import { DashboardState } from '../types/dashboardTypes';

export const useClubData = () => {
  const { user, token } = useAuth();
  const [state, setState] = useState<DashboardState>({
    clubs: [],
    selectedClub: null,
    members: [],
    investments: [],
    contributions: [], // Add contributions
    portfolio: null,
    loading: true,
    mobileMenuOpen: false,
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

  const loadClubDetails = async (club: Club) => {
    if (!token) return;

    try {
      setState((prev) => ({ ...prev, selectedClub: club }));

      // Load members
      const membersResponse = await membershipService.getMembers(
        token,
        club.slug,
      );

      // Load investments
      const investmentsResponse = await investmentService.getInvestments(
        token,
        club.slug,
      );

      // Load contributions
      const contributionsResponse = await contributionService.getContributions(
        token,
        club.slug,
      );

      // Load portfolio
      const portfolioResponse = await portfolioService.getClubPortfolio(
        token,
        club.slug,
      );

      setState((prev) => ({
        ...prev,
        members: membersResponse.members,
        investments: investmentsResponse.investments,
        contributions: contributionsResponse.contributions, // Add contributions
        portfolio: portfolioResponse,
      }));
    } catch (error) {
      console.error('Failed to load club details:', error);
    }
  };

  const setMobileMenuOpen = (open: boolean) => {
    setState((prev) => ({ ...prev, mobileMenuOpen: open }));
  };

  useEffect(() => {
    if (token) {
      loadUserClubs();
    }
  }, [token]);

  return {
    ...state,
    token,
    loadUserClubs,
    loadClubDetails,
    setMobileMenuOpen,
  };
};
