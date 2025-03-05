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
import { ArticlesProvider } from './admin/articles/ArticlesContext';
import { PledgesProvider } from './pledges/PledgesContext';
import { DrawerProvider } from './drawer/DrawerContext';

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <DrawerProvider>
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
                          <ArticlesProvider>
                            <LeaderboardProvider>
                              <PointRewardProvider>
                                <PledgesProvider>{children}</PledgesProvider>
                              </PointRewardProvider>
                            </LeaderboardProvider>
                          </ArticlesProvider>
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
    </DrawerProvider>
  );
};
