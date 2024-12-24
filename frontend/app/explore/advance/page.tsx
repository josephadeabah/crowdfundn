'use client';

import { useEffect, useState } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCard from '@/app/components/campaigns/CampaignCard';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';

const CampaignsPage = () => {
  const { fetchAllCampaigns, campaigns, loading, error } = useCampaignContext();

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
      searchTerm, // Include the search term in the search query
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) return <CampaignCardLoader />;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        We’ve made it easy to find the causes that matter most to you.
      </h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters Section */}
        <aside className="w-full md:w-1/4 p-4 border rounded bg-gray-100">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="mb-4">
            <label htmlFor="sortBy" className="block text-sm font-medium mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortChange}
              className="p-2 border rounded w-full"
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
              className="p-2 border rounded w-full"
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
              className="p-2 border rounded w-full"
            >
              <option value="all_time">All Time</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
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
              className="p-2 border rounded w-full"
            >
              <option value="all">All</option>
              <option value="0-500">$0 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000-5000">$1000 - $5000</option>
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
              className="p-2 border rounded w-full"
            >
              <option value="all">All</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="South Africa">South Africa</option>
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
              className="p-2 border rounded w-full"
              placeholder="Search for a campaign"
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Search
          </button>
        </aside>

        {/* Campaigns Section */}
        <div className="w-full">
          {!loading && campaigns && campaigns.length > 0 ? (
            <CampaignCard
              campaigns={campaigns}
              loading={loading}
              error={error}
              onPageChange={handlePageChange}
            />
          ) : (
            !loading && <p>No campaigns found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
