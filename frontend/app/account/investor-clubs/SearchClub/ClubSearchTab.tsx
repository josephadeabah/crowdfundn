// app/account/investor-clubs/ClubSearchTab.tsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  Globe,
  Lock,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Club, Member } from '../clubTypes';
import { clubService, membershipService } from '../clubservice';
import ClubDetailsModal from '../club-details/ClubDetailsModal';
import { AdvancedSlider } from '../../../components/advanced-slider/AdvancedSlider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { deslugify } from '@/app/utils/helpers/categories';

interface SearchFilters {
  investmentFocus: string[];
  clubType: string[];
  membersRange: [number, number];
  monthlyContributionRange: [number, number];
  sortBy: 'recent' | 'members' | 'balance' | 'name';
}

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Club[];
  loading: boolean;
  hasSearched: boolean;
}

const investmentFocusOptions = [
  // Social Impact & Community Categories
  'Access to Education',
  'Agriculture Innovation',
  'Animal Welfare',
  'Arts and Culture',
  'Arts Education',
  'Carbon Footprint Reduction',
  'Charity',
  'Civic Engagement',
  'Clean Energy',
  'Clean Water',
  'Climate Change',
  'Community Empowerment',
  'Community Health',
  'Community Support',
  'Crisis Response',
  'Cultural Preservation',
  'Digital Literacy',
  'Disability Support',
  'Disaster Preparedness',
  'Eco-Tourism',
  'Economic Development',
  'Education',
  'Elderly Care',
  'Energy Efficiency',
  'Environment',
  'Environmental Justice',
  'Family Services',
  'Financial Literacy',
  'Food Security',
  'Forestry Management',
  'Gender Equality',
  'Green Architecture',
  'Health',
  'Honor & Memorial',
  'Housing and Homelessness',
  'Humanitarian Aid',
  'Innovation and Research',
  'Innovation in Education',
  'Job Creation',
  'Local Business Support',
  'Local Farmers Support',
  'Marine Conservation',
  'Organic Farming',
  'Peer Support',
  'Plastic Recycling',
  'Poverty Reduction',
  'Public Health',
  'Public Safety',
  'Public Transport',
  'Renewable Energy',
  'Rural Development',
  'Social Enterprise',
  'Sports and Recreation',
  'Sustainable Agriculture',
  'Sustainable Transport',
  'Technology',
  'Urban Development',
  'Urban Farming',
  'Veterans Support',
  'Water and Sanitation',
  'Wildlife Conservation',
  'Women’s Empowerment',
  'Youth Development',

  // Technology & Innovation Categories
  'AI & Machine Learning',
  'Augmented Reality',
  'Biotechnology',
  'Blockchain & Crypto',
  'Clean Energy Tech',
  'Climate Tech',
  'Consumer Apps',
  'Creator Economy',
  'Cybersecurity',
  'Data Analytics',
  'Developer Tools',
  'Digital Health',
  'EdTech',
  'E-commerce',
  'Enterprise Software',
  'FinTech',
  'FoodTech',
  'Future of Work',
  'Gaming',
  'GreenTech',
  'Hardware',
  'HealthTech',
  'Impact Investing',
  'Industrial Tech',
  'InsurTech',
  'IoT',
  'LegalTech',
  'Logistics',
  'Marketplaces',
  'Mobility',
  'NFTs & Web3',
  'PropTech',
  'Quantum Computing',
  'Real Estate Tech',
  'Robotics',
  'SaaS',
  'SpaceTech',
  'SportsTech',
  'Supply Chain Tech',
  'Sustainability',
  'Telecom',
  'TravelTech',
  'Virtual Reality',
  'Wearables',

  // Business & Specialized Tech Categories
  'AgTech',
  'B2B Software',
  'Cloud Computing',
  'Crowdfunding Platforms',
  'Digital Banking',
  'Digital Media',
  'FemTech',
  'GovTech',
  'HR Tech',
  'MarTech',
  'Micro-investing',
  'Open Source',
  'Payments',
  'Personal Finance',
  'Retail Tech',
  'Smart Cities',
  'Social Impact',
  'Social Networking',
  'Voice Technology',

  // Legacy categories (keeping for backward compatibility)
  'Technology',
  'Real Estate',
  'Renewable Energy',
  'Healthcare',
  'Finance',
  'Agriculture',
  'Education',
  'Entertainment',
  'E-commerce',
  'Manufacturing',
  'Transportation',
  'Sustainability',
  'Artificial Intelligence',
  'Blockchain',
  'Biotechnology',
];

