import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '../ui/label';

interface FundingGoalsProps {
  minRaise: string;
  setMinRaise: (value: string) => void;
  maxRaise: string;
  setMaxRaise: (value: string) => void;
  valuation: string;
  setValuation: (value: string) => void;
  equityOffered: string;
  setEquityOffered: (value: string) => void;
}

const FundingGoals = ({
  minRaise,
  setMinRaise,
  maxRaise,
  setMaxRaise,
  valuation,
  setValuation,
  equityOffered,
  setEquityOffered,
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

          <div>
            <Label htmlFor="valuation">Valuation</Label>
            <p className="text-xs text-gray-500 mt-1">
              The total valuation of your company for this funding round.
            </p>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                $
              </span>
              <Input
                id="valuation"
                type="number"
                value={valuation}
                onChange={(e) => setValuation(e.target.value)}
                className="w-full pl-7"
                placeholder="1,000,000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="equity-offered">Equity Offered</Label>
            <p className="text-xs text-gray-500 mt-1">
              The percentage of equity you're offering in this round.
            </p>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                %
              </span>
              <Input
                id="equity-offered"
                type="number"
                value={equityOffered}
                onChange={(e) => setEquityOffered(e.target.value)}
                className="w-full pl-7"
                placeholder="10"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundingGoals;