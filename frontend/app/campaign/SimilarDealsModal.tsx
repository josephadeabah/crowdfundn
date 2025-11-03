// app/components/campaign/SimilarDealsModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/AuthContext';

interface SimilarDealsModalProps {
  campaignId: string;
  onClose: () => void;
}

interface SimilarDeal {
  id: string;
  title: string;
  type: string;
  goal_amount: number;
  currency: string;
  performance_percentage: number;
  deal_score: number;
  risk_score: number;
  similarity_score: number;
  common_features: string[];
  ai_metrics?: {
    sentiment_analysis?: string;
    team_assessment?: string;
    market_opportunity?: string;
    risk_category?: string;
  };
}

export const SimilarDealsModal: React.FC<SimilarDealsModalProps> = ({
  campaignId,
  onClose,
}) => {
  const [similarDeals, setSimilarDeals] = useState<SimilarDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    loadSimilarDeals();
  }, [campaignId]);

  const loadSimilarDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/ai_scoring/deal_scoring/similar_deals?campaign_id=${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setSimilarDeals(data.similar_deals || []);
      } else {
        setError('Failed to load similar deals');
      }
    } catch (err) {
      setError('Failed to load similar deals');
      console.error('Error loading similar deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCampaign = (campaignId: string) => {
    window.open(`/campaign/${campaignId}`, '_blank');
  };

  const formatFeature = (feature: string): string => {
    return feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAIMetricColor = (metric: string, value: string): string => {
    const colorMap: { [key: string]: { [key: string]: string } } = {
      sentiment_analysis: {
        positive: 'text-green-600 bg-green-50',
        neutral: 'text-yellow-600 bg-yellow-50',
        negative: 'text-red-600 bg-red-50'
      },
      team_assessment: {
        strong: 'text-green-600 bg-green-50',
        adequate: 'text-yellow-600 bg-yellow-50',
        weak: 'text-red-600 bg-red-50'
      },
      market_opportunity: {
        large: 'text-green-600 bg-green-50',
        medium: 'text-yellow-600 bg-yellow-50',
        small: 'text-red-600 bg-red-50'
      },
      risk_category: {
        low: 'text-green-600 bg-green-50',
        medium: 'text-yellow-600 bg-yellow-50',
        high: 'text-red-600 bg-red-50',
        very_high: 'text-red-700 bg-red-100'
      }
    };

    return colorMap[metric]?.[value] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Similar Investment Opportunities
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Campaigns with similar characteristics and AI analysis profiles
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">{error}</div>
              <button
                onClick={loadSimilarDeals}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : similarDeals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.927-6-2.445"
                  />
                </svg>
              </div>
              <p>No similar deals found.</p>
              <p className="text-sm mt-1">Try running AI analysis first to enable smart matching.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {similarDeals.map((deal, index) => (
                <div
                  key={deal.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {deal.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {deal.type?.replace('Campaign', '') || 'Campaign'} • {deal.currency} {deal.goal_amount?.toLocaleString()}
                          </p>
                        </div>
                        
                        {/* Similarity Score */}
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500">MATCH</span>
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                              {deal.similarity_score}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="flex items-center space-x-6 mt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {deal.performance_percentage}%
                          </div>
                          <div className="text-xs text-gray-500">Funded</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(deal.deal_score)}`}>
                            {deal.deal_score || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">Deal Score</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getRiskColor(deal.risk_score)}`}>
                            {deal.risk_score || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">Risk Score</div>
                        </div>
                      </div>

                      {/* AI Metrics */}
                      {deal.ai_metrics && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {Object.entries(deal.ai_metrics).map(([key, value]) => (
                            value && (
                              <span
                                key={key}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAIMetricColor(key, value)}`}
                              >
                                {formatFeature(key)}: {formatFeature(value)}
                              </span>
                            )
                          ))}
                        </div>
                      )}

                      {/* Common Features */}
                      {deal.common_features && deal.common_features.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Why it's similar:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {deal.common_features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                              >
                                <svg
                                  className="w-3 h-3 mr-1 text-green-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {formatFeature(feature)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="ml-6 flex-shrink-0">
                      <button
                        onClick={() => handleViewCampaign(deal.id)}
                        className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                      >
                        View Campaign
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Found {similarDeals.length} similar deal{similarDeals.length !== 1 ? 's' : ''}
            </div>
            <div
              className="px-4 py-2 bg-gray-50 text-white text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getScoreColor = (score: number): string => {
  if (!score) return 'text-gray-500';
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getRiskColor = (score: number): string => {
  if (!score) return 'text-gray-500';
  if (score <= 30) return 'text-green-600';
  if (score <= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBadgeClass = (score: number): string => {
  if (!score) return 'bg-gray-100 text-gray-800';
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getRiskBadgeClass = (score: number): string => {
  if (!score) return 'bg-gray-100 text-gray-800';
  if (score <= 30) return 'bg-green-100 text-green-800';
  if (score <= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};