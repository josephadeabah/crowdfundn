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

const data = [
  { name: 'Tech Stocks', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Real Estate', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Bonds', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Cryptocurrency', value: 15, color: 'hsl(var(--chart-4))' },
  { name: 'Commodities', value: 5, color: 'hsl(var(--chart-5))' },
];

export const PortfolioChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 md:p-6 border border-border/50">
        <h3 className="text-base md:text-lg font-semibold mb-4">
          Portfolio Allocation
        </h3>
        <ResponsiveContainer width="100%" height={250} minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};
