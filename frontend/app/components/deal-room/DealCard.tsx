import { Clock, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Button } from '@/app/components/ui/button';
import { Deal } from './dealRoomData';

interface DealCardProps {
  deal: Deal;
  onViewDetails: (deal: Deal) => void;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

const getStatusVariant = (status: Deal['status']) => {
  switch (status) {
    case 'Closing Soon':
      return 'destructive';
    case 'Funded':
      return 'secondary';
    case 'New':
      return 'default';
    default:
      return 'outline';
  }
};

export function DealCard({ deal, onViewDetails }: DealCardProps) {
  const progressPercent = Math.min(
    (deal.currentRaise / deal.targetRaise) * 100,
    100,
  );

  return (
    <div className="bg-white shadow hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-2xl">
              {deal.logo}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                {deal.companyName}
              </h3>
              <p className="text-sm text-gray-600">{deal.industry}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(deal.status)} className="shrink-0">
            {deal.status}
          </Badge>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2 mb-4">
          {deal.tagline}
        </p>

        {/* Metrics Row */}
        <div className="flex items-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{deal.investors} investors</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              {deal.daysLeft > 0 ? `${deal.daysLeft}d left` : 'Closed'}
            </span>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-900">
              {formatCurrency(deal.currentRaise)}
            </span>
            <span className="text-gray-600">
              of {formatCurrency(deal.targetRaise)}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-gray-200">
            <div
              className="h-full bg-emerald-600"
              style={{ width: `${progressPercent}%` }}
            />
          </Progress>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{progressPercent.toFixed(0)}% funded</span>
            <span>Min: {formatCurrency(deal.minInvestment)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-800">
            {deal.founderImage}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{deal.founderName}</p>
            <p className="text-xs text-gray-600">{deal.stage}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-800 hover:text-gray-900 hover:bg-gray-200 bg-white"
          onClick={() => onViewDetails(deal)}
        >
          View Deal
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
