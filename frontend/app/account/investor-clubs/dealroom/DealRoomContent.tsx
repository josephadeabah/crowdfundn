import { DealCard } from './DealCard';
import { Briefcase, TrendingUp } from 'lucide-react';

const activeDealsMock = [
  {
    id: '1',
    founderName: 'Sarah Chen',
    founderTitle: 'CEO & Founder',
    companyName: 'QuantumAI Labs',
    sector: 'AI/ML Infrastructure',
    stage: 'Series A',
    seeking: '$5M',
    valuation: '$25M',
    traction: '15K users, $120K MRR',
    status: 'active' as const,
    lastUpdate: '2 hours ago',
    matchScore: 94,
    keyMetrics: [
      { label: 'MRR Growth', value: '+45%', trend: 'up' as const },
      { label: 'CAC Payback', value: '3 months', trend: 'neutral' as const },
      { label: 'Churn Rate', value: '2.1%', trend: 'down' as const },
    ],
    investorInterest: 8,
    nextMilestone: 'Product launch Q2 2024',
  },
  {
    id: '2',
    founderName: 'Marcus Johnson',
    founderTitle: 'Founder',
    companyName: 'GreenChain Energy',
    sector: 'Climate Tech',
    stage: 'Seed',
    seeking: '$2M',
    valuation: '$10M',
    traction: '3 pilot customers, LOI for $500K',
    status: 'reviewing' as const,
    lastUpdate: '1 day ago',
    matchScore: 87,
    keyMetrics: [
      { label: 'Pipeline', value: '$2.5M', trend: 'up' as const },
      { label: 'Team Size', value: '12', trend: 'up' as const },
      { label: 'Patents', value: '2 pending', trend: 'neutral' as const },
    ],
    investorInterest: 5,
    nextMilestone: 'First commercial deployment',
  },
  {
    id: '3',
    founderName: 'Priya Patel',
    founderTitle: 'Co-Founder & CTO',
    companyName: 'HealthSync',
    sector: 'Healthcare SaaS',
    stage: 'Series B',
    seeking: '$12M',
    valuation: '$60M',
    traction: '150 hospitals, $2M ARR',
    status: 'pending' as const,
    lastUpdate: '3 days ago',
    matchScore: 91,
    keyMetrics: [
      { label: 'ARR', value: '$2M', trend: 'up' as const },
      { label: 'NPS Score', value: '72', trend: 'up' as const },
      { label: 'Expansion', value: '135%', trend: 'up' as const },
    ],
    investorInterest: 12,
    nextMilestone: 'FDA approval Q3 2024',
  },
];

export const DealroomContent = () => {
  return (
    <div className="space-y-6 p-4">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Deal Value</p>
              <p className="text-2xl font-bold text-gray-900">$19M</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Match Score</p>
              <p className="text-2xl font-bold text-gray-900">91%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Deals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Active Opportunities
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {activeDealsMock.length} deals matched
          </span>
        </div>

        <div className="space-y-4">
          {activeDealsMock.map((deal, index) => (
            <div
              key={deal.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <DealCard deal={deal} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};