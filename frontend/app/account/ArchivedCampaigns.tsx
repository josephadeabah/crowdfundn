'use client';
import React, { useEffect, useState } from 'react';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import CampaignsLoader from '../loaders/CampaignsLoader';
import { Button } from '../components/button/Button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../components/popover/Popover';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import Modal from '@/app/components/modal/Modal';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { CampaignResponseDataType } from '../types/campaigns.types';
import ErrorPage from '../components/errorpage/ErrorPage';
import { FiFolder, FiArchive, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import Avatar from '../components/avatar/Avatar';
import ToastComponent from '@/app/components/toast/Toast';
import { getDetailedErrorMessage } from '../types/campaign.error.messages.types';

const ArchivedCampaigns: React.FC = () => {
  const {
    archivedCampaigns,
    loading,
    error,
    fetchArchivedCampaigns,
    deleteCampaign,
    unarchiveCampaign,
  } = useCampaignContext();

  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignResponseDataType | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [alertPopupOpen, setAlertPopupOpen] = useState(false);
  const [campaignToActOn, setCampaignToActOn] =
    useState<CampaignResponseDataType | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'unarchive' | null>(
    null,
  );

  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

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

  useEffect(() => {
    fetchArchivedCampaigns();
  }, [fetchArchivedCampaigns]);

  const handleOpenModal = (campaign: CampaignResponseDataType) => {
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleAction = (
    campaign: CampaignResponseDataType,
    type: 'delete' | 'unarchive',
  ) => {
    setCampaignToActOn(campaign);
    setActionType(type);
    setAlertPopupOpen(true);
  };

  const confirmAction = async () => {
    if (!campaignToActOn || !actionType) return;

    try {
      let successMessage = '';

      if (actionType === 'delete') {
        await deleteCampaign(String(campaignToActOn.id));
        successMessage = 'Campaign deleted successfully';
      } else if (actionType === 'unarchive') {
        await unarchiveCampaign(String(campaignToActOn.id));
        successMessage = 'Campaign unarchived successfully';
      }

      showToast('Success', successMessage, 'success');
      await fetchArchivedCampaigns();
    } catch (error) {
      const errorMessage = getDetailedErrorMessage(error);
      showToast('Error', errorMessage, 'error');
    } finally {
      setAlertPopupOpen(false);
      setCampaignToActOn(null);
      setActionType(null);
    }
  };

  const getStatusDisplay = (campaign: CampaignResponseDataType) => {
    if (campaign.type === 'EquityCampaign') {
      switch (campaign.equity_status) {
        case 'draft':
          return { text: 'Draft', color: 'text-blue-500' };
        case 'pending_approval':
          return { text: 'Pending Approval', color: 'text-yellow-500' };
        case 'approved':
          return { text: 'Approved', color: 'text-purple-500' };
        case 'live':
          return { text: 'Live', color: 'text-green-500' };
        case 'funded':
          return { text: 'Funded', color: 'text-emerald-500' };
        case 'failed':
          return { text: 'Failed', color: 'text-red-500' };
        case 'closed':
          return { text: 'Closed', color: 'text-gray-500' };
        default:
          return { text: 'Unknown', color: '' };
      }
    }

    switch (campaign.status) {
      case 'active':
        return { text: 'Active', color: 'text-green-500' };
      case 'completed':
        return { text: 'Completed', color: 'text-red-500' };
      case 'canceled':
        return { text: 'Canceled', color: 'text-orange-300' };
      default:
        return { text: 'Unknown', color: '' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <CampaignsLoader />;

  if (error) {
    return <ErrorPage />;
  }

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
          <h2 className="text-2xl font-semibold text-gray-800">
            Archived Campaigns
          </h2>
          <p className="text-gray-500">
            View and manage your archived campaigns. Archived campaigns are
            hidden from public view.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={fetchArchivedCampaigns}
            className="flex items-center justify-center px-3 py-2 text-gray-700 rounded-lg w-full sm:w-auto"
            variant="outline"
          >
            <FiRefreshCw className="mr-2" />
            <span className="whitespace-nowrap">Refresh</span>
          </Button>
        </div>
      </div>

      {archivedCampaigns.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mt-6">
          <div className="text-gray-400 mb-4">
            <FiFolder className="w-16 h-16 mx-auto opacity-50" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No archived campaigns
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            You haven't archived any campaigns yet. Archive campaigns to hide
            them from public view while keeping them for your records.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {archivedCampaigns.map((campaign) => {
            const status = getStatusDisplay(campaign);
            const archiveInfo = campaign.archive_info;

            return (
              <div
                key={campaign.id}
                className="relative p-4 rounded-lg shadow flex flex-col justify-between bg-gray-100 border border-gray-300"
              >
                {/* Archive badge */}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                    <FiArchive className="w-3 h-3 mr-1" />
                    Archived
                  </span>
                </div>

                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 break-words">
                    {campaign.title}
                  </h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                        <DotsVerticalIcon className="h-6 w-6" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                      <ul className="space-y-2">
                        <li>
                          <button
                            className="w-full text-left text-sm text-green-600 hover:bg-green-50 p-2 rounded-md"
                            onClick={() => handleAction(campaign, 'unarchive')}
                          >
                            Unarchive Campaign
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-full text-left text-sm text-red-600 hover:bg-red-50 p-2 rounded-md"
                            onClick={() => handleAction(campaign, 'delete')}
                          >
                            Delete Campaign
                          </button>
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Archive details */}
                {archiveInfo && (
                  <div className="mt-2 p-3 bg-gray-200 rounded-lg">
                    <div className="text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Archived on:</span>
                        <span className="font-medium">
                          {formatDate(archiveInfo.archived_at)}
                        </span>
                      </div>
                      {archiveInfo.reason && (
                        <div className="mt-1">
                          <span>Reason: </span>
                          <span className="font-medium">
                            {archiveInfo.reason}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-gray-500 grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs">Goal:</span>
                    <span className="font-medium">
                      {campaign?.currency?.toUpperCase()}{' '}
                      {parseFloat(campaign.goal_amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs">Raised:</span>
                    <span className="font-medium">
                      {campaign?.currency?.toUpperCase()}{' '}
                      {parseFloat(campaign.transferred_amount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {campaign.type === 'EquityCampaign' &&
                  campaign.team_members &&
                  campaign.team_members.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-2">Team Members</p>
                      <div className="flex -space-x-3">
                        {campaign.team_members
                          .slice(0, 5)
                          .map((member, index) => (
                            <div
                              key={index}
                              className="relative"
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
                          <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-semibold text-gray-600">
                            +{campaign.team_members.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm ${status.color}`}>
                      {status.text}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          campaign.permissions.is_public
                            ? 'bg-green-500'
                            : 'bg-gray-500'
                        }`}
                      ></span>
                      <span className="text-xs text-gray-500">
                        {campaign.permissions.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      className="w-full sm:w-auto px-3 py-1.5 text-sm"
                      variant="outline"
                      size="sm"
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

      <AlertPopup
        title={
          actionType === 'delete' ? 'Confirm Deletion' : 'Unarchive Campaign'
        }
        message={
          actionType === 'delete'
            ? 'Are you sure you want to permanently delete this campaign? This action cannot be undone.'
            : 'Are you sure you want to unarchive this campaign? It will become visible to the public again.'
        }
        isOpen={alertPopupOpen}
        setIsOpen={setAlertPopupOpen}
        onConfirm={confirmAction}
        onCancel={() => setAlertPopupOpen(false)}
        confirmText={actionType === 'delete' ? 'Delete Forever' : 'Unarchive'}
        confirmButtonClass={
          actionType === 'delete'
            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        }
      />

      {selectedCampaign && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          size="xlarge"
          closeOnBackdropClick={false}
        >
          <div className="overflow-y-auto max-h-[60vh] p-2 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                <FiArchive className="w-3 h-3 mr-1" />
                Archived
              </span>
              <span className="text-xs font-semibold text-gray-400">
                This campaign is archived and hidden from public view
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedCampaign.title}
            </h2>
            <p className="text-gray-800">
              <strong>Goal Amount:</strong>{' '}
              {selectedCampaign?.currency?.toUpperCase()}{' '}
              {parseFloat(selectedCampaign.goal_amount).toLocaleString()}
            </p>
            <p className="text-gray-800">
              <strong>Raised Amount:</strong>{' '}
              {selectedCampaign?.currency?.toUpperCase()}{' '}
              {parseFloat(selectedCampaign.transferred_amount).toLocaleString()}
            </p>
            {selectedCampaign.archive_info && (
              <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-700">
                  Archive Details
                </h4>
                <p className="text-sm text-gray-600">
                  <strong>Archived on:</strong>{' '}
                  {formatDate(selectedCampaign.archive_info.archived_at)}
                </p>
                {selectedCampaign.archive_info.reason && (
                  <p className="text-sm text-gray-600">
                    <strong>Reason:</strong>{' '}
                    {selectedCampaign.archive_info.reason}
                  </p>
                )}
              </div>
            )}
            {selectedCampaign.media && (
              <img
                src={selectedCampaign.media}
                alt="Campaign thumbnail"
                className="w-full rounded-lg mt-3"
              />
            )}
            <div
              className="prose dark:prose-dark max-w-none mt-3"
              dangerouslySetInnerHTML={{
                __html: selectedCampaign.description.body,
              }}
            />
          </div>
        </Modal>
      )}
      <div className="h-20"></div>
    </div>
  );
};

export default ArchivedCampaigns;
