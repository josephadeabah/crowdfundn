// app/account/investor-clubs/ClubsListPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClubDetailsModal from './ClubDetailsModal';
import CreateClubModal from './CreateClubModal'; // Add this import
import { Club, Member } from './clubTypes';
import { clubService, membershipService } from './clubservice';
import { useAuth } from '@/app/context/auth/AuthContext';

const ClubsListPage: React.FC = () => {
  const { token } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Add this state
  const [loading, setLoading] = useState(true);
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
      const response = await clubService.getClubs(token);
      setClubs(response.clubs);
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
    }
  };

  const handleClubClick = async (club: Club) => {
    setSelectedClub(club);
    await loadClubMembers(club);
    setIsModalOpen(true);
  };

  // Add this function to handle club creation
  const handleClubCreated = () => {
    loadClubs(); // Reload the clubs list
  };

  const filteredClubs = clubs.filter(
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
    return '💼';
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
              Discover Investment Clubs
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Find and join investment clubs that match your interests.
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
            {/* Update this button to open the create modal */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium whitespace-nowrap"
            >
              Create New Club
            </button>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club, index) => (
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
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        club.club_type === 'public'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {club.club_type}
                    </span>
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
                      <div className="text-xs text-gray-500">Club Balance</div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      {club.is_member ? 'View Club' : 'Join Club'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No clubs found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filter === 'all'
                ? 'There are no investment clubs available at the moment.'
                : `No ${filter} clubs match your criteria.`}
            </p>
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
