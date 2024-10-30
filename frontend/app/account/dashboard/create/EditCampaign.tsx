'use client';
import { FaEdit } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Modal from '@/app/components/modal/Modal';
import { Button } from '@/app/components/button/Button';
import { useParams } from 'next/navigation';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { SingleCampaignResponseDataType } from '@/app/types/campaigns.types';
import CampaignsLoader from '@/app/loaders/CampaignsLoader';
import { truncateHTML } from '@/app/utils/helpers/truncate.html';

const RichTextEditor = dynamic(() => import('@mantine/rte'), { ssr: false });

const EditCampaign = () => {
  const {
    loading,
    editCampaign,
    fetchCampaignById,
    currentCampaign,
    fetchCampaigns,
  } = useCampaignContext();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState({ field: '', value: '' });
  const [title, setTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(
    'https://images.pexels.com/photos/28974077/pexels-photo-28974077/free-photo-of-close-up-of-two-polar-bears-on-rocky-terrain.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  );
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Additional state variables
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentAmount, setCurrentAmount] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startDate, setStartDate] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [endDate, setEndDate] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [category, setCategory] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [location, setLocation] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currency, setCurrency] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currencyCode, setCurrencyCode] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currencySymbol, setCurrencySymbol] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchCampaignById(id)
        .then((campaignData: SingleCampaignResponseDataType) => {
          if (campaignData) {
            setTitle(campaignData.title);
            setGoalAmount(campaignData.goal_amount.toString());
            setDescription(campaignData.description.body);
            setImage(campaignData.media || '');
            setCurrentAmount(campaignData.current_amount);
            setStartDate(campaignData.start_date);
            setEndDate(campaignData.end_date);
            setCategory(campaignData.category);
            setLocation(campaignData.location);
            setCurrency(campaignData.currency);
            setCurrencyCode(campaignData.currency_code);
            setCurrencySymbol(campaignData.currency_symbol);
            setStatus(campaignData.status);
          }
        })
        .catch(() => setFetchError('Error fetching campaign details.'));
    }
  }, [id, fetchCampaignById]);

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

  const openEditModal = (field: string, value: string) => {
    setEditMode({ field, value });
    setIsModalOpen(true);
  };

  const handleSave = async (newValue: string) => {
    if (!currentCampaign) return;

    const updatedData = new FormData();
    updatedData.append(`campaign[${editMode.field}]`, newValue);

    if (selectedImageFile && editMode.field === 'image') {
      updatedData.append('campaign[media]', selectedImageFile);
    }

    await editCampaign(id, updatedData);
    await fetchCampaignById(String(id));
    await fetchCampaigns();
    setIsModalOpen(false);
  };

  if (loading) return <CampaignsLoader />;
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
            {title}
          </h3>
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
            ${currentCampaign?.goal_amount}
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
            src={currentCampaign?.media || image}
            alt="Campaign"
            className="w-full h-40 object-cover rounded"
          />
        </div>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xxxlarge"
        closeOnBackdropClick={false}
      >
        <div className="overflow-y-auto max-h-[60vh] p-2">
          <div className="p-4">
            {/* Conditional Fields in Modal */}
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

            {/* Save Button */}
            <Button
              onClick={() => {
                handleSave(editMode.value);
              }}
              className="mt-4 dark:bg-gray-800 text-gray-800 hover:bg-gray-100 dark:text-gray-50 py-2 px-4 rounded-full"
              size="lg"
              variant="secondary"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditCampaign;