const ClubSearchTab: React.FC = () => {
  const { token } = useAuth();
  const [state, setState] = useState<SearchState>({
    query: '',
    filters: {
      investmentFocus: [],
      clubType: [],
      membersRange: [1, 50],
      monthlyContributionRange: [0, 1000],
      sortBy: 'recent',
    },
    results: [],
    loading: false,
    hasSearched: false,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate max values from actual club data
  const maxValues = useMemo(() => {
    if (allClubs.length === 0) return { maxMembers: 50, maxContribution: 1000 };

    const maxMembers = Math.max(
      ...allClubs.map((club) => club.current_members_count),
    );
    const maxContribution = Math.max(
      ...allClubs.map((club) => club.minimum_monthly_contribution),
    );

    return {
      maxMembers: Math.ceil(maxMembers / 10) * 10, // Round up to nearest 10
      maxContribution: Math.ceil(maxContribution / 100) * 100, // Round up to nearest 100
    };
  }, [allClubs]);

  // Load all clubs on component mount
  useEffect(() => {
    const loadAllClubs = async () => {
      if (!token) return;

      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await clubService.getClubs(token, 1, 100);
        setAllClubs(response.clubs);
      } catch (error) {
        console.error('Failed to load clubs:', error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadAllClubs();
  }, [token]);

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

  // Update ranges when max values change
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        membersRange: [
          1,
          Math.max(prev.filters.membersRange[1], maxValues.maxMembers),
        ],
        monthlyContributionRange: [
          0,
          Math.max(
            prev.filters.monthlyContributionRange[1],
            maxValues.maxContribution,
          ),
        ],
      },
    }));
  }, [maxValues]);

  // Perform search when query or filters change
  useEffect(() => {
    if (allClubs.length === 0) return;

    const performSearch = () => {
      setState((prev) => ({ ...prev, loading: true }));

      setTimeout(() => {
        const filteredClubs = allClubs.filter((club) => {
          // Text search
          const matchesQuery =
            !state.query ||
            club.name.toLowerCase().includes(state.query.toLowerCase()) ||
            club.mission.toLowerCase().includes(state.query.toLowerCase()) ||
            club.investment_focus
              .toLowerCase()
              .includes(state.query.toLowerCase());

          // Investment focus filter
          const matchesFocus =
            state.filters.investmentFocus.length === 0 ||
            state.filters.investmentFocus.some((focus) =>
              club.investment_focus.toLowerCase().includes(focus.toLowerCase()),
            );

          // Club type filter
          const matchesType =
            state.filters.clubType.length === 0 ||
            state.filters.clubType.includes(club.club_type);

          // Members count filter
          const [minMembers, maxMembers] = state.filters.membersRange;
          const matchesMembers =
            club.current_members_count >= minMembers &&
            club.current_members_count <= maxMembers;

          // Monthly contribution filter
          const [minContribution, maxContribution] =
            state.filters.monthlyContributionRange;
          const matchesContribution =
            club.minimum_monthly_contribution >= minContribution &&
            club.minimum_monthly_contribution <= maxContribution;

          return (
            matchesQuery &&
            matchesFocus &&
            matchesType &&
            matchesMembers &&
            matchesContribution
          );
        });

        // Sort results
        const sortedClubs = [...filteredClubs].sort((a, b) => {
          switch (state.filters.sortBy) {
            case 'members':
              return b.current_members_count - a.current_members_count;
            case 'balance':
              return (
                b.financials.current_balance - a.financials.current_balance
              );
            case 'name':
              return a.name.localeCompare(b.name);
            case 'recent':
            default:
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
          }
        });

        setState((prev) => ({
          ...prev,
          results: sortedClubs,
          loading: false,
          hasSearched: true,
        }));
      }, 300);
    };

    performSearch();
  }, [state.query, state.filters, allClubs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, query: e.target.value }));
  };

  const handleFilterChange = (filterKey: keyof SearchFilters, value: any) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterKey]: value,
      },
    }));
  };

  const clearFilters = () => {
    setState((prev) => ({
      ...prev,
      filters: {
        investmentFocus: [],
        clubType: [],
        membersRange: [1, maxValues.maxMembers],
        monthlyContributionRange: [0, maxValues.maxContribution],
        sortBy: 'recent',
      },
    }));
  };

  const toggleInvestmentFocus = (focus: string) => {
    const currentFocus = state.filters.investmentFocus;
    const newFocus = currentFocus.includes(focus)
      ? currentFocus.filter((f) => f !== focus)
      : [...currentFocus, focus];

    handleFilterChange('investmentFocus', newFocus);
  };

  const toggleClubType = (type: string) => {
    const currentTypes = state.filters.clubType;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    handleFilterChange('clubType', newTypes);
  };

  const handleClubClick = async (club: Club) => {
    setSelectedClub(club);
    await loadClubMembers(club);
    setIsModalOpen(true);
  };

  // Memoized statistics
  const searchStats = useMemo(() => {
    return {
      totalClubs: allClubs.length,
      averageMembers:
        Math.round(
          allClubs.reduce((acc, club) => acc + club.current_members_count, 0) /
            allClubs.length,
        ) || 0,
      averageBalance:
        Math.round(
          allClubs.reduce(
            (acc, club) => acc + club.financials.current_balance,
            0,
          ) / allClubs.length,
        ) || 0,
    };
  }, [allClubs]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const getClubIcon = (club: Club) => {
    const focus = club.investment_focus?.toLowerCase();
    if (focus?.includes('tech') || focus?.includes('software')) {
      return <TrendingUp className="w-4 h-4" />;
    }
    if (focus?.includes('real estate') || focus?.includes('property')) {
      return <Target className="w-4 h-4" />;
    }
    return <TrendingUp className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Discover Investment Clubs
          </h1>
          <p className="text-gray-600">
            Find the perfect investment club to join
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-50 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clubs by name, mission, or investment focus..."
                value={state.query}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-50 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border font-medium flex items-center gap-2 transition-colors ${
                showFilters
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-700 border-gray-50 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.values(state.filters).some((filter) =>
                Array.isArray(filter)
                  ? filter.length > 0
                  : filter !== 'recent' &&
                    (Array.isArray(filter)
                      ? filter.some(
                          (val) =>
                            val !== 0 &&
                            val !== 1 &&
                            val !== 50 &&
                            val !== 1000,
                        )
                      : true),
              ) && (
                <span className="bg-emerald-500 text-white w-4 h-4 text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-50 p-4 mb-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Investment Focus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Investment Focus
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {investmentFocusOptions.map((focus) => (
                      <label
                        key={focus}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={state.filters.investmentFocus.includes(
                            focus,
                          )}
                          onChange={() => toggleInvestmentFocus(focus)}
                          className="border-gray-50 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{focus}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Club Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Club Type
                  </label>
                  <div className="space-y-2">
                    {['public', 'private'].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={state.filters.clubType.includes(type)}
                          onChange={() => toggleClubType(type)}
                          className="border-gray-50 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stacked Range Filters */}
                <div className="space-y-6">
                  {/* Members Range Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Members Range
                    </label>
                    <AdvancedSlider
                      value={state.filters.membersRange}
                      onValueChange={(value: number[]) =>
                        handleFilterChange(
                          'membersRange',
                          value as [number, number],
                        )
                      }
                      min={1}
                      max={maxValues.maxMembers}
                      step={1}
                      showValue={true}
                      showMinMax={true}
                      formatValue={(value: number | number[]) =>
                        `${Array.isArray(value) ? value[0] : value} members`
                      }
                      variant="minimal"
                    />
                  </div>

                  {/* Monthly Contribution Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Monthly Contribution
                    </label>
                    <AdvancedSlider
                      value={state.filters.monthlyContributionRange}
                      onValueChange={(value: number | number[]) =>
                        handleFilterChange(
                          'monthlyContributionRange',
                          Array.isArray(value)
                            ? (value as [number, number])
                            : [value, value],
                        )
                      }
                      min={0}
                      max={maxValues.maxContribution}
                      step={10}
                      showValue={true}
                      showMinMax={true}
                      formatValue={(value: number | number[]) =>
                        formatCurrency(Array.isArray(value) ? value[0] : value)
                      }
                      variant="minimal"
                    />
                  </div>
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sort By
                    </label>
                    <Select
                      value={state.filters.sortBy}
                      onValueChange={(
                        value: 'recent' | 'members' | 'balance' | 'name',
                      ) => handleFilterChange('sortBy', value)}
                    >
                      <SelectTrigger className="w-full rounded-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-full rounded-none">
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="members">Most Members</SelectItem>
                        <SelectItem value="balance">Highest Balance</SelectItem>
                        <SelectItem value="name">Alphabetical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div>
          {/* Results Header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {state.hasSearched ? 'Search Results' : 'All Clubs'}
            </h2>
            <p className="text-sm text-gray-600">
              {state.results.length}{' '}
              {state.results.length === 1 ? 'club' : 'clubs'} found
              {state.query && ` for "${state.query}"`}
            </p>
          </div>

          {/* Loading State */}
          {state.loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {/* Results Grid - 2 cards per row */}
          {!state.loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.results.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-50 hover:border-emerald-500 transition-colors cursor-pointer"
                  onClick={() => handleClubClick(club)}
                >
                  {/* Club Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight">
                        {club.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(club.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                      {club.mission}
                    </p>
                  </div>

                  {/* Club Stats */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{club.current_members_count} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {formatCurrency(
                            club.minimum_monthly_contribution,
                            club.currency,
                          )}
                          /mo
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <div className="text-base font-bold text-emerald-700">
                        {formatCurrency(
                          club.financials.current_balance,
                          club.currency,
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Club Balance</div>
                    </div>

                    {/* Investment Focus and Type */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Target className="w-4 h-4" />
                        <span className="capitalize">
                          {deslugify(club.investment_focus)}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium capitalize flex items-center gap-1 ${
                          club.club_type === 'public'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-orange-600 bg-orange-50'
                        }`}
                      >
                        {club.club_type === 'public' ? (
                          <Globe className="w-3 h-3" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                        {club.club_type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!state.loading &&
            state.results.length === 0 &&
            state.hasSearched && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No clubs found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {state.query
                    ? `No clubs match your search for "${state.query}". Try adjusting your search terms or filters.`
                    : 'No clubs match your current filters. Try adjusting your filter criteria.'}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          {/* Initial State - Before Search */}
          {!state.loading &&
            !state.hasSearched &&
            state.results.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Exploring Investment Clubs
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Use the search bar above to find investment clubs that match
                  your interests and criteria.
                </p>
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
          onMembershipUpdate={() => {}}
        />
      )}
    </div>
  );
};

export default ClubSearchTab;
