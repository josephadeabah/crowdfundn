// app/components/premium/SubscriptionStatus.tsx
'use client';
import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';
import { usePremium } from '@/app/context/premium/PremiumContext';
import { FaExclamationTriangle } from 'react-icons/fa';
import AlertPopup from '../alertpopup/AlertPopup';

const SubscriptionStatus = () => {
  const { subscription, loading, cancelSubscription } = usePremium();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelResult, setCancelResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    setShowCancelConfirm(false);

    try {
      await cancelSubscription();
      setCancelResult({
        type: 'success',
        message: 'Subscription cancelled successfully',
      });
    } catch (error) {
      setCancelResult({
        type: 'error',
        message: 'Failed to cancel subscription. Please try again.',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  return (
    <>
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
            onClick={handleCancelClick}
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

      {/* Cancel Confirmation Popup */}
      <AlertPopup
        title="Cancel Subscription"
        message={
          <span>
            Are you sure you want to cancel your subscription? You will lose
            access to premium features at the end of your billing period.
          </span>
        }
        isOpen={showCancelConfirm}
        setIsOpen={setShowCancelConfirm}
        onConfirm={handleCancelConfirm}
        icon={<FaExclamationTriangle className="w-6 h-6 text-red-600" />}
        confirmText="Yes, Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        loading={isCancelling}
      />

      {/* Success/Error Result Popup */}
      <AlertPopup
        title={cancelResult?.type === 'success' ? 'Success' : 'Error'}
        message={cancelResult?.message || ''}
        isOpen={!!cancelResult}
        setIsOpen={() => setCancelResult(null)}
        onConfirm={() => setCancelResult(null)}
        icon={
          cancelResult?.type === 'success' ? (
            <div className="w-6 h-6 text-green-600">✓</div>
          ) : (
            <FaExclamationTriangle className="w-6 h-6 text-red-600" />
          )
        }
        confirmText="OK"
        confirmButtonClass={
          cancelResult?.type === 'success'
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        }
      />
    </>
  );
};

export default SubscriptionStatus;
