// app/components/equity/PerformanceCharts.tsx
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { EquityInvestment } from '@/app/types/equityCampaigns.types';
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
}

export const PerformanceCharts = ({ investments }: PerformanceChartsProps) => {
  // Prepare data for portfolio composition pie chart
  const portfolioData = investments.reduce(
    (acc, investment) => {
      const campaignName =
        investment.campaign?.title || `Campaign ${investment.campaign_id}`;
      const currentValue = investment.current_value || investment.amount;

      const existing = acc.find((item) => item.name === campaignName);
      if (existing) {
        existing.value += currentValue;
      } else {
        acc.push({
          name: campaignName,
          value: currentValue,
        });
      }
      return acc;
    },
    [] as { name: string; value: number }[],
  );

  // Prepare data for returns bar chart
  const returnsData = investments.map((investment, index) => {
    const invested = investment.amount;
    const currentValue = investment.current_value || invested;
    const returnAmount = currentValue - invested;
    const returnPercentage = invested > 0 ? (returnAmount / invested) * 100 : 0;
    const campaignName =
      investment.campaign?.title || `Campaign ${investment.campaign_id}`;

    return {
      name: `Investment ${index + 1}`,
      campaign: campaignName,
      invested: invested,
      currentValue: currentValue,
      return: returnAmount,
      returnPercentage: returnPercentage,
    };
  });

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">
            {payload[0].payload.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-muted-foreground">
            {(
              (payload[0].value /
                portfolioData.reduce((sum, item) => sum + item.value, 0)) *
              100
            ).toFixed(1)}
            % of portfolio
          </p>
        </div>
      );
    }
    return null;
  };

  if (investments.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
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

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
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
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
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

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
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
                  tickFormatter={formatCurrency}
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
