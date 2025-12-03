import { useState, useMemo } from 'react';
import { Briefcase, TrendingUp, Sparkles } from 'lucide-react';
import { StatsOverview } from './StatsOverview';
import { DealFilters } from './DealFilters';
import { DealCard } from './DealCard';
import { DealDetailModal } from './DealDetailModal';
import { Badge } from '@/app/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Deal, deals } from './dealRoomData';

export function DealRoom() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.founderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry =
        selectedIndustry === 'All Industries' ||
        deal.industry === selectedIndustry;

      const matchesStage =
        selectedStage === 'All Stages' || deal.stage === selectedStage;

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'active' && deal.status === 'Active') ||
        (activeTab === 'closing' && deal.status === 'Closing Soon') ||
        (activeTab === 'new' && deal.status === 'New') ||
        (activeTab === 'funded' && deal.status === 'Funded');

      return matchesSearch && matchesIndustry && matchesStage && matchesTab;
    });
  }, [searchQuery, selectedIndustry, selectedStage, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-white" />
        <div className="relative max-w-2xl mx-auto px-4 py-12">
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Deal Room
              </h1>
              <p className="text-lg text-gray-700">
                Connect directly with vetted founders, explore investment
                opportunities, and close deals — all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div>
          <StatsOverview />
        </div>

        {/* Filters & Tabs */}
        <div className="space-y-6">
          <DealFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            selectedStage={selectedStage}
            onStageChange={setSelectedStage}
          />

          {/* Horizontally Scrollable Tabs for Mobile */}
          <div className="w-full">
            {/* Desktop Tabs */}
            <div className="hidden md:block">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-100">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    All Deals
                    <Badge className="ml-2 bg-emerald-100 text-emerald-600">
                      {deals.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger
                    value="closing"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Closing Soon
                  </TabsTrigger>
                  <TabsTrigger
                    value="new"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    New
                  </TabsTrigger>
                  <TabsTrigger
                    value="funded"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Funded
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Mobile Tabs - Horizontally Scrollable */}
            <div className="md:hidden w-full">
              <div className="relative">
                {/* Scroll Container */}
                <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  <style jsx>{`
                    .scrollbar-hide {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  <button
                    onClick={() => setActiveTab('all')}
                    className={`shrink-0 px-4 py-2 font-medium ${
                      activeTab === 'all'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Deals
                    <Badge
                      className={`ml-2 ${activeTab === 'all' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-600'}`}
                    >
                      {deals.length}
                    </Badge>
                  </button>

                  <button
                    onClick={() => setActiveTab('active')}
                    className={`shrink-0 px-4 py-2 font-medium ${
                      activeTab === 'active'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Active
                  </button>

                  <button
                    onClick={() => setActiveTab('closing')}
                    className={`shrink-0 px-4 py-2 font-medium ${
                      activeTab === 'closing'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Closing Soon
                  </button>

                  <button
                    onClick={() => setActiveTab('new')}
                    className={`shrink-0 px-4 py-2 font-medium ${
                      activeTab === 'new'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    New
                  </button>

                  <button
                    onClick={() => setActiveTab('funded')}
                    className={`shrink-0 px-4 py-2 font-medium ${
                      activeTab === 'funded'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Funded
                  </button>
                </div>

                {/* Gradient fade effect for scroll indication */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Deal Grid - 2 cards per row */}
        <div>
          {filteredDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDeals.map((deal) => (
                <div key={deal.id}>
                  <DealCard deal={deal} onViewDetails={setSelectedDeal} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No deals found
              </h3>
              <p className="text-gray-700">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Deal Detail Modal */}
      <DealDetailModal
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
      />
    </div>
  );
}