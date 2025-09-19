// components/InvestorWarningBanner.tsx
'use client';

import React from 'react';
import { X } from 'lucide-react';
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
        'bg-gray-300 text-black z-50',
        'px-4 py-3',
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              Don't invest unless you're prepared to lose all the money you invest. 
              This is a high-risk investment and you are unlikely to be protected if 
              something goes wrong.{' '}
              <a 
                href="/risk-warning" 
                className="text-gray-700-600 hover:text-gray-800 underline font-medium"
              >
                Take 2 mins to learn more
              </a>
            </p>
          </div>

          {dismissible && (
            <div className="flex-shrink-0 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-6 w-6 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
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