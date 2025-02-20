'use client';
import { useRouter } from 'next/navigation';
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
import { generateRandomString } from '../utils/helpers/generate.random-string';
import ErrorPage from '../components/errorpage/ErrorPage';
import { FiPlus, FiPlusCircle } from 'react-icons/fi';

const Campaigns: React.FC = () => {
  const {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    deleteCampaign,
    cancelCampaign, // Added cancelCampaign function from context
  } = useCampaignContext();

  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignResponseDataType | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [alertPopupOpen, setAlertPopupOpen] = useState(false);
  const [campaignToActOn, setCampaignToActOn] =
    useState<CampaignResponseDataType | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'cancel' | null>(
    null,
  ); // Tracks whether action is delete or cancel

  const router = useRouter();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (loading) return <CampaignsLoader />;

  if (error) {
    return <ErrorPage />;
  }

  const handleEditCampaign = (campaignId: string) => {
    router.push(
      `/account/dashboard/create/${campaignId}?${generateRandomString()}`,
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

    await fetchCampaigns(); // Refresh campaigns after action
    setAlertPopupOpen(false);
    setCampaignToActOn(null);
    setActionType(null);
  };

  return (
    <div className="px-2 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Campaigns
        </h2>
        <button
          onClick={() => router.push('/account/dashboard/create')}
          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg"
        >
          <FiPlusCircle className="mr-2" />
          Add Campaign
        </button>
      </div>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        Manage your active and past campaigns.
      </p>
      {campaigns && campaigns.length === 0 ? (
        <p className="text-gray-500 dark:text-neutral-400">
          You have no active campaigns.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="relative p-4 bg-white dark:bg-neutral-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700 flex flex-col justify-between"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {campaign.title}
              </h3>
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
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Button
                    className={`px-4 py-2 rounded-full 
    ${
      campaign.status === 'active'
        ? 'text-green-500'
        : campaign.status === 'completed'
          ? 'text-red-500'
          : campaign.status === 'canceled'
            ? 'text-orange-300'
            : ''
    }`}
                    variant="ghost"
                    size="default"
                  >
                    {campaign.status === 'active'
                      ? 'Active'
                      : campaign.status === 'completed'
                        ? 'Completed'
                        : campaign.status === 'canceled'
                          ? 'Canceled'
                          : 'Unknown'}
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
              <Popover>
                <PopoverTrigger asChild>
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200">
                    <DotsVerticalIcon className="h-6 w-6" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <ul className="space-y-2">
                    <li>
                      <button
                        className="w-full text-left text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 rounded-md"
                        onClick={() => handleEditCampaign(String(campaign.id))}
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
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          ))}
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
      {/* Space Below the Page */}
      <div className="h-20"></div>
    </div>
  );
};

export default Campaigns;
