import React from 'react';
import { Plus } from 'lucide-react';
import { useKYCStatus } from '@/app/hooks/useKYCStatus';

interface CreateClubCardProps {
  onCreateClub: () => void;
}

export const CreateClubCard: React.FC<CreateClubCardProps> = ({ onCreateClub }) => {
  const { kycStatus, loading: kycLoading } = useKYCStatus();
  
  const isKycVerified = kycStatus?.verified && !kycStatus?.is_expired;

  const handleCreateClick = () => {
    if (!isKycVerified) {
      // The actual KYC alert will be handled by the parent component
      onCreateClub();
      return;
    }
    onCreateClub();
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-indigo-100 rounded-lg p-4 border border-emerald-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Plus className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-emerald-900 text-sm mb-1">
            {isKycVerified ? 'Create New Club' : 'KYC Required'}
          </h3>
          <p className="text-emerald-700 text-xs mb-3">
            {isKycVerified 
              ? 'Start a new investment club and invite members'
              : 'Complete KYC verification to create investment clubs'
            }
          </p>
          <button
            onClick={handleCreateClick}
            disabled={kycLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {kycLoading ? 'Checking...' : isKycVerified ? 'Create Club' : 'Verify KYC'}
          </button>
        </div>
      </div>
      
      {/* KYC Notice */}
      {!isKycVerified && !kycLoading && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          <strong>KYC verification required</strong> to create investment clubs
        </div>
      )}
    </div>
  );
};