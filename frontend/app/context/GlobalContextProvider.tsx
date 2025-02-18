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
import { CategoryProvider } from './categories/CategoryContext';
import { CampaignCommentsProvider } from './account/comments/CommentsContext';
import { MetricsProvider } from './admin/metrics/MetricsContext';
import { LeaderboardProvider } from './leaderboard/LeaderboardContext';
import { PointRewardProvider } from './pointreward/PointRewardContext';

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
                <TransferProvider>
                  <CampaignCommentsProvider>
                    <CategoryProvider>
                      <MetricsProvider>
                        <LeaderboardProvider>
                          <PointRewardProvider>{children}</PointRewardProvider>
                        </LeaderboardProvider>
                      </MetricsProvider>
                    </CategoryProvider>
                  </CampaignCommentsProvider>
                </TransferProvider>
              </CampaignUpdatesProvider>
            </CampaignProvider>
          </RewardProvider>
        </DonationsProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
};
