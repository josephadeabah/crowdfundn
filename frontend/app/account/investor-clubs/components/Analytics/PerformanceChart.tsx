import { Card } from '@/app/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { month: 'Jan', portfolio: 125000, contributions: 120000, growth: 5000 },
  { month: 'Feb', portfolio: 132000, contributions: 125000, growth: 7000 },
  { month: 'Mar', portfolio: 128000, contributions: 130000, growth: -2000 },
  { month: 'Apr', portfolio: 145000, contributions: 135000, growth: 10000 },
  { month: 'May', portfolio: 152000, contributions: 140000, growth: 12000 },
  { month: 'Jun', portfolio: 168000, contributions: 145000, growth: 23000 },
  { month: 'Jul', portfolio: 175000, contributions: 150000, growth: 25000 },
  { month: 'Aug', portfolio: 182000, contributions: 155000, growth: 27000 },
  { month: 'Sep', portfolio: 178000, contributions: 160000, growth: 18000 },
  { month: 'Oct', portfolio: 195000, contributions: 165000, growth: 30000 },
  { month: 'Nov', portfolio: 208000, contributions: 170000, growth: 38000 },
  { month: 'Dec', portfolio: 224500, contributions: 175000, growth: 49500 },
];

export const PerformanceChart = () => {
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
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number, name: string) => {
                const formattedValue = `$${value.toLocaleString()}`;
                const label = name === 'portfolio' ? 'Portfolio Value' : 
                             name === 'contributions' ? 'Total Contributions' : 
                             'Growth';
                return [formattedValue, label];
              }}
              labelStyle={{ color: '#374151', fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="portfolio"
              stroke="#10B981" // Emerald-500
              strokeWidth={3}
              dot={{ 
                fill: '#10B981',
                stroke: '#FFFFFF',
                strokeWidth: 2,
                r: 4 
              }}
              activeDot={{ 
                r: 6, 
                fill: '#059669', // Emerald-600
                stroke: '#FFFFFF',
                strokeWidth: 2
              }}
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
                r: 3 
              }}
              activeDot={{ 
                r: 5, 
                fill: '#16A34A', // Green-600
                stroke: '#FFFFFF',
                strokeWidth: 2
              }}
            />
            <Line
              type="monotone"
              dataKey="growth"
              stroke="#F97316" // Orange-500
              strokeWidth={2}
              dot={{ 
                fill: '#F97316',
                stroke: '#FFFFFF',
                strokeWidth: 2,
                r: 3 
              }}
              activeDot={{ 
                r: 5, 
                fill: '#EA580C', // Orange-600
                stroke: '#FFFFFF',
                strokeWidth: 2
              }}
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
            <span className="text-sm text-gray-600">Growth</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};