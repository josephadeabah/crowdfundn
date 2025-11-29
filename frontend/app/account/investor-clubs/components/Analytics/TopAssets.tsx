// app/account/investor-clubs/components/Analytics/TopAssets.tsx
import { Card } from '@/app/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';

interface AssetData {
  name: string;
  ticker?: string;
  value: number;
  change: number;
  isPositive: boolean;
  company_info?: {
    name: string;
    description?: string;
    headquarters?: string;
    website?: string;
  };
}

interface TopAssetsProps {
  data?: AssetData[];
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
const formatPercentage = (value: any, decimalPlaces: number = 1): string => {
  try {
    if (value === undefined || value === null || value === '') return 'N/A';

    let numValue: number;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d.-]/g, '');
      numValue = parseFloat(cleaned);
    } else if (typeof value === 'number') {
      numValue = value;
    } else {
      numValue = Number(value);
    }

    if (isNaN(numValue) || !isFinite(numValue)) {
      return 'N/A';
    }

    const formatted = Math.abs(numValue).toFixed(decimalPlaces);
    return `${numValue >= 0 ? '+' : ''}${formatted}%`;
  } catch (error) {
    console.warn('Percentage formatting error:', error, value);
    return 'N/A';
  }
};

export const TopAssets = ({ data, currency = 'USD' }: TopAssetsProps) => {
  // Use real data from props
  const assets = data || [];

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
            <p className="text-sm text-gray-400 mt-2">
              Asset performance will appear as investments grow
            </p>
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
          {assets.map((asset, index) => {
            // Use company_info.name if available, otherwise fall back to asset.name
            const displayName = asset.company_info?.name || asset.name;

            return (
              <motion.div
                key={asset.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {displayName}
                  </p>
                  {asset.ticker && (
                    <p className="text-sm text-gray-500">{asset.ticker}</p>
                  )}
                  {asset.company_info?.description && (
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {asset.company_info.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(asset.value, currency)}
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
                      {formatPercentage(asset.change, 1)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Value</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(
                assets.reduce((sum, asset) => sum + asset.value, 0),
                currency,
              )}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};