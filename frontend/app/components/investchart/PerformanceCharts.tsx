// app/components/equity/PerformanceCharts.tsx
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { EquityInvestment } from '@/app/types/equityCampaigns.types';
import { formatCurrency } from '@/app/utils/helpers/calculate.days';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface PerformanceChartsProps {
  investments: EquityInvestment[];
  currency?: string;
  currencySymbol?: string;
}

export const PerformanceCharts = ({
  investments,
  currency = 'USD',
  currencySymbol = '$',
}: PerformanceChartsProps) => {
  // Safe number parsing function
  const parseNumber = (value: any, fallback = 0): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || fallback;
    return fallback;
  };

  // Prepare data for portfolio composition pie chart
  const portfolioData = investments.reduce(
    (acc, investment) => {
      const campaignName =
        investment.campaign?.title || `Campaign ${investment.campaign_id}`;
      const currentValue = parseNumber(
        investment.current_value,
        parseNumber(investment.amount),
      );

      const existing = acc.find((item) => item.name === campaignName);
      if (existing) {
        existing.value += currentValue;
      } else {
        acc.push({
          name: campaignName,
          value: currentValue,
          // Use investment-specific currency if available, otherwise fall back to props
          currency: investment.currency || currency,
          currency_symbol: investment.currency_symbol || currencySymbol,
        });
      }
      return acc;
    },
    [] as {
      name: string;
      value: number;
      currency?: string;
      currency_symbol?: string;
    }[],
  );

  // Prepare data for returns bar chart
  const returnsData = investments.map((investment, index) => {
    const invested = parseNumber(investment.amount);
    const currentValue = parseNumber(investment.current_value, invested);
    const returnAmount = currentValue - invested;
    const returnPercentage = invested > 0 ? (returnAmount / invested) * 100 : 0;
    const campaignName =
      investment.campaign?.title || `Campaign ${investment.campaign_id}`;

    return {
      name: campaignName,
      campaign: campaignName,
      invested: invested,
      currentValue: currentValue,
      return: returnAmount,
      returnPercentage: returnPercentage,
      // Use investment-specific currency if available, otherwise fall back to props
      currency: investment.currency || currency,
      currency_symbol: investment.currency_symbol || currencySymbol,
    };
  });

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataItem = returnsData.find((item) => item.name === label);
      // Use the currency from the data item or fall back to props
      const itemCurrency = dataItem?.currency || currency;
      const itemCurrencySymbol = dataItem?.currency_symbol || currencySymbol;

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
          <p className="text-gray-900 dark:text-white font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
              {`${entry.name || entry.dataKey}: ${formatCurrency(entry.value, itemCurrency, itemCurrencySymbol)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const totalValue = portfolioData.reduce(
        (sum, item) => sum + item.value,
        0,
      );
      const percentage =
        totalValue > 0 ? (payload[0].value / totalValue) * 100 : 0;

      // Use the currency from the payload or fall back to props
      const itemCurrency = payload[0].payload.currency || currency;
      const itemCurrencySymbol = payload[0].payload.currency_symbol || currencySymbol;

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
          <p className="text-gray-900 dark:text-white font-medium">
            {payload[0].payload.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {formatCurrency(payload[0].value, itemCurrency, itemCurrencySymbol)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {percentage.toFixed(1)}% of portfolio
          </p>
        </div>
      );
    }
    return null;
  };

  if (investments.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-white dark:bg-gray-800 border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Portfolio Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                No investments to display
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Investment Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                No investments to display
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <Card className="bg-white dark:bg-gray-800 border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Composition
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  }
                  labelLine={false}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Investment Returns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={returnsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value, currency, currencySymbol)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="invested"
                  fill="hsl(var(--chart-1))"
                  name="Invested"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="return"
                  fill="hsl(var(--chart-2))"
                  name="Return"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};