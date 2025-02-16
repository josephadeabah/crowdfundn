'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Button } from '@/app/components/button/Button';
import { useDropzone } from 'react-dropzone';
import Modal from '@/app/components/modal/Modal';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useUserContext } from '@/app/context/users/UserContext';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { FaExclamationTriangle } from 'react-icons/fa';
import RichTextEditor from '@/app/components/richtext/Richtext';
import { categories } from '@/app/utils/helpers/categories';

const CreateCampaign = () => {
  const { userAccountData } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [currency, setCurrency] = useState('');
  const [currency_symbol, setCurrencySymbol] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState<FormErrors>({});
  const { addCampaign, loading } = useCampaignContext();
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
  const [alertTitle, setAlertTitle] = useState<string>('');

  interface FormErrors {
    title?: string;
    content?: string;
    image?: string;
    currentAmount?: string;
    startDate?: string;
    endDate?: string;
    dateRange?: string;
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
      setError({});
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setError({});
  };

  const validateForm = (): boolean => {
    const formErrors: FormErrors = {};
    if (!title.trim()) formErrors.title = 'Title is required';
    if (!content.trim()) formErrors.content = 'Content is required';
    if (!selectedImage) formErrors.image = 'Image is required';
    if (isNaN(parseFloat(currentAmount))) {
      formErrors.currentAmount = 'Current amount must be a number';
    }
    if (!startDate) formErrors.startDate = 'Start date is required';
    if (!endDate) formErrors.endDate = 'End date is required';

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      formErrors.dateRange = 'End date must be after start date';
    }

    setError(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  useEffect(() => {
    // Set the initial profile values after fetching
    setCategory(userAccountData?.category || '');
    setLocation(userAccountData?.country || '');
    setGoalAmount(userAccountData?.target_amount || '');
    setCurrency(userAccountData?.currency || '');
    setCurrencySymbol(userAccountData?.currency_symbol || '');
    setCurrentAmount('0');
    // Disable further fetching
  }, [userAccountData]);

  const handleSubmit = async () => {
    if (validateForm()) {
      // Prepare formData for submission
      const formData = new FormData();

      // Append each field to the FormData object using the correct keys
      formData.append('campaign[title]', title);
      formData.append('campaign[description]', content);
      formData.append('campaign[goal_amount]', goalAmount);
      formData.append(
        'campaign[current_amount]',
        parseFloat(currentAmount).toString(),
      );
      formData.append('campaign[start_date]', startDate);
      formData.append('campaign[end_date]', endDate);
      formData.append('campaign[category]', category);
      formData.append('campaign[location]', location);
      formData.append('campaign[currency]', currency);
      formData.append('campaign[currency_symbol]', currency_symbol);

      if (selectedImage) {
        formData.append('campaign[media]', selectedImage);
      }
      try {
        const createdCampaign = await addCampaign(formData);
        setAlertTitle(createdCampaign.message);
        setAlertMessage(
          <a href="/account#Campaigns" className="text-gray-700 underline">
            View created campaign in the "Campaigns" tab
          </a>,
        );
        setIsOpen(false);
      } catch {
        setAlertTitle('Failed to create fundraising!');
        setAlertMessage(
          <div>
            {Object.values(error).map((errMsg, index) => (
              <p key={index} className="text-red-500">
                {errMsg}
              </p>
            ))}
          </div>,
        );
      } finally {
        setAlertOpen(true);
      }
    }
  };

  const onConfirmAction = () => {
    setAlertOpen(false);
    setAlertMessage('');
    setAlertTitle('');
    window.location.href = '/account#Campaigns';
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTitle('');
    setContent('');
    setSelectedImage(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed flex items-center gap-2 bottom-4 right-4 bg-green-600 text-white p-2 z-50 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 hover:bg-orange-400"
      >
        Create New Campaign
        <FaEdit />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        size="xxxlarge"
        closeOnBackdropClick={false}
      >
        <div className="overflow-y-auto p-2">
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Create a New Campaign</h2>

            <div className="mb-4">
              <label htmlFor="campaign-title" className="block text-sm mb-1">
                Title:
              </label>
              <input
                id="campaign-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="goal-amount" className="block text-sm mb-1">
                Goal Amount:
              </label>
              <input
                id="goal-amount"
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="start-date" className="block text-sm mb-1">
                Start Date:
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              />
              {error && error.startDate && (
                <p className="text-red-500 text-xs">{error.startDate}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="end-date" className="block text-sm mb-1">
                End Date:
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              />
              {error && error.endDate && (
                <p className="text-red-500 text-xs">{error.endDate}</p>
              )}
              {error && error.dateRange && (
                <p className="text-red-500 text-xs">{error.dateRange}</p>
              )}
            </div>

            {/* Dropdown for Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm mb-1">
                Category:
              </label>
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Dropdown for Currency Symbol*/}
            <div className="mb-4">
              <label htmlFor="currency_symbol" className="block text-sm mb-1">
                Currency Symbol:
              </label>
              <input
                type="text"
                name="currency_symbol"
                id="currency_symbol"
                value={currency_symbol}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                aria-label="Currency Symbol"
                disabled={true}
              />
            </div>
            {/* Dropdown for Currency */}
            <div className="mb-4">
              <label htmlFor="currency" className="block text-sm mb-1">
                Currency Code:
              </label>
              <input
                type="text"
                name="currency"
                id="currency"
                value={currency?.toLocaleUpperCase()}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                aria-label="Currency"
                disabled={true}
              />
            </div>

            {/* Dropdown for Country */}
            <div className="mb-4">
              <label htmlFor="country" className="block text-sm mb-1">
                Location:
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={location}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                aria-label="Location"
                disabled={true}
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm mb-1">Description:</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Add detailed description of what you're fundraising for..."
                id="rte"
                controls={[
                  ['bold', 'italic', 'underline'],
                  ['link', 'image', 'video'],
                  ['unorderedList', 'h1', 'h2', 'h3', 'blockquote'],
                  ['alignLeft', 'alignCenter', 'alignRight'],
                ]}
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Image Upload</h3>
                {selectedImage && (
                  <FiX
                    size={24}
                    className="text-gray-500 cursor-pointer"
                    onClick={handleRemoveImage}
                  />
                )}
              </div>

              {!selectedImage ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-md p-4 text-center ${
                    isDragActive ? 'border-green-600' : 'border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here...</p>
                  ) : (
                    <p>Drag 'n' drop a file here, or click to select one</p>
                  )}
                </div>
              ) : (
                <div className="relative h-64 bg-cover bg-center rounded-md overflow-hidden">
                  <img
                    src={URL.createObjectURL(selectedImage) || ''}
                    alt="Selected image"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="w-full text-orange-500 text-sm">
              Campaign you create is public by default. You can change it
              anytime from your fundraiser settings
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={handleCancel}>
                Close
              </Button>
              <Button variant="destructive" onClick={handleSubmit}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <AlertPopup
        title={alertTitle}
        message={alertMessage}
        isOpen={alertOpen}
        setIsOpen={setAlertOpen}
        onConfirm={() => onConfirmAction()}
        icon={
          alertTitle === 'Campaign created successfully' ? (
            <FaCheck className="w-6 h-6 text-green-600" />
          ) : (
            <FaExclamationTriangle className="w-6 h-6 text-red-600" />
          )
        }
      />
    </>
  );
};

export default CreateCampaign;
