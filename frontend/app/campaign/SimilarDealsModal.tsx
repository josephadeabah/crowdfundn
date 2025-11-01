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
    window.open(`/campaigns/${campaignId}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Similar Investment Opportunities
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : similarDeals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No similar deals found. Try running AI analysis first.
            </div>
          ) : (
            <div className="grid gap-4">
              {similarDeals.map((deal, index) => (
                <div
                  key={deal.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {deal.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {deal.type?.replace('Campaign', '') || 'Campaign'}
                      </p>

                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                          Goal: {deal.currency}{' '}
                          {deal.goal_amount?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          Performance: {deal.performance_percentage}%
                        </span>
                        <span className="text-sm text-gray-500">
                          Similarity: {deal.similarity_score}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeClass(deal.deal_score)}`}
                        >
                          Score: {deal.deal_score || 'N/A'}
                        </div>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${getRiskBadgeClass(deal.risk_score)}`}
                        >
                          Risk: {deal.risk_score || 'N/A'}
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewCampaign(deal.id)}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>

                  {deal.common_features && deal.common_features.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        Common features:{' '}
                      </span>
                      {deal.common_features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1"
                        >
                          {feature.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
