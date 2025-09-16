'use client';

import { useEffect, useState } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useUserContext } from '@/app/context/users/UserContext';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { deslugify } from '@/app/utils/helpers/categories';
import Image from 'next/image';
import Pagination from '@/app/components/pagination/Pagination';
import { FaClock, FaUser, FaBookmark, FaRegBookmark, FaSearch, FaFilter } from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '@/app/components/toast/Toast';
import Avatar from '@/app/components/avatar/Avatar';
import { Card, Collapse } from '@material-tailwind/react';
import { Button } from '@/app/components/button/Button';
import CampaignCardSkeleton from '@/app/loaders/CampaignCardSkeleton';

const CampaignsPage = () => {
  const {
    fetchAllCampaigns,
    campaigns,
    loading,
    error,
    favoriteCampaign,
    unfavoriteCampaign,
  } = useCampaignContext();
  const { userAccountData } = useUserContext();
  const { user } = useAuth();
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('all_time');
  const [goalRange, setGoalRange] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const { pagination } = useCampaignContext();

  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen((cur) => !cur);

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

  useEffect(() => {
    fetchAllCampaigns(
      sortBy,
      sortOrder,
      page,
      pageSize,
      dateRange,
      goalRange,
      location,
      searchTerm,
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
    searchTerm,
  ]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
  };

  const handleGoalRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGoalRange(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
  };

  const handleSearch = () => {
    fetchAllCampaigns(
      sortBy,
      sortOrder,
      page,
      pageSize,
      dateRange,
      goalRange,
      location,
      searchTerm,
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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

  return (
     <div className="w-full bg-white min-h-screen">
    <div className="max-w-7xl mx-auto p-4">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      <div className="w-full mx-auto">
        <motion.h6
          ref={ref}
          variants={fadeInUp}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.5 }}
          className="text-lg font-bold text-left py-6 text-gray-800"
        >
          Find and support the causes that matter most to you.
        </motion.h6>
        
        {/* Search Section */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-full shadow-sm flex items-center w-full overflow-hidden">
              <div className="pl-4 pr-2 text-gray-400">
                <FaSearch />
              </div>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 focus:outline-none text-gray-800 bg-white"
                placeholder="Search for a campaign..."
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleSearch}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-100 text-gray-700 px-6 py-3 font-medium hover:bg-gray-200 transition-colors duration-300 h-full"
              >
                Search
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Section */}
        <div className="w-full md:w-1/4">
          <Button
            onClick={toggleOpen}
            className="mb-4 w-full flex items-center justify-center gap-2"
            size="lg"
            variant="outline"
          >
            <FaFilter className="text-sm" />
            {open ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Collapse open={open}>
            <Card className="p-5 border border-gray-100 bg-white rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>
              
              <div className="mb-4">
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full bg-white"
                >
                  <option value="created_at">Date Created</option>
                  <option value="goal_amount">Goal Amount</option>
                  <option value="location">Location</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="sortOrder"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Sort Order
                </label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={handleOrderChange}
                  className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full bg-white"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="dateRange"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Date Created
                </label>
                <select
                  id="dateRange"
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full bg-white"
                >
                  <option value="all_time">All Time</option>
                  <option value="today">Today</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="last_60_days">Last 60 Days</option>
                  <option value="last_90_days">Last 90 Days</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="this_year">This Year</option>
                  <option value="last_year">Last Year</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="goalRange"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Goal Amount
                </label>
                <select
                  id="goalRange"
                  value={goalRange}
                  onChange={handleGoalRangeChange}
                  className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full bg-white"
                >
                  <option value="all">All</option>
                  <option value="0-500">
                    {userAccountData?.currency.toUpperCase() || 'GHS'}0 -{' '}
                    {userAccountData?.currency.toUpperCase() || 'GHS'}500
                  </option>
                  <option value="500-1000">
                    {userAccountData?.currency.toUpperCase() || 'GHS'}500 -{' '}
                    {userAccountData?.currency.toUpperCase() || 'GHS'}1,000
                  </option>
                  <option value="1000-5000">
                    {userAccountData?.currency.toUpperCase() || 'GHS'}1,000 -{' '}
                    {userAccountData?.currency.toUpperCase() || 'GHS'}5,000
                  </option>
                  <option value="5000-10000">
                    {userAccountData?.currency.toUpperCase() || 'GHS'}5,000 -{' '}
                    {userAccountData?.currency.toUpperCase() || 'GHS'}10,000
                  </option>
                  <option value="10000-50000">
                    {userAccountData?.currency.toUpperCase() || 'GHS'}10,000 -{' '}
                    {userAccountData?.currency.toUpperCase() || 'GHS'}50,000
                  </option>
                  <option value="50000-100000">
                    {userAccountData?.currency.toUpperCase() || 'GHS'}50,000 -{' '}
                    {userAccountData?.currency.toUpperCase() || 'GHS'}10,0000
                  </option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Location
                </label>
                <select
                  id="location"
                  value={location}
                  onChange={handleLocationChange}
                  className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full bg-white"
                >
                  <option value="all">All</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Ghana">Ghana</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Eswatini">Eswatini</option>
                </select>
              </div>
            </Card>
          </Collapse>
        </div>

        {/* Campaigns Section */}
        <div className="w-full md:w-3/4 bg-white p-0 md:p-2">
          {loading ? (
            <CampaignCardSkeleton />
          ) : (
            <div>
              {campaigns && campaigns.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {campaigns
                    .filter((campaign) => campaign?.permissions?.is_public)
                    .map((campaign, index) => {
                      const fundraiserCurrency =
                        campaign?.currency_symbol ||
                        campaign?.currency?.toUpperCase();

                      return (
                        <motion.div
                          key={campaign?.id}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="group relative bg-white flex flex-col h-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          <Link
                            href={`/campaign/${campaign?.id}?${generateRandomString()}`}
                          >
                            <Card className="h-full border border-gray-100 rounded-lg overflow-hidden">
                              <div className="relative w-full h-0 pb-[75%] overflow-hidden">
                                <Image
                                  src={campaign?.media || '/bantuhive.svg'}
                                  alt="media thumbnail"
                                  layout="fill"
                                  objectFit="cover"
                                  unoptimized
                                  className="absolute top-0 left-0 w-full h-full group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    console.error('Image failed to load:', e);
                                    e.currentTarget.src = '/bantuhive.svg';
                                  }}
                                />
                                <div className="absolute top-3 right-3">
                                  <div
                                    className="p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      campaign?.favorited
                                        ? handleUnfavorite(
                                            campaign?.id.toString(),
                                          )
                                        : handleFavorite(
                                            campaign?.id.toString(),
                                          );
                                    }}
                                  >
                                    {campaign.favorited ? (
                                      <FaBookmark className="text-orange-500" />
                                    ) : (
                                      <FaRegBookmark className="text-gray-500" />
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 bg-white">
                                <div className="w-full mb-3">
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
                                
                                <div className="flex items-center space-x-2 mb-3">
                                  <Avatar
                                    name={
                                      campaign?.fundraiser?.profile?.name
                                    }
                                    size="sm"
                                    imageUrl={
                                      campaign?.fundraiser?.profile?.avatar
                                    }
                                  />
                                  <span className="text-sm font-medium text-gray-700 truncate">
                                    {campaign?.fundraiser?.profile?.name}
                                  </span>
                                </div>
                                
                                <h3 className="text-base font-bold text-gray-800 line-clamp-2 mb-2 h-12">
                                  {campaign?.title}
                                </h3>
                                
                                <div className="flex justify-between items-center mb-3">
                                  <p className="text-sm font-semibold text-gray-800">
                                    <span className="text-gray-600 text-xs font-normal block">Raised</span>
                                    {fundraiserCurrency}
                                    {parseFloat(
                                      campaign?.transferred_amount?.toString() ||
                                        '0',
                                    ).toLocaleString()}
                                  </p>
                                  <p className="text-sm text-gray-600 text-right">
                                    <span className="text-gray-600 text-xs font-normal block">Goal</span>
                                    {fundraiserCurrency}
                                    {parseFloat(
                                      campaign?.goal_amount,
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                
                                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-2">
                                  <div className="flex items-center space-x-1">
                                    <FaUser className="text-gray-400" />
                                    <span>
                                      {campaign?.total_donors || 0} Backers
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <FaClock className="text-gray-400" />
                                    <span>
                                      {campaign?.remaining_days} days left
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        </motion.div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">
                    No campaigns found. Try adjusting your filters or search terms.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        {pagination?.totalPages > 1 && (
          <Pagination
            currentPage={pagination?.currentPage}
            totalPages={pagination?.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
    </div>
  );
};

export default CampaignsPage;