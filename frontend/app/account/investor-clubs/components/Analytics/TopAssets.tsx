import { Card } from '@/app/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';

const assets = [
  {
    name: 'Apple Inc.',
    ticker: 'AAPL',
    value: '$45,230',
    change: '+12.5%',
    isPositive: true,
  },
  {
    name: 'Microsoft Corp.',
    ticker: 'MSFT',
    value: '$38,450',
    change: '+8.3%',
    isPositive: true,
  },
  {
    name: 'Tesla Inc.',
    ticker: 'TSLA',
    value: '$32,100',
    change: '+15.7%',
    isPositive: true,
  },
  {
    name: 'Amazon.com',
    ticker: 'AMZN',
    value: '$28,900',
    change: '+6.2%',
    isPositive: true,
  },
  {
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    value: '$25,780',
    change: '-2.1%',
    isPositive: false,
  },
];

export const TopAssets = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-4 md:p-6 border border-border/50">
        <h3 className="text-base md:text-lg font-semibold mb-4">
          Top Performing Assets
        </h3>
        <div className="space-y-4">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.ticker}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
            >
              <div>
                <p className="font-medium">{asset.name}</p>
                <p className="text-sm text-muted-foreground">{asset.ticker}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{asset.value}</p>
                <div className="flex items-center gap-1 justify-end">
                  {asset.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <p
                    className={cn(
                      'text-sm font-medium',
                      asset.isPositive ? 'text-success' : 'text-destructive',
                    )}
                  >
                    {asset.change}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
