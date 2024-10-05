// context/GlobalProvider.tsx
'use client';
import { ReactNode } from 'react';
import { UserProfileProvider } from './users/UserContext';
import { DonationsProvider } from './account/donations/DonationsContext';
import { RewardProvider } from './account/rewards/RewardsContext';
import { CampaignProvider } from './account/campaign/CampaignsContext';
import { TransferProvider } from './account/transfers/TransfersContext';
import { AuthProvider } from './auth/AuthContext';

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <DonationsProvider>
          <RewardProvider>
            <CampaignProvider>
              <TransferProvider>{children}</TransferProvider>
            </CampaignProvider>
          </RewardProvider>
        </DonationsProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
};
