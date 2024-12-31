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

const CampaignsPage = () => {
  const { fetchAllCampaigns, campaigns, loading, error } = useCampaignContext();
  const { userProfile } = useUserContext();
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Track search input
  const [dateRange, setDateRange] = useState<string>('all_time');
  const [goalRange, setGoalRange] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const { pagination } = useCampaignContext();

  useEffect(() => {
    fetchAllCampaigns(
      sortBy,
      sortOrder,
      page,
      pageSize,
      dateRange,
      goalRange,
      location,
      searchTerm, // Pass the searchTerm to filter by title
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

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="w-full bg-white mx-auto">
        <motion.h4
          ref={ref}
          variants={fadeInUp}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-gray-800 py-6"
        >
          Find and support the causes that matter most to you.
        </motion.h4>
        {/* Search Section */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-2xl flex py-6">
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-50 focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white mr-2" // Added 'mr-2' for margin-right
              placeholder="Search for a campaign"
            />
            <button
              onClick={handleSearch}
              className="bg-green-500 text-white px-4 py-2 rounded w-32" // Set a fixed width for button
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-1">
        {/* Filters Section */}
        <aside className="w-full md:w-1/4 p-4 border border-gray-50 bg-white">
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
                {userProfile?.currency.toUpperCase() || 'GHS'}0 -{' '}
                {userProfile?.currency.toUpperCase() || 'GHS'}500
              </option>
              <option value="500-1000">
                {userProfile?.currency.toUpperCase() || 'GHS'}500 -{' '}
                {userProfile?.currency.toUpperCase() || 'GHS'}1,000
              </option>
              <option value="1000-5000">
                {userProfile?.currency.toUpperCase() || 'GHS'}1,000 -{' '}
                {userProfile?.currency.toUpperCase() || 'GHS'}5,000
              </option>
              <option value="5000-10000">
                {userProfile?.currency.toUpperCase() || 'GHS'}5,000 -{' '}
                {userProfile?.currency.toUpperCase() || 'GHS'}10,000
              </option>
              <option value="10000-50000">
                {userProfile?.currency.toUpperCase() || 'GHS'}10,000 -{' '}
                {userProfile?.currency.toUpperCase() || 'GHS'}50,000
              </option>
              <option value="50000-100000">
                {userProfile?.currency.toUpperCase() || 'GHS'}50,000 -{' '}
                {userProfile?.currency.toUpperCase() || 'GHS'}10,0000
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
        </aside>

        {/* Campaigns Section */}
        <div className="w-full bg-white md:p-1">
          {/* Show a loading spinner or placeholder while data is being fetched */}
          {loading ? (
            <CampaignCardLoader />
          ) : (
            <>
              {/* Show campaigns if available */}
              {campaigns && campaigns.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-2 md:p-0 relative">
                  {campaigns.map((campaign, index) => {
                    const fundraiserCurrency =
                      campaign?.currency_symbol ||
                      campaign?.currency?.toUpperCase();

                    return (
                      <motion.div
                        key={campaign.id}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-900 flex flex-col h-full dark:text-gray-50 transform hover:shadow-lg transition-transform duration-300 cursor-pointer overflow-hidden"
                      >
                        <Link
                          href={`/campaign/${campaign.id}?${generateRandomString()}`}
                        >
                          <div className="flex flex-col h-full">
                            <div
                              className="relative w-full"
                              style={{ paddingTop: '100%' }}
                            >
                              <Image
                                src={campaign?.media || '/bantuhive.svg'}
                                alt="media thumbnail"
                                sizes="100vw"
                                layout="fill"
                                objectFit="cover"
                                className="absolute top-0 left-0 rounded-t"
                              />
                            </div>
                            <div className="px-1 py-2 dark:text-gray-50 flex flex-col gap-1">
                              <h3 className="text-lg font-bold truncate whitespace-nowrap overflow-hidden">
                                {campaign?.title}
                              </h3>
                              <div className="w-full text-xs text-orange-500 truncate">
                                {deslugify(campaign?.category)}
                              </div>
                              <div className="flex justify-between items-center w-full text-xs font-semibold text-gray-500">
                                <div className="truncate">
                                  {campaign.total_donors || 0} Backers
                                </div>
                                <div className="truncate">
                                  {campaign.remaining_days} days left
                                </div>
                              </div>
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
                              <div className="w-full text-xs text-gray-600 flex flex-col">
                                <p className="flex justify-between items-center text-sm font-semibold mt-2 break-words">
                                  {fundraiserCurrency}
                                  {!isNaN(
                                    parseFloat(campaign.transferred_amount),
                                  )
                                    ? parseFloat(
                                        campaign.transferred_amount,
                                      ).toLocaleString()
                                    : 0}
                                  <span className="text-gray-600 dark:text-gray-100 truncate">
                                    <span className="text-xs p-1">of</span>
                                    {fundraiserCurrency}
                                    {parseFloat(
                                      campaign.goal_amount,
                                    ).toLocaleString()}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                // Show a friendly message if no campaigns are found
                <p className="text-center text-gray-500">
                  No campaigns found. Try adjusting your filters or search
                  terms.
                </p>
              )}
            </>
          )}
        </div>
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage || page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;
