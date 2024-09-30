'use client';
import dynamic from 'next/dynamic';
import React, { useState, useCallback, useEffect } from 'react';
import { FiX, FiEdit, FiUpload, FiCheck } from 'react-icons/fi';
import { Switch } from '@headlessui/react';
import { Button } from '@/app/components/button/Button';
import { useDropzone } from 'react-dropzone';

const RichTextEditor = dynamic(() => import('@mantine/rte'), { ssr: false });

const CreateCampaign = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setError(null);
  };

  interface FormErrors {
    title?: string;
    content?: string;
    image?: string;
  }

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, []);

  const validateForm = () => {
    let formErrors: FormErrors = {};
    if (!title.trim()) formErrors.title = 'Title is required';
    if (!content.trim()) formErrors.content = 'Content is required';
    if (!selectedImage) formErrors.image = 'Image is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('isPublic', JSON.stringify(isPublic));
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      console.log('Form data:', formData);

      // Submit the form using formData
      fetch('/api/campaigns', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Campaign submitted successfully:', data);
          setIsOpen(false);
        })
        .catch((error) => {
          console.error('Error submitting campaign:', error);
        });
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTitle('');
    setContent('');
    setIsPublic(false);
    setErrors({});
    setSelectedImage(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300"
        aria-label="Open blog post modal"
      >
        <FiEdit className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Campaign
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-300"
                  aria-label="Close modal"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${
                      errors.title ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter Campaign title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Pick Image  */}
                <div className="mx-auto">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-md p-4 mb-4 text-center cursor-pointer transition duration-300 ${
                      isDragActive
                        ? 'border-red-500 bg-blue-50'
                        : 'border-gray-300 hover:border-red-500 hover:bg-blue-50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <FiUpload className="mx-auto text-4xl mb-2 text-gray-400" />
                    <p className="text-gray-600">
                      {isDragActive
                        ? 'Drop the file here...'
                        : "Drag 'n' drop an image here, or click to select a file"}
                    </p>
                  </div>
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
                      <FiX className="mr-2" />
                      <span>{error}</span>
                    </div>
                  )}
                  {selectedImage && (
                    <div className="mb-4">
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={handleRemoveImage}
                            className="bg-gray-300 hover:bg-red-600 text-white rounded-full p-1 transition duration-300"
                          >
                            <FiX className="text-xl" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {selectedImage.name}
                      </p>
                    </div>
                  )}
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Story
                  </label>
                  <RichTextEditor
                    id="content"
                    value={content}
                    onChange={setContent}
                    className={`mt-1 ${errors.content ? 'border-red-500' : ''}`}
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.content}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <Switch
                    checked={isPublic}
                    onChange={setIsPublic}
                    className={`${
                      isPublic ? 'bg-red-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Make post public</span>
                    <span
                      className={`${
                        isPublic ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {isPublic ? 'Public' : 'Private'} post
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleSubmit}>
                  Publish Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateCampaign;
