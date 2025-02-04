"use client";

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
      title: 'Title 1',
      description: 'Description 1',
      detailedDescription: 'Detailed Description 1',
    },
    {
      id: 2,
      src: '/BHRewardScreenshotDocument.png',
      title: 'Title 2',
      description: 'Description 2',
      detailedDescription: 'Detailed Description 2',
    },
    {
      id: 3,
      src: '/BHTransfersScreenshotDocument.png',
      title: 'Title 3',
      description: 'Description 3',
      detailedDescription: 'Detailed Description 3',
    },
    {
      id: 4,
      src: '/BHCampaignsScreenshotDocument.png',
      title: 'Title 4',
      description: 'Description 4',
      detailedDescription: 'Detailed Description 4',
    },
    {
      id: 5,
      src: '/BHBackerLeaderboardScreenshotDocument.png',
      title: 'Title 5',
      description: 'Description 5',
      detailedDescription: 'Detailed Description 5',
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
          <div
            key={item.id}
            className="relative bg-green-200 p-4 rounded-lg"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold truncate">{item.title}</h3>
              <p className="text-sm text-gray-600 truncate">{item.description}</p>
            </div>
            <button
              className="absolute bottom-4 right-4 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors duration-200"
              onClick={() => handlePlusClick(item)}
            >
              <FaPlus className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {imageItems.slice(3, 5).map((item) => (
          <div
            key={item.id}
            className="relative bg-green-200 p-4 rounded-lg"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold truncate">{item.title}</h3>
              <p className="text-sm text-gray-600 truncate">{item.description}</p>
            </div>
            <button
              className="absolute bottom-4 right-4 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors duration-200"
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
              <p className="mt-4 text-gray-700">{selectedItem.detailedDescription}</p>
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