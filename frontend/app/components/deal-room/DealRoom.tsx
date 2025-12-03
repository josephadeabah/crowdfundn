import { useState, useMemo } from 'react';
import { Briefcase, TrendingUp, Sparkles } from 'lucide-react';
import { StatsOverview } from './StatsOverview';
import { DealFilters } from './DealFilters';
import { DealCard } from './DealCard';
import { DealDetailModal } from './DealDetailModal';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
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
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-emerald-100/20 border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl gradient-emerald shadow-glow">
                  <Briefcase className="w-6 h-6 text-primary-foreground" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Live Deals
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                Deal Room
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Connect directly with vetted founders, explore investment
                opportunities, and close deals — all in one place.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-card">
                <TrendingUp className="w-4 h-4 mr-2" />
                My Investments
              </Button>
              <Button className="gradient-emerald text-primary-foreground shadow-glow">
                Submit Your Deal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <section className="animate-slide-up">
          <StatsOverview />
        </section>

        {/* Filters & Tabs */}
        <section
          className="space-y-6 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <DealFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            selectedStage={selectedStage}
            onStageChange={setSelectedStage}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all">
                All Deals
                <Badge
                  variant="secondary"
                  className="ml-2 bg-primary/10 text-primary"
                >
                  {deals.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="closing">Closing Soon</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="funded">Funded</TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        {/* Deal Grid */}
        <section
          className="animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          {filteredDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal, index) => (
                <div
                  key={deal.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <DealCard deal={deal} onViewDetails={setSelectedDeal} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No deals found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Deal Detail Modal */}
      <DealDetailModal
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
      />
    </div>
  );
}
