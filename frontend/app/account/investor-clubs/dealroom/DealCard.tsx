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
    <article className="bg-white transition-shadow duration-150 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-lg">
              {initials}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                {deal.founderName}
              </h3>
              <span className="text-xs text-gray-400">•</span>
              <p className="text-xs text-gray-500 truncate">
                {deal.founderTitle}
              </p>
            </div>

            <div className="mt-2 md:mt-3">
              <h4 className="text-sm md:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                {deal.companyName}
              </h4>
              <p className="text-xs md:text-sm text-gray-500 truncate">
                {deal.sector}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-400">Match</p>
              <p className="text-lg font-bold text-emerald-600">
                {deal.matchScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body grid */}
      <div className="px-4 md:px-6 py-3 bg-gray-50 dark:bg-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500">Stage</p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {deal.stage}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Seeking</p>
          <p className="font-medium text-emerald-600">{deal.seeking}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Valuation</p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {deal.valuation}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Traction</p>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {deal.traction}
          </p>
        </div>
      </div>

      {/* Key metrics */}
      <div className="px-4 md:px-6 py-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Key Metrics
        </p>

        <div className="flex flex-wrap gap-2">
          {deal.keyMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white border border-gray-100 px-3 py-2 text-xs"
            >
              {getTrendIcon(metric.trend)}
              <div className="leading-tight">
                <div className="text-gray-500 text-[11px]">{metric.label}</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {metric.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BUTTONS (stay where they were) */}
      <div className="px-4 md:px-6 pt-3 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 hover:bg-gray-50"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="hidden sm:inline">Interest</span>
          </Button>

          <Button
            size="sm"
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Discuss</span>
          </Button>
        </div>
      </div>

      {/* META ROW (moved fully to bottom, new section) */}
      <div className="px-4 md:px-6 py-3 mt-2 bg-gray-50 dark:bg-neutral-800 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300 flex-wrap">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>
              <span className="font-semibold text-orange-600">
                {deal.investorInterest}
              </span>{' '}
              investors interested
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Next: {deal.nextMilestone}</span>
          </div>

          <div className="text-gray-400">{deal.lastUpdate}</div>
        </div>
      </div>
    </article>
  );
};

export default DealCard;
