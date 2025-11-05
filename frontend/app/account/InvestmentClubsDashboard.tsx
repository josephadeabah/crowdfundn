// app/account/InvestmentClubsDashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClubDetailsModal from './investor-clubs/ClubDetailsModal';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  clubService,
  investmentService,
  membershipService,
  portfolioService,
} from './investor-clubs/clubservice';
import { Club, Member, ClubInvestment } from './investor-clubs/clubTypes';

const InvestmentClubsDashboard: React.FC = () => {
  const { user, token } = useAuth(); // Get token from useAuth
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [investments, setInvestments] = useState<ClubInvestment[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUserClubs();
    }
  }, [token]);

  const loadUserClubs = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await clubService.getClubs(token);
      // Filter clubs where user is a member
      const userClubs = response.clubs.filter((club) => club.is_member);
      setClubs(userClubs);

      if (userClubs.length > 0) {
        await loadClubDetails(userClubs[0]);
      }
    } catch (error) {
      console.error('Failed to load clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClubDetails = async (club: Club) => {
    if (!token) return;

    try {
      setSelectedClub(club);

      // Load members
      const membersResponse = await membershipService.getMembers(
        token,
        club.slug,
      );
      setMembers(membersResponse.members);

      // Load investments
      const investmentsResponse = await investmentService.getInvestments(
        token,
        club.slug,
      );
      setInvestments(investmentsResponse.investments);

      // Load portfolio
      const portfolioResponse = await portfolioService.getClubPortfolio(
        token,
        club.slug,
      );
      setPortfolio(portfolioResponse);
    } catch (error) {
      console.error('Failed to load club details:', error);
    }
  };

  const handleVote = async (investmentId: string, voteType: string) => {
    if (!selectedClub || !token) return;

    try {
      await investmentService.voteOnInvestment(
        token,
        selectedClub.slug,
        investmentId,
        voteType,
      );
      // Reload investments to get updated voting status
      const investmentsResponse = await investmentService.getInvestments(
        token,
        selectedClub.slug,
      );
      setInvestments(investmentsResponse.investments);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg border border-gray-200 p-12">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Investment Clubs Yet
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Join an investment club to start collaborating with other
                investors and make collective investment decisions.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => (window.location.hash = 'See Clubs')}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Discover Clubs
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                  Create Club
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentClub = selectedClub || clubs[0];
  const activeVotes = investments.filter((inv) => inv.status === 'voting');

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Investment Clubs</h1>
              <p className="text-gray-600 mt-2">
                Manage your club investments and collaborate with members
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                value={currentClub.slug}
                onChange={(e) => {
                  const club = clubs.find((c) => c.slug === e.target.value);
                  if (club) loadClubDetails(club);
                }}
              >
                {clubs.map((club) => (
                  <option key={club.slug} value={club.slug}>
                    {club.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
              >
                Club Details
              </button>
            </div>
          </div>

          {/* Rest of your component remains the same */}
          {/* ... */}
        </div>
      </main>

      {/* Club Details Modal */}
      {currentClub && (
        <ClubDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          club={currentClub}
          members={members}
        />
      )}
    </div>
  );
};

export default InvestmentClubsDashboard;
