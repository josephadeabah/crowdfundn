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
    <div className="w-full px-2 py-4 bg-gradient-to-br from-gray-50 to-neutral-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {loading ? (
            <CategoryBadgeLoader />
          ) : (
            categoriesWithIcons.map((category) => {
              const campaignCount =
                campaignsGroupedByCategory[category.value]?.campaigns.length ||
                0;
              return (
                <Badge
                  key={category.value}
                  className={`cursor-pointer transform hover:scale-105 transition-transform duration-300 w-fit ${
                    selectedCategory === category.value
                      ? 'bg-orange-400 text-white'
                      : 'text-gray-800 dark:bg-slate-950 dark:text-gray-50'
                  }`}
                  onClick={() => handleCategoryClick(category.value)}
                  variant="secondary"
                >
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span>
                      {category.label}{' '}
                      {campaignCount > 0 && `(${campaignCount})`}
                    </span>
                  </div>
                </Badge>
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
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              {categories.find((c) => c.value === selectedCategory)?.label}{' '}
              Fundraisers
            </h3>
            <div className="space-y-6 mt-4">
              {filteredCampaigns(selectedCategory || '').length > 0 ? (
                filteredCampaigns(selectedCategory || '').map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/3">
                        <img
                          src={campaign.media}
                          alt={campaign.title}
                          className="w-full h-40 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/bantuhive.svg';
                          }}
                        />
                      </div>
                      <div className="w-full md:w-2/3">
                        <h4 className="text-lg font-semibold">
                          {campaign.title}
                        </h4>
                        <div className="space-y-2">
                          <div className="w-full text-base">
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
                            <span className="font-medium">
                              {campaign.currency_symbol ||
                                campaign?.currency?.toUpperCase()}{' '}
                              {parseFloat(
                                campaign.transferred_amount,
                              ).toLocaleString()}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              of{' '}
                              {campaign.currency_symbol ||
                                campaign?.currency?.toUpperCase()}
                              {parseFloat(
                                campaign.goal_amount,
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-full flex justify-between items-center">
                          <button
                            onClick={() => handleClick(String(campaign.id))}
                            className="w-full mt-4 bg-green-500 text-white px-5 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Back Now
                          </button>
                          <div className="w-full text-xs font-semibold text-right text-gray-600">
                            {campaign.remaining_days} days left
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No fundraising campaigns available for this category.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Component */}
            {selectedCategory &&
              campaignsGroupedByCategory[selectedCategory]?.total_pages > 1 && (
                <Pagination
                  currentPage={
                    campaignsGroupedByCategory[selectedCategory]?.current_page
                  }
                  totalPages={
                    campaignsGroupedByCategory[selectedCategory]?.total_pages
                  }
                  onPreviousPage={() =>
                    handlePageChange(selectedCategory, 'prev')
                  }
                  onNextPage={() => handlePageChange(selectedCategory, 'next')}
                  onLoading={loading}
                  onError={error}
                />
              )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
