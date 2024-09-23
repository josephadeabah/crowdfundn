// context/GlobalProvider.tsx
'use client';
import { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { DonationsProvider } from './DonationsContext';
import { RewardProvider } from './RewardsContext';
import { CampaignProvider } from './CampaignsContext';
import { TransferProvider } from './TransfersContext';

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <DonationsProvider>
        <RewardProvider>
          <CampaignProvider>
            <TransferProvider>{children}</TransferProvider>
          </CampaignProvider>
        </RewardProvider>
      </DonationsProvider>
    </UserProvider>
  );
};
