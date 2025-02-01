import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { useUserContext } from '@/app/context/users/UserContext';
import debounce from 'lodash/debounce'; // Import lodash debounce
import FormField from './FormField'; // Import FormField
import { UserProfile } from '@/app/types/user_profiles.types';

const UserSettings = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    country: '',
    description: '',
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const {
    userAccountData,
    updateUserAccountData,
    profileData,
    updateProfileData,
  } = useUserContext();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      setProfilePhoto(URL.createObjectURL(file));

      try {
        updateProfileData(formData);
      } catch (error) {
        console.error('Error uploading profile photo:', error);
      }
    }
  };

  const handlePhoneChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value.replace(/\D/g, '');
      const formattedPhone = value.replace(
        /^(\d{3})(\d{3})(\d{4})$/,
        '($1) $2-$3',
      );
      setFormData((prev) => ({ ...prev, phone: formattedPhone }));
    }, 500),
    [],
  );

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSaveChanges = async () => {
    try {
      // Prepare form data for profile (including avatar upload)
      const formDataToSend = new FormData();
      formDataToSend.append('profile[name]', formData.name);
      formDataToSend.append('profile[description]', formData.description);

      if (profilePhoto instanceof File) {
        formDataToSend.append('profile[avatar]', profilePhoto);
      }

      // Update the profile data
      updateProfileData(formDataToSend);

      // Prepare JSON data for user account information
      const userDataToUpdate: Partial<UserProfile> = {
        full_name: formData.name,
        phone_number: formData.phone,
        email: formData.email,
        country: formData.country,
      };

      // Update the user account data
      updateUserAccountData(userDataToUpdate);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleDeleteAccount = () => {
    setIsAlertOpen(true);
  };

  const confirmDeleteAccount = () => {
    console.log('Account deleted');
    setIsAlertOpen(false);
  };

  const cancelAccountDelete = () => {
    setIsAlertOpen(false);
  };

  useEffect(() => {
    if (userAccountData) {
      setFormData({
        name: userAccountData.full_name || '',
        phone: userAccountData.phone_number || '',
        email: userAccountData.email || '',
        country: userAccountData.country || '',
        description: userAccountData?.profile?.description || '',
      });
      setProfilePhoto(userAccountData?.profile?.avatar?.record?.avatar || null);
    }
  }, [userAccountData, profileData]);

  return (
    <div className="mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-50">
      <div className="mx-auto bg-white dark:bg-gray-700">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">
            Account Settings
          </h2>
          <div className="space-y-6 sm:space-y-5">
            {/* Profile Photo */}
            <motion.div
              className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  {profilePhoto ? (
                    <img
                      src={
                        typeof profilePhoto === 'string'
                          ? profilePhoto
                          : URL.createObjectURL(profilePhoto)
                      }
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <FaUser className="text-gray-400 text-3xl" />
                    </div>
                  )}
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="ml-5 cursor-pointer"
                    onChange={handlePhotoUpload}
                    aria-label="Upload profile photo"
                  />
                </div>
              </div>
            </motion.div>

            {/* Form Fields */}
            <FormField
              label="Name"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <FormField
              label="Phone Number"
              id="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              type="tel"
            />
            <FormField
              label="Email Address"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              error={
                !validateEmail(formData.email) && formData.email
                  ? 'Please enter a valid email address.'
                  : ''
              }
            />
            <FormField
              label="Country"
              id="country"
              value={formData.country}
              disabled={true}
            />
            <FormField
              label="Description"
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              isTextArea={true}
            />
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 dark:bg-gray-600">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSaveChanges}
          >
            Save Changes
          </motion.button>
        </div>
      </div>

      {/* Alert Popup for Account Deletion */}
      <AlertPopup
        title="Delete Account"
        message="Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone."
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        onConfirm={confirmDeleteAccount}
        onCancel={cancelAccountDelete}
      />
    </div>
  );
};

export default UserSettings;
