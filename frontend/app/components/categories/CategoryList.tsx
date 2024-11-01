import React, { useState } from 'react';
import {
  FaTree,
  FaBook,
  FaUsers,
  FaHeartbeat,
  FaDog,
  FaPalette,
  FaLightbulb,
  FaLaptopCode,
  FaHandsHelping,
  FaGraduationCap,
  FaGlobeAmericas,
  FaUserFriends,
  FaBuilding,
  FaGasPump,
  FaIndustry,
  FaHome,
  FaCar,
  FaCogs,
  FaCheckCircle,
  FaWater,
  FaSeedling,
  FaShieldAlt,
  FaChild,
  FaPeopleArrows,
  FaGem,
  FaRecycle,
  FaLeaf,
  FaSprayCan,
  FaTrophy,
} from 'react-icons/fa';
import Modal from '@/app/components/modal/Modal';
import { Badge } from '../badge/Badge';

type Category = {
  value: string;
  label: string;
  icon: React.ElementType;
};

type Campaign = {
  id: number;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  image: string;
};

const CategoryList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const categories: Category[] = [
    { value: 'environment', label: 'Environment', icon: FaTree },
    { value: 'education', label: 'Education', icon: FaBook },
    { value: 'community-support', label: 'Community Support', icon: FaUsers },
    { value: 'health', label: 'Health', icon: FaHeartbeat },
    { value: 'animal-welfare', label: 'Animal Welfare', icon: FaDog },
    { value: 'arts-and-culture', label: 'Arts and Culture', icon: FaPalette },
    {
      value: 'disaster-relief',
      label: 'Disaster Relief',
      icon: FaHandsHelping,
    },
    { value: 'technology', label: 'Technology', icon: FaLaptopCode },
    { value: 'womens-empowerment', label: "Women's Empowerment", icon: FaGem },
    { value: 'youth-development', label: 'Youth Development', icon: FaChild },
    {
      value: 'sports-and-recreation',
      label: 'Sports and Recreation',
      icon: FaTrophy,
    },
    { value: 'mental-health', label: 'Mental Health', icon: FaCheckCircle },
    { value: 'food-security', label: 'Food Security', icon: FaSeedling },
    { value: 'human-rights', label: 'Human Rights', icon: FaShieldAlt },
    { value: 'clean-energy', label: 'Clean Energy', icon: FaGasPump },
    {
      value: 'housing-and-homelessness',
      label: 'Housing and Homelessness',
      icon: FaHome,
    },
    { value: 'public-health', label: 'Public Health', icon: FaHeartbeat },
    { value: 'disability-support', label: 'Disability Support', icon: FaCogs },
    {
      value: 'sustainable-agriculture',
      label: 'Sustainable Agriculture',
      icon: FaSprayCan,
    },
    {
      value: 'crisis-response',
      label: 'Crisis Response',
      icon: FaGlobeAmericas,
    },
    {
      value: 'economic-development',
      label: 'Economic Development',
      icon: FaIndustry,
    },
    {
      value: 'civic-engagement',
      label: 'Civic Engagement',
      icon: FaUserFriends,
    },
    {
      value: 'rural-development',
      label: 'Rural Development',
      icon: FaBuilding,
    },
    {
      value: 'water-and-sanitation',
      label: 'Water and Sanitation',
      icon: FaWater,
    },
    { value: 'job-creation', label: 'Job Creation', icon: FaPeopleArrows },
    {
      value: 'digital-literacy',
      label: 'Digital Literacy',
      icon: FaLaptopCode,
    },
    {
      value: 'local-business-support',
      label: 'Local Business Support',
      icon: FaBuilding,
    },
    { value: 'transportation', label: 'Transportation', icon: FaCar },
    {
      value: 'cultural-preservation',
      label: 'Cultural Preservation',
      icon: FaPalette,
    },
    {
      value: 'innovation-and-research',
      label: 'Innovation and Research',
      icon: FaLightbulb,
    },
    { value: 'renewable-energy', label: 'Renewable Energy', icon: FaGasPump },
    {
      value: 'wildlife-conservation',
      label: 'Wildlife Conservation',
      icon: FaDog,
    },
    {
      value: 'urban-development',
      label: 'Urban Development',
      icon: FaBuilding,
    },
    { value: 'elderly-care', label: 'Elderly Care', icon: FaUserFriends },
    { value: 'child-protection', label: 'Child Protection', icon: FaChild },
    {
      value: 'environmental-justice',
      label: 'Environmental Justice',
      icon: FaLeaf,
    },
    { value: 'arts-education', label: 'Arts Education', icon: FaPalette },
    { value: 'gender-equality', label: 'Gender Equality', icon: FaGem },
    {
      value: 'poverty-reduction',
      label: 'Poverty Reduction',
      icon: FaHandsHelping,
    },
    { value: 'climate-change', label: 'Climate Change', icon: FaGlobeAmericas },
    { value: 'clean-water', label: 'Clean Water', icon: FaWater },
    {
      value: 'access-to-education',
      label: 'Access to Education',
      icon: FaGraduationCap,
    },
    { value: 'veterans-support', label: 'Veterans Support', icon: FaUsers },
    {
      value: 'disaster-preparedness',
      label: 'Disaster Preparedness',
      icon: FaHandsHelping,
    },
    {
      value: 'agriculture-innovation',
      label: 'Agriculture Innovation',
      icon: FaSeedling,
    },
    {
      value: 'humanitarian-aid',
      label: 'Humanitarian Aid',
      icon: FaHandsHelping,
    },
    { value: 'family-services', label: 'Family Services', icon: FaUsers },
    { value: 'microfinance', label: 'Microfinance', icon: FaCheckCircle },
    { value: 'financial-literacy', label: 'Financial Literacy', icon: FaGem },
    { value: 'public-transport', label: 'Public Transport', icon: FaCar },
    {
      value: 'energy-efficiency',
      label: 'Energy Efficiency',
      icon: FaLightbulb,
    },
    {
      value: 'social-enterprise',
      label: 'Social Enterprise',
      icon: FaHandsHelping,
    },
    { value: 'plastic-recycling', label: 'Plastic Recycling', icon: FaRecycle },
    {
      value: 'forestry-management',
      label: 'Forestry Management',
      icon: FaTree,
    },
    {
      value: 'marine-conservation',
      label: 'Marine Conservation',
      icon: FaWater,
    },
    {
      value: 'carbon-footprint-reduction',
      label: 'Carbon Footprint Reduction',
      icon: FaLeaf,
    },
    { value: 'urban-farming', label: 'Urban Farming', icon: FaSeedling },
    {
      value: 'mental-health-advocacy',
      label: 'Mental Health Advocacy',
      icon: FaCheckCircle,
    },
    { value: 'green-architecture', label: 'Green Architecture', icon: FaLeaf },
    {
      value: 'sustainable-transport',
      label: 'Sustainable Transport',
      icon: FaCar,
    },
    {
      value: 'disaster-relief-infrastructure',
      label: 'Disaster Relief Infrastructure',
      icon: FaHandsHelping,
    },
    { value: 'organic-farming', label: 'Organic Farming', icon: FaSeedling },
    { value: 'eco-tourism', label: 'Eco-Tourism', icon: FaGlobeAmericas },
  ];

  // Dummy fundraising campaigns data
  const fundraisingCampaigns: Record<string, Campaign[]> = {
    environment: [
      {
        id: 1,
        title: 'Clean River Project',
        description: 'Help clean up local rivers and lakes.',
        goalAmount: 50000,
        currentAmount: 25000,
        image: 'images.unsplash.com/photo-1511941680711-7c0a9a3e15e8',
      },
      // Add more campaigns...
    ],
    education: [
      {
        id: 1,
        title: 'Scholarship Fund',
        description: 'Provide scholarships to students in need.',
        goalAmount: 20000,
        currentAmount: 10000,
        image: 'images.unsplash.com/photo-1560807707-8cc777a484c3',
      },
      {
        id: 2,
        title: 'School Supplies Drive',
        description: 'Provide school supplies to underprivileged children.',
        goalAmount: 30000,
        currentAmount: 15000,
        image: 'images.unsplash.com/photo-1573497490520-90ebf0d12c6e',
      },
      {
        id: 3,
        title: 'STEM Education Program',
        description: 'Support STEM education initiatives in schools.',
        goalAmount: 40000,
        currentAmount: 20000,
        image: 'images.unsplash.com/photo-1573497490520-90ebf0d12c6e',
      },
      // Add more campaigns...
    ],
    // Add more campaigns for other categories as needed
  };

  const handleCategoryClick = (value: string) => {
    setSelectedCategory(value);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="p-2 bg-gradient-to-br from-gray-50 to-neutral-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {categories.map((category) => {
            // const Icon = category.icon;
            return (
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
            );
          })}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} size="xxlarge">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              {categories.find((c) => c.value === selectedCategory)?.label}{' '}
              Campaigns
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
                          src={`https://${campaign.image}`}
                          alt={campaign.title}
                          className="w-full h-40 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1531685250784-7569952593d2';
                          }}
                        />
                      </div>
                      <div className="w-full md:w-2/3">
                        <h4 className="text-lg font-semibold mb-2">
                          {campaign.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {campaign.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Progress</span>
                            <span>
                              {Math.round(
                                (campaign.currentAmount / campaign.goalAmount) *
                                  100,
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <div
                              className="bg-orange-400 h-2.5 rounded-full"
                              style={{
                                width: `${(campaign.currentAmount / campaign.goalAmount) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              ${campaign.currentAmount.toLocaleString()}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              of ${campaign.goalAmount.toLocaleString()}
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
