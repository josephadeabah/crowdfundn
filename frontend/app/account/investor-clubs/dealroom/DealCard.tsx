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
      return <Minus className="h-3 w-3 text-gray-500" />;
  }
};

export const DealCard = ({ deal }: DealCardProps) => {
  const statusStyle = statusConfig[deal.status];

  return (
    <div className="bg-white border border-gray-200 p-4 hover:border-emerald-300 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg">
              {deal.founderName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{deal.founderName}</h3>
              <p className="text-sm text-gray-500">
                {deal.founderTitle}
              </p>
            </div>
          </div>

          <div className="ml-15">
            <h4 className="text-lg font-bold text-gray-900">
              {deal.companyName}
            </h4>
            <p className="text-sm text-gray-500">{deal.sector}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-gray-500">Match Score</p>
              <p className="text-lg font-bold text-emerald-600">
                {deal.matchScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50">
        <div>
          <p className="text-xs text-gray-500 mb-1">Stage</p>
          <p className="font-semibold text-gray-900">{deal.stage}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Seeking</p>
          <p className="font-semibold text-emerald-600">{deal.seeking}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Valuation</p>
          <p className="font-semibold text-gray-900">{deal.valuation}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Traction</p>
          <p className="font-semibold text-sm text-gray-900">{deal.traction}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Key Metrics
        </p>
        <div className="flex flex-wrap gap-2">
          {deal.keyMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2 py-1 bg-white text-xs"
            >
              {getTrendIcon(metric.trend)}
              <span>
                <span className="text-gray-500">{metric.label}:</span>{' '}
                <span className="font-semibold text-gray-900">{metric.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info - Single line layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>
              <span className="font-semibold text-orange-600">
                {deal.investorInterest}
              </span>{' '}
              investors interested
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Next: {deal.nextMilestone}</span>
          </div>
          <div className="text-gray-500">
            Last updated {deal.lastUpdate}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View Details</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="hidden sm:inline">Express Interest</span>
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Start Discussion</span>
            <span className="sm:hidden">Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
};