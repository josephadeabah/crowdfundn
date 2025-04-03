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
  const [isFavorite, setIsFavorite] = useState(false);

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
    try {
      await favoriteCampaign(campaignId);
      setIsFavorite(true);
      showToast('Success', 'Campaign added to favorites', 'success');
    } catch (error) {
      showToast('Error', 'Failed to favorite campaign', 'error');
    }
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
    try {
      await unfavoriteCampaign(campaignId);
      setIsFavorite(false);
      showToast('Success', 'Campaign removed from favorites', 'success');
    } catch (error) {
      showToast('Error', 'Failed to unfavorite campaign', 'error');
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      handleUnfavorite(String(campaign.id));
    } else {
      handleFavorite(String(campaign.id));
    }
  };

  return (
    <>
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      <div
        className="group relative overflow-hidden rounded-lg bg-background hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up h-full flex flex-col text-xs"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite();
            }}
            className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm"
          >
            {isFavorite ? (
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            ) : (
              <Heart className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        </div>

        <Link
          href={`/campaign/${campaign.id}?${generateRandomString()}`}
          className="block flex-1"
        >
          <div className="relative aspect-[4/2.5] overflow-hidden">
            <Image
              src={campaign?.media || '/bantuhive.svg'}
              alt={campaign.title}
              layout="fill"
              objectFit="cover"
              unoptimized
              className={cn(
                'w-full h-full object-cover transition-transform duration-700',
                isHovered ? 'scale-105' : 'scale-100',
              )}
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.currentTarget.src = '/bantuhive.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
            <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-semibold bg-green-600 text-white rounded-full">
              {deslugify(campaign?.category)}
            </span>
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <div className="mb-1 flex items-center gap-1">
              <Avatar
                name={campaign?.fundraiser?.profile?.name}
                size="sm"
                imageUrl={campaign?.fundraiser?.profile?.avatar}
              />
              <span className="text-[10px] text-muted-foreground">
                {campaign?.fundraiser?.profile?.name}
              </span>
            </div>

            <h3
              className={cn(
                'text-sm font-semibold text-foreground mb-1 line-clamp-2 transition-colors duration-300',
                isHovered ? 'text-primary' : '',
              )}
            >
              {campaign.title}
            </h3>

            <div className="mt-auto">
              <div className="w-full text-[10px] mb-1">
                <Progress
                  firstProgress={
                    (Number(campaign?.transferred_amount) /
                      Number(campaign?.goal_amount)) *
                    100
                  }
                  firstTooltipContent={`Progress: ${(Number(campaign?.transferred_amount) / Number(campaign?.goal_amount)) * 100}%`}
                />
              </div>

              <div className="flex justify-between text-[10px] mb-2">
                <span className="text-muted-foreground">
                  {campaign?.currency_symbol ||
                    campaign?.currency?.toUpperCase()}{' '}
                  {parseFloat(
                    campaign?.transferred_amount?.toString() || '0',
                  ).toLocaleString()}{' '}
                  raised
                </span>
                <span className="text-muted-foreground">
                  of{' '}
                  {campaign?.currency_symbol ||
                    campaign?.currency?.toUpperCase()}{' '}
                  {parseFloat(
                    campaign?.goal_amount?.toString() || '0',
                  ).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3 text-primary" />
                  <span className="font-medium">
                    {campaign.total_donors || 0} Backers
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {campaign.remaining_days} days left
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default CampaignCard;
