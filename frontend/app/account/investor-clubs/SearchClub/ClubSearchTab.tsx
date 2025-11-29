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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Club } from '../clubTypes';
import { clubService } from '../clubservice';
import ClubDetailsModal from '../club-details/ClubDetailsModal';
import { AdvancedSlider } from '../components/advanced-slider/AdvancedSlider';

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
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

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

  const handleClubClick = (club: Club) => {
    setSelectedClub(club);
    setIsModalOpen(true);
  };

  const toggleFilterSection = (section: string) => {
    setExpandedFilter(expandedFilter === section ? null : section);
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

  const hasActiveFilters = Object.values(state.filters).some((filter) =>
    Array.isArray(filter)
      ? filter.length > 0
      : filter !== 'recent' &&
        (Array.isArray(filter)
          ? filter.some(
              (val) => val !== 0 && val !== 1 && val !== 50 && val !== 1000,
            )
          : true),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Discover Investment Clubs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect investment club that matches your financial goals
            and interests
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clubs by name, mission, or investment focus..."
                value={state.query}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                showFilters
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-emerald-500'
              } ${hasActiveFilters ? 'border-emerald-500' : ''}`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="bg-emerald-500 text-white w-6 h-6 text-xs rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {searchStats.totalClubs}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Total Clubs
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {searchStats.averageMembers}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Avg Members
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(searchStats.averageBalance)}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Avg Balance
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Filter Clubs
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Investment Focus - Mobile Accordion */}
                <div className="lg:hidden">
                  <button
                    onClick={() => toggleFilterSection('investment')}
                    className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">
                      Investment Focus
                    </span>
                    {expandedFilter === 'investment' ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedFilter === 'investment' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                          {investmentFocusOptions.map((focus) => (
                            <label
                              key={focus}
                              className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={state.filters.investmentFocus.includes(
                                  focus,
                                )}
                                onChange={() => toggleInvestmentFocus(focus)}
                                className="w-4 h-4 border-gray-300 text-emerald-600 focus:ring-emerald-500 rounded"
                              />
                              <span className="text-sm text-gray-700 font-medium">
                                {focus}
                              </span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Desktop Investment Focus */}
                <div className="hidden lg:block">
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Investment Focus
                  </label>
                  <div className="grid grid-cols-3 xl:grid-cols-5 gap-4 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                    {investmentFocusOptions.map((focus) => (
                      <label
                        key={focus}
                        className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white border border-gray-200 hover:border-emerald-500 transition-colors shadow-sm"
                      >
                        <input
                          type="checkbox"
                          checked={state.filters.investmentFocus.includes(
                            focus,
                          )}
                          onChange={() => toggleInvestmentFocus(focus)}
                          className="w-4 h-4 border-gray-300 text-emerald-600 focus:ring-emerald-500 rounded"
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          {focus}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Club Type */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Club Type
                    </label>
                    <div className="space-y-3">
                      {['public', 'private'].map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={state.filters.clubType.includes(type)}
                            onChange={() => toggleClubType(type)}
                            className="w-4 h-4 border-gray-300 text-emerald-600 focus:ring-emerald-500 rounded"
                          />
                          <span className="text-sm text-gray-700 font-medium capitalize">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Members Range Slider */}
                  <div className="lg:col-span-2">
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Members Range
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg">
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
                        variant="default"
                        className="px-2"
                      />
                    </div>
                  </div>

                  {/* Monthly Contribution Slider */}
                  <div className="lg:col-span-2">
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Monthly Contribution
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg">
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
                          formatCurrency(
                            Array.isArray(value) ? value[0] : value,
                          )
                        }
                        variant="default"
                        className="px-2"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Sort By
                    </label>
                    <select
                      value={state.filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange('sortBy', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 bg-white"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="members">Most Members</option>
                      <option value="balance">Highest Balance</option>
                      <option value="name">Alphabetical</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div>
          {/* Results Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {state.hasSearched ? 'Search Results' : 'All Clubs'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {state.results.length}{' '}
                  {state.results.length === 1 ? 'club' : 'clubs'} found
                  {state.query && (
                    <span className="text-emerald-600 font-medium">
                      {' '}
                      for "{state.query}"
                    </span>
                  )}
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {state.loading && (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {/* Results Grid */}
          {!state.loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {state.results.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-500 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleClubClick(club)}
                >
                  {/* Club Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                        {club.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 text-xs bg-gray-50 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(club.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {club.mission}
                    </p>
                  </div>

                  {/* Club Stats */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Users className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">
                          {club.current_members_count} members
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">
                          {formatCurrency(
                            club.minimum_monthly_contribution,
                            club.currency,
                          )}
                          /mo
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xl font-bold text-emerald-700">
                        {formatCurrency(
                          club.financials.current_balance,
                          club.currency,
                        )}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        Club Balance
                      </div>
                    </div>

                    {/* Investment Focus and Type */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium capitalize">
                          {club.investment_focus}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full capitalize flex items-center gap-1 ${
                          club.club_type === 'public'
                            ? 'text-blue-700 bg-blue-100'
                            : 'text-orange-700 bg-orange-100'
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
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No clubs found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8 text-lg">
                  {state.query
                    ? `No clubs match your search for "${state.query}". Try adjusting your search terms or filters.`
                    : 'No clubs match your current filters. Try adjusting your filter criteria.'}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-lg transition-colors shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          {/* Initial State - Before Search */}
          {!state.loading &&
            !state.hasSearched &&
            state.results.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Start Exploring Investment Clubs
                </h3>
                <p className="text-gray-600 max-w-md mx-auto text-lg">
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
          members={[]}
          onMembershipUpdate={() => {}}
        />
      )}
    </div>
  );
};

export default ClubSearchTab;
