'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Heart, Award } from 'lucide-react';

interface CampaignCardProps {
  campaign: {
    id: number;
    title: string;
    description: string;
    category: string;
    funded: number;
    goal: number;
    current: number;
    daysLeft: number;
    imageUrl: string;
    creator: {
      name: string;
      avatarUrl: string;
    };
    rewards: string[];
  };
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-up h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to="/campaign" className="block flex-1">
        <div className="relative aspect-[3/2] overflow-hidden">
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className={cn(
              'w-full h-full object-cover transition-transform duration-700',
              isHovered ? 'scale-105' : 'scale-100'
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
          <span className="absolute top-4 left-4 px-2 py-1 text-xs font-semibold bg-background/90 text-foreground rounded-md">
            {campaign.category}
          </span>

          <button
            className={cn(
              'absolute top-4 right-4 p-2 rounded-full transition-colors',
              isLiked
                ? 'bg-primary/20 text-primary'
                : 'bg-background/80 text-muted-foreground hover:text-primary'
            )}
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={cn('h-4 w-4', isLiked && 'fill-primary')} />
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <img
              src={campaign.creator.avatarUrl}
              alt={campaign.creator.name}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-xs text-muted-foreground">
              {campaign.creator.name}
            </span>
          </div>

          <h3
            className={cn(
              'text-lg font-semibold text-foreground mb-2 line-clamp-2 transition-colors duration-300',
              isHovered ? 'text-primary' : ''
            )}
          >
            {campaign.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {campaign.description}
          </p>

          {/* Progress bar */}
          <div className="mt-auto">
            <div className="w-full bg-muted h-2 rounded-full mb-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${campaign.funded}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span className="font-medium">{campaign.funded}% funded</span>
              <span className="text-muted-foreground">
                ${campaign.current.toLocaleString()} raised
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">
                  {campaign.rewards.length} rewards
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {campaign.daysLeft} days left
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CampaignCard;
