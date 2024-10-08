'use client';
import { FaEdit } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Modal from '@/app/components/modal/Modal';
import { Button } from '@/app/components/button/Button';

const RichTextEditor = dynamic(() => import('@mantine/rte'), { ssr: false });

const EditCampaign = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState({ field: '', value: '' });
  const [title, setTitle] = useState('Fundraising Title');
  const [goal, setGoal] = useState(10000);
  const [description, setDescription] = useState(
    'Your fundraiser description goes here...',
  );
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=500&q=60',
  );

  // For handling image drop using react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedImage = URL.createObjectURL(acceptedFiles[0]);
      setImage(selectedImage);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  // Open the modal and set the field to edit
  const openEditModal = (field: string, value: string) => {
    setEditMode({ field, value });
    setIsModalOpen(true);
  };

  // Handle the save action from modal
  const handleSave = (newValue: string) => {
    switch (editMode.field) {
      case 'title':
        setTitle(newValue);
        break;
      case 'goal':
        setGoal(parseInt(newValue, 10));
        break;
      case 'description':
        setDescription(newValue);
        break;
      case 'image':
        setImage(newValue);
        break;
      default:
        break;
    }
    setIsModalOpen(false);
  };

  // Function to prepare data and send to the API
  const submitCampaignData = async () => {
    const campaignData = {
      title,
      goal,
      description,
      image,
    };

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      const result = await response.json();
      console.log('Campaign submitted successfully:', result);
      // Optionally, handle any UI feedback here
    } catch (error) {
      console.error('Error submitting campaign:', error);
      // Optionally, handle error UI feedback here
    }
  };

  return (
    <>
      {/* Display Campaign Information with Edit Buttons */}
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
            onClick={() => openEditModal('goal', goal.toString())}
            className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaEdit />
          </button>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Fundraising Goal
          </h3>
          <p className="text-gray-700 dark:text-gray-400">${goal}</p>
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
          <p className="text-gray-700 dark:text-gray-400">{description}</p>
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
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeOnBackdropClick={false}
        size="large"
      >
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

          {editMode.field === 'goal' && (
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
              submitCampaignData(); // Submit data after saving
            }}
            className="mt-4 dark:bg-gray-800 text-gray-800 hover:bg-gray-100 dark:text-gray-50 py-2 px-4 rounded-full"
            size="lg"
            variant="secondary"
          >
            Save Changes
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EditCampaign;
