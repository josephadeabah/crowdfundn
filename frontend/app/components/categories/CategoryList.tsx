import React, { useEffect, useState } from 'react';
import Modal from '@/app/components/modal/Modal';
import { Badge } from '../badge/Badge';
import { useRouter } from 'next/navigation';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import {
  categories,
  categoriesWithIcons,
} from '@/app/utils/helpers/categories';
import { useCategoryContext } from '@/app/context/categories/CategoryContext';
import Pagination from '@/app/components/categories/PaginateCategory';
import CategoryBadgeLoader from '@/app/loaders/CategoryBadgeLoader';
import Progress from '../progressbar/ProgressBar';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const CategoryList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const {
    campaignsGroupedByCategory,
    fetchGroupedCampaigns,
    fetchCampaignsForCategory,
    loading,
    error,
  } = useCategoryContext();

  useEffect(() => {
    fetchGroupedCampaigns();
  }, []);

  const handlePageChange = (category: string, direction: 'next' | 'prev') => {
    const currentPage = campaignsGroupedByCategory[category]?.current_page || 1;
    const totalPages = campaignsGroupedByCategory[category]?.total_pages || 1;

    if (direction === 'next' && currentPage < totalPages) {
      fetchCampaignsForCategory(category, currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      fetchCampaignsForCategory(category, currentPage - 1);
    }
  };

  const handleClick = (campaignId: string) => {
    router.push(`/campaign/${campaignId}?${generateRandomString()}`);
  };

  const handleCategoryClick = (value: string) => {
    setSelectedCategory(value);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  // Filter campaigns to exclude those with 0 remaining days
  const filteredCampaigns = (category: string) => {
    const campaigns = campaignsGroupedByCategory[category]?.campaigns || [];
    return campaigns.filter((campaign) => {
      return campaign.status !== 'completed';
    });
  };

  return (
    <div className="w-full px-2 py-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {loading ? (
            <CategoryBadgeLoader />
          ) : (
            categoriesWithIcons.map((category) => {
              const campaignCount =
                campaignsGroupedByCategory[category.value]?.campaigns.length ||
                0;
              return (
                <div
                  key={category.value}
                  className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  onClick={() => handleCategoryClick(category.value)}
                >
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-300 h-full">
                    <div className="text-2xl mb-2 text-gray-600">
                      {category.icon}
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-800">
                        {category.label}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {campaignCount} {campaignCount === 1 ? 'campaign' : 'campaigns'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          size="xxlarge"
          closeOnBackdropClick={false}
        >
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {categories.find((c) => c.value === selectedCategory)?.label}{' '}
              Fundraisers
            </h3>
            <div className="space-y-4">
              {filteredCampaigns(selectedCategory || '').length > 0 ? (
                filteredCampaigns(selectedCategory || '').map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-5">
                      <div className="w-full md:w-1/4">
                        <img
                          src={campaign.media}
                          alt={campaign.title}
                          className="w-full h-40 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/bantuhive.svg';
                          }}
                        />
                      </div>
                      <div className="w-full md:w-3/4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          {campaign.title}
                        </h4>
                        <div className="space-y-3">
                          <div className="w-full">
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
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-800">
                              {campaign.currency_symbol ||
                                campaign?.currency?.toUpperCase()}{' '}
                              {parseFloat(
                                campaign.transferred_amount,
                              ).toLocaleString()}
                              <span className="text-xs text-gray-500 block">raised</span>
                            </span>
                            <span className="text-gray-600">
                              Goal: {campaign.currency_symbol ||
                                campaign?.currency?.toUpperCase()}
                              {parseFloat(
                                campaign.goal_amount,
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <button
                            onClick={() => handleClick(String(campaign.id))}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                          >
                            Support Now
                          </button>
                          <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {campaign.remaining_days} days left
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    No fundraising campaigns available for this category.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Component */}
            {selectedCategory &&
              campaignsGroupedByCategory[selectedCategory]?.total_pages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                  <button
                    onClick={() => handlePageChange(selectedCategory, 'prev')}
                    disabled={campaignsGroupedByCategory[selectedCategory]?.current_page === 1}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    <FaArrowLeft className="mr-2" />
                    Previous
                  </button>
                  <span className="text-gray-600">
                    Page {campaignsGroupedByCategory[selectedCategory]?.current_page} of{' '}
                    {campaignsGroupedByCategory[selectedCategory]?.total_pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(selectedCategory, 'next')}
                    disabled={campaignsGroupedByCategory[selectedCategory]?.current_page === 
                             campaignsGroupedByCategory[selectedCategory]?.total_pages}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    Next
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
              )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;