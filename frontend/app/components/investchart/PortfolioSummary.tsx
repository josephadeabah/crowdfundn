'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Target,
} from 'lucide-react';
import { InvestmentPortfolio } from '@/app/types/equityCampaigns.types';

export const PortfolioSummary = ({
  portfolio,
  currency = 'USD',
  currencySymbol = '$',
}: InvestmentPortfolio) => {
  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
        .format(amount)
        .replace(/\p{Sc}/u, currencySymbol);
    } catch (e) {
      console.error('Currency formatting error:', e);
      return `${currencySymbol}${amount.toFixed(2)}`;
    }
  };

  const formatPercentage = (percentage: number | string | null | undefined) => {
    const numPercentage =
      typeof percentage === 'string'
        ? parseFloat(percentage)
        : Number(percentage) || 0;

    return `${numPercentage.toFixed(2)}%`;
  };

  const totalInvested = Number(portfolio?.total_invested) || 0;
  const totalValue = Number(portfolio?.total_value) || 0;
  const totalReturn = Number(portfolio?.total_return) || 0;
  const distinctCampaignsInvested = Number(portfolio?.campaigns_invested) || 0;

  const returnPercentageValue =
    typeof portfolio?.return_percentage === 'string'
      ? parseFloat(portfolio.return_percentage)
      : Number(portfolio?.return_percentage) || 0;

  const isPositiveReturn = totalReturn >= 0;
  const returnColorClass = isPositiveReturn ? 'text-green-600' : 'text-red-600';
  const badgeVariant = isPositiveReturn ? 'default' : 'destructive';
  const badgeText = isPositiveReturn
    ? `+${formatPercentage(returnPercentageValue)}`
    : `${formatPercentage(returnPercentageValue)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Invested
          </CardTitle>
          <DollarSign className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(totalInvested)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Current Value
          </CardTitle>
          <Target className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(totalValue)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Return
          </CardTitle>
          {isPositiveReturn ? (
            <TrendingUp className={`h-4 w-4 ${returnColorClass}`} />
          ) : (
            <TrendingDown className={`h-4 w-4 ${returnColorClass}`} />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${returnColorClass}`}>
            {formatCurrency(totalReturn)}
          </div>
          <div className="flex items-center mt-2">
            <Badge
              variant={badgeVariant}
              className={
                isPositiveReturn
                  ? 'bg-green-100 text-green-800 border-0'
                  : 'bg-red-100 text-red-800 border-0'
              }
            >
              {badgeText}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Ventures
          </CardTitle>
          <PieChart className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">
            {distinctCampaignsInvested.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
