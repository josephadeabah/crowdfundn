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
  const [language, setLanguage] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { userProfile, loading, error, fetchUserProfile, hasRole } =
    useUserContext();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedPhone = value.replace(
      /^(\d{3})(\d{3})(\d{4})$/,
      '($1) $2-$3',
    );
    setPhone(formattedPhone);
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleDeleteAccount = () => {
    setDeleteConfirmation(true);
    setIsAlertOpen(true);
  };

  const confirmDeleteAccount = () => {
    // Implement account deletion logic here
    console.log('Account deleted');
    setDeleteConfirmation(false);
    setIsAlertOpen(true);
  };
  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setName(userProfile?.full_name || '');
      setPhone(userProfile?.phone_number || '');
      setEmail(userProfile?.email || '');
      setLanguage('English');
    }, 1000);
  }, [userProfile]);

  const cancelAccountDelete = () => {
    setIsAlertOpen(false); // Close the AlertPopup without action
    setDeleteConfirmation(false); // Reset the ID
  };

  return (
    <div className=" mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-50">
      <div className="mx-auto bg-white dark:bg-gray-700">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">
            Account Settings
          </h2>
          <div className="space-y-6 sm:space-y-5">
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500"
                  >
                    Change
                  </motion.button>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoUpload}
                    aria-label="Upload profile photo"
                  />
                </div>
              </div>
            </motion.div>

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

            <motion.div
              className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 dark:border-gray-600 sm:pt-5"
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

            <motion.div
              className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Preferred Language
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                  id="language"
                  name="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="max-w-lg block focus:ring-gray-500 focus:border-gray-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                  aria-label="Preferred language"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                </select>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 dark:bg-gray-600">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleDeleteAccount}
            aria-label="Delete account"
          >
            Delete Account
          </motion.button>
        </div>
      </div>
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
