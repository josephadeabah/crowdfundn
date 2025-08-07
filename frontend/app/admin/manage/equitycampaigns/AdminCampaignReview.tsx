'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useEquityCampaignContext } from '@/app/contexts/account/campaign/EquityCampaignContext';
import { AlertPopup } from '@/app/components/alertpopup/AlertPopup';

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

export function AdminCampaignReview() {
  const { equityCampaigns, loading, error, approveCampaign, rejectCampaign } =
    useEquityCampaignContext();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  // Filter only equity campaigns that need admin attention
  const pendingCampaigns =
    equityCampaigns?.filter(
      (campaign) => campaign.equity_status === 'pending_approval',
    ) || [];

  const handleApprove = async (campaignId: string) => {
    try {
      await approveCampaign(campaignId);
      setIsApproveModalOpen(false);
    } catch (error) {
      console.error('Failed to approve campaign:', error);
    }
  };

  const handleReject = async (campaignId: string) => {
    try {
      await rejectCampaign(campaignId, rejectionReason);
      setIsRejectModalOpen(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject campaign:', error);
    }
  };

  if (loading) return <div>Loading campaigns...</div>;
  if (error) return <div>Error loading campaigns: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Campaigns
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {equityCampaigns?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Reviews
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingCampaigns.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Live Campaigns
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {equityCampaigns?.filter((c) => c.equity_status === 'live')
                    .length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Funding
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  $
                  {equityCampaigns
                    ?.reduce(
                      (sum, campaign) =>
                        sum + parseFloat(campaign.transferred_amount || '0'),
                      0,
                    )
                    .toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Campaign Status</span>
            <Button size="sm">View All Campaigns</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingCampaigns.map((campaign) => {
              const progress = campaign.goal_amount
                ? (parseFloat(campaign.transferred_amount || '0') /
                    parseFloat(campaign.goal_amount)) *
                  100
                : 0;

              return (
                <div
                  key={campaign.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created by {campaign.creator?.name || 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(campaign.equity_status)}>
                        {getStatusIcon(campaign.equity_status)}
                        <span className="ml-1 capitalize">
                          {campaign.equity_status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {campaign.documents?.filter(
                          (d) => d.status === 'approved',
                        ).length || 0}
                        /{campaign.documents?.length || 0} Documents
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {campaign.team_members?.length || 0} Team Members
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        $
                        {parseFloat(
                          campaign.transferred_amount || '0',
                        ).toLocaleString()}{' '}
                        / $
                        {parseFloat(
                          campaign.goal_amount || '0',
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Created:{' '}
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Funding Progress
                      </span>
                      <span className="text-sm text-gray-600">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        // You could implement a detailed view here
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setIsRejectModalOpen(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setIsApproveModalOpen(true);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              );
            })}

            {pendingCampaigns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No campaigns pending approval
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approve Confirmation Modal */}
      <AlertPopup
        title="Approve Campaign"
        message={`Are you sure you want to approve ${selectedCampaign?.title || 'this campaign'}?`}
        isOpen={isApproveModalOpen}
        setIsOpen={setIsApproveModalOpen}
        onConfirm={() => handleApprove(selectedCampaign?.id)}
        onCancel={() => setIsApproveModalOpen(false)}
        confirmText="Approve"
      />

      {/* Reject Confirmation Modal */}
      <AlertPopup
        title="Reject Campaign"
        message={
          <div className="space-y-4">
            <p>
              Are you sure you want to reject{' '}
              {selectedCampaign?.title || 'this campaign'}?
            </p>
            <div>
              <label
                htmlFor="rejectionReason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason for rejection
              </label>
              <textarea
                id="rejectionReason"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
              />
            </div>
          </div>
        }
        isOpen={isRejectModalOpen}
        setIsOpen={setIsRejectModalOpen}
        onConfirm={() => handleReject(selectedCampaign?.id)}
        onCancel={() => {
          setIsRejectModalOpen(false);
          setRejectionReason('');
        }}
        confirmText="Reject"
        confirmDisabled={!rejectionReason.trim()}
      />
    </div>
  );
}
