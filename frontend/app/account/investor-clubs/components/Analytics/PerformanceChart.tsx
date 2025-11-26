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
} from 'recharts';
import { motion } from 'framer-motion';
import { Club } from '../../clubTypes';

interface TimeSeriesData {
  period: string;
  portfolio_value: number;
  contributions?: number;
  investments?: number;
  returns?: number;
}

interface PerformanceChartProps {
  data?: TimeSeriesData[];
  club?: Club;
}

// Helper function to format currency values
const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PerformanceChart = ({ data, club }: PerformanceChartProps) => {
  // Use real data or generate sample data for demonstration
  const chartData = data || generateSampleData();

  // Function to generate sample data if no real data
  function generateSampleData() {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let portfolioValue = 100000;

    return months.map((month, index) => {
      const growth = Math.random() * 10000 - 2000; // Random growth between -2k and +8k
      const contributions = Math.random() * 15000 + 5000; // Random contributions between 5k and 20k
      portfolioValue += contributions + growth;

      return {
        period: month,
        portfolio_value: Math.round(portfolioValue),
        contributions: Math.round(contributions),
        returns: Math.round(growth),
      };
    });
  }

  // Custom tooltip formatter
  const formatTooltipValue = (value: number, name: string) => {
    const formattedValue = formatCurrency(value, club?.currency);
    const labelMap: { [key: string]: string } = {
      portfolio_value: 'Portfolio Value',
      contributions: 'Contributions',
      returns: 'Returns',
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
          <LineChart
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
            <Line
              type="monotone"
              dataKey="portfolio_value"
              stroke="#10B981" // Emerald-500
              strokeWidth={3}
              dot={{
                fill: '#10B981',
                stroke: '#FFFFFF',
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: '#059669', // Emerald-600
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
              name="portfolio_value"
            />
            <Line
              type="monotone"
              dataKey="contributions"
              stroke="#22C55E" // Green-500
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{
                fill: '#22C55E',
                stroke: '#FFFFFF',
                strokeWidth: 2,
                r: 3,
              }}
              activeDot={{
                r: 5,
                fill: '#16A34A', // Green-600
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
              name="contributions"
            />
            <Line
              type="monotone"
              dataKey="returns"
              stroke="#F97316" // Orange-500
              strokeWidth={2}
              dot={{
                fill: '#F97316',
                stroke: '#FFFFFF',
                strokeWidth: 2,
                r: 3,
              }}
              activeDot={{
                r: 5,
                fill: '#EA580C', // Orange-600
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
              name="returns"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-emerald-500"></div>
            <span className="text-sm text-gray-600">Portfolio Value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-500 border border-green-500 border-dashed"></div>
            <span className="text-sm text-gray-600">Contributions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-orange-500"></div>
            <span className="text-sm text-gray-600">Returns</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};