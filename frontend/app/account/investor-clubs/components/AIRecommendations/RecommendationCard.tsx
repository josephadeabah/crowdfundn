import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import {
  AIRecommendation,
  aiRecommendationService,
} from '../../aiRecommendationService';

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onProposeInvestment: (campaign: any) => void;
  onExplainRecommendation: (campaignId: string, campaignTitle: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onProposeInvestment,
  onExplainRecommendation,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-700 transition-colors">
            {recommendation.campaign.title}
          </h4>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {recommendation.campaign.description}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${aiRecommendationService.getMatchScoreColor(
              recommendation.match_score,
            )} bg-opacity-10 border`}
          >
            {aiRecommendationService.formatMatchScore(
              recommendation.match_score,
            )}
          </span>
          <span className="text-sm font-bold text-gray-700">
            {recommendation.match_score}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="font-medium text-gray-600">Risk</div>
          <div
            className={`font-semibold ${
              recommendation.quick_assessment.risk_alignment === 'low'
                ? 'text-green-600'
                : recommendation.quick_assessment.risk_alignment === 'medium'
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}
          >
            {aiRecommendationService.formatRiskAlignment(
              recommendation.quick_assessment.risk_alignment,
            )}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="font-medium text-gray-600">Strategic Fit</div>
          <div
            className={`font-semibold ${
              recommendation.quick_assessment.strategic_fit === 'high'
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}
          >
            {recommendation.quick_assessment.strategic_fit}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="font-medium text-gray-600">Financial Fit</div>
          <div
            className={`font-semibold ${
              recommendation.quick_assessment.financial_suitability ===
              'excellent'
                ? 'text-green-600'
                : recommendation.quick_assessment.financial_suitability ===
                    'good'
                  ? 'text-blue-600'
                  : 'text-yellow-600'
            }`}
          >
            {recommendation.quick_assessment.financial_suitability}
          </div>
        </div>
      </div>

      {recommendation.key_alignment_factors.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {recommendation.key_alignment_factors
              .slice(0, 3)
              .map((factor, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1"
                >
                  <Zap size={10} />
                  {factor}
                </span>
              ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onProposeInvestment(recommendation.campaign)}
          className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm transition-colors"
        >
          Propose Investment
        </button>
        <button
          onClick={() =>
            onExplainRecommendation(
              recommendation.campaign.id,
              recommendation.campaign.title,
            )
          }
          className="px-3 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 font-medium text-sm transition-colors flex items-center gap-1"
        >
          <Sparkles size={14} />
          Learn More
        </button>
      </div>
    </div>
  );
};
