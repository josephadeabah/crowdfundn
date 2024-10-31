import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiAlertCircle, FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { truncateTitle } from '../utils/helpers/truncate.title';

interface Update {
  id: number;
  campaignId: string;
  content: string;
}

// Define type for form data
interface FormData {
  content: string;
}

const CampaignUpdates: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { campaigns, fetchCampaigns, loading } = useCampaignContext();
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    content: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleCampaignSelect = (campaignId: string) => {
    setSelectedCampaign(campaignId);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.content.trim()) {
      newErrors.content = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const newUpdate: Update = {
        id: Date.now(),
        campaignId: selectedCampaign,
        ...formData,
      };
      setUpdates([...updates, newUpdate]);
      setFormData({ content: '' });
      setIsModalOpen(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name as keyof FormData]: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Campaign Updates</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <FiPlus className="mr-2" />
          Add Update
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white p-6 rounded-sm shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6">Add New Update</h2>
              <form onSubmit={handleSubmit}>
                {/* Campaign Selector */}
                <div className="relative mb-8">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="campaign-select"
                  >
                    Select Campaign
                  </label>
                  <select
                    id="campaign-select"
                    value={selectedCampaign}
                    onChange={(e) => handleCampaignSelect(e.target.value)}
                    className="block w-full rounded-lg border-gray-300 border p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-200 appearance-none bg-white"
                    aria-label="Select campaign"
                  >
                    <option value="">Choose a campaign</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {truncateTitle(campaign.title, 60)}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-10 text-gray-400" />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.content ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-200'}`}
                  ></textarea>
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <FiAlertCircle className="mr-1" /> {errors.content}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Add Update
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Updates Display */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => {
          const campaignUpdates = updates.filter(
            (update) => update.campaignId === campaign.id.toString(),
          );

          if (campaignUpdates.length === 0) return null;

          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {campaign.title}
              </h2>
              <div className="space-y-4">
                {campaignUpdates.map((update) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-l-4 border-orange-400 pl-4 py-2"
                  >
                    <p className="text-gray-600 mt-1">{update.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignUpdates;
