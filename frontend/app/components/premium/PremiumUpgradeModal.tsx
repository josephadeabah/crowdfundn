// app/account/components/premium/PremiumUpgradeModal.tsx
'use client';
import React from 'react';
import { Star, CheckCircle, Zap, Shield, Crown } from 'lucide-react';
import Modal from '@/app/components/modal/Modal';
import { FaCashRegister } from 'react-icons/fa';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  onUpgrade?: () => void;
}

const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
  featureName = 'this feature',
  onUpgrade,
}) => {
  // Enhanced upgrade logic to match ProfileTabs exactly
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Use localStorage to communicate with ProfileTabs
      localStorage.setItem('activeTab', 'Settings');
      localStorage.setItem('forceScrollToSubscription', 'true');

      // Create the exact URL pattern that ProfileTabs expects
      const url = new URL(window.location.href);
      url.hash = 'Settings';
      url.searchParams.set('subscribe', 'true');
      window.history.replaceState(null, '', url.toString());

      // Force a page reload to ensure ProfileTabs picks up the change
      // This is necessary because we're in a modal and need to trigger the parent component
      window.location.reload();
    }
  };

  // Alternative: Navigate to Settings without reload if possible
  const handleCheckSubscription = () => {
    localStorage.setItem('activeTab', 'Settings');

    const url = new URL(window.location.href);
    url.hash = 'Settings';
    window.history.replaceState(null, '', url.toString());

    // Trigger hashchange event for ProfileTabs
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
      closeOnBackdropClick={true}
    >
      <div className="bg-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Upgrade to Premium
            </h2>
          </div>
        </div>

        {/* Modal Content */}
        <div>
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Unlock Premium Features
            </h3>
            <p className="text-gray-600">
              To send messages to investment clubs and access other premium
              features, you need to upgrade your account.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-transparent rounded-lg">
              <CheckCircle className="h-5 w-5 text-amber-500" />
              <span className="text-gray-700 font-medium">
                Direct messaging with all investment clubs
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Zap className="h-5 w-5 text-purple-500" />
              <span className="text-gray-700 font-medium">
                Advanced analytics and insights
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700 font-medium">
                Priority support
              </span>
            </div>
          </div>

          {/* Action Buttons - Side by side on all devices */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Maybe Later Button - First on mobile, left on desktop */}
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
            >
              Maybe Later
            </button>

            {/* Main Upgrade Button - Second on mobile, right on desktop */}
            <button
              onClick={handleUpgrade}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <FaCashRegister className="w-3 h-3" />
              </div>
              <span>Go Premium</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already premium?{' '}
            <button
              onClick={handleCheckSubscription}
              className="text-amber-600 hover:text-amber-700 font-medium underline"
            >
              Check your subscription
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default PremiumUpgradeModal;
