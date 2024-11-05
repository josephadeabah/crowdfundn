'use client';

import { useState, useEffect } from 'react';
import { Walktour } from 'walktour';
import {
  DashboardIcon,
  HandIcon,
  SymbolIcon,
  IconJarLogoIcon,
  GearIcon,
  RocketIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons';
import Rewards from '@/app/account/Rewards';
import Campaigns from '@/app/account/Campaigns';
import Transfers from '@/app/account/Transfers';
import Donations from '@/app/account/Donations';
import CampaignUpdates from '@/app/account/Updates';
import Dashboard from '@/app/account/Dashboard';
import ProfileTabsLoader from '@/app/loaders/ProfileTabsLoader';
import AccountSettings from '@/app/account/settings/AccountSettings';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');

    if (savedTab) {
      setActiveTab(savedTab);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  // Handle tab click and loading state
  const handleTabClick = (tab: string) => {
    setLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Define steps for the Walktour
  const steps = [
    {
      selector: '#dashboard-tab',
      title: 'Dashboard Guide',
      description:
        'This is your dashboard where you can see an overview of activities.',
    },
    {
      selector: '#donations-tab',
      title: 'Donations Guide',
      description: 'View all your donations and say thank you in this tab.',
    },
    {
      selector: '#transfers-tab',
      title: 'Transfer Guide',
      description: 'Manage your transfers in this tab.',
    },
    {
      selector: '#rewards-tab',
      title: 'Rewards Guide',
      description:
        'Give rewards to your backers and view your rewards from here.',
    },
    {
      selector: '#campaigns-tab',
      title: 'Campaigns Guide',
      description: 'Check your active campaigns in this tab.',
    },
    {
      selector: '#updates-tab',
      title: 'Updates Guide',
      description: 'Add your fundraising updates in this tab.',
    },
    {
      selector: '#settings-tab',
      title: 'Settings Guide',
      description: 'Manage your account settings in this tab.',
    },
  ];

  // Render content for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Donations':
        return <Donations />;
      case 'Transfers':
        return <Transfers />;
      case 'Rewards':
        return <Rewards />;
      case 'Campaigns':
        return <Campaigns />;
      case 'Updates':
        return <CampaignUpdates />;
      case 'Settings':
        return <AccountSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return <ProfileTabsLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col mt-0 md:flex-row h-screen">
      {/* Walktour Component */}
      <Walktour steps={steps} />

      {/* Tabs Menu */}
      <div className="md:w-1/6 border-b h-auto md:h-screen md:border-b-0 md:border-r-2 border-dashed border-orange-200 dark:border-neutral-700">
        <div
          className="flex md:flex-col w-full space-x-2 md:space-x-0 md:space-y-2 !overflow-x-auto md:overflow-visible"
          aria-label="Tabs"
        >
          {[
            {
              label: 'Dashboard',
              icon: <DashboardIcon />,
              id: 'dashboard-tab',
            },
            { label: 'Donations', icon: <HandIcon />, id: 'donations-tab' },
            { label: 'Transfers', icon: <SymbolIcon />, id: 'transfers-tab' },
            { label: 'Rewards', icon: <IconJarLogoIcon />, id: 'rewards-tab' },
            { label: 'Campaigns', icon: <RocketIcon />, id: 'campaigns-tab' },
            { label: 'Updates', icon: <ChatBubbleIcon />, id: 'updates-tab' },
            { label: 'Settings', icon: <GearIcon />, id: 'settings-tab' },
          ].map(({ label, icon, id }) => (
            <button
              id={id}
              key={label}
              type="button"
              className={`py-4 px-4 h-full whitespace-nowrap text-sm font-medium md:text-base transform transition-transform duration-300 ${
                activeTab === label
                  ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-2 md:border-r-0 border-orange-200 text-orange-400 dark:text-orange-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-gray-950'
              } flex items-center focus:outline-none`}
              onClick={() => handleTabClick(label)}
              aria-selected={activeTab === label}
              aria-controls={`vertical-tab-${label}`}
              role="tab"
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-gradient-to-br from-green-50 to-orange-50 dark:from-green-900 dark:to-orange-900 dark:bg-gray-900 px-4 py-4 overflow-auto h-full md:h-screen [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
        <div
          role="tabpanel"
          id={`vertical-tab-${activeTab}`}
          className="h-full"
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;
