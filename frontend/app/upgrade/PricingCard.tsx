import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';

type PricingFeature = {
  title: string;
  included: boolean;
};

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  gradient?: boolean;
}

const PricingCard = ({
  name,
  price,
  description,
  features,
  popular = false,
  gradient = false,
}: PricingCardProps) => {
  return (
    <div
      className={cn(
        'pricing-card',
        popular && 'popular',
        gradient && 'bg-pricing-gradient text-white',
      )}
    >
      {popular && <div className="card-highlight">Popular</div>}

      <div className="mb-4">
        <h3 className={cn('text-2xl font-bold', gradient && 'text-white')}>
          {name}
        </h3>
        <div className="mt-2">
          <span className={cn('text-4xl font-bold', gradient && 'text-white')}>
            {price}
          </span>
          <span
            className={cn(
              'text-muted-foreground ml-1',
              gradient && 'text-white/80',
            )}
          >
            /month
          </span>
        </div>
      </div>

      <p
        className={cn(
          'mt-2 mb-4 text-sm',
          gradient ? 'text-white/80' : 'text-muted-foreground',
        )}
      >
        {description}
      </p>

      <Button
        className={cn(
          'w-full mt-6',
          gradient
            ? 'bg-white text-bantu-orange hover:bg-gray-100'
            : 'bg-bantu-green text-white hover:bg-bantu-dark-green',
        )}
      >
        Get started
      </Button>

      <ul className="mt-8 space-y-3 pricing-feature-list">
        {features.map((feature, index) => (
          <li key={index} className="pricing-feature-item">
            <Check
              className={cn(
                'h-5 w-5 flex-shrink-0',
                gradient ? 'text-white' : 'text-bantu-green',
              )}
            />
            <span className={cn(gradient && 'text-white')}>{feature}</span>
          </li>
        ))}
        {/* Add analytics-specific features */}
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span className="ml-2">Advanced Funding Analytics</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span className="ml-2">Performance Metrics</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span className="ml-2">Geographic Funding Insights</span>
        </li>
      </ul>
    </div>
  );
};

export default PricingCard;
