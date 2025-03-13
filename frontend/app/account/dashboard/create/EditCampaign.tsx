'use client';
import { FaEdit } from 'react-icons/fa';
import React, { useState, useCallback, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import Modal from '@/app/components/modal/Modal';
import { Button } from '@/app/components/button/Button';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignPermissionSetting from '@/app/account/dashboard/create/settings/PermissionSettings';
import { SingleCampaignResponseDataType } from '@/app/types/campaigns.types';
import { truncateHTML } from '@/app/utils/helpers/truncate.html';
import RichTextEditor from '@/app/components/richtext/Richtext';
import EditCampaignsLoader from '@/app/loaders/EditCampaignLoader';

interface EditCampaignProps {
  campaignId: string | null;
}

const EditCampaign: React.FC<EditCampaignProps> = ({ campaignId }) => {
  const {
    loading,
    editCampaign,
    fetchCampaignById,
    currentCampaign,
    fetchCampaigns,
  } = useCampaignContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState({ field: '', value: '' });
  const [title, setTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false); // Loading state for save operation
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Fetch campaign data when campaignId changes
  useEffect(() => {
    if (campaignId) {
      fetchCampaignById(campaignId)
        .then((campaignData: SingleCampaignResponseDataType) => {
          if (campaignData) {
            setTitle(campaignData.title);
            setGoalAmount(campaignData.goal_amount.toString());
            setDescription(campaignData.description.body);
            setImage(campaignData.media || '');
          }
        })
        .catch(() => setFetchError('Error fetching campaign details.'));
    }
  }, [campaignId, fetchCampaignById]);

  // Handle image drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedImage = URL.createObjectURL(acceptedFiles[0]);
      setImage(selectedImage);
      setSelectedImageFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  // Open modal for editing a field
  const openEditModal = (field: string, value: string) => {
    setEditMode({ field, value });
    setIsModalOpen(true);
  };

  // Save changes to the campaign
  const handleSave = async (newValue: string) => {
    if (!campaignId || !currentCampaign) return;

    setSaveLoading(true); // Start loading

    const updatedData = new FormData();
    updatedData.append(`campaign[${editMode.field}]`, newValue);

    if (selectedImageFile && editMode.field === 'image') {
      updatedData.append('campaign[media]', selectedImageFile);
    }

    try {
      await editCampaign(campaignId, updatedData);
      await fetchCampaignById(campaignId); // Refresh campaign data
      await fetchCampaigns(); // Refresh campaigns list
      setIsModalOpen(false);
    } catch (error) {
      setFetchError('Failed to update campaign. Please try again.');
    } finally {
      setSaveLoading(false); // Stop loading
    }
  };

  if (loading) return <EditCampaignsLoader />;
  if (fetchError) {
    return <p className="text-red-500 dark:text-red-300">{fetchError}</p>;
  }

  return (
    <>
      <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
          <button
            onClick={() => openEditModal('title', title)}
            className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaEdit />
          </button>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Fundraising Title
          </h3>
          <p className="text-gray-700 dark:text-gray-400">
            {currentCampaign?.title}
          </p>
        </div>

        {/* Fundraising Goal */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
          <button
            onClick={() => openEditModal('goal_amount', goalAmount)}
            className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaEdit />
          </button>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Fundraising Goal
          </h3>
          <p className="text-gray-700 dark:text-gray-400">
            {currentCampaign?.currency_symbol ||
              currentCampaign?.currency.toLocaleUpperCase()}
            {currentCampaign?.goal_amount}
          </p>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
          <button
            onClick={() => openEditModal('description', description)}
            className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaEdit />
          </button>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Fundraising Description
          </h3>
          <div
            className="text-gray-800 dark:text-neutral-200 flex-grow"
            dangerouslySetInnerHTML={{
              __html: truncateHTML(currentCampaign?.description.body || '', 30),
            }}
          />
        </div>

        {/* Image */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
          <button
            onClick={() => openEditModal('image', image)}
            className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaEdit />
          </button>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Fundraising Image
          </h3>
          <img
            src={image}
            alt="Campaign"
            className="w-full h-40 object-cover rounded"
          />
        </div>

        {/* Campaign Settings */}
        {campaignId && (
          <div className="col-span-full">
            <button
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-lg text-left focus:outline-none"
            >
              <span className="text-lg font-semibold">Campaign Settings</span>
              {settingsOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
        )}

        {settingsOpen && campaignId && (
          <div className="p-4 border rounded-lg bg-gray-50 col-span-full">
            <CampaignPermissionSetting campaignId={campaignId} />
          </div>
        )}
      </div>

      {/* Modal for Editing Fields */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xxxlarge"
        closeOnBackdropClick={false}
      >
        <div className="overflow-y-auto max-h-[60vh] p-2">
          <div className="p-4">
            {editMode.field === 'title' && (
              <>
                <h3 className="text-lg font-semibold mb-2">Edit Title</h3>
                <input
                  type="text"
                  value={editMode.value}
                  onChange={(e) =>
                    setEditMode({ ...editMode, value: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </>
            )}

            {editMode.field === 'goal_amount' && (
              <>
                <h3 className="text-lg font-semibold mb-2">
                  Edit Fundraising Goal
                </h3>
                <input
                  type="number"
                  value={editMode.value}
                  onChange={(e) =>
                    setEditMode({ ...editMode, value: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </>
            )}

            {editMode.field === 'description' && (
              <>
                <h3 className="text-lg font-semibold mb-2">Edit Description</h3>
                <RichTextEditor
                  value={editMode.value}
                  onChange={(value) => setEditMode({ ...editMode, value })}
                  sticky={false}
                  controls={[
                    ['bold', 'italic', 'underline'],
                    ['link', 'image', 'video'],
                    ['unorderedList', 'h1', 'h2', 'h3', 'blockquote'],
                    ['alignLeft', 'alignCenter', 'alignRight'],
                  ]}
                />
              </>
            )}

            {editMode.field === 'image' && (
              <>
                <h3 className="text-lg font-semibold mb-2">Edit Image</h3>
                <div
                  {...getRootProps()}
                  className="border border-gray-300 p-4 rounded-lg cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-600">
                    Drag 'n' drop an image here, or click to select an image
                  </p>
                </div>
                {editMode.value && (
                  <img
                    src={editMode.value}
                    alt="Preview"
                    className="mt-4 w-full h-40 object-cover rounded-lg"
                  />
                )}
              </>
            )}

            <Button
              onClick={() => handleSave(editMode.value)}
              className="mt-4 dark:bg-gray-800 text-gray-800 hover:bg-gray-100 dark:text-gray-50 py-2 px-4 rounded-full"
              size="lg"
              variant="secondary"
              disabled={saveLoading}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditCampaign;
