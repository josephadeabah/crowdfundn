// app/account/investor-clubs/ClubsListPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClubDetailsModal from './ClubDetailsModal';
import CreateClubModal from './CreateClubModal';
import { Club, Member } from './clubTypes';
import { clubService, membershipService } from './clubservice';
import { useAuth } from '@/app/context/auth/AuthContext';

const ClubsListPage: React.FC = () => {
  const { token, user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [discoverClubs, setDiscoverClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    clubId?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'my_clubs' | 'discover'>('all');
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    if (token) {
      loadClubs();
    }
  }, [token]);

  const loadClubs = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const [allClubsResponse, myClubsResponse, discoverClubsResponse] =
        await Promise.all([
          clubService.getClubs(token),
          clubService.getMyClubs(token),
          clubService.getDiscoverClubs(token),
        ]);

      setClubs(allClubsResponse.clubs);
      setMyClubs(myClubsResponse.clubs);
      setDiscoverClubs(discoverClubsResponse.clubs);
    } catch (error) {
      console.error('Failed to load clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClubMembers = async (club: Club) => {
    if (!token) return;

    try {
      const response = await membershipService.getMembers(token, club.slug);
      setMembers(response.members);
    } catch (error) {
      console.error('Failed to load club members:', error);
      setMembers([]);
    }
  };

  const handleClubClick = async (club: Club) => {
    // Allow clicking on any club to view details and request membership
    setSelectedClub(club);
    await loadClubMembers(club);
    setIsModalOpen(true);
  };

  const handleJoinRequest = async (club: Club, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent triggering the card click
    }

    if (!token) return;

    setActionLoading(club.id);
    setMessage(null);

    try {
      const response = await clubService.joinClub(token, club.slug);

      if (response.success || response.is_member) {
        setMessage({
          type: 'success',
          text: response.message || 'Membership request sent successfully!',
          clubId: club.id
        });
        // Reload clubs to update membership status
        await loadClubs();
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to send membership request',
          clubId: club.id
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send membership request',
        clubId: club.id
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleClubCreated = () => {
    loadClubs();
  };

  const handleMembershipUpdate = () => {
    loadClubs();
  };

  const getDisplayClubs = () => {
    switch (activeTab) {
      case 'my_clubs':
        return myClubs;
      case 'discover':
        return discoverClubs;
      default:
        return clubs;
    }
  };

  const filteredClubs = getDisplayClubs().filter(
    (club) => filter === 'all' || club.club_type === filter,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getClubIcon = (club: Club) => {
    const focus = club.investment_focus?.toLowerCase();
    if (focus?.includes('tech')) return '🚀';
    if (focus?.includes('climate') || focus?.includes('green')) return '🌿';
    if (focus?.includes('agriculture') || focus?.includes('agri')) return '🌱';
    if (focus?.includes('health')) return '🏥';
    if (focus?.includes('real estate')) return '🏠';
    if (focus?.includes('energy')) return '⚡';
    return '💼';
  };

  const getClubStatus = (club: Club) => {
    if (club.is_member) {
      return { label: 'Member', color: 'bg-green-100 text-green-800' };
    }
    if (club.club_type === 'private') {
      return { label: 'Private', color: 'bg-blue-100 text-blue-800' };
    }
    return { label: 'Join', color: 'bg-gray-100 text-gray-800' };
  };

  const getActionButton = (club: Club) => {
    if (club.is_member) {
      return {
        label: 'View Club',
        style: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
        onClick: () => handleClubClick(club)
      };
    }

    if (club.club_type === 'private') {
      return {
        label: actionLoading === club.id ? 'Requesting...' : 'Request to Join',
        style: 'bg-blue-600 text-white hover:bg-blue-700',
        onClick: (e: React.MouseEvent) => handleJoinRequest(club, e),
        disabled: actionLoading === club.id
      };
    }

    return {
      label: actionLoading === club.id ? 'Joining...' : 'Join Club',
      style: 'bg-emerald-600 text-white hover:bg-emerald-700',
      onClick: (e: React.MouseEvent) => handleJoinRequest(club, e),
      disabled: actionLoading === club.id
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Investment Clubs
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Collaborate with like-minded investors and make collective investment decisions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex bg-white border border-gray-300 rounded-lg p-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'public', label: 'Public' },
                { id: 'private', label: 'Private' },
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium whitespace-nowrap"
            >
              Create New Club
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { id: 'all', label: 'All Clubs', count: clubs.length },
            { id: 'my_clubs', label: 'My Clubs', count: myClubs.length },
            { id: 'discover', label: 'Discover', count: discoverClubs.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Clubs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club, index) => {
            const status = getClubStatus(club);
            const actionButton = getActionButton(club);

            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => handleClubClick(club)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl">
                        {getClubIcon(club)}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            club.club_type === 'public'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {club.club_type}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {club.name}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {club.mission}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>Members</span>
                        <span className="font-medium text-gray-900">
                          {club.current_members_count}/{club.max_members}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Min. Contribution</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(club.minimum_monthly_contribution)}/mo
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Focus Area</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {club.investment_focus || 'General'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-emerald-700">
                          {formatCurrency(club.financials.current_balance)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Club Balance
                        </div>
                      </div>
                      <button
                        onClick={actionButton.onClick}
                        disabled={actionButton.disabled}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${actionButton.style}`}
                      >
                        {actionButton.label}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">
                {activeTab === 'my_clubs'
                  ? '👥'
                  : activeTab === 'discover'
                    ? '🔍'
                    : '🏢'}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'my_clubs'
                ? 'No clubs yet'
                : activeTab === 'discover'
                  ? 'No clubs to discover'
                  : 'No clubs found'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {activeTab === 'my_clubs'
                ? "You haven't joined any investment clubs yet. Explore clubs below or create your own."
                : activeTab === 'discover'
                  ? "You've joined all available clubs or there are no clubs matching your criteria."
                  : filter === 'all'
                    ? 'There are no investment clubs available at the moment.'
                    : `No ${filter} clubs match your criteria.`}
            </p>
            {activeTab === 'my_clubs' && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setActiveTab('discover')}
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
            )}
          </div>
        )}
      </main>

      {/* Club Details Modal */}
      {selectedClub && (
        <ClubDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          club={selectedClub}
          members={members}
          onMembershipUpdate={handleMembershipUpdate}
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

export default ClubsListPage;