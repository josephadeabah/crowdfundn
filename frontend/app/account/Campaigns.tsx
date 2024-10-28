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
import CampaignPermissionSetting from './dashboard/create/settings/PermissionSettings';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { generateRandomString } from '../utils/helpers/generate.random-string';

const Campaigns: React.FC = () => {
  const { campaigns, loading, error, fetchCampaigns, deleteCampaign } =
    useCampaignContext();

  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignResponseDataType | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alertPopupOpen, setAlertPopupOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] =
    useState<CampaignResponseDataType | null>(null);

  const router = useRouter();

  const initialPermissions = {
    acceptDonations: false,
    leaveWordsOfSupport: false,
    appearInSearchResults: false,
    suggestedFundraiserLists: false,
    receiveDonationEmail: false,
    receiveDailySummary: false,
  };

  const [permissions, setPermissions] = useState(initialPermissions);
  const [promotionSettings, setPromotionSettings] = useState({
    enablePromotions: false,
    schedulePromotion: false,
    promotionFrequency: 'daily',
    promotionDuration: 1,
  });

  const handleEditCampaign = (campaignId: string) => {
    router.push(
      `/account/dashboard/create/${campaignId}?${generateRandomString()}`,
    );
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (loading) return <CampaignsLoader />;

  if (error) {
    return (
      <p className="text-red-500 dark:text-red-300">
        Error fetching campaigns: {error}
      </p>
    );
  }

  const handleOpenModal = (campaign: CampaignResponseDataType) => {
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleDeleteCampaign = (campaign: CampaignResponseDataType) => {
    setCampaignToDelete(campaign);
    setAlertPopupOpen(true);
  };

  const confirmDeleteCampaign = async () => {
    if (campaignToDelete) {
      await deleteCampaign(String(campaignToDelete.id)); // Await deletion
      await fetchCampaigns(); // Fetch updated campaigns after deletion
      setAlertPopupOpen(false);
      setCampaignToDelete(null);
    }
  };

  return (
    <div className="px-2 py-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Campaigns
      </h2>
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
              <p className="text-gray-500 dark:text-neutral-400">
                Goal: {campaign.goal_amount}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <Button
                  className="px-4 py-2 text-green-500 rounded-full"
                  variant="secondary"
                  size="default"
                >
                  Promote
                </Button>

                <Button
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-full"
                  variant="secondary"
                  size="default"
                  onClick={() => handleOpenModal(campaign)}
                >
                  Preview Campaign
                </Button>
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
                        onClick={() => handleDeleteCampaign(campaign)}
                      >
                        Delete Campaign
                      </button>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      )}

      {/* AlertPopup for confirming deletion */}
      <AlertPopup
        title={campaignToDelete ? campaignToDelete.title : 'Confirm Deletion'}
        message="Are you sure you want to delete this campaign?"
        isOpen={alertPopupOpen}
        setIsOpen={setAlertPopupOpen}
        onConfirm={confirmDeleteCampaign}
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
              <strong>Goal Amount:</strong> {selectedCampaign.goal_amount}
            </p>
            <p className="text-gray-800 dark:text-neutral-200">
              <strong>Raised Amount:</strong> {selectedCampaign.current_amount}
            </p>
            {selectedCampaign.media && (
              <img
                src={selectedCampaign.media}
                alt="Campaign thumbnail"
                className="w-full rounded-lg"
              />
            )}
            <div
              className="text-gray-800 dark:text-neutral-200 flex-grow"
              dangerouslySetInnerHTML={{
                __html: selectedCampaign.description.body,
              }}
            />
          </div>

          {/* Dropdown for Campaign Permissions and Promotion Settings */}
          <div className="mb-4 mt-4">
            <button
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-lg text-left focus:outline-none"
            >
              <span className="text-lg font-semibold">Campaign Settings</span>
              {settingsOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {settingsOpen && (
              <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                <CampaignPermissionSetting
                  permissions={permissions as { [key: string]: boolean }}
                  setPermissions={
                    setPermissions as React.Dispatch<
                      React.SetStateAction<{ [key: string]: boolean }>
                    >
                  }
                  promotionSettings={promotionSettings}
                  setPromotionSettings={setPromotionSettings}
                />
              </div>
            )}
          </div>
        </Modal>
      )}
      {/* Space Below the Page */}
      <div className="h-20"></div>
    </div>
  );
};

export default Campaigns;
