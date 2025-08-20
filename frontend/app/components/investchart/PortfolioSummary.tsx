// app/components/equity/PortfolioSummary.tsx
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { TrendingUp, DollarSign, PieChart, Target } from 'lucide-react';

interface PortfolioSummaryProps {
  portfolio: {
    total_invested: number;
    total_shares?: number;
    total_value?: number;
    active_investments: number;
    campaigns_invested: number;
    total_return?: number;
    return_percentage?: number | string | null;
  };
}

export const PortfolioSummary = ({ portfolio }: PortfolioSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage: number | string | null | undefined) => {
    // Convert to number if it's a string, or use 0 if null/undefined
    const numPercentage = typeof percentage === 'string' 
      ? parseFloat(percentage) 
      : Number(percentage) || 0;
    
    return `${numPercentage.toFixed(2)}%`;
  };

  // Safely parse numeric values with fallbacks
  const totalInvested = Number(portfolio?.total_invested) || 0;
  const totalValue = Number(portfolio?.total_value) || 0;
  const totalReturn = Number(portfolio?.total_return) || 0;
  const totalShares = Number(portfolio?.total_shares) || 0;
  
  // Parse return percentage safely
  const returnPercentageValue = typeof portfolio?.return_percentage === 'string'
    ? parseFloat(portfolio.return_percentage)
    : Number(portfolio?.return_percentage) || 0;

  // Determine if return is positive or negative for styling
  const isPositiveReturn = totalReturn >= 0;
  const returnColorClass = isPositiveReturn ? 'text-green-600' : 'text-red-600';
  const badgeVariant = isPositiveReturn ? 'default' : 'destructive';
  const badgeText = isPositiveReturn
    ? `+${formatPercentage(returnPercentageValue)}`
    : `${formatPercentage(returnPercentageValue)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Invested
          </CardTitle>
          <DollarSign className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatCurrency(totalInvested)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Current Value
          </CardTitle>
          <Target className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatCurrency(totalValue)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Return
          </CardTitle>
          <TrendingUp className={`h-4 w-4 ${returnColorClass}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${returnColorClass}`}>
            {formatCurrency(totalReturn)}
          </div>
          <div className="flex items-center mt-2">
            <Badge
              variant={badgeVariant}
              className={`${isPositiveReturn ? 'bg-green-100 text-green-800 border-0' : 'bg-red-100 text-red-800 border-0'} dark:${isPositiveReturn ? 'bg-green-900/20 text-green-300 border-0' : 'bg-red-900/20 text-red-300 border-0'}`}
            >
              {badgeText}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Shares
          </CardTitle>
          <PieChart className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {totalShares.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};