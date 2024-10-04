'use client';
import React, { useState, useEffect } from 'react';
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaBan,
  FaPlayCircle,
  FaCheckCircle,
  FaSearch,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '@/app/components/modal/Modal';

const PromotionScheduler = () => {
  interface Promotion {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    fundraiserName: string;
    status: string;
    goal: number;
    currentAmount: number;
    participants: number;
  }

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Promotion>('startDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      const newPromotion = generateRandomPromotion();
      setPromotions((prevPromotions) => [...prevPromotions, newPromotion]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomPromotion = () => {
    const id = Math.random().toString(36).substring(2, 11);
    const title = `Promotion${Math.floor(Math.random() * 1000)}`;
    const startDate = new Date(
      Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000,
    );
    const endDate = new Date(
      startDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000,
    );
    const fundraiserName = `Fundraiser${Math.floor(Math.random() * 1000)}`;
    const status = 'scheduled';
    const goal = Math.floor(Math.random() * 10000) + 1000;
    const currentAmount = Math.floor(Math.random() * goal);
    const participants = Math.floor(Math.random() * 100);

    return {
      id,
      title,
      startDate,
      endDate,
      fundraiserName,
      status,
      goal,
      currentAmount,
      participants,
    };
  };

  const handleSort = (column: keyof Promotion) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedPromotions = [...promotions].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleView = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
  };

  const handleCloseModal = () => {
    setSelectedPromotion(null);
  };

  const handleStart = (id: string) => {
    setPromotions(
      promotions.map((p) => (p.id === id ? { ...p, status: 'active' } : p)),
    );
  };

  const handleComplete = (id: string) => {
    setPromotions(
      promotions.map((p) => (p.id === id ? { ...p, status: 'completed' } : p)),
    );
  };

  const handleCancel = (id: string) => {
    setPromotions(
      promotions.map((p) => (p.id === id ? { ...p, status: 'cancelled' } : p)),
    );
  };

  const getSortIcon = (column: keyof Promotion) => {
    if (column === sortColumn) {
      return sortDirection === 'asc' ? (
        <FaSortUp className="inline ml-1" />
      ) : (
        <FaSortDown className="inline ml-1" />
      );
    }
    return <FaSort className="inline ml-1" />;
  };

  const filteredPromotions = sortedPromotions
    .filter((p) => p.status === activeTab)
    .filter((p) => {
      if (filterDate) {
        const promotionDate = new Date(p.startDate);
        return (
          promotionDate.getDate() === filterDate.getDate() &&
          promotionDate.getMonth() === filterDate.getMonth() &&
          promotionDate.getFullYear() === filterDate.getFullYear()
        );
      }
      return true;
    })
    .filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.fundraiserName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <div className="mx-auto px-2 py-4">
      <h1 className="text-3xl font-bold mb-6">Promotion Scheduler</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex border-b border-gray-200 mb-4 sm:mb-0">
          <button
            className={`py-2 px-4 ${
              activeTab === 'scheduled'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('scheduled')}
          >
            Scheduled
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'active'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'completed'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'cancelled'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <DatePicker
            selected={filterDate}
            onChange={(date) => setFilterDate(date)}
            placeholderText="Filter by date"
            className="p-2 border rounded"
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 pl-8 border rounded"
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Title {getSortIcon('title')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('startDate')}
              >
                Start Date {getSortIcon('startDate')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('endDate')}
              >
                End Date {getSortIcon('endDate')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('fundraiserName')}
              >
                Fundraiser {getSortIcon('fundraiserName')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('goal')}
              >
                Goal {getSortIcon('goal')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('currentAmount')}
              >
                Current Amount {getSortIcon('currentAmount')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('participants')}
              >
                Participants {getSortIcon('participants')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredPromotions.map((promotion) => (
                <motion.tr
                  key={promotion.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b"
                >
                  <td className="px-4 py-2 text-center">{promotion.title}</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(promotion.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(promotion.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {promotion.fundraiserName}
                  </td>
                  <td className="px-4 py-2 text-center">
                    ${promotion.goal.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    ${promotion.currentAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {promotion.participants}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        promotion.status === 'scheduled'
                          ? 'bg-yellow-200 text-yellow-800'
                          : promotion.status === 'active'
                            ? 'bg-blue-200 text-blue-800'
                            : promotion.status === 'completed'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {promotion.status.charAt(0).toUpperCase() +
                        promotion.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleView(promotion)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <FaEye />
                      </button>
                      {activeTab === 'scheduled' && (
                        <button
                          onClick={() => handleStart(promotion.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                        >
                          <FaPlayCircle />
                        </button>
                      )}
                      {activeTab === 'active' && (
                        <button
                          onClick={() => handleComplete(promotion.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                      {(activeTab === 'scheduled' ||
                        activeTab === 'active') && (
                        <button
                          onClick={() => handleCancel(promotion.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <FaBan />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {selectedPromotion && (
        <Modal onClose={handleCloseModal} isOpen={!!selectedPromotion}>
          <h2 className="text-2xl font-bold mb-4">{selectedPromotion.title}</h2>
          <p>
            <strong>Start Date:</strong>{' '}
            {selectedPromotion.startDate.toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong>{' '}
            {selectedPromotion.endDate.toLocaleDateString()}
          </p>
          <p>
            <strong>Fundraiser:</strong> {selectedPromotion.fundraiserName}
          </p>
          <p>
            <strong>Goal:</strong> {selectedPromotion.goal}
          </p>
          <p>
            <strong>Current Amount:</strong> {selectedPromotion.currentAmount}
          </p>
          <p>
            <strong>Participants:</strong> {selectedPromotion.participants}
          </p>
          <p>
            <strong>Status:</strong> {selectedPromotion.status}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default PromotionScheduler;
