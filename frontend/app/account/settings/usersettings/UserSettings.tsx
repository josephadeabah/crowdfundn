import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { useUserContext } from '@/app/context/users/UserContext';

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  type?: string;
  error?: string;
  disabled?: boolean;
  isTextArea?: boolean;
}

const UserSettings = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | File | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      setProfilePhoto(URL.createObjectURL(file)); // Update the photo preview

      try {
        // Assuming updateProfileData can handle FormData
        await updateProfileData(formData);
      } catch (error) {
        console.error('Error uploading profile photo:', error);
      }
    }
  };

  // Handle phone number formatting
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.replace(/\D/g, ''); // We want to process the value of the input or textarea

    // Format phone number (only valid for input type)
    if (e.target instanceof HTMLInputElement) {
      const formattedPhone = value.replace(
        /^(\d{3})(\d{3})(\d{4})$/,
        '($1) $2-$3',
      );
      setPhone(formattedPhone);
    }
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    try {
      await updateUserAccountData({
        full_name: name,
        phone_number: phone,
        email: email,
        country: country,
      });

      const updatedProfile = {
        description,
        avatar: profilePhoto ? profilePhoto : undefined,
      };

      await updateProfileData(updatedProfile);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
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

  // Reusable FormField Component
  const FormField = ({
    label,
    id,
    value,
    onChange,
    type = 'text',
    error,
    disabled = false,
    isTextArea = false,
  }: FormFieldProps) => (
    <motion.div
      className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
      >
        {label}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        {isTextArea ? (
          <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="max-w-lg block w-full shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:max-w-xs sm:text-sm border-gray-300 flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
            rows={4}
            aria-label={label}
          />
        ) : (
          <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className={`max-w-lg block w-full shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:max-w-xs sm:text-sm border-gray-300 flex-grow px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${error ? 'border-red-500' : ''}`}
            aria-label={label}
            disabled={disabled}
          />
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
            {error}
          </p>
        )}
      </div>
    </motion.div>
  );

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
                          : profilePhoto
                            ? URL.createObjectURL(profilePhoto)
                            : ''
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormField
              label="Phone Number"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              type="tel"
            />
            <FormField
              label="Email Address"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              error={
                !validateEmail(email) && email
                  ? 'Please enter a valid email address.'
                  : ''
              }
            />
            <FormField
              label="Country"
              id="country"
              value={country}
              disabled={true}
            />
            <FormField
              label="Description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
