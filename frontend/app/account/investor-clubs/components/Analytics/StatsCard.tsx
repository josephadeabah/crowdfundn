import { Card } from '@/app/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
}

export const StatsCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-4 md:p-6 border border-border/50">
        <div className="flex items-start justify-between">
          <div className="space-y-1 md:space-y-2">
            <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl md:text-3xl font-bold">{value}</p>
            <p
              className={cn(
                'text-sm font-medium',
                changeType === 'positive' && 'text-success',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground',
              )}
            >
              {change}
            </p>
          </div>
          <div
            className={cn(
              'p-3 rounded-lg',
              changeType === 'positive' && 'bg-success/10',
              changeType === 'negative' && 'bg-destructive/10',
              changeType === 'neutral' && 'bg-muted',
            )}
          >
            <Icon
              className={cn(
                'h-6 w-6',
                changeType === 'positive' && 'text-success',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground',
              )}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
