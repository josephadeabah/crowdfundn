'use client';

import { useEffect, useState } from 'react';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCard from '@/app/components/campaigns/CampaignCard';

const CampaignsPage = () => {
  const { fetchAllCampaigns, campaigns, loading, error, pagination } =
    useCampaignContext(); // Add pagination from context

  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchAllCampaigns(sortBy, sortOrder, page, pageSize);
  }, [sortBy, sortOrder, page, pageSize]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = () => {
    fetchAllCampaigns(sortBy, sortOrder, page, pageSize);
  };

  return (
    <div className="container mx-auto p-4">
        <span className="text-xs font-normal mb-4 text-red-600">[Work In Progress]</span>
      <h1 className="text-2xl font-bold mb-4">We’ve made it easy to find the causes that matter most to you.</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {/* Sort and search filters */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            className="p-2 border rounded"
          >
            <option value="created_at">Date Created</option>
            <option value="goal_amount">Goal Amount</option>
            <option value="location">Location</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium mb-1">
            Sort Order
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleOrderChange}
            className="p-2 border rounded"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="searchTerm"
            className="block text-sm font-medium mb-1"
          >
            Search
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 py-2 rounded mt-6"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading campaigns...</p>}
      {error && <p className="text-red-500">{error}</p>}

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
  );
};

export default CampaignsPage;
