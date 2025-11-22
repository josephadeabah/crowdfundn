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

const data = [
  { month: 'Jan', value: 125000 },
  { month: 'Feb', value: 132000 },
  { month: 'Mar', value: 128000 },
  { month: 'Apr', value: 145000 },
  { month: 'May', value: 152000 },
  { month: 'Jun', value: 168000 },
  { month: 'Jul', value: 175000 },
  { month: 'Aug', value: 182000 },
  { month: 'Sep', value: 178000 },
  { month: 'Oct', value: 195000 },
  { month: 'Nov', value: 208000 },
  { month: 'Dec', value: 224500 },
];

export const PerformanceChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="p-4 md:p-6 border border-border/50">
        <h3 className="text-base md:text-lg font-semibold mb-4">
          Performance Over Time
        </h3>
        <ResponsiveContainer width="100%" height={250} minWidth={0}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                'Portfolio Value',
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};
