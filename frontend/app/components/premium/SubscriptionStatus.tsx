'use client';
import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { usePremium } from '@/app/context/premium/PremiumContext';
import { FaExclamationTriangle } from 'react-icons/fa';
import AlertPopup from '../alertpopup/AlertPopup';

const SubscriptionStatus = () => {
  const {
    subscription,
    subscriptionLoading,
    actionLoading,
    cancelSubscription,
    fetchSubscription,
  } = usePremium();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelResult, setCancelResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Function to format date in a more human-readable way
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If expiry is within 7 days, show relative time
    if (diffDays <= 7 && diffDays >= 0) {
      if (diffDays === 0) return 'today';
      if (diffDays === 1) return 'tomorrow';
      return `in ${diffDays} days`;
    }

    // Otherwise show a friendly date format
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchSubscription();
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loading state if subscription is loading
  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-bantu-green" />
      </div>
    );
  }

  if (!subscription?.has_premium) {
    return null;
  }

  const isCancelled = subscription.active_subscription?.status === 'cancelled';

  const handleCancelConfirm = async () => {
    setShowCancelConfirm(false);

    try {
      await cancelSubscription();
      setCancelResult({
        type: 'success',
        message:
          'Subscription cancelled successfully. You will lose access to premium features immediately.',
      });
    } catch (error) {
      setCancelResult({
        type: 'error',
        message: 'Failed to cancel subscription. Please try again.',
      });
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
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-green-900 text-lg">
                Premium Membership Active
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1 h-6 w-6"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>

            <p className="text-green-700 text-sm">
              You're on the{' '}
              <span className="font-medium">
                {subscription.current_plan?.name}
              </span>{' '}
              plan
            </p>

            {subscription.expires_at && (
              <p className="text-green-700 text-sm mt-1">
                {isCancelled ? 'Access ended ' : 'Expires '}
                {formatExpiryDate(subscription.expires_at)}
              </p>
            )}

            {isCancelled && (
              <p className="text-amber-600 text-sm mt-1 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Cancelled
              </p>
            )}
          </div>

          {!isCancelled && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelClick}
              disabled={actionLoading}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 whitespace-nowrap"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Cancelling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Popup */}
      <AlertPopup
        title="Cancel Subscription"
        message={
          <span>
            Are you sure you want to cancel your subscription? You will lose
            access to premium features immediately. This action cannot be
            undone.
          </span>
        }
        isOpen={showCancelConfirm}
        setIsOpen={setShowCancelConfirm}
        onConfirm={handleCancelConfirm}
        icon={<FaExclamationTriangle className="w-6 h-6 text-red-600" />}
        confirmText="Yes, Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        loading={actionLoading}
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
