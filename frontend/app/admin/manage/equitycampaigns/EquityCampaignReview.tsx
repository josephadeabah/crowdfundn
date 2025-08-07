// components/campaign/CampaignReview/EquityCampaignReview.tsx
'use client';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';
import { CampaignReview } from './CampaignReview';
import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { useEffect } from 'react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending_approval':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'draft':
      return 'bg-blue-100 text-blue-800';
    case 'live':
      return 'bg-purple-100 text-purple-800';
    case 'funded':
      return 'bg-emerald-100 text-emerald-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-4 h-4" />;
    case 'pending_approval':
      return <Clock className="w-4 h-4" />;
    case 'rejected':
      return <XCircle className="w-4 h-4" />;
    case 'draft':
      return <FileText className="w-4 h-4" />;
    case 'live':
      return <TrendingUp className="w-4 h-4" />;
    case 'funded':
      return <DollarSign className="w-4 h-4" />;
    case 'closed':
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export function EquityCampaignReview() {
  const {
    equityCampaigns = [],
    loading,
    error,
    approveCampaign,
    rejectCampaign,
    fetchEquityCampaigns,
  } = useEquityCampaignContext();

  // Refresh campaigns when approval/rejection happens
  useEffect(() => {
    if (!loading && !error) {
      fetchEquityCampaigns();
    }
  }, [loading, error, fetchEquityCampaigns]);

  return (
    <CampaignReview
      campaigns={equityCampaigns}
      loading={loading}
      error={error}
      approveCampaign={approveCampaign}
      rejectCampaign={rejectCampaign}
      getStatusColor={getStatusColor}
      getStatusIcon={getStatusIcon}
      statusFilter="pending_approval"
      campaignTypeLabel="Equity Campaign"
    />
  );
}
