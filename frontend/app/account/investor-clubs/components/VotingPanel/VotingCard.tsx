// app/account/investor-clubs/components/InvestmentProposal/VotingCard.tsx
import React from 'react';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
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
}

interface VotingCardProps {
  investment: Investment;
  onInvest: (id: string) => void;
  onPass: (id: string) => void;
  isAnimating: boolean;
}

export const VotingCard: React.FC<VotingCardProps> = ({
  investment,
  onInvest,
  onPass,
  isAnimating,
}) => {
  const progress = (investment.votes / investment.threshold) * 100;

  return (
    <Card
      className={cn(
        'w-full max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm',
        isAnimating && 'opacity-0 scale-95 transition-all duration-300',
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {investment.sector}
            </Badge>
            {investment.match_score && investment.match_score >= 80 && (
              <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Top Match
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
            <p className="text-xs text-blue-700">
              💡 {investment.reasoning}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
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

        {/* AI Analysis Badges */}
        {investment.ai_analysis && (
          <div className="flex flex-wrap gap-1">
            {investment.ai_analysis.deal_score >= 70 && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                Strong Deal
              </Badge>
            )}
            {investment.ai_analysis.risk_category === 'low' && (
              <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                Low Risk
              </Badge>
            )}
            {investment.ai_analysis.sentiment_analysis === 'positive' && (
              <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                Positive Sentiment
              </Badge>
            )}
          </div>
        )}

        {/* Voting Buttons */}
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
      </CardContent>
    </Card>
  );
};