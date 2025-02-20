'use client';
import React, { useState, useEffect } from 'react';
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaBan,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaSearch,
  FaLock,
  FaUnlock,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '@/app/components/modal/Modal';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';

const CampaignManager = () => {
  interface Campaign {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    organizer: string;
    status: string;
    goal: number;
    currentAmount: number;
    participants: number;
    isBlocked: boolean;
  }

  const {
    campaigns: contextCampaigns,
    loading,
    error: contextError,
    fetchAllCampaigns,
    pagination,
    deleteCampaign,
    updateCampaignSettings,
  } = useCampaignContext(); // Use the context

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sortColumn, setSortColumn] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState('active');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);

  // State for filters and pagination
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [dateRange, setDateRange] = useState<string>('all_time');
  const [goalRange, setGoalRange] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [titleFilter, setTitleFilter] = useState<string>('');

  // Fetch campaigns when filters or pagination change
  useEffect(() => {
    fetchAllCampaigns(
      sortBy,
      sortOrder,
      page,
      pageSize,
      dateRange,
      goalRange,
      location,
      titleFilter,
    );
  }, [
    fetchAllCampaigns,
    sortBy,
    sortOrder,
    page,
    pageSize,
    dateRange,
    goalRange,
    location,
    titleFilter,
  ]);

  // Map context campaigns to the local Campaign interface
  useEffect(() => {
    if (contextCampaigns) {
      const mappedCampaigns = contextCampaigns.map((campaign) => ({
        id: campaign.id.toString(),
        title: campaign.title,
        startDate: new Date(campaign.start_date),
        endDate: new Date(campaign.end_date),
        organizer: campaign.fundraiser?.profile?.name || 'Unknown',
        status: campaign.status || 'active',
        goal: parseFloat(campaign.goal_amount),
        currentAmount: parseFloat(campaign.transferred_amount),
        participants: campaign.total_donors,
        isBlocked: !campaign.permissions.is_public, // Assuming is_public determines blocking
      }));
      setCampaigns(mappedCampaigns);
    }
  }, [contextCampaigns]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (a[sortColumn as keyof Campaign] < b[sortColumn as keyof Campaign])
      return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn as keyof Campaign] > b[sortColumn as keyof Campaign])
      return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleView = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditMode(false);
  };

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditMode(true);
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
    setEditMode(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCampaign(id);
      setCampaigns(campaigns.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleBlock = async (id: string) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (!campaign) return;

    const newIsPublic = !campaign.isBlocked;
    try {
      await updateCampaignSettings(id, { is_public: newIsPublic });
      setCampaigns(
        campaigns.map((c) =>
          c.id === id ? { ...c, isBlocked: !newIsPublic } : c,
        ),
      );
    } catch (error) {
      console.error('Error updating campaign settings:', error);
    }
  };

  const handleUpdateCampaign = (updatedCampaign: Campaign) => {
    setCampaigns(
      campaigns.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c)),
    );
    setSelectedCampaign(null);
    setEditMode(false);
  };

  const getSortIcon = (column: string) => {
    if (column === sortColumn) {
      return sortDirection === 'asc' ? (
        <FaSortUp className="inline ml-1" />
      ) : (
        <FaSortDown className="inline ml-1" />
      );
    }
    return <FaSort className="inline ml-1" />;
  };

  const filteredCampaigns = sortedCampaigns
    .filter(
      (c) => c.status === activeTab || (activeTab === 'blocked' && c.isBlocked),
    )
    .filter((c) => {
      if (filterDate) {
        const campaignDate = new Date(c.startDate);
        return (
          campaignDate.getDate() === filterDate.getDate() &&
          campaignDate.getMonth() === filterDate.getMonth() &&
          campaignDate.getFullYear() === filterDate.getFullYear()
        );
      }
      return true;
    })
    .filter(
      (c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.organizer.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <div className="mx-auto px-2 py-4">
      <h1 className="text-3xl font-bold mb-6">Campaign Manager</h1>
      {contextError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {contextError}</span>
        </div>
      )}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex border-b border-gray-200 mb-4 sm:mb-0">
          <button
            className={`py-2 px-4 ${
              activeTab === 'active'
                ? 'border-b-2 border-gray-500 text-black'
                : 'text-gray-500 hover:text-gray-500'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'pending'
                ? 'border-b-2 border-gray-500 text-black'
                : 'text-gray-500 hover:text-gray-500'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'blocked'
                ? 'border-b-2 border-gray-500 text-black'
                : 'text-gray-500 hover:text-gray-500'
            }`}
            onClick={() => setActiveTab('blocked')}
          >
            Blocked
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
          <thead className="w-full text-left bg-gray-200">
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
                onClick={() => handleSort('organizer')}
              >
                Organizer {getSortIcon('organizer')}
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
              {filteredCampaigns.map((campaign) => (
                <motion.tr
                  key={campaign.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b"
                >
                  <td className="px-4 py-2">{campaign.title}</td>
                  <td className="px-4 py-2">
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{campaign.organizer}</td>
                  <td className="px-4 py-2">
                    ${campaign.goal.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    ${campaign.currentAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{campaign.participants}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        campaign.status === 'active'
                          ? 'bg-green-200 text-green-800'
                          : campaign.status === 'pending'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleView(campaign)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(campaign)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleBlock(campaign.id)}
                        className={`${campaign.isBlocked ? 'text-red-600 hover:text-red-900' : 'text-yellow-600 hover:text-yellow-900'} p-1`}
                        title={campaign.isBlocked ? 'Unblock' : 'Block'}
                      >
                        {campaign.isBlocked ? <FaUnlock /> : <FaLock />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {selectedCampaign && (
        <Modal onClose={handleCloseModal} isOpen={!!selectedCampaign}>
          <div className="mt-3">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
              {editMode ? 'Edit Campaign' : 'Campaign Details'}
            </h3>
            <div className="mt-2 text-sm text-gray-500">
              {editMode ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateCampaign({
                      ...selectedCampaign,
                      title: (
                        (e.target as HTMLFormElement).elements.namedItem(
                          'title',
                        ) as HTMLInputElement
                      ).value,
                      organizer: (
                        (e.target as HTMLFormElement).elements.namedItem(
                          'organizer',
                        ) as HTMLInputElement
                      ).value,
                      goal: parseFloat(
                        (
                          (e.target as HTMLFormElement).elements.namedItem(
                            'goal',
                          ) as HTMLInputElement
                        ).value,
                      ),
                      status: (
                        (e.target as HTMLFormElement).elements.namedItem(
                          'status',
                        ) as HTMLSelectElement
                      ).value,
                    });
                  }}
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="title"
                    >
                      Title
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="title"
                      type="text"
                      defaultValue={selectedCampaign.title}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="organizer"
                    >
                      Organizer
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="organizer"
                      type="text"
                      defaultValue={selectedCampaign.organizer}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="goal"
                    >
                      Goal
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="goal"
                      type="number"
                      defaultValue={selectedCampaign.goal}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="status"
                      defaultValue={selectedCampaign.status}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Update
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p>
                    <strong>Title:</strong> {selectedCampaign.title}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{' '}
                    {new Date(selectedCampaign.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{' '}
                    {new Date(selectedCampaign.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Organizer:</strong> {selectedCampaign.organizer}
                  </p>
                  <p>
                    <strong>Goal:</strong> $
                    {selectedCampaign.goal.toLocaleString()}
                  </p>
                  <p>
                    <strong>Current Amount:</strong> $
                    {selectedCampaign.currentAmount.toLocaleString()}
                  </p>
                  <p>
                    <strong>Participants:</strong>{' '}
                    {selectedCampaign.participants}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedCampaign.status}
                  </p>
                  <p>
                    <strong>Blocked:</strong>{' '}
                    {selectedCampaign.isBlocked ? 'Yes' : 'No'}
                  </p>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CampaignManager;
