// app/account/components/premium/PremiumUpgradeModal.tsx
'use client';
import React from 'react';
import { X, Star, CheckCircle, Zap, Shield } from 'lucide-react';

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
  if (!isOpen) return null;

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default upgrade action - redirect to pricing page
      window.location.href = '/account#Settings';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Upgrade to Premium
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
            >
              Upgrade Now
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Already premium?{' '}
            <a
              href="/account#Settings"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Check your subscription
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgradeModal;
