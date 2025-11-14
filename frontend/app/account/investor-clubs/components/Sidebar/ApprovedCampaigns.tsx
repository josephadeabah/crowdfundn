import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  List,
  RefreshCw,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Vote,
} from 'lucide-react';

interface Club {
  id: string;
  slug: string;
  name: string;
  mission: string;
  investment_focus: string;
  current_members_count: number;
  total_contributions: number;
  total_invested: number;
  current_balance: number;
  currency: string;
  currency_symbol: string;
  status: 'active' | 'inactive' | 'suspended';
  access_type: 'open' | 'restricted' | 'certified';
  created_at: string;
  updated_at: string;
}

interface ClubDashboardProps {
  club: Club;
}

interface ClubPortfolioData {
  approved_campaigns_count: number;
  pending_investments: number;
  total_contributions: number;
  current_balance: number;
}

interface VotingStats {
  total_votes: number;
  yes_votes: number;
  no_votes: number;
  approval_percentage: number;
  threshold_met: boolean;
}

interface DashboardApprovedCampaign {
  id: string;
  campaign: {
    id: string;
    title: string;
    description: string;
    category: string;
    goal_amount: number;
    current_amount: number;
    currency: string;
    currency_symbol: string;
    fundraiser: {
      id: string;
      name: string;
    };
  };
  club_investment: {
    id: string;
    proposed_amount: number;
    proposed_share_percentage: number;
    voting_stats: VotingStats;
  };
  approved_at: string;
  voting_stats?: VotingStats;
}

interface ClubInvestment {
  id: string;
  campaign: {
    id: string;
    title: string;
    description: string;
    category: string;
    goal_amount: number;
    current_amount: number;
    currency: string;
    currency_symbol: string;
  };
  investment_amount: number;
  status: 'pending' | 'voting' | 'approved' | 'rejected';
  voting_session_id: string;
  voting_stats: VotingStats;
}

const ClubDashboard: React.FC<ClubDashboardProps> = ({ club }) => {
  const { token } = useAuth();
  const [approvedCampaigns, setApprovedCampaigns] = useState<
    DashboardApprovedCampaign[]
  >([]);
  const [portfolioData, setPortfolioData] = useState<ClubPortfolioData | null>(
    null,
  );
  const [activeInvestments, setActiveInvestments] = useState<ClubInvestment[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setStatsLoading(true);

      // Fetch approved campaigns
      const approvedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${club.slug}/approved_campaigns`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Fetch portfolio overview
      const portfolioResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${club.slug}/portfolio`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Fetch active investments
      const investmentsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${club.slug}/investments?status=voting`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (
        !approvedResponse.ok ||
        !portfolioResponse.ok ||
        !investmentsResponse.ok
      ) {
        throw new Error('Failed to fetch dashboard data');
      }

      const approvedData = await approvedResponse.json();
      const portfolioData = await portfolioResponse.json();
      const investmentsData = await investmentsResponse.json();

      if (approvedData.success) {
        setApprovedCampaigns(approvedData.approved_campaigns || []);
      }

      if (portfolioData.success) {
        setPortfolioData(portfolioData.portfolio);
      }

      if (investmentsData.success) {
        setActiveInvestments(investmentsData.investments || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [club.slug, token]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Stats Cards Component
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{club.current_members_count}</div>
          <p className="text-xs text-muted-foreground">Active club members</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Contributions
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {club.currency_symbol}
            {club.total_contributions.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total funds contributed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {club.currency_symbol}
            {club.current_balance.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Available for investments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Votes</CardTitle>
          <Vote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeInvestments.length}</div>
          <p className="text-xs text-muted-foreground">
            Proposals being voted on
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // Portfolio Overview Component
  const PortfolioOverview = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
        <CardDescription>
          Current status of your club's investment activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {statsLoading ? (
          <div className="flex justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : portfolioData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approved Campaigns</span>
                <Badge variant="secondary">
                  {portfolioData.approved_campaigns_count}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Campaigns approved for investment
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Votes</span>
                <Badge variant="outline">
                  {portfolioData.pending_investments}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Active investment proposals
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Available Funds</span>
                <span className="text-sm font-bold text-green-600">
                  {club.currency_symbol}
                  {portfolioData.current_balance.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for new investments
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Unable to load portfolio data
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Approved Campaigns Section
  const ApprovedCampaignsSection = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Approved Campaigns</CardTitle>
            <CardDescription>
              Campaigns that have been approved by club members
            </CardDescription>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : approvedCampaigns.length === 0 ? (
          <div className="text-center py-8">
            <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No Approved Campaigns
            </h3>
            <p className="text-sm text-muted-foreground">
              Approved campaigns will appear here after successful voting.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {approvedCampaigns.map((campaign: DashboardApprovedCampaign) => (
              <Card
                key={campaign.id}
                className="border-green-200 bg-green-50/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">
                      {campaign.campaign.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      Approved
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {campaign.campaign.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Goal:</span>
                      <span className="font-medium">
                        {campaign.campaign.currency_symbol}
                        {campaign.campaign.goal_amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Raised:</span>
                      <span className="font-medium">
                        {campaign.campaign.currency_symbol}
                        {campaign.campaign.current_amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="secondary" className="text-xs">
                        {campaign.campaign.category}
                      </Badge>
                    </div>

                    {campaign.club_investment?.voting_stats && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">
                            Approval:
                          </span>
                          <span className="font-medium text-green-600">
                            {
                              campaign.club_investment.voting_stats
                                .approval_percentage
                            }
                            % Yes
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Approved:</span>
                        <span className="font-medium">
                          {new Date(campaign.approved_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Active Investments Section
  const ActiveInvestmentsSection = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Active Investment Proposals</CardTitle>
        <CardDescription>
          Currently active proposals awaiting member votes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeInvestments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2" />
            <p>No active investment proposals at the moment</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Check for New Proposals
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeInvestments.map((investment: ClubInvestment) => (
              <div
                key={investment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{investment.campaign.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {investment.campaign.category} •{' '}
                    {investment.campaign.currency_symbol}
                    {investment.investment_amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <div className="font-medium">
                        {investment.voting_stats.approval_percentage}% Yes
                      </div>
                      <div className="text-muted-foreground">
                        {investment.voting_stats.yes_votes}/
                        {investment.voting_stats.total_votes} votes
                      </div>
                    </div>
                    <Badge
                      variant={
                        investment.voting_stats.threshold_met
                          ? 'default'
                          : 'outline'
                      }
                    >
                      {investment.voting_stats.threshold_met
                        ? 'Threshold Met'
                        : 'Voting'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{club.name}</h1>
          <p className="text-muted-foreground">{club.mission}</p>
          {club.investment_focus && (
            <Badge variant="secondary" className="mt-2">
              Focus: {club.investment_focus}
            </Badge>
          )}
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={loading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      <StatsCards />
      <PortfolioOverview />
      <ApprovedCampaignsSection />
      <ActiveInvestmentsSection />
    </div>
  );
};

export default ClubDashboard;
