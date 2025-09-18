'use client';

import React, { useState, useMemo } from 'react';
import RewardCard from './RewardCard';
import { Button } from '../ui/button';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';

interface RewardCarouselProps {
  campaigns: CampaignResponseDataType[];
  loading: boolean;
  error: string | null;
}

interface GroupedReward {
  reward: any;
  campaigns: CampaignResponseDataType[];
  count: number;
}

const RewardCarousel: React.FC<RewardCarouselProps> = ({ campaigns, loading, error }) => {
  const [visibleCount, setVisibleCount] = useState(3);

  const groupedRewards = useMemo(() => {
    const map = new Map<string, GroupedReward>();

    campaigns.forEach((campaign) => {
      campaign.rewards.forEach((reward: any) => {
        // ✅ group by campaign + reward id (fix)
        const key = `${campaign.id}-${reward.id}`;
        const existing = map.get(key);

        if (!existing) {
          map.set(key, {
            reward,
            campaigns: [campaign],
            count: 1,
          });
        } else {
          existing.count += 1;
        }
      });
    });

    return Array.from(map.values());
  }, [campaigns]);

  const showContent = () => {
    if (loading) {
      return <p>Loading rewards...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    if (!groupedRewards || groupedRewards.length === 0) {
      return <p>No rewards available.</p>;
    }

    return (
      <>
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {groupedRewards.slice(0, visibleCount).map(({ campaigns, reward, count }) => {
            const representativeCampaign = campaigns[0];

            return (
              <div
                key={`${representativeCampaign.id}-${reward.id}`}
                className="snap-start flex-none w-[220px] md:w-[280px] my-3 mx-2"
              >
                <RewardCard
                  campaign={representativeCampaign}
                  reward={reward}
                  loading={false}
                  error={null}
                  count={count}
                />
              </div>
            );
          })}
        </div>
        {visibleCount < groupedRewards.length && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 text-sm font-medium shadow-sm transition-all duration-300 hover:bg-primary hover:text-white"
              onClick={() => setVisibleCount((prev) => prev + 3)}
            >
              Show More
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold mb-4">Featured Rewards</h2>
      {showContent()}
    </div>
  );
};

export default RewardCarousel;
