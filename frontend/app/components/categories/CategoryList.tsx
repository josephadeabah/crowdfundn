import React, { useEffect, useState } from 'react';
import Modal from '@/app/components/modal/Modal';
import { Badge } from '../badge/Badge';
import { categories } from '@/app/utils/helpers/categories';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';

const CategoryList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { campaigns, loading, error, fetchAllCampaigns } = useCampaignContext();

  // Group campaigns by category
  const fundraisingCampaigns: Record<string, CampaignResponseDataType[]> =
    campaigns.reduce(
      (acc: Record<string, CampaignResponseDataType[]>, campaign) => {
        const category = campaign.category.toLowerCase().replace(/\s+/g, '-');
        if (!acc[category]) acc[category] = [];
        acc[category].push(campaign);
        return acc;
      },
      {},
    );

  useEffect(() => {
    fetchAllCampaigns();
  }, [fetchAllCampaigns]);

  const handleCategoryClick = (value: string) => {
    setSelectedCategory(value);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="w-full p-2 bg-gradient-to-br from-gray-50 to-neutral-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {categories.map((category) => (
            <Badge
              key={category.value}
              className={`cursor-pointer transform hover:scale-105 transition-transform duration-300 w-fit ${
                selectedCategory === category.value
                  ? 'bg-orange-400 text-white'
                  : 'text-gray-800 dark:bg-slate-950 dark:text-gray-50'
              }`}
              onClick={() => handleCategoryClick(category.value)}
              variant="default"
            >
              {category.label}
            </Badge>
          ))}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} size="xxlarge">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              {categories.find((c) => c.value === selectedCategory)?.label}{' '}
              Fundraisers
            </h3>
            <div className="space-y-6 mt-4">
              {fundraisingCampaigns[selectedCategory || '']?.length > 0 ? (
                fundraisingCampaigns[selectedCategory || ''].map((campaign) => (
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
                        <h4 className="text-lg font-semibold mb-2">
                          {campaign.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {campaign.message}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Progress</span>
                            <span>
                              {Math.round(
                                (parseFloat(campaign.current_amount) /
                                  parseFloat(campaign.goal_amount)) *
                                  100,
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <div
                              className="bg-orange-400 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  (parseFloat(campaign.current_amount) /
                                    parseFloat(campaign.goal_amount)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              {campaign.currency_symbol}
                              {parseFloat(
                                campaign.current_amount,
                              ).toLocaleString()}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              of {campaign.currency_symbol}
                              {parseFloat(
                                campaign.goal_amount,
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button className="mt-4 bg-green-500 text-white px-5 py-1.5 rounded-lg hover:bg-green-600 transition-colors">
                          Donate Now
                        </button>
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
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
