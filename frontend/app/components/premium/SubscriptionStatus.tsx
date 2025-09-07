// app/components/premium/SubscriptionStatus.tsx
'use client';
import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';
import { usePremium } from '@/app/context/premium/PremiumContext';

const SubscriptionStatus = () => {
  const { subscription, loading, cancelSubscription } = usePremium();
  const [isCancelling, setIsCancelling] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-bantu-green" />
      </div>
    );
  }

  if (!subscription?.has_premium) {
    return null;
  }

  const handleCancel = async () => {
    if (
      window.confirm(
        'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
      )
    ) {
      setIsCancelling(true);
      try {
        await cancelSubscription();
        alert('Subscription cancelled successfully');
      } catch (error) {
        alert('Failed to cancel subscription. Please try again.');
      } finally {
        setIsCancelling(false);
      }
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-green-900 text-lg">
            Premium Membership Active
          </h3>
          <p className="text-green-700 text-sm mt-1">
            You're on the{' '}
            <span className="font-medium">
              {subscription.current_plan?.name}
            </span>{' '}
            plan
            {subscription.expires_at && (
              <>
                {' '}
                • Renews on{' '}
                {new Date(subscription.expires_at).toLocaleDateString()}
              </>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={isCancelling}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 whitespace-nowrap"
        >
          {isCancelling ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Cancelling...
            </>
          ) : (
            'Cancel Subscription'
          )}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
