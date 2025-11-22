import { Card } from '@/app/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  loading?: boolean;
}

export const StatsCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  loading = false,
}: StatsCardProps) => {
  // Format value if it's a number
  const formattedValue =
    typeof value === 'number'
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)
      : value;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-4 md:p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
            </div>
            <div className="p-3 rounded-lg bg-gray-200 animate-pulse">
              <div className="w-6 h-6"></div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-4 md:p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="space-y-1 md:space-y-2">
            <p className="text-xs md:text-sm text-gray-600">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {formattedValue}
            </p>
            <p
              className={cn(
                'text-sm font-medium',
                changeType === 'positive' && 'text-green-600',
                changeType === 'negative' && 'text-red-600',
                changeType === 'neutral' && 'text-gray-500',
              )}
            >
              {change}
            </p>
          </div>
          <div
            className={cn(
              'p-3 rounded-lg',
              changeType === 'positive' && 'bg-green-100',
              changeType === 'negative' && 'bg-red-100',
              changeType === 'neutral' && 'bg-gray-100',
            )}
          >
            <Icon
              className={cn(
                'h-6 w-6',
                changeType === 'positive' && 'text-green-600',
                changeType === 'negative' && 'text-red-600',
                changeType === 'neutral' && 'text-gray-500',
              )}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
