import React, { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SaveReminderPanel = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSave = () => {
    // Simulating validation
    const newErrors: { name?: string; email?: string } = {};
    if (!(document.getElementById('name') as HTMLInputElement)?.value) {
      newErrors.name = 'Name is required';
    }
    if (!(document.getElementById('email') as HTMLInputElement)?.value) {
      newErrors.email = 'Email is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save logic here
    setHasUnsavedChanges(false);
    setIsPanelOpen(false);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowConfirmModal(true);
    } else {
      setIsPanelOpen(false);
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmModal(false);
    setIsPanelOpen(false);
  };

  const handleInputChange = () => {
    setHasUnsavedChanges(true);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Save Your Changes
            </h2>
            <p className="mb-6 text-gray-600">
              Please remember to save your changes before leaving.
            </p>

            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                onChange={handleInputChange}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                onChange={handleInputChange}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                onClick={handleSave}
                aria-label="Save changes"
              >
                <FaSave className="mr-2" /> Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                onClick={handleCancel}
                aria-label="Cancel and close panel"
              >
                <FaTimes className="mr-2" /> Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Unsaved Changes</h3>
              <p className="mb-4">
                Are you sure you want to leave without saving your changes?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Stay
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={handleConfirmCancel}
                >
                  Leave
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SaveReminderPanel;
