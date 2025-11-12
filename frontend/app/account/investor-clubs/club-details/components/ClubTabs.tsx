// app/account/investor-clubs/club-details/components/ClubTabs.tsx
import React from 'react';

interface ClubTabsProps {
  activeTab: 'about' | 'members' | 'actions' | 'share-history';
  onTabChange: (tab: 'about' | 'members' | 'actions' | 'share-history') => void;
}

const ClubTabs: React.FC<ClubTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6">
        {['about', 'members', 'actions', 'share-history'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab as any)}
            className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ClubTabs;
