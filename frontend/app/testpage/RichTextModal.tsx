'use client';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import { Switch } from '@headlessui/react';

// Dynamically import the RichTextEditor to load it only on the client side
const RichTextEditor = dynamic(() => import('@mantine/rte'), { ssr: false });

const BlogPostModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  interface FormErrors {
    title?: string;
    content?: string;
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
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Blog post submitted:', { title, content, isPublic });
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTitle('');
    setContent('');
    setIsPublic(false);
    setErrors({});
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
        aria-label="Open blog post modal"
      >
        <FiSave className="w-6 h-6" />
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
                  Add New Blog Post
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
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Enter blog post title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Content
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
                    className={`${isPublic ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Make post public</span>
                    <span
                      className={`${isPublic ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {isPublic ? 'Public' : 'Private'} post
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogPostModal;
