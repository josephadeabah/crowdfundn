// app/info/upgrade/PricingCard.tsx
'use client';
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import { PremiumPlan, usePremium } from '@/app/context/premium/PremiumContext';

interface PricingCardProps {
  plan: PremiumPlan;
  isCurrentPlan: boolean;
  popular?: boolean;
  proPlus?: boolean; // Changed from gradient to proPlus
}

const PricingCard = ({
  plan,
  isCurrentPlan,
  popular = false,
  proPlus = false, // Changed from gradient to proPlus
}: PricingCardProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createSubscription, subscription } = usePremium();

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const result = await createSubscription(plan.id);
      // Redirect to Paystack checkout
      window.location.href = result.authorization_url;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      // Handle error (show toast message, etc.)
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert features object to array for display
  const features = Object.entries(plan.features || {}).map(([key, value]) => {
    if (typeof value === 'boolean') {
      return value ? `${key}` : `${key} (Not included)`;
    }
    return `${key}: ${value}`;
  });

  return (
    <div
      className={cn(
        'relative p-6 rounded-lg border-2 transition-all duration-200 h-full flex flex-col',
        popular ? 'border-bantu-orange shadow-lg' : 'border-gray-200',
        proPlus
          ? 'bg-purple-50 border-purple-200' // Unique color for Pro+
          : 'bg-white',
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-bantu-orange text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      {proPlus && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Premium
          </span>
        </div>
      )}

      <div className="mb-4 text-center">
        <h3 className={cn('text-2xl font-bold', proPlus && 'text-purple-900')}>
          {plan.name}
        </h3>
        <div className="mt-2">
          <span
            className={cn(
              'text-4xl font-bold',
              proPlus ? 'text-purple-900' : 'text-gray-900',
            )}
          >
            {plan.currency} {plan.price}
          </span>
          <span
            className={cn(
              'ml-1 text-lg',
              proPlus ? 'text-purple-700' : 'text-gray-600',
            )}
          >
            /{plan.interval}
          </span>
        </div>
      </div>

      <p
        className={cn(
          'mt-2 mb-4 text-sm text-center flex-grow-0',
          proPlus ? 'text-purple-700' : 'text-gray-600',
        )}
      >
        {plan.description}
      </p>

      <Button
        className={cn(
          'w-full mt-6',
          proPlus
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : popular
              ? 'bg-bantu-orange text-white hover:bg-orange-600'
              : 'bg-bantu-green text-white hover:bg-bantu-dark-green',
          (isCurrentPlan || subscription?.has_premium) &&
            'bg-gray-400 cursor-not-allowed',
        )}
        onClick={handleSubscribe}
        disabled={isCurrentPlan || isProcessing || subscription?.has_premium}
      >
        {isProcessing
          ? 'Processing...'
          : isCurrentPlan
            ? 'Current Plan'
            : subscription?.has_premium
              ? 'Already Premium'
              : 'Get Started'}
      </Button>

      <ul className="mt-8 space-y-3 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check
              className={cn(
                'h-5 w-5 flex-shrink-0 mt-0.5',
                proPlus ? 'text-purple-600' : 'text-bantu-green',
              )}
            />
            <span
              className={cn(
                'ml-2 text-sm',
                proPlus ? 'text-purple-800' : 'text-gray-700',
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingCard;
