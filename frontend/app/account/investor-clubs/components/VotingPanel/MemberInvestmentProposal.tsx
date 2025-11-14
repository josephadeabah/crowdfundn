import { useState, useEffect } from 'react';
import { VotingCard, Investment } from './VotingCard';
import { cn } from '@/app/lib/utils';
import { TrendingUp, X, RefreshCw, List, Grid, Plus } from 'lucide-react';
import Toast from '@/app/components/toast/Toast';
import { useAuth } from '@/app/context/auth/AuthContext';

// Add these transformation functions here
const transformInvestmentForFrontend = (investment: any): any => {
  return {
    id: investment.id?.toString() || Math.random().toString(),
    company: investment.campaign?.title || 'Unknown Company',
    description: investment.campaign?.description || 'No description available',
    amount: investment.investment_amount
      ? formatCurrency(
          investment.investment_amount,
          investment.campaign?.currency_symbol,
        )
      : '$0',
    sector: investment.campaign?.category || 'General',
    votes: investment.voting_stats?.yes_votes || 0,
    threshold: investment.threshold || 3,
    match_score: investment.match_score || 50,
    reasoning: investment.reasoning || 'Investment opportunity',
    ai_analysis: investment.ai_analysis || getDefaultAIAnalysis(),
    status: investment.status || 'voting',
    voting_stats: investment.voting_stats,
    club_investment_id: investment.id?.toString(),
    campaign_id: investment.campaign?.id?.toString(),
  };
};

const getDefaultAIAnalysis = () => ({
  deal_score: Math.floor(Math.random() * 30) + 60,
  risk_score: Math.floor(Math.random() * 30) + 20,
  risk_category: 'medium',
  sentiment_analysis: 'positive',
  strengths: ['Market potential', 'Team experience'],
});

const formatCurrency = (
  amount: number,
  currencySymbol: string = '$',
): string => {
  if (amount >= 1000) {
    return `${currencySymbol}${(amount / 1000).round(1)}K`;
  } else {
    return `${currencySymbol}${amount.round(0)}`;
  }
};

// Extend Number prototype for rounding (or use a utility function)
declare global {
  interface Number {
    round(decimals: number): number;
  }
}

Number.prototype.round = function (decimals: number): number {
  return Number(Math.round(Number(this + 'e' + decimals)) + 'e-' + decimals);
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

      // If no proposals, generate some
      if (proposalsResponse.status === 200) {
        const proposalsData = await proposalsResponse.json();

        if (proposalsData.success && proposalsData.investments.length === 0) {
          // Generate new proposals
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
              setInvestments(generateData.proposals || []);
            }
          }
        } else {
          setInvestments(proposalsData.investments || []);
        }
      }

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
        setApprovedInvestments(approvedData.approved_campaigns || []);
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

      // Update local state optimistically
      const updatedInvestment = {
        ...investment,
        votes: (investment.votes || 0) + 1,
        voting_stats: result.data.voting_stats,
      };

      const newVotes = updatedInvestment.votes;
      const isNowApproved = newVotes >= updatedInvestment.threshold;

      if (isNowApproved) {
        showToast(
          '🎉 Investment Approved!',
          `${investment.company} has reached the approval threshold!`,
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
        showToast(
          'Vote Recorded',
          `${newVotes}/${updatedInvestment.threshold} votes for ${investment.company}`,
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

      setAnimatingId(id);
      showToast(
        'Vote Recorded',
        `Voted against ${investment?.company}`,
        'warning',
      );

      setTimeout(() => {
        setInvestments((prev) => prev.filter((inv) => inv.id !== id));
        setAnimatingId(null);
      }, 400);
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
                    investment={investment}
                    onInvest={handleInvest}
                    onPass={handlePass}
                    isAnimating={animatingId === investment.id}
                  />
                </div>
              ) : (
                <VotingCard
                  investment={investment}
                  onInvest={() => {}}
                  onPass={() => {}}
                  isAnimating={false}
                />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );

  const renderApprovedSection = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {approvedInvestments.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
            <List className="w-12 h-12 text-emerald-600 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No Approved Campaigns
          </h3>
          <p className="text-gray-600">
            Approved campaigns will appear here after successful voting.
          </p>
        </div>
      ) : (
        approvedInvestments.map((investment) => (
          <div key={investment.id} className="animate-scale-in">
            <VotingCard
              investment={{
                ...investment,
                status: 'approved',
              }}
              onInvest={() => {}}
              onPass={() => {}}
              isAnimating={false}
              showResults={true}
            />
          </div>
        ))
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
          <div className="max-w-2xl mx-auto">
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
