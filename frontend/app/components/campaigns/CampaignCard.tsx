'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import ErrorPage from '../errorpage/ErrorPage';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import EmptyPage from '../emptypage/EmptyPage';
import Image from 'next/image';
import { useUserContext } from '@/app/context/users/UserContext';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { FaBookmark, FaRegBookmark, FaClock, FaUser } from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '../toast/Toast';
import Avatar from '../avatar/Avatar';
import CarouselComponent from '@/app/components/carousel/CarouselComponent';
import { cn } from '@/app/lib/utils';
import { Heart, Award } from 'lucide-react';
import { deslugify } from '@/app/utils/helpers/categories';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';

type CampaignCardProps = {
  campaign: CampaignResponseDataType;
  loading: boolean;
  error: string | null;
  onPageChange: (newPage: number) => void;
};

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  loading,
  error,
  onPageChange,
}) => {
  const { userAccountData } = useUserContext();
  const {
    pagination,
    favoriteCampaign,
    unfavoriteCampaign,
    fetchAllCampaigns,
  } = useCampaignContext();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(1);
  const [location, setLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [pageSize, setPageSize] = useState<number>(20);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('all_time');
  const [goalRange, setGoalRange] = useState<string>('all');
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning',
  ) => {
    setToast({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    setPage(newPage);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    fetchAllCampaigns(
      sortBy,
      sortOrder,
      page,
      pageSize,
      dateRange,
      goalRange,
      location,
      debouncedSearchTerm,
    );
  }, [
    fetchAllCampaigns,
    sortBy,
    sortOrder,
    page,
    pageSize,
    dateRange,
    goalRange,
    location,
    debouncedSearchTerm,
  ]);

  const handleFavorite = async (campaignId: string) => {
    if (!user) {
      showToast(
        'Error',
        'You must log in first to add to your favorite and track campaign progress.',
        'error',
      );
      return;
    }
    await favoriteCampaign(campaignId);
  };

  const handleUnfavorite = async (campaignId: string) => {
    if (!user) {
      showToast(
        'Error',
        'You must log in first to add to your favorite and track campaign progress.',
        'error',
      );
      return;
    }
    await unfavoriteCampaign(campaignId);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-up h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/campaign/${campaign.id}?${generateRandomString()}`} className="block flex-1">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={campaign?.media || '/bantuhive.svg'}
            alt={campaign.title}
            layout="fill"
            objectFit="cover"
            className={cn(
              'w-full h-full object-cover transition-transform duration-700',
              isHovered ? 'scale-105' : 'scale-100',
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
          <span className="absolute top-4 left-4 px-2 py-1 text-xs font-semibold bg-background/90 text-foreground rounded-md">
            {deslugify(campaign?.category)}
          </span>

          <button
            className={cn(
              'absolute top-4 right-4 p-2 rounded-full transition-colors',
              isLiked
                ? 'bg-primary/20 text-primary'
                : 'bg-background/80 text-muted-foreground hover:text-primary',
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
          <Avatar
              name={campaign?.fundraiser?.profile?.name}
              size="sm"
              imageUrl={campaign?.fundraiser?.profile?.avatar}
            />
            <span className="text-xs text-muted-foreground">
              {campaign?.fundraiser?.profile?.name}
            </span>
          </div>

          <h3
            className={cn(
              'text-lg font-semibold text-foreground mb-2 line-clamp-2 transition-colors duration-300',
              isHovered ? 'text-primary' : '',
            )}
          >
            {campaign.title}
          </h3>

          {/* Progress bar */}
          <div className="mt-auto">
            <div className="w-full text-xs mb-2">
              <Progress
                firstProgress={
                  (Number(campaign?.transferred_amount) /
                    Number(campaign?.goal_amount)) *
                  100
                }
                firstTooltipContent={`Progress: ${
                  (Number(campaign?.transferred_amount) /
                    Number(campaign?.goal_amount)) *
                  100
                }%`}
              />
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">
                {campaign?.currency_symbol || campaign?.currency?.toUpperCase()}{' '}
                {parseFloat(
                  campaign?.transferred_amount?.toString() || '0',
                ).toLocaleString()}{' '}
                raised
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">
                  {campaign.total_donors || 0} Backers
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {campaign.remaining_days} days left
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CampaignCard;