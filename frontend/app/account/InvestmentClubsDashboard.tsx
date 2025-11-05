// app/account/InvestmentClubsDashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClubDetailsModal from './investor-clubs/ClubDetailsModal';
import CreateClubModal from './investor-clubs/CreateClubModal';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  clubService,
  investmentService,
  membershipService,
  portfolioService,
} from './investor-clubs/clubservice';
import { Club, Member, ClubInvestment } from './investor-clubs/clubTypes';

const InvestmentClubsDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [investments, setInvestments] = useState<ClubInvestment[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUserClubs();
    }
  }, [token]);

  const loadUserClubs = async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      const response = await clubService.getClubs(token);
      
      // Filter clubs where user is a member OR is the creator
      const userClubs = response.clubs.filter((club) => 
        club.is_member || club.creator.id === user.id
      );
      
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

  const handleClubCreated = () => {
    loadUserClubs(); // Reload the clubs list
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleMakeContribution = () => {
    // This would open a contribution modal or navigate to contributions page
    alert('Make Contribution feature would open here');
  };

  const handleProposeInvestment = () => {
    // This would open an investment proposal modal
    alert('Propose Investment feature would open here');
  };

  const handleViewAnalytics = () => {
    // This would navigate to analytics page
    alert('View Analytics feature would open here');
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
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Create Club
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Create Club Modal */}
        <CreateClubModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onClubCreated={handleClubCreated}
        />
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Club Info and Members */}
            <div className="lg:col-span-2 space-y-6">
              {/* Club Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl">
                      {currentClub.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {currentClub.name}
                      </h2>
                      <p className="text-gray-600 mt-1">{currentClub.mission}</p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-500">
                        <span>{currentClub.current_members_count} members</span>
                        <span>•</span>
                        <span>Min. contribution: {formatCurrency(currentClub.minimum_monthly_contribution)}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full ${
                          currentClub.club_type === 'public' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {currentClub.club_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-700">
                      {formatCurrency(currentClub.financials.current_balance)}
                    </div>
                    <div className="text-sm text-gray-500">Club Balance</div>
                  </div>
                </div>
              </motion.div>

              {/* Active Votes */}
              {activeVotes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-xl font-semibold mb-4">Active Votes</h3>
                  <div className="space-y-4">
                    {activeVotes.map((investment) => (
                      <div
                        key={investment.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                      >
                        <h4 className="text-lg font-semibold mb-2">
                          {investment.campaign.title}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          Investment: {formatCurrency(investment.investment_amount)}
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleVote(investment.id, 'invest')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                          >
                            Vote Yes
                          </button>
                          <button
                            onClick={() => handleVote(investment.id, 'pass')}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                          >
                            Vote No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Recent Investments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4">Recent Investments</h3>
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm divide-y">
                  {investments.slice(0, 5).map((investment) => (
                    <div key={investment.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{investment.campaign.title}</h4>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(investment.investment_amount)} • 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              investment.status === 'executed' ? 'bg-green-100 text-green-800' :
                              investment.status === 'voting' ? 'bg-yellow-100 text-yellow-800' :
                              investment.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {investment.status}
                            </span>
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(investment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Stats and Quick Actions */}
            <div className="space-y-6">
              {/* Portfolio Summary */}
              {portfolio && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-4">Portfolio Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Invested</span>
                      <span className="font-semibold">
                        {formatCurrency(portfolio.total_invested)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Value</span>
                      <span className="font-semibold">
                        {formatCurrency(portfolio.current_value)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Returns</span>
                      <span className={`font-semibold ${
                        portfolio.total_returns >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(portfolio.total_returns)} ({portfolio.return_percentage}%)
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={handleMakeContribution}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-left"
                  >
                    Make Contribution
                  </button>
                  <button 
                    onClick={handleProposeInvestment}
                    className="w-full px-4 py-3 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium text-left"
                  >
                    Propose Investment
                  </button>
                  <button 
                    onClick={handleViewAnalytics}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-left"
                  >
                    View Analytics
                  </button>
                </div>
              </motion.div>

              {/* Club Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-4">Club Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {currentClub.current_members_count}
                    </div>
                    <div className="text-sm text-gray-600">Members</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {investments.length}
                    </div>
                    <div className="text-sm text-gray-600">Investments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {formatCurrency(currentClub.financials.total_contributions)}
                    </div>
                    <div className="text-sm text-gray-600">Total Raised</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {formatCurrency(currentClub.financials.total_invested)}
                    </div>
                    <div className="text-sm text-gray-600">Total Invested</div>
                  </div>
                </div>
              </motion.div>

              {/* Create New Club Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-6 shadow-sm text-white"
              >
                <h3 className="text-lg font-semibold mb-2">Start a New Club</h3>
                <p className="text-emerald-100 text-sm mb-4">
                  Create your own investment club and invite others to join
                </p>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium transition-colors"
                >
                  Create New Club
                </button>
              </motion.div>
            </div>
          </div>
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

      {/* Create Club Modal */}
      <CreateClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onClubCreated={handleClubCreated}
      />
    </div>
  );
};

export default InvestmentClubsDashboard;