// app/account/investor-clubs/ClubsListPage.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ClubDetailsModal from './ClubDetailsModal';
import CreateClubModal from './CreateClubModal';
import { Club, Member } from './clubTypes';
import { clubService, membershipService } from './clubservice';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  Users,
  DollarSign,
  Lock,
  Globe,
  Clock,
  TrendingUp,
  BookOpen,
  Leaf,
  PawPrint,
  Palette,
  Music,
  TreePine,
  Handshake,
  Lightbulb,
  Droplets,
  CloudSun,
  Heart,
  Landmark,
  Laptop,
  Briefcase,
  Building,
  User,
  Sun,
  Recycle,
  Fish,
  Home,
  Microscope,
  Shield,
  Bus,
  Car,
  Gamepad,
  Bitcoin,
  GraduationCap,
  ShoppingCart,
  Utensils,
  Cpu,
  Satellite,
  Truck,
  Plane,
  Headphones,
  Shirt,
  Cloud,
  Wallet,
  ChartLine,
  PiggyBank,
  Code,
  Banknote,
} from 'lucide-react';
import { categoriesWithIcons, deslugify } from '@/app/utils/helpers/categories';

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
  const [activeTab, setActiveTab] = useState<'all' | 'my_clubs' | 'discover'>(
    'all',
  );
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
    setSelectedClub(club);
    await loadClubMembers(club);
    setIsModalOpen(true);
  };

  // Helper function to update club with pending status
  const updateClubWithPendingStatus = (club: Club): Club => {
    return {
      ...club,
      membership_status: 'pending' as const,
    };
  };

  // Helper function to update club with none status
  const updateClubWithNoneStatus = (club: Club): Club => {
    return {
      ...club,
      membership_status: 'none' as const,
    };
  };

  const handleJoinRequest = async (club: Club, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    if (!token) return;

    setActionLoading(club.id);
    setMessage(null);

    // OPTIMISTIC UPDATE - Immediately update UI with proper typing
    setClubs((prevClubs) =>
      prevClubs.map((c) =>
        c.id === club.id ? updateClubWithPendingStatus(c) : c,
      ),
    );

    setMyClubs((prevMyClubs) =>
      prevMyClubs.map((c) =>
        c.id === club.id ? updateClubWithPendingStatus(c) : c,
      ),
    );

    setDiscoverClubs((prevDiscoverClubs) =>
      prevDiscoverClubs.map((c) =>
        c.id === club.id ? updateClubWithPendingStatus(c) : c,
      ),
    );

    try {
      const response = await clubService.joinClub(token, club.slug);

      if (response.success || response.is_member) {
        setMessage({
          type: 'success',
          text: response.message || 'Membership request sent successfully!',
          clubId: club.id,
        });

        // Reload the full data to ensure consistency with backend
        await loadClubs();
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to send membership request',
          clubId: club.id,
        });

        // Revert optimistic update on error
        revertOptimisticUpdate(club.id);
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send membership request',
        clubId: club.id,
      });

      // Revert optimistic update on error
      revertOptimisticUpdate(club.id);
    } finally {
      setActionLoading(null);
    }
  };

  const revertOptimisticUpdate = (clubId: string) => {
    setClubs((prevClubs) =>
      prevClubs.map((c) => (c.id === clubId ? updateClubWithNoneStatus(c) : c)),
    );

    setMyClubs((prevMyClubs) =>
      prevMyClubs.map((c) =>
        c.id === clubId ? updateClubWithNoneStatus(c) : c,
      ),
    );

    setDiscoverClubs((prevDiscoverClubs) =>
      prevDiscoverClubs.map((c) =>
        c.id === clubId ? updateClubWithNoneStatus(c) : c,
      ),
    );
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

  // Enhanced icon mapping with valid Lucide React icons
  const getClubIcon = (club: Club) => {
    const focus = club.investment_focus?.toLowerCase();

    // Tech & Innovation
    if (
      focus?.includes('tech') ||
      focus?.includes('software') ||
      focus?.includes('ai') ||
      focus?.includes('machine learning')
    )
      return <Laptop className="w-5 h-5" />;
    if (
      focus?.includes('blockchain') ||
      focus?.includes('crypto') ||
      focus?.includes('web3')
    )
      return <Bitcoin className="w-5 h-5" />;
    if (focus?.includes('robot') || focus?.includes('automation'))
      return <Cpu className="w-5 h-5" />;

    // Environment & Sustainability
    if (
      focus?.includes('climate') ||
      focus?.includes('green') ||
      focus?.includes('environment')
    )
      return <Leaf className="w-5 h-5" />;
    if (
      focus?.includes('energy') ||
      focus?.includes('solar') ||
      focus?.includes('renewable')
    )
      return <Sun className="w-5 h-5" />;
    if (
      focus?.includes('agriculture') ||
      focus?.includes('agri') ||
      focus?.includes('farm')
    )
      return <TreePine className="w-5 h-5" />;
    if (focus?.includes('water') || focus?.includes('clean water'))
      return <Droplets className="w-5 h-5" />;
    if (focus?.includes('recycle') || focus?.includes('waste'))
      return <Recycle className="w-5 h-5" />;

    // Social & Community
    if (
      focus?.includes('education') ||
      focus?.includes('edtech') ||
      focus?.includes('learning')
    )
      return <BookOpen className="w-5 h-5" />;
    if (
      focus?.includes('health') ||
      focus?.includes('medical') ||
      focus?.includes('healthcare')
    )
      return <Heart className="w-5 h-5" />;
    if (
      focus?.includes('real estate') ||
      focus?.includes('property') ||
      focus?.includes('housing')
    )
      return <Home className="w-5 h-5" />;
    if (
      focus?.includes('finance') ||
      focus?.includes('fintech') ||
      focus?.includes('banking')
    )
      return <Wallet className="w-5 h-5" />;
    if (focus?.includes('community') || focus?.includes('social'))
      return <Users className="w-5 h-5" />;

    // Specific categories
    if (
      focus?.includes('art') ||
      focus?.includes('culture') ||
      focus?.includes('creative')
    )
      return <Palette className="w-5 h-5" />;
    if (focus?.includes('music') || focus?.includes('entertainment'))
      return <Music className="w-5 h-5" />;
    if (
      focus?.includes('animal') ||
      focus?.includes('wildlife') ||
      focus?.includes('pet')
    )
      return <PawPrint className="w-5 h-5" />;
    if (
      focus?.includes('sport') ||
      focus?.includes('fitness') ||
      focus?.includes('recreation')
    )
      return <Gamepad className="w-5 h-5" />;
    if (
      focus?.includes('food') ||
      focus?.includes('restaurant') ||
      focus?.includes('culinary')
    )
      return <Utensils className="w-5 h-5" />;
    if (
      focus?.includes('game') ||
      focus?.includes('gaming') ||
      focus?.includes('esports')
    )
      return <Gamepad className="w-5 h-5" />;
    if (
      focus?.includes('transport') ||
      focus?.includes('mobility') ||
      focus?.includes('logistics')
    )
      return <Car className="w-5 h-5" />;
    if (focus?.includes('business') || focus?.includes('enterprise'))
      return <Building className="w-5 h-5" />;
    if (focus?.includes('research') || focus?.includes('science'))
      return <Microscope className="w-5 h-5" />;
    if (focus?.includes('security') || focus?.includes('safety'))
      return <Shield className="w-5 h-5" />;

    return <TrendingUp className="w-5 h-5" />;
  };

  const getClubStatus = (club: Club) => {
    if (club.membership_status === 'pending') {
      return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    }
    if (club.is_member) {
      return { label: 'Member', color: 'bg-green-100 text-green-800' };
    }
    if (club.club_type === 'private') {
      return { label: 'Private', color: 'bg-orange-100 text-orange-800' };
    }
    return { label: 'Join', color: 'bg-gray-100 text-gray-800' };
  };

  const getActionButton = (club: Club) => {
    // Use the club's membership_status for immediate feedback
    if (club.membership_status === 'pending') {
      return {
        label: 'Request Pending',
        style: 'bg-yellow-100 text-yellow-700 cursor-not-allowed',
        onClick: undefined,
        disabled: true,
      };
    }

    if (club.is_member) {
      return {
        label: 'View Club',
        style: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
        onClick: () => handleClubClick(club),
      };
    }

    if (club.club_type === 'private') {
      return {
        label: actionLoading === club.id ? 'Requesting...' : 'Request to Join',
        style:
          'bg-orange-100 text-orange-800 hover:bg-orange-600 hover:text-white',
        onClick: (e: React.MouseEvent) => handleJoinRequest(club, e),
        disabled: actionLoading === club.id,
      };
    }

    return {
      label: actionLoading === club.id ? 'Joining...' : 'Join Club',
      style: 'bg-emerald-600 text-white hover:bg-emerald-700',
      onClick: (e: React.MouseEvent) => handleJoinRequest(club, e),
      disabled: actionLoading === club.id,
    };
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Main Content Area - Article-like layout */}
        <div className="px-4 py-6">
          {/* Page Header - Integrated into content flow */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Investment Clubs
                </h1>
                <p className="text-gray-600 mt-2">
                  Collaborate and invest together with like-minded investors
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm transition-colors shadow-sm"
              >
                Create Club
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              {[
                { id: 'all', label: 'For You', count: clubs.length },
                { id: 'my_clubs', label: 'My Clubs', count: myClubs.length },
                {
                  id: 'discover',
                  label: 'Discover',
                  count: discoverClubs.length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
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

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: 'all', label: 'All', icon: Globe },
                { id: 'public', label: 'Public', icon: Globe },
                { id: 'private', label: 'Private', icon: Lock },
              ].map((filterOption) => {
                const IconComponent = filterOption.icon;
                return (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      filter === filterOption.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <IconComponent size={14} />
                    {filterOption.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Clubs Feed - Article-like display */}
          <div className="space-y-4">
            {filteredClubs.map((club, index) => {
              const status = getClubStatus(club);
              const actionButton = getActionButton(club);

              return (
                <motion.article
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200"
                  onClick={() => handleClubClick(club)}
                >
                  <div className="flex gap-4">
                    {/* Club Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-sm">
                        {getClubIcon(club)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg hover:text-emerald-700 transition-colors">
                            {club.name}
                          </h3>
                          {club.membership_status === 'pending' && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                              Pending
                            </span>
                          )}
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                              club.club_type === 'public'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-orange-100 text-orange-800 border-orange-200'
                            }`}
                          >
                            {club.club_type === 'public' ? 'Public' : 'Private'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Clock size={14} />
                          <span>{formatTimeAgo(club.created_at)}</span>
                        </div>
                      </div>

                      {/* Mission */}
                      <p className="text-gray-700 text-base mb-4 leading-relaxed">
                        {club.mission}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Users size={16} className="text-gray-600" />
                          <div>
                            <div className="font-semibold text-gray-900">
                              {club.current_members_count}/{club.max_members}
                            </div>
                            <div className="text-gray-600 text-xs">Members</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <DollarSign size={16} className="text-gray-600" />
                          <div>
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(club.minimum_monthly_contribution)}
                            </div>
                            <div className="text-gray-600 text-xs">Monthly</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          {getClubIcon(club)}
                          <div>
                            <div className="font-semibold text-gray-900 capitalize">
                              {deslugify(club.investment_focus || 'general')}
                            </div>
                            <div className="text-gray-600 text-xs">Focus</div>
                          </div>
                        </div>
                      </div>

                      {/* Balance and Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-2xl font-bold text-emerald-700">
                            {formatCurrency(club.financials.current_balance)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Club Balance
                          </div>
                        </div>
                        <button
                          onClick={actionButton.onClick}
                          disabled={actionButton.disabled}
                          className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
                            actionButton.disabled 
                              ? actionButton.style 
                              : `${actionButton.style} hover:shadow-md`
                          }`}
                        >
                          {actionButton.label}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredClubs.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">
                  {activeTab === 'my_clubs' ? (
                    <Users className="w-10 h-10 text-gray-400" />
                  ) : activeTab === 'discover' ? (
                    '🔍'
                  ) : (
                    '🏢'
                  )}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {activeTab === 'my_clubs'
                  ? 'No clubs yet'
                  : activeTab === 'discover'
                    ? 'No clubs to discover'
                    : 'No clubs found'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                {activeTab === 'my_clubs'
                  ? "You haven't joined any investment clubs yet. Explore clubs below or create your own to start collaborating with other investors."
                  : activeTab === 'discover'
                    ? "You've joined all available clubs or there are no clubs matching your criteria at the moment."
                    : filter === 'all'
                      ? 'There are no investment clubs available at the moment. Be the first to create one!'
                      : `No ${filter} clubs match your current criteria. Try adjusting your filters.`}
              </p>
              {activeTab === 'my_clubs' && (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm shadow-sm hover:shadow-md transition-all"
                  >
                    Discover Clubs
                  </button>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all"
                  >
                    Create Club
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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