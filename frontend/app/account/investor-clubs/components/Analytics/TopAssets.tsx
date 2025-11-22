import { Card } from '@/app/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';

interface AssetData {
  name: string;
  ticker?: string;
  value: number; // Changed from string to number
  change: number; // Changed from string to number
  isPositive: boolean;
}

interface TopAssetsProps {
  data?: AssetData[];
  currency?: string;
}

export const TopAssets = ({ data, currency = 'USD' }: TopAssetsProps) => {
  // Use real data or generate sample data
  const assets = data || generateSampleData();

  // Function to generate sample data if no real data
  function generateSampleData(): AssetData[] {
    return [
      {
        name: 'Technology Fund',
        ticker: 'TECH',
        value: 45230, // Changed to number
        change: 12.5, // Changed to number
        isPositive: true,
      },
      {
        name: 'Real Estate Trust',
        ticker: 'REIT',
        value: 38450, // Changed to number
        change: 8.3, // Changed to number
        isPositive: true,
      },
      {
        name: 'Healthcare ETF',
        ticker: 'HEAL',
        value: 32100, // Changed to number
        change: 15.7, // Changed to number
        isPositive: true,
      },
      {
        name: 'Consumer Index',
        ticker: 'CONS',
        value: 28900, // Changed to number
        change: 6.2, // Changed to number
        isPositive: true,
      },
      {
        name: 'Energy Sector',
        ticker: 'NRG',
        value: 25780, // Changed to number
        change: -2.1, // Changed to number
        isPositive: false,
      },
    ];
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  if (assets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-4 md:p-6 border border-gray-200">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800">
            Top Performing Assets
          </h3>
          <div className="text-center py-8">
            <p className="text-gray-500">No asset data available</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-4 md:p-6 border border-gray-200">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800">
          Top Performing Assets
        </h3>
        <div className="space-y-4">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {asset.name}
                </p>
                {asset.ticker && (
                  <p className="text-sm text-gray-500">{asset.ticker}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(asset.value)}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  {asset.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <p
                    className={cn(
                      'text-sm font-medium',
                      asset.isPositive ? 'text-green-600' : 'text-red-600',
                    )}
                  >
                    {formatPercentage(asset.change)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Value</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(
                assets.reduce((sum, asset) => sum + asset.value, 0),
              )}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
