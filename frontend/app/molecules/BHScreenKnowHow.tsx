'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import Modal from '../components/modal/Modal';

interface ImageItem {
  id: number;
  src: string;
  title: string;
  description: string;
  detailedDescription: string;
}

const BHScreenKnowHow: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageItems: ImageItem[] = [
    {
      id: 1,
      src: '/BHOverviewScreenshotDocument.png',
      title: 'Dashboard Overview',
      description: 'Monitor your campaigns, track progress, and stay informed.',
      detailedDescription:
        'Get a comprehensive view of your crowdfunding activities with the Bantu Hive dashboard. Easily monitor your campaign’s progress, see donation trends, track your earned rewards, and stay updated on key platform metrics. The dashboard provides a centralized place to manage all your fundraising efforts efficiently.',
    },
    {
      id: 2,
      src: '/BHRewardScreenshotDocument.png',
      title: 'Give and Receive Rewards',
      description:
        'Earn points, badges, and exclusive rewards for supporting campaigns.',
      detailedDescription:
        'Bantu Hive’s gamified crowdfunding model allows you to earn exciting rewards for your contributions. Every donation, share, and engagement on the platform helps you accumulate points, unlock badges, and climb the leaderboard. Support others and get rewarded for your generosity!',
    },
    {
      id: 3,
      src: '/BHTransfersScreenshotDocument.png',
      title: 'Make Withdrawals of Your Money Raised',
      description:
        'Easily access the funds you’ve raised through a secure transfer process.',
      detailedDescription:
        'Once your campaign has successfully raised funds, Bantu Hive makes it simple to withdraw your earnings. Secure payment processing ensures that funds are delivered directly to your linked accounts. Track your withdrawal history and manage your funds with ease.',
    },
    {
      id: 4,
      src: '/BHCampaignsScreenshotDocument.png',
      title: 'Manage Your Created Campaigns',
      description:
        'Edit, update, and track your fundraising campaigns in one place.',
      detailedDescription:
        'Effortlessly manage all your created campaigns from a single interface. Update your campaign details, add updates for your backers, monitor donation progress, and interact with supporters. Bantu Hive provides you with the tools to maximize your campaign’s success.',
    },
    {
      id: 5,
      src: '/BHBackerLeaderboardScreenshotDocument.png',
      title: 'See Who’s Leading the Backing and Fundraising Game',
      description:
        'Compete and engage with the top supporters in the community.',
      detailedDescription:
        'Bantu Hive’s leaderboard highlights the most active contributors and top fundraisers on the platform. See who has earned the most points, donated the most, or shared the most campaigns. Challenge yourself and others to climb the ranks while making a real impact!',
    },
  ];

  const handlePlusClick = (item: ImageItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {imageItems.slice(0, 3).map((item) => (
          <div key={item.id} className="relative bg-green-200 p-4 rounded-lg">
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold truncate">{item.title}</h3>
              <div className="w-full max-w-md">
                <p className="text-sm text-gray-600 truncate">
                  {item.description}
                </p>
              </div>
            </div>
            <button
              className="absolute bottom-4 right-4 bg-orange-300 text-white p-2 rounded-full hover:bg-orange-400 transition-colors duration-200"
              onClick={() => handlePlusClick(item)}
            >
              <FaPlus className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {imageItems.slice(3, 5).map((item) => (
          <div key={item.id} className="relative bg-green-200 p-4 rounded-lg">
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold truncate">{item.title}</h3>
              <p className="text-sm text-gray-600 truncate">
                {item.description}
              </p>
            </div>
            <button
              className="absolute bottom-4 right-4 bg-orange-300 text-white p-2 rounded-full hover:bg-orange-400 transition-colors duration-200"
              onClick={() => handlePlusClick(item)}
            >
              <FaPlus className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="full">
        {selectedItem && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
              <p className="mt-4 text-gray-700">
                {selectedItem.detailedDescription}
              </p>
            </div>
            <div className="flex-1">
              <img
                src={selectedItem.src}
                alt={selectedItem.title}
                className="w-full h-64 object-cover rounded-md"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BHScreenKnowHow;
