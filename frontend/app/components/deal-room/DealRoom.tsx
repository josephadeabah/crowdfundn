// app/components/deal-room/DealRoom.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Briefcase, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { DealFilters } from './DealFilters';
import { DealCard } from './DealCard';
import { DealDetailModal } from './DealDetailModal';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Deal } from './services/dealRoomApi';
import { toast } from 'sonner';
import { useDealRoomApi } from './hooks/useDealRoom';

export function DealRoom() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const {
    deals,
    stats,
    industries,
    stages,
    isLoading,
    isStatsLoading,
    error,
    page,
    totalPages,
    totalCount,
    loadDeals,
    setPage,
  } = useDealRoomApi();

  // Load deals when filters change
  useEffect(() => {
    loadDealsWithFilters();
  }, [page, selectedIndustry, selectedStage, searchQuery]);

  const loadDealsWithFilters = useCallback(() => {
    const filters = {
      industry:
        selectedIndustry !== 'All Industries' ? selectedIndustry : undefined,
      stage: selectedStage !== 'All Stages' ? selectedStage : undefined,
      search: searchQuery || undefined,
    };

    loadDeals(page, filters);
  }, [page, selectedIndustry, selectedStage, searchQuery, loadDeals]);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'active' && deal.status === 'Active') ||
        (activeTab === 'closing' && deal.status === 'Closing Soon') ||
        (activeTab === 'new' && deal.status === 'New') ||
        (activeTab === 'funded' && deal.status === 'Funded');

      return matchesTab;
    });
  }, [deals, activeTab]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setPage(1);
    },
    [setPage],
  );

  const handleIndustryChange = useCallback(
    (value: string) => {
      setSelectedIndustry(value);
      setPage(1);
    },
    [setPage],
  );

  const handleStageChange = useCallback(
    (value: string) => {
      setSelectedStage(value);
      setPage(1);
    },
    [setPage],
  );

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
      setPage(1);
    },
    [setPage],
  );

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleRefresh = () => {
    loadDealsWithFilters();
  };

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-white" />
        <div className="relative max-w-3xl mx-auto ">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Private Deal Room
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl">
                Connect directly with vetted founders, explore investment
                opportunities, and close deals — all in one place.
              </p>
            </div>

            {/* Stats */}
            {!isStatsLoading && stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white p-4">
                  <p className="text-sm text-gray-600">Total Deals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalDeals}
                  </p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-sm text-gray-600">Active Deals</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {stats.activeDeals}
                  </p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-sm text-gray-600">Total Raised</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(stats.totalRaised / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.successRate}%
                  </p>
                </div>
              </div>
            )}

            {isStatsLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
                <p className="text-gray-600">Loading stats...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Filters & Tabs */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Deals
            </h2>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="rounded-none border border-gray-50"
            >
              <Loader2
                className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>

          <DealFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            selectedIndustry={selectedIndustry}
            onIndustryChange={handleIndustryChange}
            selectedStage={selectedStage}
            onStageChange={handleStageChange}
            industries={industries}
            stages={stages}
            isLoading={isLoading}
          />

          {/* Tabs */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {['all', 'active', 'closing', 'new', 'funded'].map((tab) => {
                const tabLabels = {
                  all: 'All Deals',
                  active: 'Active',
                  closing: 'Closing Soon',
                  new: 'New',
                  funded: 'Funded',
                };

                return (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`shrink-0 px-4 py-2 font-medium ${
                      activeTab === tab
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tabLabels[tab as keyof typeof tabLabels]}
                    {tab === 'all' && (
                      <Badge
                        className={`ml-2 ${activeTab === 'all' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-600'}`}
                      >
                        {totalCount}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deal Grid */}
        <div>
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading deals...</p>
            </div>
          ) : filteredDeals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => (
                  <div key={deal.id}>
                    <DealCard deal={deal} onViewDetails={setSelectedDeal} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={page === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={page === totalPages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No deals found
              </h3>
              <p className="text-gray-700">
                {searchQuery ||
                selectedIndustry !== 'All Industries' ||
                selectedStage !== 'All Stages'
                  ? 'Try adjusting your filters or search query'
                  : 'No deals available at the moment. Check back soon!'}
              </p>
              {(searchQuery ||
                selectedIndustry !== 'All Industries' ||
                selectedStage !== 'All Stages') && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustry('All Industries');
                    setSelectedStage('All Stages');
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Deal Detail Modal */}
      <DealDetailModal
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onDealUpdate={handleRefresh}
      />
    </div>
  );
}
