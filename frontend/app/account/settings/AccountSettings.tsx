// app/account/settings/AccountSettings.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  FaCreditCard,
  FaUser,
  FaBell,
  FaIdCard,
  FaBars,
  FaCashRegister,
} from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import PaymentMethod from './paymentmethod/PaymentMethod';
import UserSettings from './usersettings/UserSettings';
import SystemSettingsPage from './systemsettings/SystemSettings';
import KYC from './kyc/KYC';
import UserSubscriptions from './subscriptions/UserSubscription';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('kyc');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const subscriptionRef = useRef<HTMLDivElement>(null);

  // Handle ?subscribe=true parameter - Enhanced version
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const subscribe = params.get('subscribe');

      if (subscribe === 'true') {
        setActiveTab('subscription');

        // Clean URL after setting tab
        const url = new URL(window.location.href);
        url.searchParams.delete('subscribe');
        window.history.replaceState(null, '', url.toString());

        // Scroll and highlight after a brief delay to ensure component is rendered
        setTimeout(() => {
          subscriptionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          subscriptionRef.current?.classList.add(
            'ring-2',
            'ring-green-500',
            'rounded-lg',
          );

          setTimeout(() => {
            subscriptionRef.current?.classList.remove(
              'ring-2',
              'ring-green-500',
              'rounded-lg',
            );
          }, 3000);
        }, 100);
      }
    };

    // Check on initial load
    handleUrlChange();

    // Listen for URL changes
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Also check when component becomes visible (in case it's loaded dynamically)
  useEffect(() => {
    const checkSubscribeParam = () => {
      const params = new URLSearchParams(window.location.search);
      const subscribe = params.get('subscribe');
      
      if (subscribe === 'true' && activeTab !== 'subscription') {
        setActiveTab('subscription');
        
        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete('subscribe');
        window.history.replaceState(null, '', url.toString());
      }
    };
    
    // Small delay to ensure component is fully rendered
    const timer = setTimeout(checkSubscribeParam, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'payment':
        return <PaymentMethod />;
      case 'subscription':
        return (
          <div
            ref={subscriptionRef}
            className="transition-all duration-500 ease-in-out"
          >
            <UserSubscriptions />
          </div>
        );
      case 'account':
        return <UserSettings />;
      case 'kyc':
        return <KYC />;
      case 'system':
        return <SystemSettingsPage />;
      default:
        return <KYC />;
    }
  };

  const tabs = [
    {
      id: 'payment',
      label: 'Payment',
      icon: <FaCreditCard className="mr-2" />,
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: <FaCashRegister className="mr-2" />,
    },
    {
      id: 'account',
      label: 'Account',
      icon: <MdAccountCircle className="mr-2" />,
    },
    { id: 'kyc', label: 'KYC', icon: <FaIdCard className="mr-2" /> },
    { id: 'system', label: 'System', icon: <FaBell className="mr-2" /> },
  ];

  return (
    <div className="mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-6">Settings</h1>

      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium"
        >
          <FaBars className="mr-2" />
          {tabs.find((tab) => tab.id === activeTab)?.label || 'Menu'}
        </button>
      </div>

      {/* Tabs */}
      <div className="relative">
        {/* Desktop Tabs */}
        <div className="hidden lg:flex border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown */}
        {showMobileMenu && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center w-full px-4 py-3 text-left ${
                  activeTab === tab.id
                    ? 'bg-green-50 text-green-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                } border-b border-gray-100 last:border-b-0`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowMobileMenu(false);
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white text-gray-800 p-3 shadow min-h-[calc(100vh-150px)] pb-16 rounded-lg">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AccountSettings;