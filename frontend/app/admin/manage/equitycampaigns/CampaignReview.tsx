// app/components/campaign/CampaignReview.tsx
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
  Download,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { Progress } from '@/app/components/ui/progress';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';
import {
  EquityCampaignResponseDataType,
  InvestorDocument,
} from '@/app/types/equityCampaigns.types';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modal/Modal';

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
  const [isDocumentModalOpen, setIsDocumentModalOpen] =
    useState<boolean>(false);
  const [documentFilter, setDocumentFilter] = useState<string>('all');

  useEffect(() => {
    const loadPendingCampaigns = async () => {
      try {
        const campaigns = await fetchPendingReviewCampaigns();
        setPendingCampaigns(campaigns);
      } catch (err) {
        console.error('Failed to load campaigns:', err);
      }
    };

    loadPendingCampaigns();
  }, [fetchPendingReviewCampaigns]);

  const handleViewCampaignDetails = (
    campaign: EquityCampaignResponseDataType,
  ) => {
    const identifier = campaign.slug || campaign.id;
    router.push(`/campaign/${identifier}`);
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
    } catch (error) {
      console.error('Failed to approve campaign:', error);
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
    } catch (error) {
      console.error('Failed to reject campaign:', error);
    }
  };

  const DocumentSection = ({
    documents,
  }: {
    documents: InvestorDocument[];
  }) => {
    const filteredDocs =
      documentFilter === 'all'
        ? documents
        : documents.filter((doc) => doc.document_type === documentFilter);

    const documentGroups = filteredDocs.reduce(
      (acc, doc) => {
        if (!acc[doc.document_type]) {
          acc[doc.document_type] = [];
        }
        acc[doc.document_type].push(doc);
        return acc;
      },
      {} as Record<string, InvestorDocument[]>,
    );

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Due Diligence Documents</h3>
          <div className="flex space-x-2">
            <Button
              variant={documentFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDocumentFilter('all')}
            >
              All
            </Button>
            <Button
              variant={documentFilter === 'pitch' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDocumentFilter('pitch')}
            >
              Pitch
            </Button>
            <Button
              variant={
                documentFilter === 'financial_statement' ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => setDocumentFilter('financial_statement')}
            >
              Financials
            </Button>
            <Button
              variant={
                documentFilter === 'business_plan' ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => setDocumentFilter('business_plan')}
            >
              Business Plan
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(documentGroups).map(([type, docs]) => (
            <div key={type} className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 capitalize">
                {docs[0].display_name || type.replace('_', ' ')}
              </h4>
              <div className="space-y-2">
                {docs.flatMap((doc) =>
                  doc.files.map((file) => (
                    <div
                      key={file.url}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm">{file.filename}</p>
                          <p className="text-xs text-gray-500">
                            {file.human_size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(file.uploaded_at).toLocaleDateString()}
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </a>
                      </div>
                    </div>
                  )),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  Total Documents
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {pendingCampaigns.reduce(
                    (sum, campaign) => sum + (campaign.documents?.length || 0),
                    0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
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
                  {pendingCampaigns
                    .reduce(
                      (sum, campaign) =>
                        sum + parseFloat(campaign.transferred_amount || '0'),
                      0,
                    )
                    .toLocaleString()}
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
            <span>Campaigns Pending Approval</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingCampaigns.map((campaign) => {
              const progress = campaign.goal_amount
                ? (parseFloat(campaign.transferred_amount || '0') /
                  parseFloat(campaign.goal_amount || '0')) *
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
                      <Badge
                        className={getStatusColor(campaign.equity_status ?? '')}
                      >
                        {getStatusIcon(campaign.equity_status ?? '')}
                        <span className="ml-1 capitalize">
                          {(campaign.equity_status ?? '').replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Valuation: ${campaign.valuation?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Equity: {campaign.equity_offered}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Investors: {campaign.total_investors || 0}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setIsDocumentModalOpen(true);
                      }}
                    >
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
                      onClick={() => handleViewCampaignDetails(campaign)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
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
                      variant="ghost"
                      className="bg-bantu-green text-white hover:bg-green-600 hover:text-white"
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

      {/* Modals */}
      <AlertPopup
        title="Approve Campaign"
        message={`Are you sure you want to approve ${selectedCampaign?.title || 'this campaign'}?`}
        isOpen={isApproveModalOpen}
        setIsOpen={setIsApproveModalOpen}
        onConfirm={() =>
          selectedCampaign && handleApprove(selectedCampaign.id.toString())
        }
        onCancel={() => setIsApproveModalOpen(false)}
        confirmText="Approve"
        confirmButtonClass="bg-green-500 hover:bg-green-600 text-white"
      />

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
        cancelButtonClass="bg-red-400 hover:bg-red-500 text-white"
      />

      {/* Document Modal */}
      <Modal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        size="xxxlarge"
      >
        {selectedCampaign && (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">
              Documents for {selectedCampaign.title}
            </h3>
            <DocumentSection documents={selectedCampaign.documents} />
          </div>
        )}
      </Modal>
    </div>
  );
}
