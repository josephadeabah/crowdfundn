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
  MapPin,
  Calendar,
  Star,
  Building2,
  Target,
  Zap,
  Globe,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Club } from '../clubTypes';
import { clubService } from '../clubservice';

interface SearchFilters {
  investmentFocus: string[];
  clubType: string[];
  minMembers: number | null;
  maxMembers: number | null;
  minMonthlyContribution: number | null;
  maxMonthlyContribution: number | null;
  location: string;
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
      minMembers: null,
      maxMembers: null,
      minMonthlyContribution: null,
      maxMonthlyContribution: null,
      location: '',
      sortBy: 'recent',
    },
    results: [],
    loading: false,
    hasSearched: false,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [allClubs, setAllClubs] = useState<Club[]>([]);

  // Load all clubs on component mount
  useEffect(() => {
    const loadAllClubs = async () => {
      if (!token) return;

      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await clubService.getClubs(token, 1, 100); // Load more clubs for search
        setAllClubs(response.clubs);
      } catch (error) {
        console.error('Failed to load clubs:', error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadAllClubs();
  }, [token]);

  // Perform search when query or filters change
  useEffect(() => {
    if (allClubs.length === 0) return;

    const performSearch = () => {
      setState((prev) => ({ ...prev, loading: true }));

      // Simulate API delay for better UX
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
          const matchesMinMembers =
            !state.filters.minMembers ||
            club.current_members_count >= state.filters.minMembers;
          const matchesMaxMembers =
            !state.filters.maxMembers ||
            club.current_members_count <= state.filters.maxMembers;

          // Monthly contribution filter
          const matchesMinContribution =
            !state.filters.minMonthlyContribution ||
            club.minimum_monthly_contribution >=
              state.filters.minMonthlyContribution;
          const matchesMaxContribution =
            !state.filters.maxMonthlyContribution ||
            club.minimum_monthly_contribution <=
              state.filters.maxMonthlyContribution;

          return (
            matchesQuery &&
            matchesFocus &&
            matchesType &&
            matchesMinMembers &&
            matchesMaxMembers &&
            matchesMinContribution &&
            matchesMaxContribution
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
        minMembers: null,
        maxMembers: null,
        minMonthlyContribution: null,
        maxMonthlyContribution: null,
        location: '',
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
      popularFocus: investmentFocusOptions.reduce(
        (popular, focus) => {
          const count = allClubs.filter((club) =>
            club.investment_focus.toLowerCase().includes(focus.toLowerCase()),
          ).length;
          return count > popular.count ? { focus, count } : popular;
        },
        { focus: 'Technology', count: 0 },
      ),
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

  const getClubTypeIcon = (clubType: string) => {
    return clubType === 'public' ? (
      <Globe className="w-4 h-4" />
    ) : (
      <Lock className="w-4 h-4" />
    );
  };

  const getClubTypeColor = (clubType: string) => {
    return clubType === 'public'
      ? 'text-blue-600 bg-blue-50'
      : 'text-orange-600 bg-orange-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Discover Investment Clubs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect investment club to join. Search by focus, size,
            contribution level, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clubs by name, mission, or investment focus..."
                value={state.query}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                showFilters
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.values(state.filters).some((filter) =>
                Array.isArray(filter)
                  ? filter.length > 0
                  : filter !== null && filter !== '' && filter !== 'recent',
              ) && (
                <span className="bg-emerald-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {searchStats.totalClubs}
              </div>
              <div className="text-sm text-gray-600">Total Clubs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {searchStats.averageMembers}
              </div>
              <div className="text-sm text-gray-600">Avg Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(searchStats.averageBalance)}
              </div>
              <div className="text-sm text-gray-600">Avg Balance</div>
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
              className="bg-white rounded-lg border border-gray-200 p-6 mb-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
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
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Members Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Members Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={state.filters.minMembers || ''}
                      onChange={(e) =>
                        handleFilterChange(
                          'minMembers',
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={state.filters.maxMembers || ''}
                      onChange={(e) =>
                        handleFilterChange(
                          'maxMembers',
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Monthly Contribution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Monthly Contribution
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={state.filters.minMonthlyContribution || ''}
                      onChange={(e) =>
                        handleFilterChange(
                          'minMonthlyContribution',
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={state.filters.maxMonthlyContribution || ''}
                      onChange={(e) =>
                        handleFilterChange(
                          'maxMonthlyContribution',
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sort By
                  </label>
                  <select
                    value={state.filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange('sortBy', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="members">Most Members</option>
                    <option value="balance">Highest Balance</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div>
          {/* Results Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {state.hasSearched ? 'Search Results' : 'All Clubs'}
              </h2>
              <p className="text-sm text-gray-600">
                {state.results.length}{' '}
                {state.results.length === 1 ? 'club' : 'clubs'} found
                {state.query && ` for "${state.query}"`}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {state.loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {/* Results Grid */}
          {!state.loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.results.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                >
                  {/* Club Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {club.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getClubTypeColor(club.club_type)}`}
                      >
                        {getClubTypeIcon(club.club_type)}
                        {club.club_type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {club.mission}
                    </p>
                  </div>

                  {/* Club Stats */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{club.current_members_count} members</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
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

                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-emerald-700">
                        {formatCurrency(
                          club.financials.current_balance,
                          club.currency,
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Club Balance</div>
                    </div>

                    {/* Investment Focus */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Target className="w-4 h-4" />
                      <span className="capitalize">
                        {club.investment_focus}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm">
                      View Club Details
                    </button>
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
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
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Exploring Investment Clubs
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Use the search bar above to find investment clubs that match
                  your interests and criteria. You can filter by investment
                  focus, club size, contribution level, and more.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ClubSearchTab;
