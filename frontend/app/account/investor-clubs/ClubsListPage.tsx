// app/account/investor-clubs/ClubsListPage.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateClubModal from './CreateClubModal';
import Pagination from '@/app/components/pagination/Pagination';
import {
  Club,
  Member,
  PaginationData,
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
  Sparkles,
  Target,
  Zap,
  Heart as HeartIcon,
  X,
  Search,
  Filter,
  SlidersHorizontal,
  List,
} from 'lucide-react';
import { categoriesWithIcons, deslugify } from '@/app/utils/helpers/categories';
import ClubDetailsModal from './club-details/ClubDetailsModal';
import DealroomContent from './dealroom/DealRoomContent';

// Club Match Card Component
const ClubMatchCard: React.FC<{
  club: Club;
  onSwipe: (direction: 'left' | 'right') => void;
  onDetails: (club: Club) => void;
  getClubIcon: (club: Club) => React.ReactNode;
  formatCurrency: (amount: number, currency?: string) => string;
}> = ({ club, onSwipe, onDetails, getClubIcon, formatCurrency }) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const swipeDistance = currentX;
    if (Math.abs(swipeDistance) > 100) {
      onSwipe(swipeDistance > 0 ? 'right' : 'left');
    }
    
    setCurrentX(0);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX - startX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const swipeDistance = currentX;
    if (Math.abs(swipeDistance) > 100) {
      onSwipe(swipeDistance > 0 ? 'right' : 'left');
    }
    
    setCurrentX(0);
    setIsDragging(false);
  };

  const rotation = currentX * 0.1;
  const opacity = Math.min(1 - Math.abs(currentX) / 300, 1);

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto cursor-grab active:cursor-grabbing"
      style={{
        x: currentX,
        rotate: rotation,
        opacity,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Swipe Indicators */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-medium opacity-0"
          animate={{ opacity: currentX < -50 ? Math.abs(currentX) / 100 : 0 }}
        >
          <X size={16} />
        </motion.div>
        <motion.div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-emerald-500 text-white px-3 py-2 rounded-full text-sm font-medium opacity-0"
          animate={{ opacity: currentX > 50 ? currentX / 100 : 0 }}
        >
          <HeartIcon size={16} />
        </motion.div>
      </div>

      {/* Club Card */}
      <div 
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        onClick={() => onDetails(club)}
      >
        {/* Club Header with Gradient */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                {getClubIcon(club)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{club.name}</h3>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    club.club_type === 'public' 
                      ? 'bg-green-500/30' 
                      : 'bg-orange-500/30'
                  }`}>
                    {club.club_type}
                  </span>
                  <Users size={12} />
                  <span>{club.current_members_count}/{club.max_members}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm opacity-90 line-clamp-2">{club.mission}</p>
        </div>

        {/* Club Details */}
        <div className="p-6">
          {/* Investment Focus */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            {getClubIcon(club)}
            <span className="capitalize font-medium">
              {deslugify(club.investment_focus || 'general')}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-emerald-700">
                {formatCurrency(club.minimum_monthly_contribution, club.currency)}
              </div>
              <div className="text-xs text-gray-500">Monthly</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-emerald-700">
                {formatCurrency(club.financials.current_balance, club.currency)}
              </div>
              <div className="text-xs text-gray-500">Balance</div>
            </div>
          </div>

          {/* Match Indicators */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Activity Level</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`w-2 h-2 rounded-full ${
                      star <= 4 ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Your Match</span>
              <span className="font-bold text-emerald-600">87%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex border-t border-gray-100">
          <button
            className="flex-1 py-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSwipe('left');
            }}
          >
            <X size={20} />
            <span className="font-medium">Skip</span>
          </button>
          <button
            className="flex-1 py-4 flex items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSwipe('right');
            }}
          >
            <HeartIcon size={20} />
            <span className="font-medium">Join</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Smart Search and Filter Component
