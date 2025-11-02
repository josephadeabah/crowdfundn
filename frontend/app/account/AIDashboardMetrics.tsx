// app/components/campaign/AIDashboardMetrics.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/AuthContext';

interface DashboardMetrics {
  total_analyzed: number;
  average_deal_score: number;
  average_risk_score: number;
  risk_distribution: {
    [key: string]: number;
  };
  top_deals: Array<{
    id: string;
    title: string;
    deal_score: number;
    risk_score: number;
  }>;
}

interface AIDashboardMetricsProps {
  campaignId: string;
  currentDealScore?: number;
  currentRiskScore?: number;
}

export const AIDashboardMetrics: React.FC<AIDashboardMetricsProps> = ({
  campaignId,
  currentDealScore,
  currentRiskScore,
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    loadDashboardMetrics();
  }, [campaignId]);

  const loadDashboardMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/ai_scoring/deal_scoring/dashboard_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      } else {
        throw new Error(`Failed to load metrics: ${response.status}`);
      }
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
      setError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  // Safe number formatting function
  const formatNumber = (value: any, decimals: number = 1): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '0.0';
    }
    return Number(value).toFixed(decimals);
  };

  // Safe percentage calculation
  const calculatePercentage = (current: any, average: any): string | null => {
    if (!current || !average || isNaN(Number(current)) || isNaN(Number(average)) || Number(average) === 0) {
      return null;
    }
    return (((Number(current) - Number(average)) / Number(average)) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-gray-500">
          <p>Market comparison data not available</p>
          <button 
            onClick={loadDashboardMetrics}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const performanceComparison = calculatePercentage(currentDealScore, metrics.average_deal_score);
  const riskComparison = calculatePercentage(currentRiskScore, metrics.average_risk_score);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Market Comparison
      </h3>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {metrics.total_analyzed || 0}
          </div>
          <div className="text-sm text-gray-600">Campaigns Analyzed</div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(metrics.average_deal_score)}
          </div>
          <div className="text-sm text-gray-600">Avg Deal Score</div>
          {performanceComparison && currentDealScore && (
            <div className={`text-xs mt-1 ${
              parseFloat(performanceComparison) > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {parseFloat(performanceComparison) > 0 ? '+' : ''}{performanceComparison}% vs avg
            </div>
          )}
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(metrics.average_risk_score)}
          </div>
          <div className="text-sm text-gray-600">Avg Risk Score</div>
          {riskComparison && currentRiskScore && (
            <div className={`text-xs mt-1 ${
              parseFloat(riskComparison) < 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {parseFloat(riskComparison) > 0 ? '+' : ''}{riskComparison}% vs avg
            </div>
          )}
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {metrics.top_deals?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Top Performers</div>
        </div>
      </div>

      {/* Risk Distribution */}
      {metrics.risk_distribution && Object.keys(metrics.risk_distribution).length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Risk Distribution</h4>
          <div className="flex space-x-2">
            {Object.entries(metrics.risk_distribution).map(([category, count]) => (
              <div key={category} className="flex-1 text-center">
                <div className="text-lg font-semibold text-gray-900">{count || 0}</div>
                <div className="text-xs text-gray-600 capitalize">{category.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Deals */}
      {metrics.top_deals && metrics.top_deals.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Top Performing Campaigns</h4>
          <div className="space-y-2">
            {metrics.top_deals.slice(0, 3).map((deal, index) => (
              <div key={deal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {deal.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-green-600">
                    {formatNumber(deal.deal_score, 0)}
                  </span>
                  <span className="text-xs text-gray-500">|</span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatNumber(deal.risk_score, 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};