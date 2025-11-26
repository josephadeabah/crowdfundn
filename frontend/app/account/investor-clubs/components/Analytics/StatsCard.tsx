// app/account/investor-clubs/components/Analytics/StatsCard.tsx
import { Card } from '@/app/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import { Club } from '../../clubTypes';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  loading?: boolean;
  club?: Club;
}

// Safe helper function to format values with proper decimal places
const formatValue = (value: any, isCurrency: boolean = false, currency: string = 'USD', decimalPlaces: number = 2): string => {
  try {
    if (value === undefined || value === null || value === '') return 'N/A';
    
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (isNaN(num)) return 'N/A';
    
    if (isCurrency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(num);
    }
    
    return decimalPlaces === 0 ? Math.round(num).toString() : num.toFixed(decimalPlaces);
  } catch (error) {
    console.warn('Formatting error:', error, value);
    return 'N/A';
  }
};

export const StatsCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  loading = false,
  club,
}: StatsCardProps) => {
  // Determine if the value should be formatted as currency
  const isCurrencyValue =
    typeof value === 'number' &&
    (title.toLowerCase().includes('value') ||
      title.toLowerCase().includes('return') ||
      title.toLowerCase().includes('amount') ||
      title.toLowerCase().includes('price') ||
      title.toLowerCase().includes('cost'));

  const formattedValue = isCurrencyValue
    ? formatValue(value, true, club?.currency || 'USD', 0)
    : formatValue(value, false, club?.currency || 'USD', 0);

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