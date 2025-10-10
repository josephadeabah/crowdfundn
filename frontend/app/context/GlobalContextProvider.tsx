// app/context/GlobalProvider.tsx (update)
'use client';
import { ReactNode } from 'react';
import PiwikProProvider from '@piwikpro/next-piwik-pro';
import { UserProfileProvider } from './users/UserContext';
import { DonationsProvider } from './account/donations/DonationsContext';
import { RewardProvider } from './account/rewards/RewardsContext';
import { CampaignProvider } from './account/campaign/CampaignsContext';
import { EquityCampaignProvider } from './account/campaign/EquityCampaignContext';
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
import { KycProvider } from './kyc/KycContext';
import { KycReviewProvider } from './kyc/KycReviewContext';
import { PremiumProvider } from './premium/PremiumContext';

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <DrawerProvider>
      <PiwikProProvider
        containerId="c8913722-4c0b-4fbb-ac2d-d2b38fdee347"
        containerUrl="https://bantuhive.containers.piwik.pro"
        nonce="nonce-string"
      >
        <AuthProvider>
          <UserProfileProvider>
            <PremiumProvider>
              <KycProvider>
                <KycReviewProvider>
                  <DonationsProvider>
                    <RewardProvider>
                      <CampaignProvider>
                        <EquityCampaignProvider>
                          <CampaignUpdatesProvider>
                            <TransferProvider>
                              <CampaignCommentsProvider>
                                <CategoryProvider>
                                  <MetricsProvider>
                                    <ArticlesProvider>
                                      <LeaderboardProvider>
                                        <PointRewardProvider>
                                          <PledgesProvider>
                                            {children}
                                          </PledgesProvider>
                                        </PointRewardProvider>
                                      </LeaderboardProvider>
                                    </ArticlesProvider>
                                  </MetricsProvider>
                                </CategoryProvider>
                              </CampaignCommentsProvider>
                            </TransferProvider>
                          </CampaignUpdatesProvider>
                        </EquityCampaignProvider>
                      </CampaignProvider>
                    </RewardProvider>
                  </DonationsProvider>
                </KycReviewProvider>
              </KycProvider>
            </PremiumProvider>
          </UserProfileProvider>
        </AuthProvider>
      </PiwikProProvider>
    </DrawerProvider>
  );
};
