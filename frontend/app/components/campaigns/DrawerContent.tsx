import React, { useState } from 'react';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import Image from 'next/image';
import SelectComponent from '../select/SearchableSelect ';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';

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

  // Handle input change for the search box
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Handle search button click
  const handleSearchButtonClick = () => {
    onSearch(searchTerm); // Trigger the search with the current search term
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
      <div className="w-1/3 p-2 border-r border-gray-200 sticky top-0 h-screen overflow-y-auto [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
        <h2 className="text-sm md:text-xl font-bold mb-4">Find & Fund</h2>
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
      <div className="w-2/3 p-4 overflow-y-auto h-screen [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
        <h2 className="text-sm md:text-xl font-bold mb-4">
          Find fundraisers by title or keyword
        </h2>
        <div className="bg-gray-100 relative flex items-center w-full sm:w-auto rounded-full">
          <input
            id="search"
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={handleSearchInputChange} // Use the new handler for input changes
            className="w-full px-4 py-3 border border-gray-100 rounded-full focus:outline-none text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white pr-24"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSearchButtonClick} // Use the new handler for button click
            whileTap={{ scale: 0.95 }}
            className="absolute right-0 bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-50 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 hover:text-gray-700 transition-colors duration-300"
          >
            Search
          </motion.button>
        </div>
        <div className="mt-4">
          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {campaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    duration: 0.5,
                    delay: Number(campaign?.id) * 0.1,
                  }}
                  className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row items-center gap-4"
                >
                  {/* Wrap the entire content with the Link component */}
                  <Link
                    href={`/campaign/${campaign.id}?${generateRandomString()}`}
                    className="w-full flex flex-col md:flex-row items-center gap-4"
                  >
                    {/* Image on the top on small screens, left on larger screens */}
                    <div className="w-full h-24 relative md:w-1/4">
                      <Image
                        src={campaign?.media || '/bantuhive.svg'}
                        alt="media thumbnail"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>

                    {/* Campaign Details on the bottom on small screens, right on larger screens */}
                    <div className="w-full md:flex-1">
                      <h3 className="text-lg font-semibold">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {campaign.fundraiser?.profile?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {campaign.currency.toUpperCase()}
                        {campaign.transferred_amount} raised of{' '}
                        {campaign.currency.toUpperCase()}
                        {campaign.goal_amount}
                      </p>
                    </div>
                  </Link>
                </motion.div>
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