const ClubFinder: React.FC<{
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  onViewChange: (view: 'cards' | 'list' | 'match') => void;
  currentView: string;
}> = ({ onSearch, onFilterChange, onViewChange, currentView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    investmentFocus: '',
    maxMonthlyContribution: 1000,
    clubType: 'all',
    minMembers: 0,
    maxMembers: 50,
  });

  const investmentFocusOptions = [
    'Technology', 'Sustainability', 'Real Estate', 'Healthcare',
    'Finance', 'Education', 'Entertainment', 'Agriculture'
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Find clubs by name, focus, or mission..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        {[
          { id: 'match', label: 'Club Match', icon: Sparkles },
          { id: 'cards', label: 'Cards', icon: Target },
          { id: 'list', label: 'List', icon: List }
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === view.id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <view.icon size={16} />
            {view.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white p-4 rounded-lg border border-gray-200 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Focus
              </label>
              <select
                value={filters.investmentFocus}
                onChange={(e) => handleFilterChange('investmentFocus', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Focus Areas</option>
                {investmentFocusOptions.map((focus) => (
                  <option key={focus} value={focus}>{focus}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Monthly Contribution
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">$0</span>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.maxMonthlyContribution}
                  onChange={(e) => handleFilterChange('maxMonthlyContribution', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">${filters.maxMonthlyContribution}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club Type
              </label>
              <select
                value={filters.clubType}
                onChange={(e) => handleFilterChange('clubType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Members Range
              </label>
              <div className="flex items-center gap-2 text-sm">
                <span>{filters.minMembers}</span>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={filters.maxMembers}
                  onChange={(e) => handleFilterChange('maxMembers', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span>{filters.maxMembers}+</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
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
  const [loading, setLoading] = useState(true);
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

  // Enhanced state for innovative features
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [viewMode, setViewMode] = useState<'list' | 'cards' | 'match'>('match');
  const [matchedClubs, setMatchedClubs] = useState<Club[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Pagination states
  const [pagination, setPagination] = useState<{
    all: PaginationData;
    my_clubs: PaginationData;
    discover: PaginationData;
    dealroom: PaginationData;
  }>({
    all: { current_page: 1, total_pages: 1, per_page: 10, total_count: 0 },
    my_clubs: { current_page: 1, total_pages: 1, per_page: 10, total_count: 0 },
    discover: { current_page: 1, total_pages: 1, per_page: 10, total_count: 0 },
    dealroom: { current_page: 1, total_pages: 1, per_page: 10, total_count: 0 },
  });

  const [loadingTabs, setLoadingTabs] = useState({
    all: false,
    my_clubs: false,
    discover: false,
    dealroom: false,
  });

  const getDisplayClubs = () => {
    let displayClubs = [];
    switch (activeTab) {
      case 'my_clubs':
        displayClubs = myClubs;
        break;
      case 'discover':
        displayClubs = discoverClubs;
        break;
      case 'dealroom':
        return [];
      default:
        displayClubs = clubs;
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      displayClubs = displayClubs.filter(club => 
        club.name.toLowerCase().includes(query) ||
        club.mission.toLowerCase().includes(query) ||
        (club.investment_focus && club.investment_focus.toLowerCase().includes(query))
      );
    }

    // Apply advanced filters
    if (advancedFilters) {
      const filters = advancedFilters as any;
      displayClubs = displayClubs.filter(club => {
        if (filters.investmentFocus && club.investment_focus !== filters.investmentFocus) {
          return false;
        }
        if (filters.maxMonthlyContribution && club.minimum_monthly_contribution > filters.maxMonthlyContribution) {
          return false;
        }
        if (filters.clubType !== 'all' && club.club_type !== filters.clubType) {
          return false;
        }
        if (club.current_members_count > filters.maxMembers) {
          return false;
        }
        return true;
      });
    }

    return displayClubs.filter(
      (club) => filter === 'all' || club.club_type === filter,
    );
  };

  const filteredClubs = getDisplayClubs();

  // Load clubs when tab changes or on initial load
  useEffect(() => {
    if (token && activeTab !== 'dealroom') {
      loadClubs(activeTab, pagination[activeTab].current_page);
    }
  }, [token, activeTab]);

  // Initialize match deck when clubs load
  useEffect(() => {
    if (filteredClubs.length > 0) {
      setMatchedClubs(filteredClubs);
      setCurrentMatchIndex(0);
    }
  }, [filteredClubs]);

  const loadClubs = async (
    tab: string,
    page: number = 1,
    perPage: number = 10,
  ) => {
    if (!token) return;

    try {
      setLoadingTabs((prev) => ({ ...prev, [tab]: true }));

      // Properly type the response based on the tab
      switch (tab) {
        case 'my_clubs': {
          const response: MyClubsResponse = await clubService.getMyClubs(
            token,
            page,
            perPage,
          );
          setMyClubs(response.clubs);
          setPagination((prev) => ({ ...prev, my_clubs: response.pagination }));
          break;
        }
        case 'discover': {
          const response: DiscoverClubsResponse =
            await clubService.getDiscoverClubs(token, page, perPage);
          setDiscoverClubs(response.clubs);
          setPagination((prev) => ({ ...prev, discover: response.pagination }));
          break;
        }
        default: {
          const response: ClubsResponse = await clubService.getClubs(
            token,
            page,
            perPage,
          );
          setClubs(response.clubs);
          setPagination((prev) => ({ ...prev, all: response.pagination }));
          break;
        }
      }
    } catch (error) {
      console.error(`Failed to load ${tab} clubs:`, error);
    } finally {
      setLoadingTabs((prev) => ({ ...prev, [tab]: false }));
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], current_page: page },
    }));
    loadClubs(activeTab, page, pagination[activeTab].per_page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (perPage: number) => {
    setPagination((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], per_page: perPage, current_page: 1 },
    }));
    loadClubs(activeTab, 1, perPage);
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

        // Reload the current tab data to ensure consistency with backend
        await loadClubs(activeTab, pagination[activeTab].current_page);
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

  // Handle swipe actions in Club Match mode
  const handleFilterChange = (filters: any) => {
    setAdvancedFilters(filters);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      // Skip to next club
      setCurrentMatchIndex(prev => prev + 1);
    } else {
      // Join the club
      handleJoinRequest(matchedClubs[currentMatchIndex]);
      setCurrentMatchIndex(prev => prev + 1);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMembershipUpdate = () => {
    loadClubs(activeTab, pagination[activeTab].current_page);
  };

  const handleClubCreated = () => {
    setIsCreateModalOpen(false);
    loadClubs('my_clubs', 1);
  };

  const revertOptimisticUpdate = (clubId: string) => {
    setClubs((prevClubs) =>
      prevClubs.map((c) =>
        c.id === clubId ? updateClubWithNoneStatus(c) : c,
      ),
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

  const getCurrentPagination = () => {
    return pagination[activeTab];
  };

  const currentPagination = getCurrentPagination();
  const isLoading = loadingTabs[activeTab];

  // Render different views based on viewMode
  const renderClubView = () => {
    if (viewMode === 'match') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          {matchedClubs.length > 0 && currentMatchIndex < matchedClubs.length ? (
            <>
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Swipe to Find Your Perfect Club
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {currentMatchIndex + 1} of {matchedClubs.length} clubs
                </p>
              </div>
              
              <ClubMatchCard
                club={matchedClubs[currentMatchIndex]}
                onSwipe={handleSwipe}
                onDetails={handleClubClick}
                getClubIcon={getClubIcon}
                formatCurrency={formatCurrency}
              />

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => handleSwipe('left')}
                  className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                >
                  <HeartIcon size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                All Clubs Reviewed!
              </h3>
              <p className="text-gray-600 mb-6">
                You've seen all available clubs. Create your own or check back later for new opportunities.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium"
              >
                Create Your Club
              </button>
            </div>
          )}
        </div>
      );
    }

    // Original list view
    return (
      <>
        <div className="divide-y divide-gray-200">
          {filteredClubs.map((club, index) => {
            const status = getClubStatus(club);
            const actionButton = getActionButton(club);

            return (
              <motion.article
                key={club.id}
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
        </div>

        {/* Pagination */}
        {currentPagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPagination.current_page}
            totalPages={currentPagination.total_pages}
            totalCount={currentPagination.total_count}
            perPage={currentPagination.per_page}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            showPerPageSelector={true}
          />
        )}
      </>
    );
  };

  if (loading && activeTab === 'all') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="px-2 py-4">
          {/* Enhanced Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Investment Clubs
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Find your perfect investment community
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium text-sm transition-colors flex items-center gap-2"
              >
                <Zap size={16} />
                Create Club
              </button>
            </div>

            {/* Enhanced Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                {
                  id: 'all',
                  label: 'Club Match',
                  count: currentPagination.total_count,
                  icon: Sparkles,
                },
                {
                  id: 'my_clubs',
                  label: 'My Clubs',
                  count: pagination.my_clubs.total_count,
                  icon: Users,
                },
                {
                  id: 'discover',
                  label: 'Browse All',
                  count: pagination.discover.total_count,
                  icon: Globe,
                },
                {
                  id: 'dealroom',
                  label: 'Dealroom',
                  count: 0,
                  icon: TrendingUp,
                },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(
                        tab.id as 'all' | 'my_clubs' | 'discover' | 'dealroom',
                      )
                    }
                    className={`flex-1 flex items-center justify-center gap-2 px-2 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent size={16} />
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
                );
              })}
            </div>

            {/* Club Finder Component */}
            {activeTab !== 'dealroom' && activeTab !== 'my_clubs' && (
              <div className="mt-4">
                <ClubFinder
                  onSearch={handleSearch}
                  onFilterChange={handleFilterChange}
                  onViewChange={setViewMode}
                  currentView={viewMode}
                />
              </div>
            )}

            {/* Original Filter Chips */}
            {activeTab !== 'dealroom' && activeTab !== 'my_clubs' && viewMode !== 'match' && (
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
            <div className="bg-white rounded-lg">
              <DealroomContent />
            </div>
          )}

          {/* Loading State */}
          {activeTab !== 'dealroom' && isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {/* Club Content */}
          {activeTab !== 'dealroom' && !isLoading && (
            <>
              {renderClubView()}

              {/* Empty State */}
              {filteredClubs.length === 0 && !isLoading && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No clubs found
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                    {searchQuery || Object.keys(advancedFilters).length > 0
                      ? 'Try adjusting your search or filters to find more clubs.'
                      : 'There are no investment clubs available at the moment.'}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setAdvancedFilters({});
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium text-sm"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 font-medium text-sm"
                    >
                      Create Club
                    </button>
                  </div>
                </div>
              )}
            </>
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