'use client';
import { SetStateAction, useEffect, useState } from 'react';
import Joyride, { CallBackProps, Step, STATUS } from 'react-joyride';
import {
  DashboardIcon,
  HandIcon,
  SymbolIcon,
  IconJarLogoIcon,
  GearIcon,
  RocketIcon,
} from '@radix-ui/react-icons';
import Rewards from '@/app/account/Rewards';
import Campaigns from '@/app/account/Campaigns';
import Transfers from '@/app/account/Transfers';
import Donations from '@/app/account/Donations';
import Dashboard from '@/app/account/Dashboard';
import ProfileTabsLoader from '@/app/loaders/ProfileTabsLoader';
import AccountSettings from '@/app/account/settings/AccountSettings';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const [runWalkthrough, setRunWalkthrough] = useState(false);

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    const hasSeenWalkthrough = localStorage.getItem('hasSeenWalkthrough');

    if (savedTab) {
      setActiveTab(savedTab);
    }

    // Trigger walkthrough if it's the user's first time
    if (!hasSeenWalkthrough) {
      setRunWalkthrough(true);
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunWalkthrough(false);
      localStorage.setItem('hasSeenWalkthrough', 'true'); // Mark walkthrough as seen
    }
  };

  const handleTabClick = (tab: SetStateAction<string>) => {
    setLoading(true);
    setActiveTab(tab);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  };

  const steps: Step[] = [
    {
      target: '#dashboard-tab',
      content:
        'This is your dashboard where you can see an overview of activities.',
    },
    {
      target: '#donations-tab',
      content: 'View all your donations and say thank you in this tab.',
    },
    {
      target: '#transfers-tab',
      content: 'Manage your transfers in this tab.',
    },
    {
      target: '#rewards-tab',
      content: 'Give rewards to your backers and view your rewards from here.',
    },
    {
      target: '#campaigns-tab',
      content: 'Check your active campaigns in this tab.',
    },
    {
      target: '#settings-tab',
      content: 'Manage your account settings in this tab.',
    },
  ];

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
    <div className="max-w-7xl mx-auto flex flex-col mt-4 md:flex-row h-screen">
      <Joyride
        steps={steps}
        run={runWalkthrough}
        continuous
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            arrowColor: '#e3ffeb',
            backgroundColor: '#e3ffeb',
            overlayColor: '#343131',
            primaryColor: '#347928',
            textColor: '#000',
            spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
          },
        }}
      />
      {/* Tabs Menu */}
      <div className="md:w-1/6 border-b h-auto md:h-screen md:border-b-0 md:border-r-2 border-dashed border-red-200 dark:border-neutral-700">
        <nav
          className="flex md:flex-col w-full space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible"
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
            {
              label: 'Settings',
              icon: <GearIcon />,
              id: 'settings-tab',
            },
          ].map(({ label, icon, id }) => (
            <button
              id={id}
              key={label}
              type="button"
              className={`py-4 px-4 h-full whitespace-nowrap text-sm font-medium md:text-base transform transition-transform duration-300 ${
                activeTab === label
                  ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-4 md:border-r-0 border-red-200 text-red-600 dark:text-red-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500'
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
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-white dark:bg-gray-900 px-4 py-4 overflow-auto h-full md:h-screen [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
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
