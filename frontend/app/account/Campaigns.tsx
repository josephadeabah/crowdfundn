'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
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
import Avatar from '../components/avatar/Avatar'; // Import Avatar component

const Campaigns: React.FC = () => {
  const {
    userCampaigns,
    loading,
    error,
    fetchUserCampaigns,
    deleteCampaign,
    cancelCampaign,
  } = useCampaignContext();

  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignResponseDataType | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTeamDocumentsModalOpen, setIsTeamDocumentsModalOpen] =
    useState(false);
  const [alertPopupOpen, setAlertPopupOpen] = useState(false);
  const [campaignToActOn, setCampaignToActOn] =
    useState<CampaignResponseDataType | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'cancel' | null>(
    null,
  );

  const router = useRouter();

  useEffect(() => {
    fetchUserCampaigns();
  }, [fetchUserCampaigns]);

  const handleEditCampaign = (campaignId: string) => {
    router.push(
      `/account/dashboard/edit/${campaignId}?${generateRandomString()}`,
    );
  };

  const handleViewCampaignDetails = (campaignId: string) => {
    router.push(`/campaign/${campaignId}?${generateRandomString()}`);
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
    type: 'delete' | 'cancel',
  ) => {
    setCampaignToActOn(campaign);
    setActionType(type);
    setAlertPopupOpen(true);
  };

  const confirmAction = async () => {
    if (!campaignToActOn || !actionType) return;

    if (actionType === 'delete') {
      await deleteCampaign(String(campaignToActOn.id));
    } else if (actionType === 'cancel') {
      await cancelCampaign(String(campaignToActOn.id));
    }

    await fetchUserCampaigns();
    setAlertPopupOpen(false);
    setCampaignToActOn(null);
    setActionType(null);
  };

  const getStatusDisplay = (campaign: CampaignResponseDataType) => {
    if (
      campaign.type === 'EquityCampaign' &&
      campaign.equity_status === 'draft'
    ) {
      return { text: 'Draft', color: 'text-blue-500' };
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

  if (loading) return <CampaignsLoader />;

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="px-2 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            My Campaigns
          </h2>
          <p className="text-gray-500 dark:text-neutral-400">
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
        <p className="text-gray-500 dark:text-neutral-400 mt-4">
          You have no campaigns yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {userCampaigns?.map((campaign) => {
            const status = getStatusDisplay(campaign);
            return (
              <div
                key={campaign.id}
                className="relative p-4 bg-white dark:bg-neutral-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700 flex flex-col justify-between"
              >
                {/* Title and Dots Vertical Icon */}
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
                            onClick={() =>
                              handleEditCampaign(String(campaign.id))
                            }
                          >
                            Edit Campaign
                          </button>
                        </li>
                        <li>
                          <button
                            className="w-full text-left text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
                            onClick={() => handleAction(campaign, 'delete')}
                          >
                            Delete Campaign
                          </button>
                        </li>
                        {campaign.type !== 'EquityCampaign' && (
                          <li>
                            <button
                              className="w-full text-left text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
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
                        )}
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Campaign Details */}
                <div className="text-gray-500 dark:text-neutral-400 flex justify-between items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="font-normal">Goal:</div>
                    <div className="font-medium">
                      {campaign?.currency?.toUpperCase()}{' '}
                      {parseFloat(campaign.goal_amount).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="font-normal">Raised:</div>
                    <div className="font-medium">
                      {campaign?.currency?.toUpperCase()}{' '}
                      {parseFloat(campaign.transferred_amount).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Team Members for Equity Campaigns */}
                {campaign.type === 'EquityCampaign' &&
                  campaign.team_members &&
                  campaign.team_members.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">
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
                          <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                            +{campaign.team_members.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Button
                      className={`px-4 py-2 rounded-full ${status.color}`}
                      variant="ghost"
                      size="default"
                    >
                      {status.text}
                    </Button>
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full 
                        ${campaign.permissions.is_public ? 'bg-green-500' : 'bg-gray-500'}`}
                      ></span>
                      <span className="text-gray-500 font-semibold text-xs">
                        {campaign.permissions.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button
                      className="px-4 py-2 text-gray-500 rounded-full"
                      variant="secondary"
                      size="default"
                      onClick={() =>
                        handleViewCampaignDetails(String(campaign.id))
                      }
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

      {/* AlertPopup for confirming delete or cancel action */}
      <AlertPopup
        title={
          actionType === 'delete'
            ? campaignToActOn?.title || 'Confirm Deletion'
            : 'Confirm Cancelation'
        }
        message={
          actionType === 'delete'
            ? 'Are you sure you want to delete this campaign?'
            : 'Are you sure you want to cancel this campaign?'
        }
        isOpen={alertPopupOpen}
        setIsOpen={setAlertPopupOpen}
        onConfirm={confirmAction}
        onCancel={() => setAlertPopupOpen(false)}
      />

      {/* Modal for previewing campaign details */}
      {selectedCampaign && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          size="xlarge"
          closeOnBackdropClick={false}
        >
          <div className="overflow-y-auto max-h-[60vh] p-2 bg-white dark:bg-neutral-800">
            <span className="text-xs font-semibold mb-5 text-gray-400 dark:text-gray-500">
              This is how your campaign looks to others when they see it.
            </span>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {selectedCampaign.title}
            </h2>
            <p className="text-gray-800 dark:text-neutral-200">
              <strong>Goal Amount:</strong>{' '}
              {selectedCampaign?.currency?.toUpperCase()}{' '}
              {parseFloat(selectedCampaign.goal_amount).toLocaleString()}
            </p>
            <p className="text-gray-800 dark:text-neutral-200">
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

      {/* Team & Documents Modal */}
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
            <CampaignTeamDocuments campaignId={String(selectedCampaign.id)} />
          )}
        </div>
      </Modal>
      {/* Space Below the Page */}
      <div className="h-20"></div>
    </div>
  );
};

export default Campaigns;
