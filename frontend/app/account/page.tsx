'use client';
import { useEffect, useState } from 'react';
import {
  DashboardIcon,
  HandIcon,
  SymbolIcon,
  ArchiveIcon,
  IconJarLogoIcon,
  RocketIcon,
} from '@radix-ui/react-icons';
import Rewards from './Rewards';
import Campaigns from './Campaigns';
import Transfers from './Transfers';
import Donations from './Donations';
import Archive from './Archive';
import Dashboard from './Dashboard';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

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
      case 'Archive':
        return <Archive />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row h-screen">
      {/* Tabs Menu */}
      <div className="w-full md:w-[13%] border-b h-full md:border-b-0 md:border-r-2 border-dashed border-red-200 dark:border-neutral-700">
        <nav
          className="flex md:flex-col w-full space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible  [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-1"
          aria-label="Tabs"
          role="tablist"
        >
          {[
            {
              label: 'Dashboard',
              icon: <DashboardIcon />,
            },
            {
              label: 'Donations',
              icon: <HandIcon />,
            },
            {
              label: 'Transfers',
              icon: <SymbolIcon />,
            },
            {
              label: 'Rewards',
              icon: <IconJarLogoIcon />,
            },
            {
              label: 'Campaigns',
              icon: <RocketIcon />,
            },
            {
              label: 'Archive',
              icon: <ArchiveIcon />,
            },
          ].map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              className={`py-2 px-1 whitespace-nowrap text-sm font-medium md:text-base ${
                activeTab === label
                  ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-4 md:border-r-0 border-red-200 text-red-600 dark:text-red-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500'
              } flex items-center focus:outline-none`}
              onClick={() => setActiveTab(label)}
              aria-selected={activeTab === label}
              aria-controls={`vertical-tab-${label}`}
              role="tab"
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="w-full bg-white dark:bg-gray-900 px-4 overflow-auto flex-1  [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-2 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
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
