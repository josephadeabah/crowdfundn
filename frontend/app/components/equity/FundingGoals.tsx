import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '../ui/label';

interface FundingGoalsProps {
  minRaise: string;
  setMinRaise: (value: string) => void;
  maxRaise: string;
  setMaxRaise: (value: string) => void;
}

const FundingGoals = ({
  minRaise,
  setMinRaise,
  maxRaise,
  setMaxRaise,
}: FundingGoalsProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Funding Goals</h3>
        <p className="text-sm text-gray-600 mb-4">
          Showing progress toward your goals can motivate investors to act. You
          can edit your goals until your Form C is filed.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="min-raise">Minimum Raise</Label>
            <p className="text-xs text-gray-500 mt-1">
              The minimum you'd be willing to accept in this raise.
            </p>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                $
              </span>
              <Input
                id="min-raise"
                type="number"
                value={minRaise}
                onChange={(e) => setMinRaise(e.target.value)}
                className="w-full pl-7"
                placeholder="50,000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="max-raise">Maximum Raise</Label>
            <p className="text-xs text-gray-500 mt-1">
              The maximum you'd be willing to accept in this raise.
            </p>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                $
              </span>
              <Input
                id="max-raise"
                type="number"
                value={maxRaise}
                onChange={(e) => setMaxRaise(e.target.value)}
                className="w-full pl-7"
                placeholder="250,000"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundingGoals;