// context/GlobalProvider.tsx
'use client';
import { ReactNode } from 'react';
import { UserProvider } from './users/UserContext';
import { DonationsProvider } from './account/donations/DonationsContext';
import { RewardProvider } from './account/rewards/RewardsContext';
import { CampaignProvider } from './account/campaign/CampaignsContext';
import { TransferProvider } from './account/transfers/TransfersContext';

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
