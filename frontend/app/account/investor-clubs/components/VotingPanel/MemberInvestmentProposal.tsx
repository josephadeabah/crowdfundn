import { useState, useEffect } from 'react';
import { VotingCard, Investment } from './VotingCard';
import { cn } from '@/app/lib/utils';
import {
  TrendingUp,
  X,
  RefreshCw,
  List,
  Grid,
  Plus,
  Target,
  ExternalLink,
} from 'lucide-react';
import Toast from '@/app/components/toast/Toast';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

// Safe number formatting helper
const safeToLocaleString = (
  value: number | undefined | null,
  fallback: string = '0',
): string => {
  if (value === undefined || value === null) return fallback;
  return value.toLocaleString();
};

interface MemberInvestmentProposalProps {
  club: any;
  onClose: () => void;
}

interface AIInvestment extends Investment {
  match_score?: number;
  reasoning?: string;
  ai_analysis?: any;
  status?: 'voting' | 'approved' | 'rejected';
  voting_stats?: any;
  club_investment_id?: string;
  campaign_id?: string;
  campaign_slug?: string; // ADD CAMPAIGN SLUG
  title?: string;
  category?: string;
  currency_symbol?: string;
  investment_amount?: number;
}

const MemberInvestmentProposal: React.FC<MemberInvestmentProposalProps> = ({
  club,
  onClose,
}) => {
  const { token } = useAuth();
  const [investments, setInvestments] = useState<AIInvestment[]>([]);
  const [approvedInvestments, setApprovedInvestments] = useState<
    AIInvestment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });
  const [activeTab, setActiveTab] = useState<'voting' | 'approved'>('voting');

  // Helper function to safely extract description
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';

    // Simple and effective HTML tag stripping
    return html.replace(/<[^>]*>/g, '');
  };

  // Then update your existing getDescription function:
  const getDescription = (investment: any): string => {
    let description = '';

    if (typeof investment.description === 'string') {
      description = investment.description;
    } else if (investment.description?.body) {
      description = investment.description.body;
    } else if (investment.campaign?.description?.body) {
      description = investment.campaign.description.body;
    } else {
      return 'No description available';
    }

    // Strip HTML tags and clean up whitespace
    const cleanDescription = stripHtmlTags(description)
      .replace(/\s+/g, ' ')
      .trim();

    return cleanDescription || 'No description available';
  };

  // Helper function to safely extract title
  const getTitle = (investment: any): string => {
    return (
      investment.campaign?.title ||
      investment.title ||
      investment.company ||
      'Unknown Company'
    );
  };

  // Helper function to safely extract category
  const getCategory = (investment: any): string => {
    return investment.campaign?.category || investment.sector || 'General';
  };

  // Helper function to safely extract currency symbol
  const getCurrencySymbol = (investment: any): string => {
    return (
      investment.campaign?.currency_symbol || investment.currency_symbol || '$'
    );
  };

  // Helper function to safely extract investment amount
  const getInvestmentAmount = (investment: any): number => {
    return (
      investment.investment_amount ||
      parseFloat(investment.proposed_amount) ||
      0
    );
  };

  // Helper function to safely extract campaign slug
  const getCampaignSlug = (investment: any): string => {
    return investment.campaign_slug || investment.campaign?.slug || '';
  };

  // Helper function to format currency
  const formatCurrency = (
    amount: number,
    currencySymbol: string = '$',
  ): string => {
    if (amount >= 1000) {
      return `${currencySymbol}${(amount / 1000).toFixed(1)}K`;
    } else {
      return `${currencySymbol}${amount.toFixed(0)}`;
    }
  };

  // Helper function to prepare investment for VotingCard
  const prepareInvestmentForVotingCard = (investment: any): Investment => {
    const votingStats = investment.voting_stats || {};
    const totalMembers = club?.current_members_count || 1;

    return {
      id: investment.id?.toString() || Math.random().toString(),
      company: getTitle(investment),
      title: getTitle(investment),
      description: getDescription(investment),
      amount: formatCurrency(
        getInvestmentAmount(investment),
        getCurrencySymbol(investment),
      ),
      sector: getCategory(investment),
      votes: votingStats.yes_votes || 0,
      threshold: totalMembers,
      match_score: investment.match_score || 50,
      reasoning: investment.reasoning || 'Investment opportunity',
      ai_analysis: investment.ai_analysis || {
        deal_score: Math.floor(Math.random() * 30) + 60,
        risk_score: Math.floor(Math.random() * 30) + 20,
        risk_category: 'medium',
        sentiment_analysis: 'positive',
        strengths: ['Market potential', 'Team experience'],
      },
      status: investment.status || 'voting',
      voting_stats: votingStats,
      campaign_slug: getCampaignSlug(investment), // ADD CAMPAIGN SLUG
    };
  };

  // Navigate to campaign
  const handleNavigateToCampaign = (slug: string) => {
    if (slug) {
      window.open(`/campaign/${slug}`, '_blank');
    }
  };

  // Fetch investment proposals and approved campaigns
  const fetchInvestmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch active voting proposals
      const proposalsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${club.slug}/investments?status=voting`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      let investmentsData = [];

      if (proposalsResponse.ok) {
        const proposalsData = await proposalsResponse.json();

        if (proposalsData.success) {
          if (proposalsData.investments.length === 0) {
            // Generate new proposals if none exist
            const generateResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${club.slug}/investments/generate_proposals`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              },
            );

            if (generateResponse.ok) {
              const generateData = await generateResponse.json();
              if (generateData.success) {
                investmentsData = generateData.proposals || [];
              }
            }
          } else {
            investmentsData = proposalsData.investments || [];
          }
        }
      }

      setInvestments(investmentsData);

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

      if (approvedResponse.ok) {
        const approvedData = await approvedResponse.json();
        if (approvedData.success) {
          setApprovedInvestments(approvedData.approved_campaigns || []);
        }
      }
    } catch (err) {
      console.error('Error fetching investment data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load investment opportunities',
      );
      setInvestments([]);
      setApprovedInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (investmentId: string, voteType: 'yes' | 'no') => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${club.slug}/investments/${investmentId}/vote`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vote_type: voteType,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to cast vote');
      }

      const data = await response.json();

      if (data.success) {
        return { success: true, data };
      } else {
        throw new Error(data.error || 'Failed to cast vote');
      }
    } catch (err) {
      console.error('Error casting vote:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to cast vote',
      };
    }
  };

  const generateProposals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${club.slug}/investments/generate_proposals`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInvestments(data.proposals || []);
          showToast(
            'Proposals Generated',
            `Created ${data.proposals.length} new proposals`,
            'success',
          );
        }
      } else {
        throw new Error('Failed to generate proposals');
      }
    } catch (err) {
      showToast('Error', 'Failed to generate proposals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestmentData();
  }, [club.slug]);

  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning' = 'success',
  ) => {
    setToastConfig({ title, description, type });
    setToastOpen(true);
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleInvest = async (id: string) => {
    const result = await castVote(id, 'yes');

    if (result.success) {
      const investment = investments.find((inv) => inv.id === id);
      if (!investment) return;

      // Update local state with new voting stats from backend
      const updatedInvestment = {
        ...investment,
        voting_stats: result.data.voting_stats,
      };

      const votingStats = updatedInvestment.voting_stats || {};
      const totalMembers = club?.current_members_count || 1;
      const allMembersVoted = votingStats.total_votes >= totalMembers;
      const thresholdMet =
        allMembersVoted && votingStats.yes_votes > votingStats.no_votes;

      if (thresholdMet) {
        showToast(
          '🎉 Investment Approved!',
          `${getTitle(investment)} has been approved by all members!`,
          'success',
        );

        setAnimatingId(id);
        setTimeout(() => {
          setInvestments((prev) => prev.filter((inv) => inv.id !== id));
          setApprovedInvestments((prev) => [
            ...prev,
            { ...updatedInvestment, status: 'approved' },
          ]);
          setAnimatingId(null);
        }, 400);
      } else {
        setInvestments((prev) =>
          prev.map((inv) => (inv.id === id ? updatedInvestment : inv)),
        );
        const totalVotes = votingStats.total_votes || 0;
        showToast(
          'Vote Recorded',
          `${totalVotes}/${totalMembers} members have voted`,
          'success',
        );
      }
    } else {
      showToast(
        'Vote Failed',
        result.error || 'Failed to record your vote',
        'error',
      );
    }
  };

  const handlePass = async (id: string) => {
    const result = await castVote(id, 'no');

    if (result.success) {
      const investment = investments.find((inv) => inv.id === id);
      if (!investment) return;

      // Update local state with new voting stats from backend
      const updatedInvestment = {
        ...investment,
        voting_stats: result.data.voting_stats,
      };

      const votingStats = updatedInvestment.voting_stats || {};
      const totalMembers = club?.current_members_count || 1;
      const allMembersVoted = votingStats.total_votes >= totalMembers;
      const thresholdMet =
        allMembersVoted && votingStats.yes_votes > votingStats.no_votes;

      if (allMembersVoted && !thresholdMet) {
        showToast(
          'Vote Recorded',
          `${getTitle(investment)} has been rejected`,
          'warning',
        );

        setAnimatingId(id);
        setTimeout(() => {
          setInvestments((prev) => prev.filter((inv) => inv.id !== id));
          setAnimatingId(null);
        }, 400);
      } else {
        setInvestments((prev) =>
          prev.map((inv) => (inv.id === id ? updatedInvestment : inv)),
        );
        const totalVotes = votingStats.total_votes || 0;
        showToast(
          'Vote Recorded',
          `${totalVotes}/${totalMembers} members have voted`,
          'warning',
        );
      }
    } else {
      showToast(
        'Vote Failed',
        result.error || 'Failed to record your vote',
        'error',
      );
    }
  };

  const handleRefresh = () => {
    fetchInvestmentData();
  };

  const renderVotingSection = () => (
    <div className="relative min-h-[400px]">
      {investments.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
            <TrendingUp className="w-12 h-12 text-emerald-600 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No Active Proposals
          </h3>
          <p className="text-gray-600 mb-6">
            There are no investment proposals currently open for voting.
          </p>
          <button
            onClick={generateProposals}
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            Generate Proposals
          </button>
        </div>
      ) : (
        <>
          {/* Stack Effect - Show up to 3 cards */}
          {investments.slice(0, 3).map((investment, index) => (
            <div
              key={investment.id}
              className={cn(
                'absolute inset-0 transition-all duration-300',
                index === 0 ? 'z-30' : index === 1 ? 'z-20' : 'z-10',
                index > 0 && 'pointer-events-none opacity-50',
              )}
              style={{
                transform: `translateY(${index * 8}px) scale(${1 - index * 0.02})`,
              }}
            >
              {index === 0 ? (
                <div
                  className={cn(
                    'animate-scale-in',
                    animatingId === investment.id && 'animate-swipe-left',
                  )}
                >
                  <VotingCard
                    investment={prepareInvestmentForVotingCard(investment)}
                    onInvest={handleInvest}
                    onPass={handlePass}
                    isAnimating={animatingId === investment.id}
                    onViewCampaign={() =>
                      handleNavigateToCampaign(getCampaignSlug(investment))
                    }
                  />
                </div>
              ) : (
                <VotingCard
                  investment={prepareInvestmentForVotingCard(investment)}
                  onInvest={() => {}}
                  onPass={() => {}}
                  isAnimating={false}
                  onViewCampaign={() =>
                    handleNavigateToCampaign(getCampaignSlug(investment))
                  }
                />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );

  // Approved Section with list layout
  const renderApprovedSection = () => (
    <div className="space-y-4">
      {!approvedInvestments || approvedInvestments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Approved Campaigns</h3>
          <p className="text-gray-600 mb-4">
            Approved campaigns will appear here after successful voting.
          </p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            Check for New Approvals
          </Button>
        </div>
      ) : (
        approvedInvestments.map((investment) => {
          if (!investment?.id) return null;

          const votingStats = investment.voting_stats || {};
          const totalMembers =
            votingStats.total_members || club.current_members_count;
          const allMembersVoted = votingStats.all_members_voted || false;
          const thresholdMet = votingStats.threshold_met || false;
          const campaignSlug = getCampaignSlug(investment);

          return (
            <div
              key={investment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        investment.ai_analysis?.risk_category === 'low'
                          ? 'bg-green-500'
                          : investment.ai_analysis?.risk_category === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {getTitle(investment)}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {getDescription(investment)}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {getCategory(investment)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Match: {investment.match_score || 0}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Deal Score:{' '}
                            {investment.ai_analysis?.deal_score || 'N/A'}
                          </span>
                        </div>
                      </div>
                      {campaignSlug && (
                        <Button
                          onClick={() => handleNavigateToCampaign(campaignSlug)}
                          variant="ghost"
                          size="sm"
                          className="ml-4 flex-shrink-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <div className="font-medium text-green-600">
                      {votingStats.approval_percentage || 0}% Yes
                    </div>
                    <div className="text-muted-foreground">
                      {safeToLocaleString(votingStats.yes_votes)}/
                      {safeToLocaleString(votingStats.total_votes)} votes
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {allMembersVoted ? (
                        <span
                          className={
                            thresholdMet
                              ? 'text-green-600 font-medium'
                              : 'text-red-600 font-medium'
                          }
                        >
                          {thresholdMet ? 'Approved! ✅' : 'Rejected ❌'}
                        </span>
                      ) : (
                        <span>
                          {safeToLocaleString(votingStats.total_votes)}/
                          {totalMembers} members voted
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      thresholdMet
                        ? 'default'
                        : allMembersVoted
                          ? 'destructive'
                          : 'outline'
                    }
                    className={
                      thresholdMet
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : allMembersVoted
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : ''
                    }
                  >
                    {thresholdMet
                      ? 'Approved'
                      : allMembersVoted
                        ? 'Rejected'
                        : 'Voting'}
                  </Badge>
                </div>
                <div className="mt-2 text-sm font-medium">
                  {getCurrencySymbol(investment)}
                  {safeToLocaleString(getInvestmentAmount(investment))}
                </div>
                {campaignSlug && (
                  <Button
                    onClick={() => handleNavigateToCampaign(campaignSlug)}
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Campaign
                  </Button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-border/50 bg-white backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-emerald-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-700">
                  Invest w/ Swipe
                </h1>
                <p className="text-sm text-gray-600">
                  Vote on investment opportunities for {club?.name}
                </p>
                {club?.investment_focus && (
                  <p className="text-xs text-gray-500 mt-1">
                    Focus: {club.investment_focus}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {club?.current_members_count} members • All must vote to
                  decide
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {activeTab === 'voting' ? 'Active Proposals' : 'Approved'}
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {loading
                    ? '...'
                    : activeTab === 'voting'
                      ? investments.length
                      : approvedInvestments.length}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`}
                />
              </button>
              <button
                onClick={generateProposals}
                disabled={loading}
                className="p-2 bg-gray-50 text-white rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Generate new proposals"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4">
            <button
              onClick={() => setActiveTab('voting')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === 'voting'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              )}
            >
              Active Voting ({investments.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              )}
            >
              Approved ({approvedInvestments.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-emerald-600 mx-auto animate-spin mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Loading Investment Data
                </h3>
                <p className="text-gray-600">
                  Fetching active proposals and approved campaigns...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <div className="inline-block p-6 bg-red-50 rounded-2xl mb-4">
                  <X className="w-12 h-12 text-red-600 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Unable to Load Data
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Content */}
            {!loading && !error && (
              <>
                {activeTab === 'voting' && renderVotingSection()}
                {activeTab === 'approved' && renderApprovedSection()}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Toast Component */}
      <Toast
        isOpen={toastOpen}
        onClose={handleToastClose}
        title={toastConfig.title}
        description={toastConfig.description}
        type={toastConfig.type}
      />
    </div>
  );
};

export default MemberInvestmentProposal;
