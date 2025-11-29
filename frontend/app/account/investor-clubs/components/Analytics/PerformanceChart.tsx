// app/account/investor-clubs/components/Analytics/PerformanceChart.tsx
import { Card } from '@/app/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';
import { Club } from '../../clubTypes';

interface TimeSeriesData {
  period: string;
  portfolio_value: number;
  contributions?: number;
  investments?: number;
  returns?: number;
  total_invested?: number;
  investments_count?: number;
  successful_investments?: number;
}

interface PerformanceChartProps {
  data?: TimeSeriesData[];
  club?: Club;
}

// Safe helper function to format currency values
const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  try {
    if (amount === undefined || amount === null || isNaN(amount)) return 'N/A';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    console.warn('Currency formatting error:', error, amount);
    return 'N/A';
  }
};

export const PerformanceChart = ({ data, club }: PerformanceChartProps) => {
  // Use real data from props
  const chartData = data || [];

  // Custom tooltip formatter
  const formatTooltipValue = (value: number, name: string) => {
    const formattedValue = formatCurrency(value, club?.currency);
    const labelMap: { [key: string]: string } = {
      portfolio_value: 'Portfolio Value',
      contributions: 'Contributions',
      returns: 'Returns',
      total_invested: 'Total Invested',
      investments_count: 'Investments Count',
      successful_investments: 'Successful Investments',
    };
    return [formattedValue, labelMap[name] || name];
  };

  // Format Y-axis values
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-4 md:p-6 border border-gray-200">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800">
            Performance Over Time
          </h3>
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <p>No performance data available</p>
              <p className="text-sm mt-2">Performance data will appear as investments grow</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="p-4 md:p-6 border border-gray-200">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800">
          Performance Over Time
        </h3>
        <ResponsiveContainer width="100%" height={250} minWidth={0}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="period"
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={formatTooltipValue}
              labelStyle={{ color: '#374151', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="portfolio_value"
              stroke="#10B981"
              fill="url(#portfolioGradient)"
              strokeWidth={3}
              fillOpacity={0.3}
              name="portfolio_value"
            />
            <defs>
              <linearGradient
                id="portfolioGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>

        {/* Additional Metrics */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {chartData[chartData.length - 1].investments_count || 0}
              </div>
              <div className="text-gray-500">Total Investments</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {chartData[chartData.length - 1].successful_investments || 0}
              </div>
              <div className="text-gray-500">Successful</div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};