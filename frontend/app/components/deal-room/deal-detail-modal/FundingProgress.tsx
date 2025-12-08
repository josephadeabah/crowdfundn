import { Progress } from '@/app/components/ui/progress';
import { Deal } from '../services/dealRoomApi';
import { formatCurrency } from '../utils/formatters';

interface FundingProgressProps {
  deal: Deal;
  progressPercent: number;
}

export function FundingProgress({
  deal,
  progressPercent,
}: FundingProgressProps) {
  return (
    <div className="bg-gray-50 p-5 rounded-lg">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-sm text-gray-600">Amount Raised</p>
          <p className="text-3xl font-bold text-emerald-600">
            {formatCurrency(deal.currentRaise)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Target</p>
          <p className="text-xl font-semibold text-gray-900">
            {formatCurrency(deal.targetRaise)}
          </p>
        </div>
      </div>
      <Progress value={progressPercent} className="h-3 mb-3 bg-gray-200">
        <div
          className="h-full bg-emerald-600"
          style={{ width: `${progressPercent}%` }}
        />
      </Progress>
      <div className="flex justify-between text-sm">
        <span className="text-emerald-600 font-medium">
          {progressPercent.toFixed(0)}% funded
        </span>
        <span className="text-gray-600">{deal.investors} investors</span>
      </div>
    </div>
  );
}
