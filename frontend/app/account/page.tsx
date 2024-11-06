'use client';

import { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0); // To track the onboarding step

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');

    if (savedTab) {
      setActiveTab(savedTab);
    }

    if (!onboardingCompleted) {
      setShowOnboarding(true); // Show onboarding if it's not completed
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

  // Mark onboarding as completed
  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
  };

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

  // Tab titles and icons
  const tabs = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      description:
        'Your overall dashboard where you can see an overview of activities and analytics.',
    },
    {
      label: 'Donations',
      icon: <HandIcon />,
      description: 'Manage your donations and charity activities.',
    },
    {
      label: 'Transfers',
      icon: <SymbolIcon />,
      description: 'View and manage your transfers.',
    },
    {
      label: 'Rewards',
      icon: <IconJarLogoIcon />,
      description: 'Receive and give rewards to your donors here.',
    },
    {
      label: 'Campaigns',
      icon: <RocketIcon />,
      description: 'Create and manage your fundraising campaigns.',
    },
    {
      label: 'Updates',
      icon: <ChatBubbleIcon />,
      description: 'Add your fundraising updates in this tab.',
    },
    {
      label: 'Settings',
      icon: <GearIcon />,
      description: 'Manage your account settings and payment here.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col mt-0 md:flex-row h-screen">
      {/* Tabs Menu */}
      <div className="md:w-1/6 border-b h-auto md:h-screen md:border-b-0 md:border-r-2 border-dashed border-orange-200 dark:border-neutral-700">
        <div
          className="flex md:flex-col w-full space-x-2 md:space-x-0 md:space-y-2 !overflow-x-auto md:overflow-visible"
          aria-label="Tabs"
        >
          {tabs.map(({ label, icon }, index) => {
            const isActive = activeTab === label;
            const isOnboarding = showOnboarding && currentStep === index;

            return (
              <button
                key={label}
                type="button"
                className={`py-4 px-4 h-full whitespace-nowrap text-sm font-medium md:text-base transform transition-transform duration-300 ${
                  isActive
                    ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-2 md:border-r-0 border-orange-200 text-orange-400 dark:text-orange-600'
                    : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-gray-950'
                } flex items-center focus:outline-none ${
                  isOnboarding ? 'bg-orange-100 dark:bg-orange-700' : ''
                }`}
                onClick={() => handleTabClick(label)}
                aria-selected={isActive}
                aria-controls={`vertical-tab-${label}`}
                role="tab"
                id={`tab-${label}`} // Specific ID for better targeting
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            );
          })}
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

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-sm max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Welcome! Let's take a quick tour.
            </h2>
            <div className="mb-4">
              <h3 className="font-bold text-lg">{tabs[currentStep].label}</h3>
              <p>{tabs[currentStep].description}</p>
            </div>
            <div className="flex justify-between mt-4">
              {/* Previous Button */}
              <button
                className="py-2 px-4 bg-gray-300 text-black rounded-lg"
                onClick={() => {
                  if (currentStep > 0) {
                    setCurrentStep(currentStep - 1);
                  }
                }}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              {/* Next Button */}
              <button
                className="py-2 px-4 bg-gray-500 text-white rounded-lg"
                onClick={() => {
                  if (currentStep === tabs.length - 1) {
                    completeOnboarding();
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
              >
                {currentStep === tabs.length - 1 ? 'Finish' : 'Next'}
              </button>
              {/* Skip Button */}
              <button
                className="py-2 px-4 bg-gray-300 text-black rounded-lg"
                onClick={completeOnboarding}
              >
                Skip Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTabs;
