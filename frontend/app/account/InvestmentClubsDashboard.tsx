// app/account/InvestmentClubsDashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClubDetailsModal from './investor-clubs/ClubDetailsModal';
import CreateClubModal from './investor-clubs/CreateClubModal';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  clubService,
  investmentService,
  membershipService,
  portfolioService,
} from './investor-clubs/clubservice';
import { Club, Member, ClubInvestment } from './investor-clubs/clubTypes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Menu,
  X,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Alert states
  const [featureAlert, setFeatureAlert] = useState(false);
  const [featureMessage, setFeatureMessage] = useState('');
  const [voteErrorAlert, setVoteErrorAlert] = useState(false);
  const [voteErrorMessage, setVoteErrorMessage] = useState('');

  useEffect(() => {
    if (token) {
      loadUserClubs();
    }
  }, [token]);

  const loadUserClubs = async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      const response = await clubService.getMyClubs(token);
      setClubs(response.clubs);

      if (response.clubs.length > 0) {
        await loadClubDetails(response.clubs[0]);
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
    } catch (error: any) {
      console.error('Failed to vote:', error);
      setVoteErrorMessage(error.message || 'Failed to vote. Please try again.');
      setVoteErrorAlert(true);
    }
  };

  const handleClubCreated = () => {
    loadUserClubs();
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleMakeContribution = () => {
    setFeatureMessage('Make Contribution feature would open here');
    setFeatureAlert(true);
  };

  const handleProposeInvestment = () => {
    setFeatureMessage('Propose Investment feature would open here');
    setFeatureAlert(true);
  };

  const handleViewAnalytics = () => {
    setFeatureMessage('View Analytics feature would open here');
    setFeatureAlert(true);
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
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-12">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-2xl md:text-3xl">👥</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                No Investment Clubs Yet
              </h2>
              <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
                Create an investment club to start collaborating with other
                investors and make collective investment decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm md:text-base"
                >
                  Create Your First Club
                </button>
              </div>
            </div>
          </div>
        </main>

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
      <main className="flex-1 p-3 md:p-4 lg:p-6">
        {/* Mobile Header */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">My Clubs</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage investments & collaborate
              </p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white border border-gray-200"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 bg-white rounded-xl border border-gray-200 p-4 shadow-lg"
            >
              <div className="space-y-3">
                <Select
                  value={currentClub.slug}
                  onValueChange={(value) => {
                    const club = clubs.find((c) => c.slug === value);
                    if (club) loadClubDetails(club);
                    setMobileMenuOpen(false);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((club) => (
                      <SelectItem key={club.slug} value={club.slug}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-sm"
                >
                  Club Details
                </button>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium text-sm"
                >
                  Create New Club
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                My Investment Clubs
              </h1>
              <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">
                Manage your club investments and collaborate with members
              </p>
            </div>
            <div className="flex items-center gap-3 lg:gap-4">
              <Select
                value={currentClub.slug}
                onValueChange={(value) => {
                  const club = clubs.find((c) => c.slug === value);
                  if (club) loadClubDetails(club);
                }}
              >
                <SelectTrigger className="w-[180px] lg:w-[200px]">
                  <SelectValue placeholder="Select a club" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.slug} value={club.slug}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-sm lg:text-base"
              >
                Club Details
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Left Column - Club Info and Members */}
            <div className="xl:col-span-2 space-y-4 lg:space-y-6">
              {/* Club Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 lg:gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-lg lg:text-2xl flex-shrink-0">
                      {currentClub.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                        {currentClub.name}
                      </h2>
                      <p className="text-gray-600 mt-1 text-sm lg:text-base line-clamp-2">
                        {currentClub.mission}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3 text-xs lg:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {currentClub.current_members_count} members
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} />
                          Min:{' '}
                          {formatCurrency(
                            currentClub.minimum_monthly_contribution,
                          )}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            currentClub.club_type === 'public'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {currentClub.club_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-left sm:min-w-[140px] lg:min-w-[160px]">
                    <div className="text-xl lg:text-3xl font-bold text-emerald-700 break-words">
                      {formatCurrency(currentClub.financials.current_balance)}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500">
                      Club Balance
                    </div>
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
                  <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">
                    Active Votes
                  </h3>
                  <div className="space-y-3 lg:space-y-4">
                    {activeVotes.map((investment) => (
                      <div
                        key={investment.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 shadow-sm"
                      >
                        <h4 className="font-semibold text-base lg:text-lg mb-2 line-clamp-2">
                          {investment.campaign.title}
                        </h4>
                        <p className="text-gray-600 mb-4 text-sm lg:text-base">
                          Investment:{' '}
                          {formatCurrency(investment.investment_amount)}
                        </p>
                        <div className="flex gap-2 lg:gap-3">
                          <button
                            onClick={() => handleVote(investment.id, 'invest')}
                            className="flex-1 px-3 lg:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm lg:text-base"
                          >
                            Vote Yes
                          </button>
                          <button
                            onClick={() => handleVote(investment.id, 'pass')}
                            className="flex-1 px-3 lg:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm lg:text-base"
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
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h3 className="text-lg lg:text-xl font-semibold">
                    Recent Investments
                  </h3>
                  <span className="text-xs lg:text-sm text-gray-500">
                    {investments.length} total
                  </span>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm divide-y">
                  {investments.slice(0, 5).map((investment) => (
                    <div key={investment.id} className="p-3 lg:p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm lg:text-base line-clamp-2">
                            {investment.campaign.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs lg:text-sm text-gray-600">
                              {formatCurrency(investment.investment_amount)}
                            </p>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                investment.status === 'executed'
                                  ? 'bg-green-100 text-green-800'
                                  : investment.status === 'voting'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : investment.status === 'approved'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {investment.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-xs lg:text-sm text-gray-500 whitespace-nowrap">
                          {new Date(investment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Stats and Quick Actions */}
            <div className="space-y-4 lg:space-y-6">
              {/* Portfolio Summary */}
              {portfolio && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3 lg:mb-4">
                    <TrendingUp size={18} className="text-emerald-600" />
                    <h3 className="text-lg font-semibold">Portfolio Summary</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm lg:text-base">
                        Total Invested
                      </span>
                      <span className="font-semibold text-sm lg:text-base">
                        {formatCurrency(portfolio.total_invested)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm lg:text-base">
                        Current Value
                      </span>
                      <span className="font-semibold text-sm lg:text-base">
                        {formatCurrency(portfolio.current_value)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm lg:text-base">
                        Total Returns
                      </span>
                      <span
                        className={`font-semibold text-sm lg:text-base ${
                          portfolio.total_returns >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(portfolio.total_returns)} (
                        {portfolio.return_percentage}%)
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
                className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-3 lg:mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2 lg:space-y-3">
                  <button
                    onClick={handleMakeContribution}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm lg:text-base text-left flex items-center gap-2"
                  >
                    <DollarSign size={16} />
                    Make Contribution
                  </button>
                  <button
                    onClick={handleProposeInvestment}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium text-sm lg:text-base text-left flex items-center gap-2"
                  >
                    <TrendingUp size={16} />
                    Propose Investment
                  </button>
                  <button
                    onClick={handleViewAnalytics}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm lg:text-base text-left flex items-center gap-2"
                  >
                    <BarChart3 size={16} />
                    View Analytics
                  </button>
                </div>
              </motion.div>

              {/* Club Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-3 lg:mb-4">
                  Club Stats
                </h3>
                <div className="grid grid-cols-2 gap-3 lg:gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg lg:text-2xl font-bold text-emerald-700">
                      {currentClub.current_members_count}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">
                      Members
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg lg:text-2xl font-bold text-emerald-700">
                      {investments.length}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">
                      Investments
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg lg:text-2xl font-bold text-emerald-700">
                      {formatCurrency(
                        currentClub.financials.total_contributions,
                      )}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">
                      Total Raised
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg lg:text-2xl font-bold text-emerald-700">
                      {formatCurrency(currentClub.financials.total_invested)}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">
                      Total Invested
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Create New Club Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-4 lg:p-6 shadow-sm text-white"
              >
                <h3 className="text-lg font-semibold mb-2">Start a New Club</h3>
                <p className="text-emerald-100 text-xs lg:text-sm mb-3 lg:mb-4">
                  Create your own investment club and invite others to join
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full px-3 lg:px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium text-sm lg:text-base transition-colors"
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

      {/* Alert Popups */}
      <AlertPopup
        title="Feature Coming Soon"
        message={featureMessage}
        isOpen={featureAlert}
        setIsOpen={setFeatureAlert}
        onConfirm={() => setFeatureAlert(false)}
        confirmText="Got it"
        confirmButtonClass="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
      />

      <AlertPopup
        title="Vote Failed"
        message={voteErrorMessage}
        isOpen={voteErrorAlert}
        setIsOpen={setVoteErrorAlert}
        onConfirm={() => setVoteErrorAlert(false)}
        confirmText="OK"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />
    </div>
  );
};

export default InvestmentClubsDashboard;
