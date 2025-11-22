// app/account/investor-clubs/components/Analytics/AnalyticsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Percent,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '@/app/components/modal/Modal';
import { Button } from '@/app/components/ui/button';
import { PerformanceChart } from './PerformanceChart';
import { TopAssets } from './TopAssets';
import { PortfolioChart } from './PortfolioChart';
import { MembersOverview } from './MembersOverview';
import { StatsCard } from './StatsCard';
import { Club, ComprehensiveAnalytics } from '../../clubTypes';
import { useAuth } from '@/app/context/auth/AuthContext';
import { investmentClubService } from '../../clubservice';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  club,
}) => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<ComprehensiveAnalytics | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && token && club) {
      loadAnalytics();
    }
  }, [isOpen, token, club]);

  const loadAnalytics = async () => {
    if (!token || !club) return;

    setLoading(true);
    setError(null);
    try {
      console.log('Loading analytics for club ID:', club.id);
      const data = await investmentClubService.getComprehensiveAnalytics(
        token,
        club.id.toString(), // Ensure it's a string
      );
      setAnalytics(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'health', label: 'Financial Health', icon: Activity },
    { id: 'predictive', label: 'Predictive', icon: Target },
  ];

  if (loading && !analytics) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="huge"
        closeOnBackdropClick={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Loading comprehensive analytics...
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="huge"
      closeOnBackdropClick={true}
    >
      <div className="max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {club.name} Investment Insights
              </h2>
              <p className="text-gray-600 mt-1">
                Comprehensive insights and performance metrics
                {analytics && (
                  <span className="text-sm text-gray-500 ml-2">
                    • Updated {lastUpdated}
                  </span>
                )}
              </p>
              {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
            <Button
              onClick={loadAnalytics}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab analytics={analytics} loading={loading} club={club} />
          )}
          {activeTab === 'performance' && (
            <PerformanceTab
              analytics={analytics}
              loading={loading}
              club={club}
            />
          )}
          {activeTab === 'insights' && (
            <InsightsTab analytics={analytics} loading={loading} club={club} />
          )}
          {activeTab === 'health' && (
            <HealthTab analytics={analytics} loading={loading} club={club} />
          )}
          {activeTab === 'predictive' && (
            <PredictiveTab
              analytics={analytics}
              loading={loading}
              club={club}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

// Tab Components with Loading States
// In AnalyticsModal.tsx, update the OverviewTab component:
const OverviewTab: React.FC<{
  analytics: ComprehensiveAnalytics | null;
  loading: boolean;
  club: Club;
}> = ({ analytics, loading, club }) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!analytics) {
    return <EmptyState message="No analytics data available" />;
  }

  const portfolio = analytics.portfolio_overview;
  const performance = analytics.performance_analytics;

  // Transform portfolio investments for TopAssets
  const transformInvestmentsForTopAssets = () => {
    if (!portfolio.investments || portfolio.investments.length === 0) {
      return [];
    }

    return portfolio.investments
      .filter((inv) => inv.current_value && Number(inv.current_value) > 0)
      .sort((a, b) => Number(b.current_value) - Number(a.current_value))
      .slice(0, 5)
      .map((investment) => {
        const currentValue = Number(investment.current_value);
        const investmentAmount = Number(investment.investment_amount);
        const roi =
          ((currentValue - investmentAmount) / (investmentAmount || 1)) * 100;

        return {
          name: investment?.campaign?.title || 'Unknown',
          value: currentValue,
          change: roi,
          isPositive: roi >= 0,
          company_info: {
            name: investment?.campaign?.company_info?.name || 'Unknown',
            description: investment?.campaign?.title || '',
            headquarters:
              investment?.campaign?.company_info?.headquarters || 'N/A', // You can add this data if available in your API
          },
        };
      });
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Portfolio Value"
          value={portfolio.total_value || 0}
          change={`${portfolio.return_percentage >= 0 ? '+' : ''}${portfolio.return_percentage || 0}% return`}
          changeType={
            portfolio.return_percentage >= 0 ? 'positive' : 'negative'
          }
          icon={DollarSign}
          club={club}
        />
        <StatsCard
          title="Total Return"
          value={portfolio.total_return || 0}
          change={`${portfolio.return_percentage || 0}% ROI`}
          changeType={
            portfolio.return_percentage >= 0 ? 'positive' : 'negative'
          }
          icon={TrendingUp}
          club={club}
        />
        <StatsCard
          title="Active Investments"
          value={(portfolio.active_investments || 0).toString()}
          change={`${portfolio.campaigns_invested || 0} campaigns`}
          changeType="neutral"
          icon={Users}
        />
        <StatsCard
          title="Success Rate"
          value={`${Math.round(((portfolio.successful_count || 0) / (portfolio.active_investments || 1)) * 100)}%`}
          change="All time"
          changeType="positive"
          icon={Percent}
        />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart
          data={
            analytics.performance_analytics?.time_analysis
              ? Object.entries(
                  analytics.performance_analytics.time_analysis,
                ).map(([period, data]: [string, any]) => ({
                  period,
                  portfolio_value: data.total_invested || 0,
                  investments: data.investments_count || 0,
                  returns: data.total_invested ? data.total_invested * 0.1 : 0,
                }))
              : []
          }
          club={club}
        />
        <PortfolioChart
          data={
            analytics.performance_analytics?.sector_breakdown
              ? Object.entries(
                  analytics.performance_analytics.sector_breakdown,
                ).map(([sector, data]: [string, any], index) => ({
                  name: sector,
                  value: data.total_invested || 0,
                  color: `hsl(${index * 60}, 70%, 50%)`,
                }))
              : []
          }
          currency={club.currency}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopAssets
          data={transformInvestmentsForTopAssets()}
          currency={club.currency}
        />
        <MembersOverview data={analytics.member_portfolio} club={club} />
      </div>
    </div>
  );
};

const PerformanceTab: React.FC<{
  analytics: ComprehensiveAnalytics | null;
  loading: boolean;
  club: Club;
}> = ({ analytics, loading }) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!analytics) {
    return <EmptyState message="No performance data available" />;
  }

  const performance = analytics.performance_analytics;
  const insights = analytics.portfolio_insights;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <MetricItem
              label="Average ROI"
              value={`${insights?.performance_insights?.best_performing_investment?.roi || 0}%`}
              trend="up"
            />
            <MetricItem
              label="Investment Frequency"
              value={`${performance?.performance_metrics?.average_investment_size ? 'Active' : 'No data'}`}
              trend="neutral"
            />
            <MetricItem
              label="Member Engagement"
              value={`${performance?.performance_metrics?.member_engagement || 0}%`}
              trend="up"
            />
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            <MetricItem
              label="Concentration Risk"
              value={`${insights?.risk_analysis?.concentration_risk || 0}`}
              trend={
                insights?.risk_analysis?.concentration_risk > 50 ? 'down' : 'up'
              }
            />
            <MetricItem
              label="Portfolio Volatility"
              value={`${insights?.performance_insights?.volatility_estimate || 0}%`}
              trend="neutral"
            />
            <MetricItem
              label="Diversification Score"
              value={`${insights?.diversification_metrics?.sector_diversity_score || 0}/100`}
              trend="up"
            />
          </div>
        </div>
      </div>

      {/* Investment Status Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Investment Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard
            status="Successful"
            count={performance?.investment_status_breakdown?.successful || 0}
            color="green"
          />
          <StatusCard
            status="Pending"
            count={performance?.investment_status_breakdown?.pending || 0}
            color="yellow"
          />
          <StatusCard
            status="Voting"
            count={performance?.investment_status_breakdown?.voting || 0}
            color="blue"
          />
          <StatusCard
            status="Failed"
            count={performance?.investment_status_breakdown?.failed || 0}
            color="red"
          />
        </div>
      </div>
    </div>
  );
};

const InsightsTab: React.FC<{
  analytics: ComprehensiveAnalytics | null;
  loading: boolean;
  club: Club;
}> = ({ analytics, loading }) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!analytics) {
    return <EmptyState message="No insights data available" />;
  }

  const insights = analytics.portfolio_insights;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Performers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
          <div className="space-y-3">
            {insights?.performance_insights && (
              <>
                <InsightItem
                  title="Best Performer"
                  value={
                    insights.performance_insights.best_performing_investment
                      ?.campaign || 'Unknown'
                  }
                  metric={`+${insights.performance_insights.best_performing_investment?.roi || 0}% ROI`}
                  type="positive"
                />
                <InsightItem
                  title="Average Holding Period"
                  value={`${insights.performance_insights.average_holding_period} days`}
                  metric="Portfolio average"
                  type="neutral"
                />
                <InsightItem
                  title="Sharpe Ratio"
                  value={insights.performance_insights.sharpe_ratio}
                  metric="Risk-adjusted return"
                  type="positive"
                />
              </>
            )}
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
          <div className="space-y-3">
            {insights?.risk_analysis && (
              <>
                <RiskItem
                  factor="Concentration Risk"
                  level={
                    insights.risk_analysis.concentration_risk > 1500
                      ? 'High'
                      : 'Moderate'
                  }
                  score={insights.risk_analysis.concentration_risk}
                />
                <RiskItem
                  factor="Liquidity Risk"
                  level={
                    insights.risk_analysis.liquidity_risk > 50 ? 'High' : 'Low'
                  }
                  score={insights.risk_analysis.liquidity_risk}
                />
                <RiskItem
                  factor="Sector Risk"
                  level="Moderate"
                  score={insights.risk_analysis.sector_risk}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Member Engagement */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Member Engagement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EngagementMetric
            title="Voting Participation"
            value={`${insights?.member_engagement_insights?.voting_participation_rate || 0}%`}
            description="Members who voted recently"
          />
          <EngagementMetric
            title="Contribution Rate"
            value={`${insights?.member_engagement_insights?.contribution_participation_rate || 0}%`}
            description="Active contributors"
          />
          <EngagementMetric
            title="Overall Engagement"
            value={`${insights?.member_engagement_insights?.engagement_score || 0}%`}
            description="Combined engagement score"
          />
        </div>
      </div>
    </div>
  );
};

