import React from 'react';
import { ThumbsUp, ThumbsDown, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/lib/utils';

export interface Investment {
  id: string;
  company: string;
  description: string;
  amount: string;
  sector: string;
  votes: number;
  threshold: number;
  match_score?: number;
  reasoning?: string;
  ai_analysis?: any;
  status?: 'voting' | 'approved' | 'rejected';
  voting_stats?: {
    total_votes: number;
    yes_votes: number;
    no_votes: number;
    approval_percentage: number;
    threshold_met: boolean;
  };
}

interface VotingCardProps {
  investment: Investment;
  onInvest: (id: string) => void;
  onPass: (id: string) => void;
  isAnimating: boolean;
  showResults?: boolean;
}

export const VotingCard: React.FC<VotingCardProps> = ({
  investment,
  onInvest,
  onPass,
  isAnimating,
  showResults = false,
}) => {

  const safeInvestment = {
    ...investment,
    company: investment.company || 'Unknown Company',
    description: investment.description || 'No description available',
    amount: investment.amount || '$0',
    sector: investment.sector || 'General',
    votes: investment.votes || 0,
    threshold: investment.threshold || 3,
    voting_stats: investment.voting_stats || {
      total_votes: 0,
      yes_votes: 0,
      no_votes: 0,
      approval_percentage: 0,
      threshold_met: false
    }
  };

  const progress = (safeInvestment.votes / safeInvestment.threshold) * 100;
  const isApproved = safeInvestment.status === 'approved';
  const isRejected = safeInvestment.status === 'rejected';

  if (!investment) {
    return <div>Error: Investment data missing</div>;
  }

  return (
    <Card
      className={cn(
        'w-full max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm',
        isAnimating && 'opacity-0 scale-95 transition-all duration-300',
        isApproved && 'border-green-200 bg-green-50/50',
        isRejected && 'border-red-200 bg-red-50/50',
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {investment.sector}
            </Badge>
            {investment.match_score && investment.match_score >= 80 && (
              <Badge
                variant="default"
                className="text-xs bg-yellow-100 text-yellow-800"
              >
                <Star className="w-3 h-3 mr-1 fill-current" />
                Top Match
              </Badge>
            )}
            {isApproved && (
              <Badge
                variant="default"
                className="text-xs bg-green-100 text-green-800"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Approved
              </Badge>
            )}
            {isRejected && (
              <Badge
                variant="default"
                className="text-xs bg-red-100 text-red-800"
              >
                <ThumbsDown className="w-3 h-3 mr-1" />
                Rejected
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">
              {investment.amount}
            </div>
            {investment.match_score && (
              <div className="text-xs text-gray-500 mt-1">
                {investment.match_score}% match
              </div>
            )}
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-500">
          {investment.company}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {investment.description}
        </CardDescription>
        {investment.reasoning && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">💡 {investment.reasoning}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Voting Results - Show when voting is complete */}
        {(showResults || isApproved || isRejected) &&
          investment.voting_stats && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Voting Results</span>
                <span className="text-emerald-600 font-bold">
                  {investment.voting_stats.approval_percentage}% Approved
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Yes: {investment.voting_stats.yes_votes}</span>
                <span>No: {investment.voting_stats.no_votes}</span>
                <span>Total: {investment.voting_stats.total_votes}</span>
              </div>
            </div>
          )}

        {/* Progress Bar - Only show for active voting */}
        {!isApproved && !isRejected && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Approval Progress</span>
              <span className="font-semibold text-gray-500">
                {investment.votes}/{investment.threshold} votes
              </span>
            </div>
            <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* AI Analysis Badges */}
        {investment.ai_analysis && (
          <div className="flex flex-wrap gap-1">
            {investment.ai_analysis.deal_score >= 70 && (
              <Badge
                variant="outline"
                className="text-xs text-green-600 border-green-200"
              >
                Strong Deal
              </Badge>
            )}
            {investment.ai_analysis.risk_category === 'low' && (
              <Badge
                variant="outline"
                className="text-xs text-blue-600 border-blue-200"
              >
                Low Risk
              </Badge>
            )}
            {investment.ai_analysis.sentiment_analysis === 'positive' && (
              <Badge
                variant="outline"
                className="text-xs text-purple-600 border-purple-200"
              >
                Positive Sentiment
              </Badge>
            )}
          </div>
        )}

        {/* Voting Buttons - Only show for active voting */}
        {!isApproved && !isRejected && !showResults && (
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => onPass(investment.id)}
              variant="outline"
              className="flex-1 h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              disabled={isAnimating}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Pass
            </Button>
            <Button
              onClick={() => onInvest(investment.id)}
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
              disabled={isAnimating}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Invest
            </Button>
          </div>
        )}

        {/* Approved Message */}
        {isApproved && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-semibold">
                Campaign Approved!
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              This campaign has been added to your approved list.
            </p>
          </div>
        )}

        {/* Rejected Message */}
        {isRejected && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-semibold">
                Campaign Rejected
              </span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              This campaign did not meet the approval threshold.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
