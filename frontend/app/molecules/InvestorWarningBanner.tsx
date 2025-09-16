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
        'bg-gray-300 border-b border-gray-300 text-black z-50',
        'px-4 py-2 md:px-6 md:py-2',
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle
              className="h-5 w-5 text-amber-600"
              aria-hidden="true"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm md:text-base font-medium mb-1">
              Investment Risk Warning
            </div>
            <div className="text-xs md:text-sm leading-relaxed space-y-1">
              <p>
                <strong>Capital at risk:</strong> Investments in startups and
                unlisted companies are speculative and carry high risks. You may
                lose 100% of your investment and should only invest money you
                can afford to lose.
              </p>
              <p className="text-xs">
                <strong>Diversify your portfolio:</strong> To mitigate risk,
                consider spreading your investments across multiple
                opportunities rather than concentrating your capital in a single
                venture.
              </p>

              {/* New SEC Regulation Notice with red background */}
              <div className="bg-red-400 text-white p-1 rounded-sm">
                <p className="font-semibold mb-1">
                  Important Regulatory Notice:
                  <span className="ms-1">
                  BantuHive is currently undergoing SEC regulation review before
                  commencing acceptance of investment campaigns. However,
                  Rewards and Donation crowdfunding remains open to both
                  fundraisers and supporters at this time.
                </span>
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
                className="h-8 w-8 text-gray-600 hover:bg-gray-300 hover:text-gray-800"
                aria-label="Dismiss warning"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorWarningBanner;