const HealthTab: React.FC<{
  analytics: ComprehensiveAnalytics | null;
  loading: boolean;
  club: Club;
}> = ({ analytics, loading }) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!analytics) {
    return <EmptyState message="No financial health data available" />;
  }

  const health = analytics.financial_health;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HealthMetric
          title="Current Ratio"
          value={health?.liquidity_ratios?.current_ratio || 0}
          idealRange="> 1.5"
          status={
            Number(health?.liquidity_ratios?.current_ratio ?? 0) > 1.5
              ? 'good'
              : 'warning'
          }
        />
        <HealthMetric
          title="Contribution Growth"
          value={`${health?.contribution_health?.growth_rate || 0}%`}
          idealRange="> 5%"
          status={
            Number(health?.contribution_health?.growth_rate ?? 0) > 5
              ? 'good'
              : 'warning'
          }
        />
        <HealthMetric
          title="Investment Efficiency"
          value={`${Math.round(Number(health?.investment_efficiency?.capital_utilization_rate ?? 0) * 100)}%`}
          idealRange="> 80%"
          status={
            Number(
              health?.investment_efficiency?.capital_utilization_rate ?? 0,
            ) > 0.8
              ? 'good'
              : 'warning'
          }
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Stability Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StabilityIndicator
            title="Member Retention"
            value={`${health?.stability_indicators?.member_retention_rate || 0}%`}
            trend="up"
          />
          <StabilityIndicator
            title="Financial Resilience"
            value={`${health?.stability_indicators?.financial_resilience_score || 0}/100`}
            trend="stable"
          />
        </div>
      </div>
    </div>
  );
};

