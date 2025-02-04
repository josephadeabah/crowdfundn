import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import Modal from '../components/modal/Modal';

const items = [
  {
    id: 1,
    title: 'Screen 1',
    description: 'This is a short description of screen 1.',
    image: '/BHOverviewScreenshotDocument.png',
    details: 'This is a detailed description of screen 1 with more information.',
  },
  {
    id: 2,
    title: 'Screen 2',
    description: 'This is a short description of screen 2.',
    image: '/BHRewardScreenshotDocument.png',
    details: 'This is a detailed description of screen 2 with more information.',
  },
  {
    id: 3,
    title: 'Screen 3',
    description: 'This is a short description of screen 3.',
    image: '/BHTransfersScreenshotDocument.png',
    details: 'This is a detailed description of screen 3 with more information.',
  },
  {
    id: 4,
    title: 'Screen 4',
    description: 'This is a short description of screen 4.',
    image: '/BHCampaignsScreenshotDocument.png',
    details: 'This is a detailed description of screen 4 with more information.',
  },
  {
    id: 5,
    title: 'Screen 5',
    description: 'This is a short description of screen 5.',
    image: '/BHBackerLeaderboardScreenshotDocument.png',
    details: 'This is a detailed description of screen 5 with more information.',
  },
];

const BHScreenKnowHow: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof items[0] | null>(null);

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="relative p-4 bg-green-100 rounded-lg shadow-lg overflow-hidden"
          >
            <Image src={item.image} alt={item.title} width={400} height={250} className="rounded-lg" />
            <h3 className="mt-2 text-lg font-semibold truncate">{item.title}</h3>
            <p className="text-sm text-gray-600 truncate">{item.description}</p>
            <button
              className="absolute bottom-4 right-4 p-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition"
              onClick={() => setSelectedItem(item)}
            >
              <FaPlus size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {items.slice(3, 5).map((item) => (
          <div
            key={item.id}
            className="relative p-4 bg-green-100 rounded-lg shadow-lg overflow-hidden col-span-2"
          >
            <Image src={item.image} alt={item.title} width={800} height={250} className="rounded-lg" />
            <h3 className="mt-2 text-lg font-semibold truncate">{item.title}</h3>
            <p className="text-sm text-gray-600 truncate">{item.description}</p>
            <button
              className="absolute bottom-4 right-4 p-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition"
              onClick={() => setSelectedItem(item)}
            >
              <FaPlus size={16} />
            </button>
          </div>
        ))}
      </div>
      {selectedItem && (
        <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} size="large">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <div>
              <h2 className="text-2xl font-semibold">{selectedItem.title}</h2>
              <p className="mt-2 text-gray-600">{selectedItem.details}</p>
            </div>
            <div>
              <Image src={selectedItem.image} alt={selectedItem.title} width={600} height={400} className="rounded-lg" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BHScreenKnowHow;
