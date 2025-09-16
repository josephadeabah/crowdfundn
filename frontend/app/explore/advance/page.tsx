'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useUserContext } from '@/app/context/users/UserContext';
import { useAuth } from '@/app/context/auth/AuthContext';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import Link from 'next/link';
import Image from 'next/image';
import { FaClock, FaUser, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Grid, List, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Card, Collapse } from '@material-tailwind/react';
import { Button } from '@/app/components/button/Button';
import Progress from '@/app/components/progressbar/ProgressBar';
import Avatar from '@/app/components/avatar/Avatar';
import Pagination from '@/app/components/pagination/Pagination';
import ToastComponent from '@/app/components/toast/Toast';
import CampaignCardSkeleton from '@/app/loaders/CampaignCardSkeleton';
import { Badge } from '@/app/components/ui/badge';
import { Skeleton } from '@/app/components/ui/Skeleton';

const CampaignsPage = () => {
  const {
    fetchAllCampaigns,
    campaigns,
    loading,
    error,
    favoriteCampaign,
    unfavoriteCampaign,
    pagination,
  } = useCampaignContext();

  const { userAccountData } = useUserContext();
  const { user } = useAuth();
  const controls = useAnimation();
  const [ref, inView] = useInView();

  // State management
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter states
  const [dateRange, setDateRange] = useState('all_time');
  const [goalRange, setGoalRange] = useState('all');
  const [location, setLocation] = useState('all');
  const [category, setCategory] = useState('all');

  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  useEffect(() => {
    fetchAllCampaigns(
      sortBy,
      sortOrder,
      currentPage,
      itemsPerPage,
      dateRange,
      goalRange,
      location,
      searchTerm,
    );
  }, [
    fetchAllCampaigns,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    dateRange,
    goalRange,
    location,
    searchTerm,
  ]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleOrderChange = (value: string) => {
    setSortOrder(value);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  const handleGoalRangeChange = (value: string) => {
    setGoalRange(value);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAllCampaigns(
      sortBy,
      sortOrder,
      1,
      itemsPerPage,
      dateRange,
      goalRange,
      location,
      searchTerm,
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const filteredCampaigns =
    campaigns?.filter((campaign) => campaign?.permissions?.is_public) || [];
  const totalPages = pagination?.totalPages || 1;

  // Campaign Card Component
  const CampaignCard = ({ campaign }: { campaign: any }) => {
    const fundraiserCurrency =
      campaign?.currency_symbol || campaign?.currency?.toUpperCase();
    const progressPercentage =
      (Number(campaign?.transferred_amount || 0) /
        Number(campaign?.goal_amount || 1)) *
      100;

    return (
      <motion.div
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
        className="group relative bg-white dark:bg-gray-900 flex flex-col h-full dark:text-gray-50 cursor-pointer overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-sm transition-shadow duration-300"
      >
        <Link href={`/campaign/${campaign?.id}?${generateRandomString()}`}>
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={campaign?.media || '/bantuhive.svg'}
              alt="media thumbnail"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.currentTarget.src = '/bantuhive.svg';
              }}
            />
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <div className="mb-3">
              <Progress
                firstProgress={progressPercentage}
                firstTooltipContent={`Progress: ${progressPercentage.toFixed(1)}%`}
              />
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Avatar
                  name={campaign?.fundraiser?.profile?.name}
                  size="sm"
                  imageUrl={campaign?.fundraiser?.profile?.avatar}
                />
                <span className="text-sm font-semibold truncate max-w-[100px]">
                  {campaign?.fundraiser?.profile?.name}
                </span>
              </div>

              <div
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  campaign?.favorited
                    ? handleUnfavorite(campaign?.id.toString())
                    : handleFavorite(campaign?.id.toString());
                }}
              >
                {campaign.favorited ? (
                  <FaBookmark className="text-orange-500" />
                ) : (
                  <FaRegBookmark className="text-gray-500 dark:text-gray-300" />
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
              {campaign?.title}
            </h3>

            <div className="mt-auto space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span
                  className={`${progressPercentage >= 100 ? 'text-green-600' : 'text-orange-500'}`}
                >
                  {fundraiserCurrency}
                  {parseFloat(
                    campaign?.transferred_amount?.toString() || '0',
                  ).toLocaleString()}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  of {fundraiserCurrency}
                  {parseFloat(campaign?.goal_amount || '0').toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <FaUser className="text-xs" />
                  <span>{campaign?.total_donors || 0} Backers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaClock className="text-xs" />
                  <span>{campaign?.remaining_days} days left</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  // Filter options
  const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'goal_amount', label: 'Goal Amount' },
    { value: 'location', label: 'Location' },
  ];

  const orderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  const dateOptions = [
    { value: 'all_time', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_60_days', label: 'Last 60 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_year', label: 'This Year' },
    { value: 'last_year', label: 'Last Year' },
  ];

  const goalOptions = [
    { value: 'all', label: 'All Amounts' },
    {
      value: '0-500',
      label: `${userAccountData?.currency.toUpperCase() || 'GHS'}0 - ${userAccountData?.currency.toUpperCase() || 'GHS'}500`,
    },
    {
      value: '500-1000',
      label: `${userAccountData?.currency.toUpperCase() || 'GHS'}500 - ${userAccountData?.currency.toUpperCase() || 'GHS'}1,000`,
    },
    {
      value: '1000-5000',
      label: `${userAccountData?.currency.toUpperCase() || 'GHS'}1,000 - ${userAccountData?.currency.toUpperCase() || 'GHS'}5,000`,
    },
    {
      value: '5000-10000',
      label: `${userAccountData?.currency.toUpperCase() || 'GHS'}5,000 - ${userAccountData?.currency.toUpperCase() || 'GHS'}10,000`,
    },
    {
      value: '10000-50000',
      label: `${userAccountData?.currency.toUpperCase() || 'GHS'}10,000 - ${userAccountData?.currency.toUpperCase() || 'GHS'}50,000`,
    },
    {
      value: '50000-100000',
      label: `${userAccountData?.currency.toUpperCase() || 'GHS'}50,000 - ${userAccountData?.currency.toUpperCase() || 'GHS'}100,000`,
    },
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'Kenya', label: 'Kenya' },
    { value: 'Ghana', label: 'Ghana' },
    { value: 'South Africa', label: 'South Africa' },
    { value: 'Eswatini', label: 'Eswatini' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <motion.div
            ref={ref}
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              <Badge className="px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                <Sparkles className="w-4 h-4 mr-2" />
                Discover Amazing Campaigns
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Find and Support
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Meaningful Causes
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover impactful campaigns from passionate creators and make a
              difference in causes that matter most to you.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-8">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for campaigns, causes, or creators..."
                  className="w-full px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white pr-24"
                />
                <Button
                  onClick={handleSearch}
                  className="absolute right-1 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600-dark transition-colors duration-300"
                >
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 space-y-6">
            <Card className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">
                Find & Fund
              </h2>

              <div className="grid gap-6">
                {/* Sort By */}
                <div>
                  <label
                    htmlFor="sortBy"
                    className="block text-sm font-medium mb-2 dark:text-gray-300"
                  >
                    Sort By
                  </label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label
                    htmlFor="sortOrder"
                    className="block text-sm font-medium mb-2 dark:text-gray-300"
                  >
                    Sort Order
                  </label>
                  <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => handleOrderChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  >
                    {orderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label
                    htmlFor="dateRange"
                    className="block text-sm font-medium mb-2 dark:text-gray-300"
                  >
                    Date Created
                  </label>
                  <select
                    id="dateRange"
                    value={dateRange}
                    onChange={(e) => handleDateRangeChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  >
                    {dateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Goal Range */}
                <div>
                  <label
                    htmlFor="goalRange"
                    className="block text-sm font-medium mb-2 dark:text-gray-300"
                  >
                    Goal Amount
                  </label>
                  <select
                    id="goalRange"
                    value={goalRange}
                    onChange={(e) => handleGoalRangeChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  >
                    {goalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium mb-2 dark:text-gray-300"
                  >
                    Location
                  </label>
                  <select
                    id="location"
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  >
                    {locationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="hidden lg:block space-y-4">
              <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Active Campaigns
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      1,234
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Total Backers
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      45.2K
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </aside>

          {/* Campaigns Grid */}
          <main className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">
                  All Campaigns
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {filteredCampaigns.length} campaigns found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Campaigns Grid/List */}
            {loading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'grid grid-cols-1 gap-6'
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-2 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredCampaigns.length > 0 ? (
              <motion.div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'grid grid-cols-1 gap-6'
                }
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {filteredCampaigns.map((campaign, index) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </motion.div>
            ) : (
              <Card className="p-12 text-center dark:bg-gray-800">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <FaClock className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold dark:text-white">
                    No campaigns found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    Try adjusting your filters or search terms to find more
                    campaigns.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setLocation('all');
                      setDateRange('all_time');
                      setGoalRange('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
