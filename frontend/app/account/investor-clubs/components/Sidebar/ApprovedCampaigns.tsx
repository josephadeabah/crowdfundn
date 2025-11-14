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
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  PieChart,
  AlertCircle,
} from 'lucide-react';
import { Club } from '../../clubTypes';

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
  total_members?: number;
  all_members_voted?: boolean;
  threshold_met?: boolean;
}

interface CampaignDescription {
  id: number;
  name: string;
  body: string;
  record_type: string;
  record_id: number;
  created_at: string;
  updated_at: string;
}

interface DashboardApprovedCampaign {
  id: string;
  campaign: {
    id: string;
    title: string;
    description: CampaignDescription;
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

// Updated interface to match the actual API response
interface ApiClubInvestment {
  id: string;
  company: string;
  description: string;
  amount: string; // This comes as string like "22.3K", "750.0K"
  sector: string;
  votes: number;
  threshold: number;
  match_score: string;
  reasoning: string;
  ai_analysis: {
    deal_score: string | number;
    risk_score: string | number;
    risk_category: string;
    sentiment_analysis: string;
    strengths: string[];
  };
  status: 'voting' | 'approved' | 'rejected' | 'pending';
  voting_stats: VotingStats;
  club_investment_id: number;
  campaign_id: number;
  proposed_amount: string; // This is the actual investment amount as string
  currency_symbol: string | null;
}

interface ClubInvestment {
  id: string;
  title: string;
  description: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  currency: string;
  currency_symbol: string;
  investment_amount: number;
  status: 'pending' | 'voting' | 'approved' | 'rejected';
  voting_stats: VotingStats;
  threshold: number;
  match_score: number;
  ai_analysis: {
    deal_score: number;
    risk_score: number;
    risk_category: string;
    sentiment_analysis: string;
    strengths: string[];
  };
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
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(
    new Set(),
  );

  // Helper function to parse amount strings like "22.3K", "750.0K" to numbers
  const parseAmountString = (amountStr: string): number => {
    if (!amountStr) return 0;
    
    const cleanStr = amountStr.replace(/[^\d.Kk]/g, '');
    
    if (cleanStr.includes('K') || cleanStr.includes('k')) {
      const numberPart = parseFloat(cleanStr.replace(/[Kk]/g, ''));
      return isNaN(numberPart) ? 0 : numberPart * 1000;
    }
    
    const number = parseFloat(cleanStr);
    return isNaN(number) ? 0 : number;
  };

  // Safe number formatting helper
  const safeToLocaleString = (value: number | undefined | null, fallback: string = '0'): string => {
    if (value === undefined || value === null) return fallback;
    return value.toLocaleString();
  };

  // Safe date formatting helper
  const safeDateToLocaleString = (dateString: string | undefined | null, fallback: string = 'N/A'): string => {
    if (!dateString) return fallback;
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return fallback;
    }
  };

  // Safe progress calculation
  const calculateProgressPercentage = (current: number | undefined, goal: number | undefined): number => {
    if (!current || !goal || goal === 0) return 0;
    return Math.min(100, (current / goal) * 100);
  };

  // Transform API investment data to our component format
  const transformInvestmentData = (apiInvestment: ApiClubInvestment): ClubInvestment => {
    const investmentAmount = parseFloat(apiInvestment.proposed_amount) || parseAmountString(apiInvestment.amount);
    const goalAmount = parseAmountString(apiInvestment.amount);
    
    // Parse AI analysis scores safely
    const dealScore = typeof apiInvestment.ai_analysis.deal_score === 'string' 
      ? parseFloat(apiInvestment.ai_analysis.deal_score) 
      : Number(apiInvestment.ai_analysis.deal_score) || 0;
    
    const riskScore = typeof apiInvestment.ai_analysis.risk_score === 'string'
      ? parseFloat(apiInvestment.ai_analysis.risk_score)
      : Number(apiInvestment.ai_analysis.risk_score) || 0;

    return {
      id: apiInvestment.id,
      title: apiInvestment.company,
      description: apiInvestment.description,
      category: apiInvestment.sector,
      goal_amount: goalAmount,
      current_amount: investmentAmount, // Using proposed amount as current for display
      currency: 'USD', // Default currency
      currency_symbol: apiInvestment.currency_symbol || '$',
      investment_amount: investmentAmount,
      status: apiInvestment.status,
      voting_stats: apiInvestment.voting_stats,
      threshold: apiInvestment.threshold,
      match_score: parseFloat(apiInvestment.match_score) || 0,
      ai_analysis: {
        deal_score: dealScore,
        risk_score: riskScore,
        risk_category: apiInvestment.ai_analysis.risk_category || 'medium',
        sentiment_analysis: apiInvestment.ai_analysis.sentiment_analysis || 'neutral',
        strengths: apiInvestment.ai_analysis.strengths || []
      }
    };
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!token || !club?.slug) {
      console.error('Missing token or club slug');
      setLoading(false);
      setStatsLoading(false);
      return;
    }

    try {
      setLoading(true);
      setStatsLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      if (!baseUrl) {
        throw new Error('Backend base URL not configured');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch approved campaigns
      const approvedResponse = await fetch(
        `${baseUrl}/investment_clubs/${club.slug}/approved_campaigns`,
        { headers }
      );


      const [approvedData] = await Promise.all([
        approvedResponse.ok ? approvedResponse.json() : { success: false, approved_campaigns: [] }
      ]);
      // Handle approved campaigns data
      if (approvedData?.success) {
        setApprovedCampaigns(Array.isArray(approvedData.approved_campaigns) ? approvedData.approved_campaigns : []);
      } else {
        setApprovedCampaigns([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty states on error
      setApprovedCampaigns([]);
      setPortfolioData(null);
      setActiveInvestments([]);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (club?.slug && token) {
      fetchDashboardData();
    }
  }, [club?.slug, token]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const toggleCampaignExpansion = (campaignId: string) => {
    setExpandedCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  // Approved Campaigns Section - Hamburger List Design
  const ApprovedCampaignsSection = () => {
    if (!approvedCampaigns || !Array.isArray(approvedCampaigns)) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Approved Campaigns</CardTitle>
            <CardDescription>
              Campaigns that have been approved by club members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Unable to load approved campaigns
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
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
            <div className="space-y-3">
              {approvedCampaigns.map((campaign) => {
                if (!campaign?.id) return null;

                const isExpanded = expandedCampaigns.has(campaign.id);
                const campaignData = campaign.campaign || {};
                const clubInvestment = campaign.club_investment || {};
                const votingStats = clubInvestment.voting_stats || {};
                
                const progressPercentage = calculateProgressPercentage(
                  campaignData.current_amount,
                  campaignData.goal_amount
                );

                return (
                  <div
                    key={campaign.id}
                    className="border border-green-200 rounded-lg bg-green-50/50 hover:bg-green-50 transition-colors"
                  >
                    {/* Campaign Header - Always Visible */}
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleCampaignExpansion(campaign.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {campaignData.title || 'Untitled Campaign'}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {campaignData.category || 'Uncategorized'}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-300 text-xs"
                              >
                                Approved
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="text-right">
                            <div className="font-medium text-green-600">
                              {votingStats.approval_percentage || 0}% Yes
                            </div>
                            <div className="text-xs">
                              {safeDateToLocaleString(campaign.approved_at)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>
                            Raised: {campaignData.currency_symbol || '$'}
                            {safeToLocaleString(campaignData.current_amount)}
                          </span>
                          <span>
                            Goal: {campaignData.currency_symbol || '$'}
                            {safeToLocaleString(campaignData.goal_amount)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-green-200 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Campaign Details */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Campaign Details
                              </h4>
                              <div className="text-sm text-gray-600">
                                {campaignData.description?.body ? (
                                  <div 
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: campaignData.description.body }}
                                  />
                                ) : (
                                  'No description available.'
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Fundraiser:</span>
                                <span className="font-medium">
                                  {campaignData.fundraiser?.name || 'Unknown'}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Category:</span>
                                <Badge variant="outline">
                                  {campaignData.category || 'Uncategorized'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Investment Details */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center">
                                <PieChart className="h-4 w-4 mr-2" />
                                Investment Details
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Proposed Amount:
                                  </span>
                                  <span className="font-medium">
                                    {club?.currency_symbol || '$'}
                                    {safeToLocaleString(clubInvestment.proposed_amount)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Share Percentage:
                                  </span>
                                  <span className="font-medium">
                                    {safeToLocaleString(clubInvestment.proposed_share_percentage)}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Voting Stats */}
                            {votingStats && (
                              <div>
                                <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center">
                                  <Vote className="h-4 w-4 mr-2" />
                                  Voting Results
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      Yes Votes:
                                    </span>
                                    <span className="font-medium text-green-600">
                                      {safeToLocaleString(votingStats.yes_votes)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      No Votes:
                                    </span>
                                    <span className="font-medium text-red-600">
                                      {safeToLocaleString(votingStats.no_votes)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      Total Votes:
                                    </span>
                                    <span className="font-medium">
                                      {safeToLocaleString(votingStats.total_votes)} / {votingStats.total_members || '?'} members
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Approval Date */}
                            <div className="flex justify-between text-sm pt-2 border-t">
                              <span className="text-gray-600 flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Approved Date:
                              </span>
                              <span className="font-medium">
                                {safeDateToLocaleString(campaign.approved_at, 'Not available')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };


  if (!club) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8 text-muted-foreground">
          <h1 className="text-2xl font-bold mb-4">Club Not Found</h1>
          <p>Unable to load club information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ApprovedCampaignsSection />
    </div>
  );
};

export default ClubDashboard;