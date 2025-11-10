import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { AIRecommendation } from '../../aiRecommendationService';
import { ClubProfileCard } from './ClubProfileCard';
import { RecommendationCard } from './RecommendationCard';

interface AIRecommendationsSectionProps {
  showAIRecommendations: boolean;
  recommendations: AIRecommendation[];
  loading: boolean;
  clubRiskProfile: any;
  currentClub: any;
  formatCurrency: (amount: number, currency?: string) => string;
  onClose: () => void;
  onProposeInvestment: (campaign: any) => void;
  onExplainRecommendation: (campaignId: string, campaignTitle: string) => void;
}

export const AIRecommendationsSection: React.FC<
  AIRecommendationsSectionProps
> = ({
  showAIRecommendations,
  recommendations,
  loading,
  clubRiskProfile,
  currentClub,
  formatCurrency,
  onClose,
  onProposeInvestment,
  onExplainRecommendation,
}) => {
  if (!showAIRecommendations) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="text-purple-600" size={20} />
          AI Club Assistant Recommendations
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <ClubProfileCard
        clubRiskProfile={clubRiskProfile}
        currentClub={currentClub}
        formatCurrency={formatCurrency}
      />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Analyzing opportunities...</span>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.campaign.id}
              recommendation={recommendation}
              onProposeInvestment={onProposeInvestment}
              onExplainRecommendation={onExplainRecommendation}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Sparkles size={32} className="mx-auto mb-3 text-gray-400" />
          <p>No AI recommendations available at this time.</p>
          <p className="text-sm mt-1">
            Try adjusting your club's investment criteria.
          </p>
        </div>
      )}
    </motion.div>
  );
};
