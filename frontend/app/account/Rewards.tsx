import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Modal from '../components/modal/Modal';

// Define types for the reward and form data
interface Reward {
  id: number;
  title: string;
  description: string;
  amount: number;
  image: string;
}

interface FormData {
  title: string;
  description: string;
  amount: string;
  image: File | null; // Changed to handle file input
}

interface Errors {
  title?: string;
  description?: string;
  amount?: string;
  image?: string;
}

const RewardsPage: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    amount: '',
    image: null,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (
      !formData.amount ||
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const newReward: Reward = {
        id: rewards.length + 1,
        title: formData.title,
        description: formData.description,
        amount: Number(formData.amount),
        image: previewImage || '',
      };
      setRewards([...rewards, newReward]);
      setFormData({ title: '', description: '', amount: '', image: null });
      setPreviewImage(null);
      setShowModal(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof Errors]) {
      setErrors({ ...errors, [name as keyof Errors]: '' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    if (errors.image) {
      setErrors({ ...errors, image: '' });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Rewards
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            aria-label="Add new reward"
          >
            <FiPlus className="mr-2" /> Add Reward
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={reward.image}
                alt={reward.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {reward.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {reward.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    ${reward.amount}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    Points
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          size="xlarge"
          closeOnBackdropClick={false}
        >
          <div className="overflow-y-auto max-h-[60vh] p-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Add New Reward
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.title ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
                  aria-invalid={errors.title ? 'true' : 'false'}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.description ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
                  rows={3}
                  aria-invalid={errors.description ? 'true' : 'false'}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="amount"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
                  aria-invalid={errors.amount ? 'true' : 'false'}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="image"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  Reward Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.image ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Image Preview"
                    className="mt-4 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-600"
              >
                Add Reward
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RewardsPage;
