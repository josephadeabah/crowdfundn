// components/InvestorWarningBanner.tsx
'use client';

import React from 'react';
import { AlertTriangleIcon, XIcon } from 'lucide-react';
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
        'bg-gray-300 text-black px-4 py-3 flex items-center justify-between w-full',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <AlertTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm font-medium">
          Warning: Equity crowdfunding involves risks, including potential loss
          of principal. Past performance is not indicative of future results.
          Please review all offering documents carefully before investing.
        </p>
      </div>

      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-600 hover:text-gray-800 hover:bg-gray-300"
          onClick={handleDismiss}
          aria-label="Dismiss warning"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default InvestorWarningBanner;
