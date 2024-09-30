'use client';
import React, { useState } from 'react';
import { FaCreditCard, FaUser, FaBell } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import PaymentMethod from './paymentmethod/PaymentMethod';
import UserSettings from './usersettings/UserSettings';
import SystemSettingsPage from './systemsettings/SystemSettings';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('payment');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'payment':
        return <PaymentMethod />;
      case 'account':
        return <UserSettings />;
      case 'system':
        return <SystemSettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'payment' ? 'border-gray-500 text-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('payment')}
        >
          <FaCreditCard className="mr-2" />
          Payment
        </button>
        <button
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'account' ? 'border-gray-500 text-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('account')}
        >
          <MdAccountCircle className="mr-2" />
          Account
        </button>
        <button
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'system' ? 'border-gray-500 text-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('system')}
        >
          <FaBell className="mr-2" />
          System
        </button>
      </div>

      {/* Content container with enough bottom padding to prevent overlapping */}
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-50 p-3 shadow min-h-[calc(100vh-150px)] pb-16">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AccountSettings;
