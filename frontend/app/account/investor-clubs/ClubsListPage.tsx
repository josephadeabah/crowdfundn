// app/account/investor-clubs/ClubsListPage.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import CreateClubModal from './CreateClubModal';
import {
  Club,
  Member,
  ClubsResponse,
  MyClubsResponse,
  DiscoverClubsResponse,
} from './clubTypes';
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
  Building2,
} from 'lucide-react';
import { deslugify } from '@/app/utils/helpers/categories';
import ClubDetailsModal from './club-details/ClubDetailsModal';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

// Define proper types for infinite scroll state
type TabType = 'all' | 'my_clubs' | 'discover';
type InfiniteScrollState = {
  loading: boolean;
  hasMore: boolean;
  page: number;
};

type InfiniteScrollStates = {
  all: InfiniteScrollState;
  my_clubs: InfiniteScrollState;
  discover: InfiniteScrollState;
};

const ClubsListPage: React.FC = () => {
  const { token, user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [discoverClubs, setDiscoverClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    clubId?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    'all' | 'my_clubs' | 'discover' | 'dealroom'
  >('all');
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');

  // Infinite scroll states with proper typing
  const [infiniteScroll, setInfiniteScroll] = useState<InfiniteScrollStates>({
    all: { loading: false, hasMore: true, page: 1 },
    my_clubs: { loading: false, hasMore: true, page: 1 },
    discover: { loading: false, hasMore: true, page: 1 },
  });

  // Load clubs function with infinite scroll support and proper typing
  const loadClubs = useCallback(
    async (tab: TabType, page: number = 1, isLoadMore: boolean = false) => {
      if (!token) return;

      try {
        setInfiniteScroll((prev) => ({
          ...prev,
          [tab]: { ...prev[tab], loading: true },
        }));

        let response: ClubsResponse | MyClubsResponse | DiscoverClubsResponse;

        switch (tab) {
          case 'my_clubs':
            response = await clubService.getMyClubs(token, page, 10);
            if (isLoadMore) {
              setMyClubs((prev) => [...prev, ...response.clubs]);
            } else {
              setMyClubs(response.clubs);
            }
            break;
          case 'discover':
            response = await clubService.getDiscoverClubs(token, page, 10);
            if (isLoadMore) {
              setDiscoverClubs((prev) => [...prev, ...response.clubs]);
            } else {
              setDiscoverClubs(response.clubs);
            }
            break;
          default:
            response = await clubService.getClubs(token, page, 10);
            if (isLoadMore) {
              setClubs((prev) => [...prev, ...response.clubs]);
            } else {
              setClubs(response.clubs);
            }
            break;
        }

        // Update infinite scroll state with proper typing
        setInfiniteScroll((prev) => ({
          ...prev,
          [tab]: {
            loading: false,
            hasMore: page < response.pagination.total_pages,
            page: page,
          },
        }));
      } catch (error) {
        console.error(`Failed to load ${tab} clubs:`, error);
        setInfiniteScroll((prev) => ({
          ...prev,
          [tab]: { ...prev[tab], loading: false },
        }));
      }
    },
    [token],
  );

  // Load more function with proper typing
  const loadMoreClubs = useCallback(async () => {
    if (activeTab === 'dealroom') return;

    const currentState = infiniteScroll[activeTab as TabType];
    if (currentState.loading || !currentState.hasMore) return;

    const nextPage = currentState.page + 1;
    await loadClubs(activeTab as TabType, nextPage, true);
  }, [activeTab, infiniteScroll, loadClubs]);

  // Set up infinite scroll observer with proper typing
  const observerRef = useInfiniteScroll(
    loadMoreClubs,
    activeTab !== 'dealroom'
      ? infiniteScroll[activeTab as TabType].hasMore
      : false,
    activeTab !== 'dealroom'
      ? infiniteScroll[activeTab as TabType].loading
      : false,
  );

  // Load clubs when tab changes with proper typing
  useEffect(() => {
    if (token && activeTab !== 'dealroom') {
      // Reset and load first page when tab changes
      setInfiniteScroll((prev) => ({
        ...prev,
        [activeTab as TabType]: { loading: false, hasMore: true, page: 1 },
      }));
      loadClubs(activeTab as TabType, 1, false);
    }
  }, [token, activeTab, loadClubs]);

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

        // Reload the current tab data to ensure consistency with backend
        if (activeTab !== 'dealroom') {
          await loadClubs(activeTab as TabType, 1, false);
        }
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
    if (activeTab !== 'dealroom') {
      loadClubs(activeTab as TabType, 1, false);
    }
  };

  const handleMembershipUpdate = () => {
    if (activeTab !== 'dealroom') {
      loadClubs(activeTab as TabType, 1, false);
    }
  };

  const getDisplayClubs = () => {
    switch (activeTab) {
      case 'my_clubs':
        return myClubs;
      case 'discover':
        return discoverClubs;
      case 'dealroom':
        return []; // Dealroom tab doesn't show clubs list
      default:
        return clubs;
    }
  };

  const filteredClubs = getDisplayClubs().filter(
    (club) => filter === 'all' || club.club_type === filter,
  );

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
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

  // Get current scroll state with proper typing
  const currentScrollState =
    activeTab !== 'dealroom'
      ? infiniteScroll[activeTab as TabType]
      : { loading: false, hasMore: false, page: 1 };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="px-2 py-4">
          {/* Page Header - Integrated into content flow */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Investment Clubs
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Collaborate and invest together
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium text-sm transition-colors"
              >
                Create Club
              </button>
            </div>

            {/* Tabs - Fixed to show labels and counts inline on mobile */}
            <div className="flex border-b border-gray-200">
              {[
                {
                  id: 'all',
                  label: 'For You',
                  count: clubs.length,
                },
                {
                  id: 'my_clubs',
                  label: 'My Clubs',
                  count: myClubs.length,
                },
                {
                  id: 'discover',
                  label: 'Discover',
                  count: discoverClubs.length,
                },
                {
                  id: 'dealroom',
                  label: 'Dealroom',
                  count: 0,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as 'all' | 'my_clubs' | 'discover' | 'dealroom',
                    )
                  }
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                  {tab.id !== 'dealroom' && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs min-w-[20px] flex items-center justify-center ${
                        activeTab === tab.id
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Filter Chips - Only show for club tabs, not dealroom */}
            {activeTab !== 'dealroom' && (
              <div className="px-0 py-3 flex gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'All', icon: Globe },
                  { id: 'public', label: 'Public', icon: Globe },
                  { id: 'private', label: 'Private', icon: Lock },
                ].map((filterOption) => {
                  const IconComponent = filterOption.icon;
                  return (
                    <button
                      key={filterOption.id}
                      onClick={() =>
                        setFilter(
                          filterOption.id as 'all' | 'public' | 'private',
                        )
                      }
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        filter === filterOption.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <IconComponent size={14} />
                      {filterOption.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Message Alert */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Dealroom Tab Content */}
          {activeTab === 'dealroom' && (
            <div className="bg-gray-50 rounded-lg flex justify-center items-center text-lg text-gray-500 h-64">
              <div>Coming Soon</div>
            </div>
          )}

          {/* Loading State for Initial Load */}
          {activeTab !== 'dealroom' &&
            currentScrollState.loading &&
            filteredClubs.length === 0 && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            )}

          {/* Clubs Feed with Infinite Scroll */}
          {activeTab !== 'dealroom' && (
            <div className="divide-y divide-gray-200">
              {filteredClubs.map((club, index) => {
                const status = getClubStatus(club);
                const actionButton = getActionButton(club);

                return (
                  <motion.article
                    key={`${club.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleClubClick(club)}
                  >
                    <div className="flex gap-3">
                      {/* Club Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white">
                          {getClubIcon(club)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1 gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-base hover:text-emerald-700 transition-colors">
                              {club.name}
                            </h3>
                            {club.membership_status === 'pending' && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                club.club_type === 'public'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {club.club_type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Clock size={14} />
                            <span>{formatTimeAgo(club.created_at)}</span>
                          </div>
                        </div>

                        {/* Mission */}
                        <p className="text-gray-800 text-sm mb-3 leading-relaxed">
                          {club.mission}
                        </p>

                        {/* Stats - Block layout on mobile, flex on desktop */}
                        <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>
                              {club.current_members_count}/{club.max_members}{' '}
                              members
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} />
                            <span>
                              {formatCurrency(
                                club.minimum_monthly_contribution,
                                club.currency,
                              )}
                              /mo
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getClubIcon(club)}
                            <span className="capitalize">
                              {deslugify(club.investment_focus || 'general')}
                            </span>
                          </div>
                        </div>

                        {/* Balance and Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-lg font-bold text-emerald-700">
                              {formatCurrency(
                                club.financials.current_balance,
                                club.currency,
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Club Balance
                            </div>
                          </div>
                          <button
                            onClick={actionButton.onClick}
                            disabled={actionButton.disabled}
                            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${actionButton.style}`}
                          >
                            {actionButton.label}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}

              {/* Loading indicator for infinite scroll */}
              {currentScrollState.loading && filteredClubs.length > 0 && (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              )}

              {/* End of results message */}
              {!currentScrollState.hasMore && filteredClubs.length > 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">
                  You've reached the end of the list
                </div>
              )}

              {/* Observer element for infinite scroll */}
              {currentScrollState.hasMore &&
                !currentScrollState.loading &&
                filteredClubs.length > 0 && (
                  <div ref={observerRef} className="h-4" />
                )}
            </div>
          )}

          {/* Empty State */}
          {filteredClubs.length === 0 &&
            !currentScrollState.loading &&
            activeTab !== 'dealroom' && (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">
                    {activeTab === 'my_clubs' ? (
                      <Users className="w-8 h-8 text-gray-400" />
                    ) : activeTab === 'discover' ? (
                      '🔍'
                    ) : (
                      '🏢'
                    )}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === 'my_clubs'
                    ? 'No clubs yet'
                    : activeTab === 'discover'
                      ? 'No clubs to discover'
                      : 'No clubs found'}
                </h3>
                <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                  {activeTab === 'my_clubs'
                    ? "You haven't joined any investment clubs yet. Explore clubs below or create your own."
                    : activeTab === 'discover'
                      ? "You've joined all available clubs or there are no clubs matching your criteria."
                      : filter === 'all'
                        ? 'There are no investment clubs available at the moment.'
                        : `No ${filter} clubs match your criteria.`}
                </p>
                {activeTab === 'my_clubs' && (
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setActiveTab('discover')}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium text-sm"
                    >
                      Discover Clubs
                    </button>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 font-medium text-sm"
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
