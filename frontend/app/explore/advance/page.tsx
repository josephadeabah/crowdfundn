'use client';

import { useEffect, useState } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCard from '@/app/components/campaigns/CampaignCard';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import { useUserContext } from '@/app/context/users/UserContext';

const CampaignsPage = () => {
  const { fetchAllCampaigns, campaigns, loading, error } = useCampaignContext();
  const { userProfile } = useUserContext();

  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Track search input
  const [dateRange, setDateRange] = useState<string>('all_time');
  const [goalRange, setGoalRange] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');

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

  // const handleSearch = () => {
  //   fetchAllCampaigns(
  //     sortBy,
  //     sortOrder,
  //     page,
  //     pageSize,
  //     dateRange,
  //     goalRange,
  //     location,
  //     searchTerm,
  //   );
  // };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h3 className="font-bold leading-tight mb-6 text-green-500 transition-all duration-300">
        We’ve made it easy to find and support the causes that matter most to
        you.
      </h3>
      <div className="flex flex-col md:flex-row gap-4 md:p-2">
        {/* Filters Section */}
        <aside className="w-full md:w-1/4 p-4 border border-gray-50 rounded bg-white">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
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
                {userProfile?.currency.toUpperCase()}0 -{' '}
                {userProfile?.currency.toUpperCase()}500
              </option>
              <option value="500-1000">
                {userProfile?.currency.toUpperCase()}500 -{' '}
                {userProfile?.currency.toUpperCase()}1000
              </option>
              <option value="1000-5000">
                {userProfile?.currency.toUpperCase()}1000 -{' '}
                {userProfile?.currency.toUpperCase()}5000
              </option>
              <option value="5000-10000">
                {userProfile?.currency.toUpperCase()}5000 -{' '}
                {userProfile?.currency.toUpperCase()}10000
              </option>
              <option value="10000-50000">
                {userProfile?.currency.toUpperCase()}10000 -{' '}
                {userProfile?.currency.toUpperCase()}50000
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

          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search by Title
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-50 rounded focus:outline-none w-full"
              placeholder="Search for a campaign"
            />
          </div>

          {/* <button
            onClick={handleSearch}
            className="bg-green-500 text-white px-4 py-2 rounded focus:outline-none w-full"
          >
            Search
          </button> */}
        </aside>

        {/* Campaigns Section */}
        <div className="w-full">
          {/* Show a loading spinner or placeholder while data is being fetched */}
          {loading ? (
            <CampaignCardLoader />
          ) : (
            <>
              {/* Show campaigns if available */}
              {campaigns && campaigns.length > 0 ? (
                <CampaignCard
                  campaigns={campaigns}
                  loading={loading}
                  error={error}
                  onPageChange={handlePageChange}
                />
              ) : (
                // Show a friendly message if no campaigns are found
                <p className="text-center text-gray-500">
                  No campaigns found. Try adjusting your filters or search
                  terms.
                </p>
              )}

              {/* Show error message if an error occurred */}
              {error && (
                <p className="text-center text-red-500">
                  An error occurred while fetching campaigns. Please try again
                  later.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
