// app/components/DealCard.tsx
import React from 'react';
import { Button } from '@/app/components/ui/button';
import {
  MessageSquare,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  ThumbsUp,
  Users,
} from 'lucide-react';

interface DealCardProps {
  deal: {
    id: string;
    founderName: string;
    founderTitle: string;
    companyName: string;
    sector: string;
    stage: string;
    seeking: string;
    valuation: string;
    traction: string;
    status: 'active' | 'pending' | 'reviewing' | 'closed';
    lastUpdate: string;
    matchScore: number;
    keyMetrics: Array<{
      label: string;
      value: string;
      trend: 'up' | 'down' | 'neutral';
    }>;
    investorInterest: number;
    nextMilestone: string;
  };
}

const statusConfig = {
  active: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    label: 'Active',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Under Review',
  },
  reviewing: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'In Discussion',
  },
  closed: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: 'Closed',
  },
};

const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-3 w-3 text-emerald-600" />;
    case 'down':
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    default:
      return <Minus className="h-3 w-3 text-gray-400" />;
  }
};

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const statusStyle = statusConfig[deal.status];

  const initials = deal.founderName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <article className="bg-white border border-gray-200 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer p-0">
      {/* Main Content Container - Unified hover area */}
      <div className="p-4 md:p-6 space-y-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-lg">
                {initials}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-semibold text-gray-900 truncate">
                  {deal.founderName}
                </h3>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-sm text-gray-500 truncate">
                  {deal.founderTitle}
                </p>
              </div>

              <h4 className="text-lg font-bold text-gray-900 mb-1">
                {deal.companyName}
              </h4>
              <p className="text-sm text-gray-500">
                {deal.sector}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
            >
              {statusStyle.label}
            </span>
            <div className="text-right">
              <p className="text-xs text-gray-400">Match</p>
              <p className="text-lg font-bold text-emerald-600">
                {deal.matchScore}%
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Stage</p>
            <p className="font-medium text-gray-900">
              {deal.stage}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Seeking</p>
            <p className="font-medium text-emerald-600">{deal.seeking}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Valuation</p>
            <p className="font-medium text-gray-900">
              {deal.valuation}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Traction</p>
            <p className="text-sm font-medium text-gray-800">
              {deal.traction}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span>
                <span className="font-semibold text-orange-600">
                  {deal.investorInterest}
                </span>{' '}
                interested
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Next: {deal.nextMilestone}</span>
            </div>
            <div className="text-gray-400 text-sm">{deal.lastUpdate}</div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-200 rounded-full"
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-200 rounded-full"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Discuss</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DealCard;