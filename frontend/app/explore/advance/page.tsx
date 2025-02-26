'use client';

import { useEffect, useState } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import { useUserContext } from '@/app/context/users/UserContext';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { deslugify } from '@/app/utils/helpers/categories';
import Image from 'next/image';
import Pagination from '@/app/components/pagination/Pagination';
import { FaClock, FaUser, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '@/app/components/toast/Toast';
import Avatar from '@/app/components/avatar/Avatar';
import { Card, Collapse } from '@material-tailwind/react'; // Import Collapse and Button
import { Button } from '@/app/components/button/Button';

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

  const [open, setOpen] = useState(false); // State for collapse

  const toggleOpen = () => setOpen((cur) => !cur); // Toggle function for collapse

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
          className="text-base font-bold text-left py-6"
        >
          Find and support the causes that matter most to you.
        </motion.h6>
        {/* Search Section */}
        <div className="flex justify-center mb-1">
          <div className="w-full max-w-7xl mx-auto flex justify-center md:justify-end">
            <div className="bg-gray-100 relative flex items-center w-full sm:w-auto rounded-l-full">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-100 rounded-full focus:outline-none text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white pr-24"
                placeholder="Search for a campaign"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSearch}
                whileTap={{ scale: 0.95 }}
                className="absolute right-0 bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-50 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 hover:text-gray-700 transition-colors duration-300"
              >
                Search
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-1">
        {/* Filters Section */}
        <div className="w-full md:w-1/4">
          <Button onClick={toggleOpen} className="mb-2 w-full" size='lg' variant='outline'>
            {open ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Collapse open={open}>
            <Card className="p-4 border border-gray-50 bg-white rounded-none shadow-none">
              <h2 className="text-lg font-semibold mb-4">Find & Fund</h2>
              <div className="mb-4">
                <label htmlFor="sortBy" className="block text-sm font-medium mb-1">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="p-2 border border-gray-50 rounded focus:outline-none w-full"
                >
                  <option value="created_at">Date Created</option>
                  <option value="goal_amount">Goal Amount</option>
                  <option value="location">Location</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="sortOrder"
                  className="block text-sm font-medium mb-1"
                >
                  Sort Order
                </label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={handleOrderChange}
                  className="p-2 border border-gray-50 rounded focus:outline-none w-full"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="dateRange"
                  className="block text-sm font-medium mb-1"
                >
                  Date Created
                </label>
                <select
                  id="dateRange"
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  className="p-2 border border-gray-50 rounded focus:outline-none w-full"
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
                  className="block text-sm font-medium mb-1"
                >
                  Goal Amount
                </label>
                <select
                  id="goalRange"
                  value={goalRange}
                  onChange={handleGoalRangeChange}
                  className="p-2 border border-gray-50 rounded focus:outline-none w-full"
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
                  className="block text-sm font-medium mb-1"
                >
                  Location
                </label>
                <select
                  id="location"
                  value={location}
                  onChange={handleLocationChange}
                  className="p-2 border border-gray-50 rounded focus:outline-none w-full"
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
        <div className="w-full bg-gray-100 md:p-4">
          {loading ? (
            <CampaignCardLoader />
          ) : (
            <div>
              {campaigns && campaigns.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-3 relative">
                  {campaigns
                    .filter((campaign) => campaign?.permissions?.is_public)
                    .slice(
                      0,
                      window.innerWidth >= 1024
                        ? 10 // Large screens (5x2)
                        : window.innerWidth >= 768
                          ? 10 // Tablet screens (3x4)
                          : 10, // Mobile screens (2x6)
                    )
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
                          className="group relative bg-gray-100 dark:bg-gray-900 flex flex-col h-full dark:text-gray-50 hover:shadow-lg transition-transform duration-300 cursor-pointer overflow-hidden"
                        >
                          <Link
                            href={`/campaign/${campaign?.id}?${generateRandomString()}`}
                          >
                            <Card className="h-full">
                              <div className="relative w-full h-0 pb-[100%]">
                                <Image
                                  src={campaign?.media || '/bantuhive.svg'}
                                  alt="media thumbnail"
                                  layout="fill"
                                  objectFit="cover"
                                  className="absolute top-0 left-0 w-full h-full"
                                />
                              </div>
                              <div className="px-2 py-2 bg-gray-50 dark:text-gray-50">
                                <div className="w-full text-xs">
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
                                <div className="w-full text-xs text-gray-600 flex flex-col py-2">
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center space-x-2">
                                      <Avatar
                                        name={
                                          campaign?.fundraiser?.profile?.name
                                        }
                                        size="sm"
                                        imageUrl={
                                          campaign?.fundraiser?.profile?.avatar
                                        }
                                      />
                                      <span className="text-sm font-semibold w-24 truncate">
                                        {campaign?.fundraiser?.profile?.name}
                                      </span>
                                    </div>
                                    <div
                                      className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
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
                                        <FaRegBookmark className="text-gray-700 dark:text-gray-300" />
                                      )}
                                    </div>
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-700 truncate mb-1">
                                    {campaign?.title}
                                  </h3>
                                  <p className="flex justify-between items-center text-sm font-semibold mt-2 break-words">
                                    <span
                                      className={`${
                                        parseFloat(
                                          campaign?.transferred_amount?.toString() ||
                                            '0',
                                        ) >=
                                        parseFloat(
                                          campaign?.goal_amount?.toString() ||
                                            '0',
                                        )
                                          ? 'text-green-600'
                                          : 'text-orange-500'
                                      }`}
                                    >
                                      <span className="text-gray-600 dark:text-gray-100 mr-1">
                                        {fundraiserCurrency}
                                      </span>
                                      {parseFloat(
                                        campaign?.transferred_amount?.toString() ||
                                          '0',
                                      ).toLocaleString()}
                                    </span>{' '}
                                    <span className="text-gray-600 dark:text-gray-100 truncate">
                                      <span className="text-xs p-1">of</span>
                                      {fundraiserCurrency}
                                      {parseFloat(
                                        campaign?.goal_amount,
                                      ).toLocaleString()}
                                    </span>
                                  </p>
                                  <div className="block md:flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
                                    <div className="flex items-center space-x-1">
                                      <FaUser />
                                      <span>
                                        {campaign?.total_donors || 0} Backers
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <FaClock />
                                      <span>
                                        {campaign?.remaining_days} days left
                                      </span>
                                    </div>
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
                <p className="text-center text-gray-500">
                  No campaigns found. Try adjusting your filters or search
                  terms.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-full">
        {pagination?.totalPages > 1 && (
          <Pagination
            currentPage={pagination?.currentPage}
            totalPages={pagination?.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;