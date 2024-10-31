// context/GlobalProvider.tsx
'use client';
import { ReactNode } from 'react';
import { UserProfileProvider } from './users/UserContext';
import { DonationsProvider } from './account/donations/DonationsContext';
import { RewardProvider } from './account/rewards/RewardsContext';
import { CampaignProvider } from './account/campaign/CampaignsContext';
import { CampaignUpdatesProvider } from './account/updates/CampaignUpdatesContext';
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
              <CampaignUpdatesProvider>
                <TransferProvider>{children}</TransferProvider>
              </CampaignUpdatesProvider>
            </CampaignProvider>
          </RewardProvider>
        </DonationsProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
};
