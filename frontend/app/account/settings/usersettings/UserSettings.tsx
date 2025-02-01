import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { useUserContext } from '@/app/context/users/UserContext';

const UserSettings = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('English');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const {
    userAccountData,
    updateUserAccountData,
    profileData,
    updateProfileData,
  } = useUserContext();

  // Handle profile photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      setProfilePhoto(URL.createObjectURL(file)); // Update the photo preview
      updateProfileData(formData); // Send the FormData to update profile
    }
  };

  // Handle phone number formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedPhone = value.replace(
      /^(\d{3})(\d{3})(\d{4})$/,
      '($1) $2-$3',
    );
    setPhone(formattedPhone);
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zAA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Update user account data
  const handleUserAccountUpdate = () => {
    updateUserAccountData({
      full_name: name,
      phone_number: phone,
      email: email,
      country: country,
    });
  };

  // Update profile data
  const handleProfileUpdate = () => {
    updateProfileData({
      description: description,
    });
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    setIsAlertOpen(true);
  };

  const confirmDeleteAccount = () => {
    // Implement account deletion logic here
    console.log('Account deleted');
    setIsAlertOpen(false);
  };

  const cancelAccountDelete = () => {
    setIsAlertOpen(false); // Close the AlertPopup without action
  };

  // Simulate fetching user data
  useEffect(() => {
    if (userAccountData) {
      setName(userAccountData?.full_name || '');
      setPhone(userAccountData?.phone_number || '');
      setEmail(userAccountData?.email || '');
      setCountry(userAccountData?.country || '');
    }

    if (profileData) {
      setDescription(profileData?.description || '');
      setProfilePhoto(profileData?.avatar || null);
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
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2"
              >
                Pick Photo
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
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

            {/* Name */}
            <motion.div
              className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="max-w-lg block w-full shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:max-w-xs sm:text-sm border-gray-300 flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                  aria-label="Full name"
                />
              </div>
            </motion.div>

            {/* Phone Number */}
            <motion.div
              className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Phone Number
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:max-w-xs sm:text-sm border-gray-300 flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                  aria-label="Phone number"
                />
              </div>
            </motion.div>

            {/* Email Address */}
            <motion.div
              className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2"
              >
                Email Address
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`max-w-lg block w-full shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:max-w-xs sm:text-sm border-gray-300 flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${!validateEmail(email) && email ? 'border-red-500' : ''}`}
                  aria-label="Email address"
                />
                {!validateEmail(email) && email && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    Please enter a valid email address.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Country */}
            <motion.div
              className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Country
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={country}
                  className="max-w-lg block w-full shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:max-w-xs sm:text-sm border-gray-300 flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                  aria-label="Country"
                  disabled={true}
                />
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Description
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  name="description"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="max-w-lg block w-full shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:max-w-xs sm:text-sm border-gray-300 flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                  rows={4}
                  aria-label="Description"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 dark:bg-gray-600">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleUserAccountUpdate}
          >
            Save Changes
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleProfileUpdate}
          >
            Save Profile
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
