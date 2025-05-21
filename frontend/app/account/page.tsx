'use client';

import { useState, useEffect } from 'react';
import {
  DashboardIcon,
  HandIcon,
  IconJarLogoIcon,
  GearIcon,
  RocketIcon,
  ChatBubbleIcon,
  StarIcon,
  MaskOffIcon,
} from '@radix-ui/react-icons';
import { HiOutlineTruck } from 'react-icons/hi';
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
import PledgesListPage from '@/app/account/Pledges';
import EquityInvestments from './EquityInvestments';
import Link from 'next/link';
import { FaArrowUp } from 'react-icons/fa';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

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
      label: 'Investments',
      icon: <MaskOffIcon />,
      component: <EquityInvestments />,
      description: 'Manage your equity investments and portfolio.',
      isNew: true,
    },
    {
      label: 'Backers',
      icon: <HandIcon />,
      component: <Donations />,
      description: 'Manage your backers and send thank you to them here.',
    },
    {
      label: 'Transfers',
      icon: <BiTransfer />,
      component: <Transfers />,
      description: 'View and manage your transfers.',
    },
    {
      label: 'Pledges',
      icon: <HiOutlineTruck />,
      component: <PledgesListPage />,
      description: 'View and manage your pledges here.',
    },
    {
      label: 'Rewards',
      icon: <IconJarLogoIcon />,
      component: <Rewards />,
      description: 'Receive and give rewards to your backers here.',
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
      label: 'Favorites',
      icon: <StarIcon />,
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

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const hashTab = window.location.hash.replace('#', '');

    if (hashTab && tabs.find((tab) => tab.label === hashTab)) {
      setActiveTab(hashTab);
    } else if (savedTab) {
      setActiveTab(savedTab);
    } else {
      setActiveTab(tabs[0].label);
    }

    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab) {
      window.history.replaceState(null, '', `#${activeTab}`);
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  const handleTabClick = (tab: string) => {
    setLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
  };

  if (loading) {
    return <ProfileTabsLoader />;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col mt-0 md:flex-row h-screen">
        {/* Tabs Menu - Now with sticky positioning */}
        <div className="md:w-1/6 border-b h-auto md:h-screen md:border-b-0 md:border-r-2 border-dashed border-orange-200 dark:border-neutral-700 flex flex-col sticky top-0">
          <div className="flex flex-col h-full">
            <div
              className="flex md:flex-col w-full space-x-2 md:space-x-0 md:space-y-2 !overflow-x-auto md:overflow-visible flex-grow"
              aria-label="Tabs"
            >
              {tabs.map(({ label, icon, isNew }, index) => {
                const isActive = activeTab === label;
                const isOnboarding = showOnboarding && currentStep === index;

                return (
                  <a
                    key={label}
                    href={`#${label}`}
                    className={`py-3 px-3 h-full whitespace-nowrap text-sm font-medium md:text-base transform transition-transform duration-300 ${
                      isActive
                        ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-2 md:border-r-0 border-orange-200 text-orange-400 dark:text-orange-600'
                        : 'border-transparent text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-gray-950'
                    } flex items-center focus:outline-none ${
                      isOnboarding
                        ? 'bg-green-600 text-white dark:bg-orange-700'
                        : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(label);
                    }}
                    aria-selected={isActive}
                    aria-controls={`vertical-tab-${label}`}
                    role="tab"
                    id={`tab-${label}`}
                  >
                    <span className="mr-2">{icon}</span>
                    {label}
                    {isNew && (
                      <span className="ml-2 relative">
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500"></span>
                      </span>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Upgrade Button - Fixed at the bottom */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-2 pb-4 px-3 border-t border-dashed border-orange-200 dark:border-neutral-700">
              <Link
                href="/account/upgrade"
                className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-colors duration-300 shadow-sm"
              >
                <FaArrowUp className="mr-2" />
                Upgrade
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col bg-gradient-to-tr from-green-50 to-orange-50 dark:from-green-900 dark:to-orange-900 dark:bg-gray-900 px-3 mb-0 overflow-auto h-full md:h-screen [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
          <div
            role="tabpanel"
            id={`vertical-tab-${activeTab}`}
            className="flex-1 mb-8"
          >
            {tabs.find((tab) => tab.label === activeTab)?.component}
          </div>
          <div className="bg-white w-full m-0 text-center py-4 text-gray-600 dark:text-gray-400">
            © 2025 Bantu Hive Ltd
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
