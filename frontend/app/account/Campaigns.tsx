'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import { useEquityCampaignContext } from '../context/account/campaign/EquityCampaignContext';
import CampaignsLoader from '../loaders/CampaignsLoader';
import { Button } from '../components/button/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../components/popover/Popover';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import Modal from '@/app/components/modal/Modal';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { CampaignResponseDataType } from '../types/campaigns.types';
import { generateRandomString } from '../utils/helpers/generate.random-string';
import ErrorPage from '../components/errorpage/ErrorPage';
import { FiPlus, FiPlusCircle } from 'react-icons/fi';
import CampaignTeamDocuments from '@/app/components/campaign/CampaignTeamDocuments';
import Avatar from '../components/avatar/Avatar';
import ToastComponent from '@/app/components/toast/Toast';
import InfoTooltip from '../components/tooltip/tooltip';
import { getDetailedErrorMessage } from '../types/campaign.error.messages.types';

const Campaigns: React.FC = () => {
  const {
    userCampaigns,
    loading,
    error,
    fetchUserCampaigns,
    deleteCampaign,
    cancelCampaign,
  } = useCampaignContext();

  const {
    submitForApproval,
    launchCampaign,
    closeCampaign,
    loading: equityActionLoading,
  } = useEquityCampaignContext();

  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignResponseDataType | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTeamDocumentsModalOpen, setIsTeamDocumentsModalOpen] =
    useState(false);
  const [alertPopupOpen, setAlertPopupOpen] = useState(false);
  const [campaignToActOn, setCampaignToActOn] =
    useState<CampaignResponseDataType | null>(null);
  const [actionType, setActionType] = useState<
    'delete' | 'cancel' | 'submit' | 'launch' | 'close' | null
  >(null);

  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const router = useRouter();

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
    fetchUserCampaigns();
  }, [fetchUserCampaigns]);

  const handleEditCampaign = (campaign: CampaignResponseDataType) => {
    const identifier = campaign.slug || campaign.id;
    router.push(
      `/account/dashboard/edit/${identifier}?${generateRandomString()}`,
    );
  };

  const handleViewCampaignDetails = (campaign: CampaignResponseDataType) => {
    const identifier = campaign.slug || campaign.id;
    router.push(`/campaign/${identifier}?${generateRandomString()}`);
  };

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
    type: 'delete' | 'cancel' | 'submit' | 'launch' | 'close',
  ) => {
    setCampaignToActOn(campaign);
    setActionType(type);
    setAlertPopupOpen(true);
  };

  const confirmAction = async () => {
    if (!campaignToActOn || !actionType) return;

    try {
      let result:
        | {
            success: boolean;
            error?: string;
            details?: string[];
            requirements?: {
              [key: string]: boolean | string[] | undefined;
              validation_errors?: string[];
            };
          }
        | undefined;
      let successMessage = '';

      if (actionType === 'delete') {
        await deleteCampaign(String(campaignToActOn.id));
        successMessage = 'Campaign deleted successfully';
      } else if (actionType === 'cancel') {
        await cancelCampaign(String(campaignToActOn.id));
        successMessage = 'Campaign canceled successfully';
      } else if (actionType === 'submit') {
        result = await submitForApproval(String(campaignToActOn.id));
        successMessage = 'Campaign submitted for approval';
      } else if (actionType === 'launch') {
        result = await launchCampaign(String(campaignToActOn.id));
        successMessage = 'Campaign launched successfully';
      } else if (actionType === 'close') {
        result = await closeCampaign(String(campaignToActOn.id));
        successMessage = 'Campaign closed successfully';
      }

      if (!result || result.success) {
        showToast('Success', successMessage, 'success');
        await fetchUserCampaigns();
      } else {
        // Collect all error messages
        const errorMessages: string[] = [];

        // Add main error if exists
        if (result.error) {
          errorMessages.push(result.error);
        }

        // Add validation errors from requirements.validation_errors if they exist
        if (result.requirements?.validation_errors?.length) {
          errorMessages.push(...result.requirements.validation_errors);
        }

        // Add regular details if they exist
        if (result.details?.length) {
          errorMessages.push(...result.details);
        }

        // Add unmet requirements (excluding validation_errors)
        if (result.requirements) {
          const unmetRequirements = Object.entries(result.requirements)
            .filter(
              ([key, value]) =>
                key !== 'validation_errors' &&
                typeof value === 'boolean' &&
                !value,
            )
            .map(([req]) => req.replace(/_/g, ' '));

          if (unmetRequirements.length) {
            errorMessages.push(
              `Requirements not met: ${unmetRequirements.join(', ')}`,
            );
          }
        }

        // Fallback if no specific errors were found
        if (errorMessages.length === 0) {
          errorMessages.push('Action failed for unknown reasons');
        }

        showToast('Error', errorMessages.join('\n'), 'error');
      }
    } catch (error) {
      const errorMessage = getDetailedErrorMessage(error);
      showToast('Error', errorMessage, 'error');
    } finally {
      setAlertPopupOpen(false);
      setCampaignToActOn(null);
      setActionType(null);
    }
  };

  const getBaseCampaignStatus = (campaign: CampaignResponseDataType) => {
    if (campaign.type !== 'EquityCampaign') return null;

    switch (campaign.status) {
      case 'active':
        return { text: 'Active', color: 'text-green-500' };
      case 'completed':
        return { text: 'Completed', color: 'text-red-500' };
      case 'canceled':
        return { text: 'Canceled', color: 'text-orange-300' };
      default:
        return null;
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

  const getActionButtons = (campaign: CampaignResponseDataType) => {
    if (campaign.type !== 'EquityCampaign') {
      return (
        <>
          <li>
            <button
              className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
              onClick={() => handleAction(campaign, 'cancel')}
              disabled={
                campaign.status === 'canceled' ||
                campaign.status === 'completed'
              }
              style={{
                cursor:
                  campaign.status === 'canceled' ||
                  campaign.status === 'completed'
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              Cancel Campaign
            </button>
          </li>
        </>
      );
    }

    const actions = [];
    if (campaign.equity_status === 'draft') {
      actions.push(
        <li key="submit">
          <button
            className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
            onClick={() => handleAction(campaign, 'submit')}
          >
            Submit for Approval
          </button>
        </li>,
      );
    } else if (campaign.equity_status === 'approved') {
      actions.push(
        <li key="launch">
          <button
            className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
            onClick={() => handleAction(campaign, 'launch')}
          >
            Launch Campaign
          </button>
        </li>,
      );
    } else if (campaign.equity_status === 'live') {
      actions.push(
        <li key="close">
          <button
            className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
            onClick={() => handleAction(campaign, 'close')}
          >
            Close Campaign
          </button>
        </li>,
      );
    }

    return actions;
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
            My Campaigns
          </h2>
          <p className="text-gray-500">
            Manage your active and past campaigns.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setIsTeamDocumentsModalOpen(true)}
            className="flex items-center justify-center px-3 py-2 text-gray-700 rounded-lg w-full sm:w-auto"
            variant="outline"
          >
            <FiPlusCircle className="mr-2" />
            <span className="whitespace-nowrap">Manage Team & Documents</span>
          </Button>
          <Button
            onClick={() => router.push('/account/dashboard/create')}
            className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg w-full sm:w-auto"
            variant="ghost"
          >
            <FiPlusCircle className="mr-2" />
            <span className="whitespace-nowrap">Add Campaign</span>
          </Button>
        </div>
      </div>

      {userCampaigns && userCampaigns.length === 0 ? (
        <p className="text-gray-500 mt-4">
          You have no campaigns yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {userCampaigns?.map((campaign) => {
            const status = getStatusDisplay(campaign);
            return (
              <div
                key={campaign.id}
                className="relative p-4 bg-white rounded-lg shadow hover:bg-gray-100 flex flex-col justify-between"
              >
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
                            className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                            onClick={() => handleEditCampaign(campaign)}
                          >
                            Edit Campaign
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                            onClick={() => handleAction(campaign, 'delete')}
                          >
                            Delete Campaign
                          </button>
                        </li>
                        {getActionButtons(campaign)}
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>

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
                      <p className="text-sm text-gray-500 mb-2">
                        Team Members
                      </p>
                      <div className="flex -space-x-3">
                        {campaign.team_members
                          .slice(0, 5)
                          .map((member, index) => (
                            <Popover key={index}>
                              <PopoverTrigger asChild>
                                <div
                                  className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                                  style={{
                                    zIndex:
                                      (campaign.team_members?.length ?? 0) -
                                      index,
                                  }}
                                >
                                  <Avatar
                                    name={member.name}
                                    size="sm"
                                    imageUrl={member.avatar_url}
                                  />
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-96">
                                <div className="space-y-4 p-4">
                                  <div className="flex items-center space-x-4">
                                    <Avatar
                                      name={member.name}
                                      size="xl"
                                      imageUrl={member.avatar_url}
                                    />
                                    <div>
                                      <div className="flex items-center gap-1">
                                        <h4 className="font-semibold text-lg text-gray-800">
                                          {member.name}
                                        </h4>
                                      </div>
                                      <p className="text-sm text-gray-500">
                                        {member.role}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold">
                                      Role
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {member.role}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold">
                                      Title
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {member.title}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold">
                                      Equity
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {member.equity_percentage}%
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold">
                                      Description
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {member.description}
                                    </p>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
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
                    {status.text === 'Pending Approval' && (
                      <InfoTooltip
                        id={`pending-tooltip-${campaign.id}`}
                        content="This campaign is currently undergoing thorough due diligence by our team. 
          We're carefully reviewing all details to ensure compliance and viability. 
          You'll be notified once the review is complete."
                      />
                    )}
                    {status.text === 'Approved' && (
                      <InfoTooltip
                        id={`approved-tooltip-${campaign.id}`}
                        content="Congratulations! Your campaign has successfully passed all due diligence checks. 
          You can now launch your campaign to start receiving investments. 
          Click the vertical dots menu in the top right corner and select 'Launch Campaign' to proceed"
                      />
                    )}

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

                    {campaign.type === 'EquityCampaign' && (
                      <div className="flex items-center gap-1">
                        {(() => {
                          const baseStatus = getBaseCampaignStatus(campaign);
                          return baseStatus ? (
                            <>
                              <span
                                className={`w-2 h-2 rounded-full ${baseStatus.color}`}
                              ></span>
                              <span className={`text-xs ${baseStatus.color}`}>
                                {baseStatus.text}
                              </span>
                            </>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      className="w-full bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-700 sm:w-auto px-3 py-1.5 text-sm"
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCampaignDetails(campaign)}
                    >
                      View
                    </Button>
                    <Button
                      className="w-full bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-700 sm:w-auto px-3 py-1.5 text-sm"
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
          actionType === 'delete'
            ? 'Confirm Deletion'
            : actionType === 'cancel'
              ? 'Confirm Cancellation'
              : actionType === 'submit'
                ? 'Submit for Approval'
                : actionType === 'launch'
                  ? 'Launch Campaign'
                  : 'Close Campaign'
        }
        message={
          actionType === 'delete'
            ? 'Are you sure you want to delete this campaign?'
            : actionType === 'cancel'
              ? 'Are you sure you want to cancel this campaign?'
              : actionType === 'submit'
                ? 'Submit this campaign for admin approval?'
                : actionType === 'launch'
                  ? 'Launch this campaign to start receiving investments?'
                  : 'Close this campaign to prevent further investments?'
        }
        isOpen={alertPopupOpen}
        setIsOpen={setAlertPopupOpen}
        onConfirm={confirmAction}
        onCancel={() => setAlertPopupOpen(false)}
        confirmText={
          actionType === 'submit'
            ? 'Submit'
            : actionType === 'launch'
              ? 'Launch'
              : actionType === 'close'
                ? 'Close'
                : 'Confirm'
        }
        loading={equityActionLoading}
      />

      {selectedCampaign && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          size="xlarge"
          closeOnBackdropClick={false}
        >
          <div className="overflow-y-auto max-h-[60vh] p-2 bg-white">
            <span className="text-xs font-semibold mb-5 text-gray-400">
              This is how your campaign looks to others when they see it.
            </span>
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

      <Modal
        isOpen={isTeamDocumentsModalOpen}
        onClose={() => setIsTeamDocumentsModalOpen(false)}
        size="full"
        closeOnBackdropClick={true}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            Manage Team & Documents
          </h2>
          {userCampaigns && userCampaigns.length > 0 ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Campaign
              </label>
              <Select
                onValueChange={(value) =>
                  setSelectedCampaign(
                    userCampaigns.find((c) => c.id === Number(value)) || null,
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an equity campaign" />
                </SelectTrigger>
                <SelectContent>
                  {userCampaigns.map((campaign) => (
                    <SelectItem
                      key={campaign.id}
                      value={String(campaign.id)}
                      disabled={campaign.type !== 'EquityCampaign'}
                      className={
                        campaign.type !== 'EquityCampaign'
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }
                    >
                      <div className="flex items-center">
                        {campaign.title}
                        {campaign.type !== 'EquityCampaign' && (
                          <span className="ml-2 text-xs text-gray-400">
                            (Regular Campaign)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-gray-500">
                Only equity campaigns can have team members
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No campaigns available</p>
          )}

          {selectedCampaign && selectedCampaign.type === 'EquityCampaign' && (
            <CampaignTeamDocuments
              campaignId={String(selectedCampaign.id)}
              userCampaigns={userCampaigns}
            />
          )}
        </div>
      </Modal>
      <div className="h-20"></div>
    </div>
  );
};

export default Campaigns;