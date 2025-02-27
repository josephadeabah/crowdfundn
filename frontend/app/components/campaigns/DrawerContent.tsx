import React, { useState } from 'react';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import SelectComponent from '../select/SearchableSelect';
import Image from "next/image";

interface DrawerContentProps {
  campaigns: CampaignResponseDataType[];
  onSearch: (searchTerm: string) => void;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onGoalRangeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({
  campaigns,
  onSearch,
  onSortByChange,
  onSortOrderChange,
  onDateRangeChange,
  onGoalRangeChange,
  onLocationChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByValue, setSortByValue] = useState('');
  const [sortOrderValue, setSortOrderValue] = useState('');
  const [dateRangeValue, setDateRangeValue] = useState('');
  const [goalRangeValue, setGoalRangeValue] = useState('');
  const [locationValue, setLocationValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSortByChange = (value: string) => {
    setSortByValue(value);
    onSortByChange(value);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrderValue(value);
    onSortOrderChange(value);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRangeValue(value);
    onDateRangeChange(value);
  };

  const handleGoalRangeChange = (value: string) => {
    setGoalRangeValue(value);
    onGoalRangeChange(value);
  };

  const handleLocationChange = (value: string) => {
    setLocationValue(value);
    onLocationChange(value);
  };

  const sortByOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'goal_amount', label: 'Goal Amount' },
    { value: 'location', label: 'Location' },
  ];

  const sortOrderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  const dateRangeOptions = [
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

  const goalRangeOptions = [
    { value: 'all', label: 'All' },
    { value: '0-500', label: '0 - 500' },
    { value: '500-1000', label: '500 - 1,000' },
    { value: '1000-5000', label: '1,000 - 5,000' },
    { value: '5000-10000', label: '5,000 - 10,000' },
    { value: '10000-50000', label: '10,000 - 50,000' },
    { value: '50000-100000', label: '50,000 - 100,000' },
  ];

  const locationOptions = [
    { value: 'all', label: 'Worldwide' },
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'Kenya', label: 'Kenya' },
    { value: 'Ghana', label: 'Ghana' },
    { value: 'South Africa', label: 'South Africa' },
    { value: 'Eswatini', label: 'Eswatini' },
  ];

  return (
    <div className="flex h-full">
      {/* Left Column: Selectors */}
      <div className="w-1/3 p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="flex flex-col gap-2">
          <SelectComponent
            options={sortByOptions}
            value={sortByValue}
            onChange={handleSortByChange}
            placeholder="Sort By"
            variant="outline"
            size="sm"
          />
          <SelectComponent
            options={sortOrderOptions}
            value={sortOrderValue}
            onChange={handleSortOrderChange}
            placeholder="Sort Order"
            variant="outline"
            size="sm"
          />
          <SelectComponent
            options={dateRangeOptions}
            value={dateRangeValue}
            onChange={handleDateRangeChange}
            placeholder="Date Range"
            variant="outline"
            size="sm"
          />
          <SelectComponent
            options={goalRangeOptions}
            value={goalRangeValue}
            onChange={handleGoalRangeChange}
            placeholder="Goal Range"
            variant="outline"
            size="sm"
          />
          <SelectComponent
            options={locationOptions}
            value={locationValue}
            onChange={handleLocationChange}
            placeholder="Location"
            variant="outline"
            size="sm"
          />
        </div>
      </div>

      {/* Right Column: Search Bar and Results */}
      <div className="w-2/3 p-4">
        <h2 className="text-xl font-bold mb-4">Search Campaigns</h2>
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="mt-4">
          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
                >
                  {/* Image on the left */}
                  <div className="w-1/4 h-24 relative">
                    <Image
                      src={campaign?.media || '/bantuhive.svg'}
                      alt="media thumbnail"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  {/* Campaign Details on the right */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{campaign.title}</h3>
                    <p className="text-sm text-gray-600">
                      {campaign.fundraiser?.profile?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {campaign.currency_symbol}
                      {campaign.transferred_amount} raised of{' '}
                      {campaign.currency_symbol}
                      {campaign.goal_amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No campaigns found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawerContent;
