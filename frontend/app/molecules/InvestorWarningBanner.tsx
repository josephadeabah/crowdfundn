// components/InvestorWarningBanner.tsx
'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';

interface InvestorWarningBannerProps {
  className?: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

const InvestorWarningBanner: React.FC<InvestorWarningBannerProps> = ({
  className,
  onDismiss,
  dismissible = true,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'bg-white border-b border-gray-200 text-gray-900 z-50',
        'px-2 py-1 md:px-3 md:py-2',
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-sm md:text-base font-medium mb-1 text-green-700">
              Investment Risk Warning
            </div>
            <div className="text-xs leading-relaxed space-y-1 text-gray-700">
              <p>
                Investments in startups and unlisted companies are speculative
                and carry high risks. You may lose your entire investment and
                should only invest money you can afford to lose.
              </p>
              <p>
                <strong className="text-orange-600">Diversify your portfolio:</strong>{' '}
                To mitigate risk, consider spreading your investments across multiple
                opportunities rather than concentrating your capital in a single
                venture.
              </p>

              {/* New SEC Regulation Notice */}
              <div className="border-l-4 border-green-500 bg-green-50 text-green-700 p-2 rounded-sm">
                <p className="font-semibold text-xs mb-1">
                  Important Regulatory Notice:
                </p>
                <p className="text-xs">
                  BantuHive is currently undergoing SEC regulation review before
                  commencing acceptance of investment campaigns. However,
                  Rewards and Donation crowdfunding remains open to both
                  fundraisers and supporters at this time.
                </p>
              </div>
            </div>
          </div>

          {dismissible && (
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-6 w-6 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Dismiss warning"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorWarningBanner;
