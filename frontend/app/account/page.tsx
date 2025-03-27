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
import { BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { NotificationsComponent } from '../components/NotificationsComponent';
import { MessagesComponent } from '../components/MessagesComponent';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0); // To track the onboarding step

  // Tab titles and icons
  const visibleTabs = [
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
      label: 'Pledges', // New Pledges tab
      icon: <HiOutlineTruck />, // Use an appropriate icon
      component: <PledgesListPage />,
      description: 'View and manage your pledges here.',
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

  // Special hidden tabs
  const hiddenTabs = [
    {
      label: 'notifications',
      component: <NotificationsComponent notifications={[]} />,
      hidden: true
    },
    {
      label: 'messages',
      component: <MessagesComponent messages={[]} />,
      hidden: true
    }
  ];

  // Combined tabs
  const allTabs = [...visibleTabs, ...hiddenTabs];

  // Navigate to a tab based on hash in URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const savedTab = localStorage.getItem('activeTab');
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');

      // First check for hidden tabs (case insensitive)
      const hiddenTabMatch = hiddenTabs.find(tab => 
        tab.label.toLowerCase() === hash.toLowerCase()
      );
      
      if (hiddenTabMatch) {
        setActiveTab(hiddenTabMatch.label);
        return;
      }

      // Then check for regular tabs
      const visibleTabMatch = visibleTabs.find(tab => 
        tab.label.toLowerCase() === hash.toLowerCase()
      );
      
      if (visibleTabMatch) {
        setActiveTab(visibleTabMatch.label);
      } else if (savedTab) {
        setActiveTab(savedTab);
      } else {
        setActiveTab(visibleTabs[0].label);
      }

      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    };

    // Initial load
    handleHashChange();

    // Add hashchange event listener
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
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
    <div className="w-full bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col mt-0 md:flex-row h-screen">
        {/* Tabs Menu - Only show visible tabs */}
        <div className="md:w-1/6 border-b h-auto md:h-screen md:border-b-0 md:border-r-2 border-dashed border-orange-200 dark:border-neutral-700">
          <div
            className="flex md:flex-col w-full space-x-2 md:space-x-0 md:space-y-2 !overflow-x-auto md:overflow-visible"
            aria-label="Tabs"
          >
            {visibleTabs.map(({ label, icon }, index) => {
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
                </a>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}         
        <div className="flex-1 flex flex-col bg-gradient-to-tr from-green-50 to-orange-50 dark:from-green-900 dark:to-orange-900 dark:bg-gray-900 px-3 mb-0 overflow-auto h-full md:h-screen">
          <div
            role="tabpanel"
            id={`vertical-tab-${activeTab}`}
            className="flex-1 mb-8"
          >
            {/* Find the exact tab match */}
            {allTabs.find(tab => tab.label === activeTab)?.component || 
             (activeTab === 'notifications' && <NotificationsComponent notifications={[]} />) ||
             (activeTab === 'messages' && <MessagesComponent messages={[]} />)}
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
            tabs={visibleTabs}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
