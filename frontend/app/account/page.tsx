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
  StarIcon,
} from '@radix-ui/react-icons';
import { BiTransfer } from 'react-icons/bi';
import Rewards from '@/app/account/Rewards';
import Campaigns from '@/app/account/Campaigns';
import Transfers from '@/app/account/Transfers';
import Donations from '@/app/account/Donations';
import CampaignUpdates from '@/app/account/Updates';
import Dashboard from '@/app/account/Dashboard';
import ProfileTabsLoader from '@/app/loaders/ProfileTabsLoader';
import AccountSettings from '@/app/account/settings/AccountSettings';
import OnboardingModal from '@/app/components/onboarding/OnboardingModal';
import Favorites from '@/app/account/Favorites';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0); // To track the onboarding step

  // Tab titles and icons
  const tabs = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      component: <Dashboard />,
      description:
        'Your overall dashboard where you can see an overview of activities and analytics.',
    },
    {
      label: 'Donations',
      icon: <HandIcon />,
      component: <Donations />,
      description:
        'Manage your donations and send thank you to your backers here.',
    },
    {
      label: 'Transfers',
      icon: <BiTransfer />,
      component: <Transfers />,
      description: 'View and manage your transfers.',
    },
    {
      label: 'Rewards',
      icon: <IconJarLogoIcon />,
      component: <Rewards />,
      description: 'Receive and give rewards to your donors here.',
    },
    {
      label: 'Campaigns',
      icon: <RocketIcon />,
      component: <Campaigns />,
      description: 'Create and manage your fundraising campaigns.',
    },
    {
      label: 'Updates',
      icon: <ChatBubbleIcon />,
      component: <CampaignUpdates />,
      description: 'Add your fundraising updates in this tab.',
    },
    {
      label: 'Favorites', // New Favorites tab
      icon: <StarIcon />, // Use an appropriate icon
      component: <Favorites />,
      description: 'View your favorited campaigns here.',
    },
    {
      label: 'Settings',
      icon: <GearIcon />,
      component: <AccountSettings />,
      description:
        'Manage your account and Payment settings here. <p class="text-white bg-red-500 text-xs px-1">IMPORTANT: Please add your bank or mobile money account in this tab after you click Finish or Skip button.</p>',
    },
  ];

  // Navigate to a tab based on hash in URL
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const hashTab = window.location.hash.replace('#', '');

    if (hashTab && tabs.find((tab) => tab.label === hashTab)) {
      setActiveTab(hashTab); // Set tab from URL hash
    } else if (savedTab) {
      setActiveTab(savedTab); // Set tab from local storage
    } else {
      setActiveTab(tabs[0].label); // Default to the first tab
    }

    if (!onboardingCompleted) {
      setShowOnboarding(true); // Show onboarding if it's not completed
    }

    setLoading(false);
  }, []);

  // Update URL hash and save the active tab in local storage
  useEffect(() => {
    if (activeTab) {
      window.history.replaceState(null, '', `#${activeTab}`);
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  // Handle tab click and loading state
  const handleTabClick = (tab: string) => {
    setLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setLoading(false);
    }, 500); // Simulate loading
  };

  // Mark onboarding as completed
  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
  };

  if (loading) {
    return <ProfileTabsLoader />;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 flex flex-col mt-0 md:flex-row h-screen">
      <div className="max-w-7xl mx-auto">
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
                <a
                  key={label}
                  href={`#${label}`} // Anchor link
                  className={`py-3 px-3 h-full whitespace-nowrap text-sm font-medium md:text-base transform transition-transform duration-300 ${
                    isActive
                      ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-2 md:border-r-0 border-orange-200 text-orange-400 dark:text-orange-600'
                      : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-gray-950'
                  } flex items-center focus:outline-none ${
                    isOnboarding
                      ? 'bg-green-600 text-white dark:bg-orange-700'
                      : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    handleTabClick(label); // Handle tab click
                  }}
                  aria-selected={isActive}
                  aria-controls={`vertical-tab-${label}`}
                  role="tab"
                  id={`tab-${label}`} // Specific ID for better targeting
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-gradient-to-tr from-green-50 to-orange-50 dark:from-green-900 dark:to-orange-900 dark:bg-gray-900 px-4 py-4 mb-20 h-full [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
          <div
            role="tabpanel"
            id={`vertical-tab-${activeTab}`}
            className="h-full"
          >
            {tabs.find((tab) => tab.label === activeTab)?.component}
          </div>
        </div>

        {/* Onboarding Modal */}
        {showOnboarding && (
          <OnboardingModal
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completeOnboarding={completeOnboarding}
            tabs={tabs}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
