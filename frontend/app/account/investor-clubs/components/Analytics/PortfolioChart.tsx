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

// Helper function to format currency values
const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format percentages
const formatPercentage = (value: number, decimalPlaces: number = 1): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

export const PortfolioChart = ({
  data,
  currency = 'USD',
}: PortfolioChartProps) => {
  // Use real data or generate sample data
  const chartData = data || generateSampleData();

  // Function to generate sample data if no real data
  function generateSampleData(): SectorData[] {
    const sectors = [
      { name: 'Technology', value: 45230 },
      { name: 'Real Estate', value: 38450 },
      { name: 'Healthcare', value: 32100 },
      { name: 'Consumer', value: 28900 },
      { name: 'Energy', value: 25780 },
      { name: 'Other', value: 15640 },
    ];

    // Add colors based on sector
    const colors = [
      '#10B981', // Emerald
      '#3B82F6', // Blue
      '#8B5CF6', // Purple
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#6B7280', // Gray
    ];

    return sectors.map((sector, index) => ({
      ...sector,
      color: colors[index % colors.length],
    }));
  }

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