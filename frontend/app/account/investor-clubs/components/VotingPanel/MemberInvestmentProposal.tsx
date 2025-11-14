// app/account/investor-clubs/components/InvestmentProposal/MemberInvestmentProposal.tsx

import { useState } from 'react';
import { VotingCard, Investment } from './VotingCard';
import { cn } from '@/app/lib/utils';
import { TrendingUp, X } from 'lucide-react';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';

interface MemberInvestmentProposalProps {
  club: any;
  onClose: () => void;
}

const initialInvestments: Investment[] = [
  {
    id: '1',
    company: 'EcoTech Solutions',
    description:
      'Revolutionary solar panel technology that increases efficiency by 40% while reducing production costs. Targeting residential and commercial markets.',
    amount: '$500K',
    sector: 'Clean Energy',
    votes: 3,
    threshold: 10,
  },
  {
    id: '2',
    company: 'HealthAI Labs',
    description:
      'AI-powered diagnostic platform that detects diseases from medical imaging with 95% accuracy. Already partnerships with 3 major hospitals.',
    amount: '$750K',
    sector: 'Healthcare',
    votes: 7,
    threshold: 10,
  },
  {
    id: '3',
    company: 'FoodChain Network',
    description:
      'Blockchain-based supply chain solution for food transparency and safety. Reducing food waste by 30% in pilot programs.',
    amount: '$400K',
    sector: 'AgriTech',
    votes: 5,
    threshold: 10,
  },
  {
    id: '4',
    company: 'Urban Mobility Co',
    description:
      'Electric micro-mobility solutions with swappable battery technology. Operating in 5 major cities with 10,000 daily users.',
    amount: '$1M',
    sector: 'Transportation',
    votes: 2,
    threshold: 10,
  },
];

const MemberInvestmentProposal: React.FC<MemberInvestmentProposalProps> = ({
  club,
  onClose,
}) => {
  const [investments, setInvestments] =
    useState<Investment[]>(initialInvestments);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [approvedInvestments, setApprovedInvestments] = useState<Investment[]>(
    [],
  );
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'error',
  });

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setAlertConfig({ title, message, type });
    setAlertOpen(true);
  };

  const handleAlertConfirm = () => {
    setAlertOpen(false);
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
      showAlert(
        '🎉 Investment Approved!',
        `${investment.company} has reached the approval threshold!`,
        'success'
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
      showAlert(
        'Vote Recorded',
        `${newVotes}/${updatedInvestment.threshold} votes for ${investment.company}`,
        'info'
      );
    }
  };

  const handlePass = (id: string) => {
    const investment = investments.find((inv) => inv.id === id);

    setAnimatingId(id);
    showAlert(
      'Passed',
      `${investment?.company} has been passed.`,
      'error'
    );

    setTimeout(() => {
      setInvestments((prev) => prev.filter((inv) => inv.id !== id));
      setAnimatingId(null);
    }, 400);
  };

  const getAlertIcon = () => {
    switch (alertConfig.type) {
      case 'success':
        return <div className="w-6 h-6 text-green-600">🎉</div>;
      case 'error':
        return <div className="w-6 h-6 text-red-600">✕</div>;
      default:
        return <div className="w-6 h-6 text-blue-600">ℹ️</div>;
    }
  };

  const getConfirmButtonClass = () => {
    switch (alertConfig.type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
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
                  Vote on investment opportunities for {club?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Opportunities</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {investments.length}
                </p>
              </div>
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
            {/* Instructions */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-700">
                Discover Your Next Investment
              </h2>
              <p className="text-gray-600">
                Vote Invest to support or Pass to move on. Reach the threshold
                to approve!
              </p>
            </div>

            {/* Card Stack */}
            <div className="relative min-h-[400px]">
              {investments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
                    <TrendingUp className="w-12 h-12 text-emerald-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    All caught up!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No more investment opportunities at the moment.
                  </p>
                  {approvedInvestments.length > 0 && (
                    <div className="mt-6 text-left">
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
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Alert Popup */}
      <AlertPopup
        title={alertConfig.title}
        message={alertConfig.message}
        isOpen={alertOpen}
        setIsOpen={setAlertOpen}
        onConfirm={handleAlertConfirm}
        icon={getAlertIcon()}
        confirmText="OK"
        confirmButtonClass={getConfirmButtonClass()}
        showCancelButton={false}
        expandable={false}
      />
    </div>
  );
};

export default MemberInvestmentProposal;