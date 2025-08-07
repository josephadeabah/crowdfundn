'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { Progress } from '@/app/components/ui/progress';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';
import { EquityCampaignResponseDataType } from '@/app/types/equityCampaigns.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/app/components/popover/Popover';
import Modal from '@/app/components/modal/Modal';
import Avatar from '@/app/components/avatar/Avatar';
import ToastComponent from '@/app/components/toast/Toast';

interface CampaignReviewProps {
  statusFilter?: string;
}

export function CampaignReview({
  statusFilter = 'pending_approval',
}: CampaignReviewProps) {
  const router = useRouter();
  const {
    approveCampaign,
    rejectCampaign,
    fetchPendingReviewCampaigns,
    loading,
    error,
  } = useEquityCampaignContext();

  const [pendingCampaigns, setPendingCampaigns] = useState<
    EquityCampaignResponseDataType[]
  >([]);
  const [selectedCampaign, setSelectedCampaign] =
    useState<EquityCampaignResponseDataType | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  useEffect(() => {
    const loadPendingCampaigns = async () => {
      try {
        const campaigns = await fetchPendingReviewCampaigns();
        setPendingCampaigns(campaigns);
      } catch (err) {
        console.error('Failed to load campaigns:', err);
        showToast('Error', 'Failed to load campaigns', 'error');
      }
    };

    loadPendingCampaigns();
  }, [fetchPendingReviewCampaigns]);

  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning',
  ) => {
    setToast({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  const handleViewCampaignDetails = (
    campaign: EquityCampaignResponseDataType,
  ) => {
    const identifier = campaign.slug || campaign.id;
    router.push(`/campaign/${identifier}`);
  };

  const handleOpenModal = (campaign: EquityCampaignResponseDataType) => {
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCampaign(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-purple-100 text-purple-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'funded':
        return 'bg-emerald-100 text-emerald-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'live':
        return <TrendingUp className="w-4 h-4" />;
      case 'funded':
        return <DollarSign className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      case 'draft':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleApprove = async (campaignId: string) => {
    try {
      await approveCampaign(campaignId);
      setPendingCampaigns((prev) =>
        prev.filter((c) => c.id.toString() !== campaignId),
      );
      setIsApproveModalOpen(false);
      showToast('Success', 'Campaign approved successfully', 'success');
    } catch (error) {
      console.error('Failed to approve campaign:', error);
      showToast('Error', 'Failed to approve campaign', 'error');
    }
  };

  const handleReject = async (campaignId: string, reason: string) => {
    try {
      if (!reason.trim()) return;
      await rejectCampaign(campaignId, reason);
      setPendingCampaigns((prev) =>
        prev.filter((c) => c.id.toString() !== campaignId),
      );
      setIsRejectModalOpen(false);
      setRejectionReason('');
      showToast('Success', 'Campaign rejected successfully', 'success');
    } catch (error) {
      console.error('Failed to reject campaign:', error);
      showToast('Error', 'Failed to reject campaign', 'error');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading campaigns...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-4">Error loading campaigns: {error}</div>
    );

  return (
    <div className="px-2 py-4">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Campaign Review
          </h2>
          <p className="text-gray-500 dark:text-neutral-400">
            Review and approve pending campaigns
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Reviews
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingCampaigns.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Funding
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {pendingCampaigns
                    .reduce(
                      (sum, campaign) =>
                        sum + parseFloat(campaign.transferred_amount || '0'),
                      0,
                    )
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Team Members
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingCampaigns.reduce(
                    (sum, campaign) =>
                      sum + (campaign.team_members?.length || 0),
                    0,
                  )}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Grid */}
      {pendingCampaigns.length === 0 ? (
        <p className="text-gray-500 dark:text-neutral-400 mt-4">
          No campaigns pending review.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {pendingCampaigns.map((campaign) => {
            const progress = campaign.goal_amount
              ? (parseFloat(campaign.transferred_amount || '0') /
                  parseFloat(campaign.goal_amount || '0')) *
                100
              : 0;

            return (
              <div
                key={campaign.id}
                className="relative p-4 bg-white dark:bg-neutral-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex-1 pr-4">
                    {campaign.title}
                  </h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200">
                        <DotsVerticalIcon className="h-6 w-6" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                      <ul className="space-y-2">
                        <li>
                          <button
                            className="w-full text-left text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setIsApproveModalOpen(true);
                            }}
                          >
                            Approve Campaign
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-full text-left text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setIsRejectModalOpen(true);
                            }}
                          >
                            Reject Campaign
                          </button>
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="text-gray-500 dark:text-neutral-400 flex justify-between items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="font-normal">Valuation:</div>
                    <div className="font-medium">
                      ${campaign.valuation?.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="font-normal">Equity:</div>
                    <div className="font-medium">
                      {campaign.equity_offered}%
                    </div>
                  </div>
                </div>

                {campaign.team_members && campaign.team_members.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
                      Team Members
                    </p>
                    <div className="flex -space-x-3">
                      {campaign.team_members
                        .slice(0, 5)
                        .map((member, index) => (
                          <div
                            key={index}
                            className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                            style={{
                              zIndex:
                                (campaign.team_members?.length ?? 0) - index,
                            }}
                          >
                            <Avatar
                              name={member.name}
                              size="sm"
                              imageUrl={member.avatar_url}
                            />
                          </div>
                        ))}
                      {campaign.team_members.length > 5 && (
                        <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                          +{campaign.team_members.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Funding Progress
                    </span>
                    <span className="text-sm text-gray-600">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Badge
                    className={getStatusColor(campaign.equity_status ?? '')}
                  >
                    {getStatusIcon(campaign.equity_status ?? '')}
                    <span className="ml-1 capitalize">
                      {(campaign.equity_status ?? '').replace('_', ' ')}
                    </span>
                  </Badge>

                  <div className="flex gap-2 items-center">
                    <Button
                      className="px-4 py-2 text-gray-500 rounded-full"
                      variant="secondary"
                      size="default"
                      onClick={() => handleViewCampaignDetails(campaign)}
                    >
                      View
                    </Button>
                    <Button
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-full"
                      variant="secondary"
                      size="default"
                      onClick={() => handleOpenModal(campaign)}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedCampaign && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          size="xlarge"
          closeOnBackdropClick={false}
        >
          <div className="overflow-y-auto max-h-[60vh] p-2 bg-white dark:bg-neutral-800">
            <span className="text-xs font-semibold mb-5 text-gray-400 dark:text-gray-500">
              This is how the campaign looks to others when they see it.
            </span>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {selectedCampaign.title}
            </h2>
            <p className="text-gray-800 dark:text-neutral-200">
              <strong>Valuation:</strong> $
              {selectedCampaign.valuation?.toLocaleString()}
            </p>
            <p className="text-gray-800 dark:text-neutral-200">
              <strong>Equity Offered:</strong> {selectedCampaign.equity_offered}
              %
            </p>
            {selectedCampaign.media && (
              <img
                src={selectedCampaign.media}
                alt="Campaign thumbnail"
                className="w-full rounded-lg"
              />
            )}
            <div
              className="prose dark:prose-dark max-w-none"
              dangerouslySetInnerHTML={{
                __html: selectedCampaign.description.body,
              }}
            />
          </div>
        </Modal>
      )}

      {/* Modals */}
      <AlertPopup
        title="Approve Campaign"
        message={`Are you sure you want to approve "${selectedCampaign?.title || 'this campaign'}"?`}
        isOpen={isApproveModalOpen}
        setIsOpen={setIsApproveModalOpen}
        onConfirm={() =>
          selectedCampaign && handleApprove(selectedCampaign.id.toString())
        }
        onCancel={() => setIsApproveModalOpen(false)}
        confirmText="Approve"
        confirmButtonClass="bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white"
      />

      <AlertPopup
        title="Reject Campaign"
        message={
          <div className="space-y-4">
            <p>
              Are you sure you want to reject "
              {selectedCampaign?.title || 'this campaign'}"?
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
          selectedCampaign &&
          handleReject(selectedCampaign.id.toString(), rejectionReason)
        }
        onCancel={() => {
          setIsRejectModalOpen(false);
          setRejectionReason('');
        }}
        confirmText="Reject"
        confirmDisabled={!rejectionReason.trim()}
        confirmButtonClass="bg-red-400 hover:bg-red-500 focus:ring-red-500 text-white"
      />
    </div>
  );
}
