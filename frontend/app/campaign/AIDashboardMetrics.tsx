// app/components/campaign/AIDashboardMetrics.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/AuthContext';
import InfoTooltip from '../components/tooltip/tooltip';

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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
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
    if (
      !current ||
      !average ||
      isNaN(Number(current)) ||
      isNaN(Number(average)) ||
      Number(average) === 0
    ) {
      return null;
    }
    return (
      ((Number(current) - Number(average)) / Number(average)) *
      100
    ).toFixed(1);
  };

  // Get risk category description
  const getRiskCategoryDescription = (category: string): string => {
    const descriptions: { [key: string]: string } = {
      low: 'Low risk: Minimal concerns, strong fundamentals, and high probability of success',
      medium:
        'Medium risk: Balanced risk-reward profile with some areas for improvement',
      high: 'High risk: Significant concerns that require careful due diligence',
      very_high:
        'Very high risk: Major concerns that may impact investment viability',
    };
    return (
      descriptions[category] ||
      'Risk assessment based on comprehensive analysis'
    );
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

  const performanceComparison = calculatePercentage(
    currentDealScore,
    metrics.average_deal_score,
  );
  const riskComparison = calculatePercentage(
    currentRiskScore,
    metrics.average_risk_score,
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          AI Market Comparison
        </h3>
        <InfoTooltip
          id="market-comparison-tooltip"
          content="This analysis compares this campaign against similar fundraising opportunities using AI-powered assessment. Scores are based on comprehensive analysis of team strength, market opportunity, financial metrics, and risk factors."
        />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Campaigns Analyzed */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="text-2xl font-bold text-gray-900">
              {metrics.total_analyzed || 0}
            </div>
            <InfoTooltip
              id="total-analyzed-tooltip"
              content="Total number of campaigns analyzed by our AI system. This represents the dataset used for comparison and ensures statistical significance in the market benchmarks."
              iconSize={14}
            />
          </div>
          <div className="text-sm text-gray-600">Campaigns Analyzed</div>
        </div>

        {/* Average Deal Score */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(metrics.average_deal_score)}
            </div>
            <InfoTooltip
              id="avg-deal-score-tooltip"
              content="Average Deal Score across all analyzed campaigns (0-100 scale). Higher scores indicate better overall investment potential considering team, market, traction, and execution capabilities."
              iconSize={14}
            />
          </div>
          <div className="text-sm text-gray-600">Avg Deal Score</div>
          {performanceComparison && currentDealScore && (
            <div
              className={`text-xs mt-1 ${
                parseFloat(performanceComparison) > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {parseFloat(performanceComparison) > 0 ? '+' : ''}
              {performanceComparison}% vs market avg
            </div>
          )}
        </div>

        {/* Average Risk Score */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(metrics.average_risk_score)}
            </div>
            <InfoTooltip
              id="avg-risk-score-tooltip"
              content="Average Risk Score across all analyzed campaigns (0-100 scale). Lower scores indicate lower risk. Considers market competition, execution risks, team experience, and financial stability."
              iconSize={14}
            />
          </div>
          <div className="text-sm text-gray-600">Avg Risk Score</div>
          {riskComparison && currentRiskScore && (
            <div
              className={`text-xs mt-1 ${
                parseFloat(riskComparison) < 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {parseFloat(riskComparison) > 0 ? '+' : ''}
              {riskComparison}% vs market avg
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="text-2xl font-bold text-gray-900">
              {metrics.top_deals?.length || 0}
            </div>
            <InfoTooltip
              id="top-performers-tooltip"
              content="Number of campaigns identified as top performers (typically scoring above 80/100). These represent the highest quality opportunities in our dataset."
              iconSize={14}
            />
          </div>
          <div className="text-sm text-gray-600">Top Performers</div>
        </div>
      </div>

      {/* Risk Distribution */}
      {metrics.risk_distribution &&
        Object.keys(metrics.risk_distribution).length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                Market Risk Distribution
              </h4>
              <InfoTooltip
                id="risk-distribution-tooltip"
                content="Distribution of risk categories across all analyzed campaigns. Shows how this campaign compares to the broader market in terms of risk profile. Categories: Low (0-25), Medium (26-50), High (51-75), Very High (76-100)."
              />
            </div>
            <div className="flex space-x-2">
              {Object.entries(metrics.risk_distribution).map(
                ([category, count]) => (
                  <div key={category} className="flex-1 text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {count || 0}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {category.replace('_', ' ')}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

      {/* Top Deals */}
      {metrics.top_deals && metrics.top_deals.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-medium text-gray-700">
              Benchmark Campaigns
            </h4>
            <InfoTooltip
              id="top-deals-tooltip"
              content="Top performing campaigns in our dataset. Use these as benchmarks to understand what constitutes high-quality opportunities. Each shows both deal score (investment potential) and risk score."
            />
          </div>
          <div className="space-y-2">
            {metrics.top_deals.slice(0, 3).map((deal, index) => (
              <div
                key={deal.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {deal.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-green-600">
                      {formatNumber(deal.deal_score, 0)}
                    </span>
                    <InfoTooltip
                      id={`deal-score-${deal.id}`}
                      content={`Deal Score: ${deal.deal_score}/100. Measures overall investment attractiveness based on team, market, product, and traction.`}
                      iconSize={12}
                    />
                  </div>
                  <span className="text-xs text-gray-500">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-red-600">
                      {formatNumber(deal.risk_score, 0)}
                    </span>
                    <InfoTooltip
                      id={`risk-score-${deal.id}`}
                      content={`Risk Score: ${deal.risk_score}/100. Lower is better. Assesses market, execution, team, and financial risks.`}
                      iconSize={12}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h5 className="text-sm font-semibold text-blue-900 mb-2">
          Understanding These Metrics
        </h5>
        <div className="text-xs text-blue-800 space-y-1">
          <p>
            <strong>Deal Score (0-100):</strong> Overall investment
            attractiveness. Higher scores indicate stronger fundamentals, better
            teams, and greater market opportunities.
          </p>
          <p>
            <strong>Risk Score (0-100):</strong> Overall risk assessment. Lower
            scores are better. Considers execution risk, market competition, and
            team experience.
          </p>
          <p>
            <strong>Market Comparison:</strong> Shows how this campaign performs
            relative to similar opportunities in our database.
          </p>
        </div>
      </div>
    </div>
  );
};
