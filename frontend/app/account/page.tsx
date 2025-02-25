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
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react';
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
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Tab titles, icons, and components
  const tabs = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon className="h-5 w-5" />,
      component: <Dashboard />,
      description:
        'Your overall dashboard where you can see an overview of activities and analytics.',
    },
    {
      label: 'Donations',
      icon: <HandIcon className="h-5 w-5" />,
      component: <Donations />,
      description:
        'Manage your donations and send thank you to your backers here.',
    },
    {
      label: 'Transfers',
      icon: <BiTransfer className="h-5 w-5" />,
      component: <Transfers />,
      description: 'View and manage your transfers.',
    },
    {
      label: 'Rewards',
      icon: <IconJarLogoIcon className="h-5 w-5" />,
      component: <Rewards />,
      description: 'Receive and give rewards to your donors here.',
    },
    {
      label: 'Campaigns',
      icon: <RocketIcon className="h-5 w-5" />,
      component: <Campaigns />,
      description: 'Create and manage your fundraising campaigns.',
    },
    {
      label: 'Updates',
      icon: <ChatBubbleIcon className="h-5 w-5" />,
      component: <CampaignUpdates />,
      description: 'Add your fundraising updates in this tab.',
    },
    {
      label: 'Favorites',
      icon: <StarIcon className="h-5 w-5" />,
      component: <Favorites />,
      description: 'View your favorited campaigns here.',
    },
    {
      label: 'Settings',
      icon: <GearIcon className="h-5 w-5" />,
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
        {/* Tabs Menu */}
        <div className="md:w-1/6 border-b h-auto md:h-screen md:border-b-0 md:border-r-2 border-dashed border-orange-200 dark:border-neutral-700">
          <Tabs value={activeTab} orientation="vertical">
            <TabsHeader className="bg-transparent dark:bg-gray-800">
              {tabs.map(({ label, icon }) => (
                <Tab
                  key={label}
                  value={label}
                  onClick={() => setActiveTab(label)}
                  className="flex items-center gap-2 text-left p-3"
                >
                  {icon}
                  {label}
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col bg-gradient-to-tr from-green-50 to-orange-50 dark:from-green-900 dark:to-orange-900 dark:bg-gray-900 px-3 mb-0 overflow-auto h-full md:h-screen">
          <Tabs value={activeTab} orientation="vertical">
            <TabsBody>
              {tabs.map(({ label, component }) => (
                <TabPanel key={label} value={label} className="py-0">
                  {component}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
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
