import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaCamera } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserAccountSettings = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState({
    promotions: false,
    newsletters: false,
    accountUpdates: true,
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleEmailPreferenceChange = (
    preference: keyof typeof emailPreferences,
  ) => {
    setEmailPreferences((prev) => ({
      ...prev,
      [preference]: !prev[preference],
    }));
  };

  const handleSaveChanges = () => {
    toast.success('Changes saved successfully!');
  };

  const handleSectionSave = (section: string) => {
    toast.success(`${section} settings updated!`);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <div className="flex flex-col space-y-2">
            <button
              className={`flex items-center p-2 rounded-lg ${
                activeTab === 'personal'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => handleTabChange('personal')}
            >
              <FaUser className="mr-2" />
              Personal Info
            </button>
            <button
              className={`flex items-center p-2 rounded-lg ${
                activeTab === 'security'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => handleTabChange('security')}
            >
              <FaLock className="mr-2" />
              Security
            </button>
            <button
              className={`flex items-center p-2 rounded-lg ${
                activeTab === 'email'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => handleTabChange('email')}
            >
              <FaEnvelope className="mr-2" />
              Email Preferences
            </button>
          </div>
        </div>
        <div className="w-full md:w-3/4">
          {activeTab === 'personal' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Personal Information
              </h2>
              <div className="mb-4">
                <label htmlFor="firstName" className="block mb-1 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full p-2 border rounded"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block mb-1 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full p-2 border rounded"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dob" className="block mb-1 font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  className="w-full p-2 border rounded"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="profilePicture"
                  className="block mb-1 font-medium"
                >
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaCamera className="text-gray-400 text-3xl" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                  <label
                    htmlFor="profilePicture"
                    className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600 transition duration-300"
                  >
                    Upload Picture
                  </label>
                </div>
              </div>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                onClick={() => handleSectionSave('Personal')}
              >
                Save Personal Info
              </button>
            </div>
          )}
          {activeTab === 'security' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Security Settings</h2>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-1 font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-2 border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 font-medium"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full p-2 border rounded"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={() => setTwoFactor(!twoFactor)}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span>Enable Two-Factor Authentication</span>
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Two-factor authentication adds an extra layer of security to
                  your account by requiring a second form of verification.
                </p>
              </div>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                onClick={() => handleSectionSave('Security')}
              >
                Save Security Settings
              </button>
            </div>
          )}
          {activeTab === 'email' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Email Preferences</h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailPreferences.promotions}
                    onChange={() => handleEmailPreferenceChange('promotions')}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span>Promotional Emails</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailPreferences.newsletters}
                    onChange={() => handleEmailPreferenceChange('newsletters')}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span>Newsletters</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailPreferences.accountUpdates}
                    onChange={() =>
                      handleEmailPreferenceChange('accountUpdates')
                    }
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span>Account Updates</span>
                </label>
              </div>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-600 transition duration-300"
                onClick={() => handleSectionSave('Email')}
              >
                Save Email Preferences
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          className="bg-blue-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
          onClick={handleSaveChanges}
        >
          Save All Changes
        </button>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default UserAccountSettings;
