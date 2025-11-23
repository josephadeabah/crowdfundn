// app/components/DealroomContent.tsx
import React from 'react';
import DealCard from './DealCard';
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

const DealroomContent: React.FC = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Briefcase className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-orange-600 bg-orange-100 inline-block px-2 py-1 rounded-full">
              Dealroom (Coming Soon)
            </h2>
            <p className="text-sm text-gray-500">
              Direct access to founders & live deal flow
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 hidden sm:block">
            {activeDealsMock.length} deals matched
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
            <TrendingUp className="h-4 w-4" />
            Explore
          </button>
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 gap-4 border-b-2 border-gray-100 pb-6">
        {activeDealsMock.map((deal) => (
          <div key={deal.id} className="animate-fade-in">
            <DealCard deal={deal} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealroomContent;
