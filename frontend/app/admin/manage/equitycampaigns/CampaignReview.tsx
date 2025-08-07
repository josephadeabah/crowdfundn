'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { Progress } from '@/app/components/ui/progress';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';

interface CampaignReviewProps<T extends CampaignResponseDataType> {
  campaigns: T[];
  loading: boolean;
  error: string | null;
  approveCampaign: (id: string) => Promise<void>;
  rejectCampaign: (id: string, rejectionReason: string) => Promise<void>;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  statusFilter?: string;
  campaignTypeLabel?: string;
}

export function CampaignReview<T extends CampaignResponseDataType>({
  campaigns = [],
  loading,
  error,
  approveCampaign,
  rejectCampaign,
  getStatusColor,
  getStatusIcon,
  statusFilter = 'pending_approval',
  campaignTypeLabel = 'Campaign',
}: CampaignReviewProps<T>) {
  const [selectedCampaign, setSelectedCampaign] = useState<T | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);

  // Filter campaigns that need admin attention
  const pendingCampaigns =
    campaigns?.filter((campaign) => campaign.status === statusFilter) || [];

  const handleApprove = async (campaignId: string) => {
    try {
      await approveCampaign(campaignId);
      setIsApproveModalOpen(false);
    } catch (error) {
      console.error(
        `Failed to approve ${campaignTypeLabel.toLowerCase()}:`,
        error,
      );
    }
  };

  const handleReject = async (campaignId: string) => {
    try {
      if (!rejectionReason.trim()) return;
      await rejectCampaign(campaignId, rejectionReason);
      setIsRejectModalOpen(false);
      setRejectionReason('');
    } catch (error) {
      console.error(
        `Failed to reject ${campaignTypeLabel.toLowerCase()}:`,
        error,
      );
    }
  };

  if (loading) return <div>Loading campaigns...</div>;
  if (error) return <div>Error loading campaigns: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards - Generic implementation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total {campaignTypeLabel}s
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {campaigns?.length || 0}
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
                  Live {campaignTypeLabel}s
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {campaigns?.filter((c) => c.status === 'live').length || 0}
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
                  {campaigns
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
            <span>{campaignTypeLabel} Status</span>
            <Button size="sm">View All {campaignTypeLabel}s</Button>
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
                        Created by {campaign.fundraiser?.name || 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1 capitalize">
                          {campaign.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  {/* Campaign-specific details can be rendered here */}
                  {campaign.type === 'EquityCampaign' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Valuation: $
                          {(campaign as any).valuation?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Equity: {(campaign as any).equity_offered}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Investors: {(campaign as any).total_investors || 0}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {campaign.documents?.length || 0} Documents
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
                      onClick={() => setSelectedCampaign(campaign)}
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
                No {campaignTypeLabel.toLowerCase()}s pending approval
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approve Confirmation Modal */}
      <AlertPopup
        title={`Approve ${campaignTypeLabel}`}
        message={`Are you sure you want to approve ${selectedCampaign?.title || 'this ' + campaignTypeLabel.toLowerCase()}?`}
        isOpen={isApproveModalOpen}
        setIsOpen={setIsApproveModalOpen}
        onConfirm={() =>
          selectedCampaign && handleApprove(selectedCampaign.id.toString())
        }
        onCancel={() => setIsApproveModalOpen(false)}
        confirmText="Approve"
      />

      {/* Reject Confirmation Modal */}
      <AlertPopup
        title={`Reject ${campaignTypeLabel}`}
        message={
          <div className="space-y-4">
            <p>
              Are you sure you want to reject{' '}
              {selectedCampaign?.title ||
                'this ' + campaignTypeLabel.toLowerCase()}
              ?
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
                required
              />
            </div>
          </div>
        }
        isOpen={isRejectModalOpen}
        setIsOpen={setIsRejectModalOpen}
        onConfirm={() =>
          selectedCampaign && handleReject(selectedCampaign.id.toString())
        }
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
