// components/InvestorWarningBanner.tsx
'use client';

import React from 'react';
import { AlertTriangle, AlertTriangleIcon, X, XIcon } from 'lucide-react';
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
        'bg-warning-banner border-warning-banner-border border-b text-warning-banner-foreground',
        'px-4 py-3 md:px-6 md:py-4',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle 
              className="h-5 w-5 text-warning-banner-accent" 
              aria-hidden="true"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm md:text-base font-medium mb-1">
              Investment Risk Warning
            </div>
            <div className="text-xs md:text-sm leading-relaxed space-y-1">
              <p>
                <strong>Capital at risk:</strong> Investments in unlisted companies are speculative and carry high risks. 
                You may lose 100% of your investment and should only invest money you can afford to lose.
              </p>
              <p className="hidden sm:block">
                <strong>Illiquid investments:</strong> Shares in unlisted companies are highly illiquid and may be difficult to sell. 
                Investments should be considered long-term commitments.
              </p>
            </div>
          </div>

          {dismissible && (
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-8 w-8 text-warning-banner-foreground hover:bg-warning-banner-foreground/10"
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
