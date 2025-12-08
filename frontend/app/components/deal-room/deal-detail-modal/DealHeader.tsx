import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Deal } from '../services/dealRoomApi';

interface DealHeaderProps {
  deal: Deal;
  canJoin?: boolean;
  isMember: boolean;
  isLoading: boolean;
  onJoinDealRoom: () => void;
}

export function DealHeader({
  deal,
  canJoin,
  isMember,
  isLoading,
  onJoinDealRoom,
}: DealHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white px-6 py-4 -mx-6 -mt-6 border-b">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center text-3xl rounded-lg">
            {deal.logo || deal.companyName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {deal.companyName}
              </h2>
              <Badge
                variant={
                  deal.status === 'Funded'
                    ? 'secondary'
                    : deal.status === 'Closing Soon'
                      ? 'destructive'
                      : 'default'
                }
              >
                {deal.status}
              </Badge>
            </div>
            <p className="text-gray-600">{deal.tagline}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {canJoin && !isMember && (
            <Button
              variant="outline"
              size="sm"
              onClick={onJoinDealRoom}
              disabled={isLoading}
            >
              Join Deal Room
            </Button>
          )}
          {isMember && (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
              Member
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