const PredictiveTab: React.FC<{
  analytics: ComprehensiveAnalytics | null;
  loading: boolean;
  club: Club;
}> = ({ analytics, loading }) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!analytics) {
    return <EmptyState message="No predictive data available" />;
  }

  const predictive = analytics.predictive_analytics;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Growth Projections</h3>
          <div className="space-y-4">
            <ProjectionItem
              period="6 Months"
              value={Number(
                predictive?.growth_projections?.short_term_projection || 0,
              )}
              currentValue={analytics.portfolio_overview.total_value}
            />
            <ProjectionItem
              period="1 Year"
              value={Number(
                predictive?.growth_projections?.medium_term_projection || 0,
              )}
              currentValue={analytics.portfolio_overview.total_value}
            />
            <ProjectionItem
              period="5 Years"
              value={Number(
                predictive?.growth_projections?.long_term_projection || 0,
              )}
              currentValue={analytics.portfolio_overview.total_value}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Scenarios</h3>
          <div className="space-y-3">
            <ScenarioItem
              scenario="Market Downturn"
              impact={
                predictive?.risk_scenarios?.market_downturn?.impact || -15
              }
              probability={
                predictive?.risk_scenarios?.market_downturn?.probability ||
                'Medium'
              }
            />
            <ScenarioItem
              scenario="High Inflation"
              impact={predictive?.risk_scenarios?.high_inflation?.impact || -8}
              probability={
                predictive?.risk_scenarios?.high_inflation?.probability || 'Low'
              }
            />
            <ScenarioItem
              scenario="Liquidity Crisis"
              impact={
                predictive?.risk_scenarios?.liquidity_crisis?.impact || -25
              }
              probability={
                predictive?.risk_scenarios?.liquidity_crisis?.probability ||
                'Very Low'
              }
            />
          </div>
        </div>
      </div>

      {/* Investment Opportunities */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Investment Opportunities</h3>
        <div className="space-y-2">
          {(predictive?.opportunity_analysis?.underserved_sectors || []).map(
            (sector: string, index: number) => (
              <OpportunityItem key={index} sector={sector} />
            ),
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const MetricItem: React.FC<{
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}> = ({ label, value, trend }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-semibold">{value}</span>
      {trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-500" />}
      {trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-500" />}
    </div>
  </div>
);

const StatusCard: React.FC<{
  status: string;
  count: number;
  color: 'green' | 'yellow' | 'blue' | 'red';
}> = ({ status, count, color }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`p-4 rounded-lg text-center ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-sm">{status}</div>
    </div>
  );
};

const InsightItem: React.FC<{
  title: string;
  value: string | number;
  metric: string;
  type: 'positive' | 'negative' | 'neutral';
}> = ({ title, value, metric, type }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
    <div>
      <div className="font-medium text-gray-900">{title}</div>
      <div className="text-sm text-gray-600">{metric}</div>
    </div>
    <div
      className={`font-semibold ${
        type === 'positive'
          ? 'text-green-600'
          : type === 'negative'
            ? 'text-red-600'
            : 'text-gray-600'
      }`}
    >
      {value}
    </div>
  </div>
);

const RiskItem: React.FC<{ factor: string; level: string; score: number }> = ({
  factor,
  level,
  score,
}) => {
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'moderate':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <div>
        <div className="font-medium text-gray-900">{factor}</div>
        <div className={`text-sm font-semibold ${getRiskColor(level)}`}>
          {level}
        </div>
      </div>
      <div className="text-lg font-bold text-gray-700">{score}</div>
    </div>
  );
};

const EngagementMetric: React.FC<{
  title: string;
  value: string;
  description: string;
}> = ({ title, value, description }) => (
  <div className="text-center p-4 bg-gray-50 rounded-lg">
    <div className="text-2xl font-bold text-emerald-600">{value}</div>
    <div className="font-medium text-gray-900 mt-1">{title}</div>
    <div className="text-sm text-gray-600">{description}</div>
  </div>
);

const HealthMetric: React.FC<{
  title: string;
  value: number | string;
  idealRange: string;
  status: 'good' | 'warning' | 'critical';
}> = ({ title, value, idealRange, status }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-medium text-gray-900">{title}</h4>
      <div
        className={`w-2 h-2 rounded-full ${
          status === 'good'
            ? 'bg-green-500'
            : status === 'warning'
              ? 'bg-yellow-500'
              : 'bg-red-500'
        }`}
      ></div>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-500 mt-1">Ideal: {idealRange}</div>
  </div>
);

const StabilityIndicator: React.FC<{
  title: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}> = ({ title, value, trend }) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
    <div>
      <div className="font-medium text-gray-900">{title}</div>
      <div className="text-sm text-gray-600">Stability indicator</div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-gray-900">{value}</span>
      {trend === 'up' && <TrendingUp className="h-5 w-5 text-green-500" />}
      {trend === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
      {trend === 'stable' && <CheckCircle className="h-5 w-5 text-blue-500" />}
    </div>
  </div>
);

const ProjectionItem: React.FC<{
  period: string;
  value: number;
  currentValue: number;
}> = ({ period, value, currentValue }) => {
  const growth = ((value - currentValue) / currentValue) * 100;

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{period}</span>
      <div className="text-right">
        <div className="font-semibold">${value.toLocaleString()}</div>
        <div
          className={`text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {growth >= 0 ? '+' : ''}
          {Number(growth).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

const ScenarioItem: React.FC<{
  scenario: string;
  impact: number;
  probability: string;
}> = ({ scenario, impact, probability }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
    <div>
      <div className="font-medium text-gray-900">{scenario}</div>
      <div className="text-sm text-gray-600">Probability: {probability}</div>
    </div>
    <div
      className={`font-semibold ${impact >= 0 ? 'text-green-600' : 'text-red-600'}`}
    >
      {impact}%
    </div>
  </div>
);

const OpportunityItem: React.FC<{ sector: string }> = ({ sector }) => (
  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
    <Sparkles className="h-5 w-5 text-green-600" />
    <div>
      <div className="font-medium text-green-900">Consider {sector}</div>
      <div className="text-sm text-green-700">High growth potential</div>
    </div>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 rounded-lg p-6 animate-pulse h-32"
        ></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-200 rounded-lg p-6 animate-pulse h-80"></div>
      <div className="bg-gray-200 rounded-lg p-6 animate-pulse h-80"></div>
    </div>
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-12">
    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No Data Available
    </h3>
    <p className="text-gray-500">{message}</p>
  </div>
);

export default AnalyticsModal;
