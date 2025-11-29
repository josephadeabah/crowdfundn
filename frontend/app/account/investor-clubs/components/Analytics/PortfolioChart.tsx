// app/account/investor-clubs/components/Analytics/PortfolioChart.tsx
import { Card } from '@/app/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import { deslugify } from '@/app/utils/helpers/categories';

interface SectorData {
  name: string;
  value: number;
  color?: string;
}

interface PortfolioChartProps {
  data?: SectorData[];
  currency?: string;
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

// Safe helper function to format percentages
const formatPercentage = (value: number, decimalPlaces: number = 1): string => {
  try {
    if (value === undefined || value === null || isNaN(value)) return 'N/A';
    return `${value.toFixed(decimalPlaces)}%`;
  } catch (error) {
    console.warn('Percentage formatting error:', error, value);
    return 'N/A';
  }
};

export const PortfolioChart = ({
  data,
  currency = 'USD',
}: PortfolioChartProps) => {
  // Use real data from props
  const chartData = data || [];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const formattedValue = formatCurrency(data.value, currency);
      const percentage = (data.value / totalValue) * 100;

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900">{deslugify(data.name)}</p>
          <p className="text-sm text-gray-600">
            {formattedValue} ({formatPercentage(percentage, 1)})
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = formatCurrency(totalValue, currency);

  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4 md:p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">
              Portfolio Allocation
            </h3>
            <span className="text-sm text-gray-500">Total: {formattedTotal}</span>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <p>No sector data available</p>
              <p className="text-sm mt-2">Sector allocation will appear as investments are made</p>
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
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 md:p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">
            Portfolio Allocation
          </h3>
          <span className="text-sm text-gray-500">Total: {formattedTotal}</span>
        </div>
        <ResponsiveContainer width="100%" height={250} minWidth={0}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${deslugify(name)} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || `hsl(${index * 60}, 70%, 50%)`}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};