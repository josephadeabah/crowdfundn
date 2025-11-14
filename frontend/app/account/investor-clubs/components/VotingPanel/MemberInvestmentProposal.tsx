// app/account/investor-clubs/components/InvestmentProposal/MemberInvestmentProposal.tsx
import { useState, useEffect } from 'react';
import { VotingCard, Investment } from './VotingCard';
import { cn } from '@/app/lib/utils';
import { TrendingUp, X, RefreshCw } from 'lucide-react';
import Toast from '@/app/components/toast/Toast'; // Update import path as needed
import { useAuth } from '@/app/context/auth/AuthContext';

interface MemberInvestmentProposalProps {
  club: any;
  onClose: () => void;
}

interface AIInvestment extends Investment {
  match_score?: number;
  reasoning?: string;
  ai_analysis?: any;
}

const MemberInvestmentProposal: React.FC<MemberInvestmentProposalProps> = ({
  club,
  onClose,
}) => {
  const { token } = useAuth();
  const [investments, setInvestments] = useState<AIInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [approvedInvestments, setApprovedInvestments] = useState<
    AIInvestment[]
  >([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  // Fetch AI recommendations
  const fetchAIRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${club.slug}/investments/ai_recommendations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();

      if (data.success) {
        setInvestments(data.recommendations);
      } else {
        throw new Error(data.error || 'Failed to load recommendations');
      }
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load investment opportunities',
      );
      // Fallback to empty array
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIRecommendations();
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

  const handleInvest = (id: string) => {
    const investment = investments.find((inv) => inv.id === id);
    if (!investment) return;

    const updatedInvestment = {
      ...investment,
      votes: investment.votes + 1,
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
        setApprovedInvestments((prev) => [...prev, updatedInvestment]);
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
  };

  const handlePass = (id: string) => {
    const investment = investments.find((inv) => inv.id === id);

    setAnimatingId(id);
    showToast('Passed', `${investment?.company} has been passed.`, 'error');

    setTimeout(() => {
      setInvestments((prev) => prev.filter((inv) => inv.id !== id));
      setAnimatingId(null);
    }, 400);
  };

  const handleRefresh = () => {
    fetchAIRecommendations();
  };

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
                  Vote on AI-recommended opportunities for {club?.name}
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
                <p className="text-sm text-gray-600">AI Recommendations</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {loading ? '...' : investments.length}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh recommendations"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`}
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-emerald-600 mx-auto animate-spin mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Analyzing Opportunities
                </h3>
                <p className="text-gray-600">
                  Our AI is finding the best matches for your club...
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
                  Unable to Load Recommendations
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

            {/* Card Stack */}
            <div className="relative min-h-[400px]">
              {!loading && !error && investments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
                    <TrendingUp className="w-12 h-12 text-emerald-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Matches Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No investment opportunities match your club's focus at the
                    moment.
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Refresh Recommendations
                  </button>
                  {approvedInvestments.length > 0 && (
                    <div className="mt-8 text-left">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">
                        Approved Investments ({approvedInvestments.length})
                      </h4>
                      <div className="space-y-3">
                        {approvedInvestments.map((inv) => (
                          <div
                            key={inv.id}
                            className="p-4 bg-card border border-emerald-600/20 rounded-xl"
                          >
                            <h5 className="font-semibold text-gray-700">
                              {inv.company}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {inv.sector}
                            </p>
                            <p className="text-sm text-emerald-600 font-medium">
                              {inv.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                !loading &&
                !error && (
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
                              animatingId === investment.id &&
                                'animate-swipe-left',
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
                )
              )}
            </div>
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