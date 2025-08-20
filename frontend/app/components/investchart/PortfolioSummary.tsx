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
    return_percentage?: number;
  };
}

export const PortfolioSummary = ({ portfolio }: PortfolioSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(2)}%`;
  };

  // Determine if return is positive or negative for styling
  const isPositiveReturn = (portfolio?.total_return ?? 0) >= 0;
  const returnColorClass = isPositiveReturn ? 'text-green-600' : 'text-red-600';
  const badgeVariant = isPositiveReturn ? 'default' : 'destructive';
  const badgeText = isPositiveReturn
    ? `+${formatPercentage(portfolio?.return_percentage ?? 0)}`
    : `${formatPercentage(portfolio?.return_percentage ?? 0)}`;

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
            {formatCurrency(portfolio?.total_invested ?? 0)}
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
            {formatCurrency(portfolio?.total_value ?? 0)}
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
            {formatCurrency(portfolio?.total_return ?? 0)}
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
            {(portfolio?.total_shares ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
