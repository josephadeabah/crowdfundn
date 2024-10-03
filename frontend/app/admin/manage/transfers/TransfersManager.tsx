import React, { useState } from 'react';
import { FaSearch, FaSort, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';

const TabButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    className={`px-4 py-2 font-semibold ${active ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
    onClick={onClick}
    aria-selected={active}
    role="tab"
  >
    {label}
  </button>
);

interface Transfer {
  id: string;
  fundraiser: string;
  amount: number;
  date: string;
  status: string;
  paymentMethod: string;
  transferTime: string;
  recipientDetails: string;
  additionalNotes: string;
}

const TransferRow = ({
  transfer,
  onView,
}: {
  transfer: Transfer;
  onView: (transfer: Transfer) => void;
}) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap">{transfer.id}</td>
    <td className="px-6 py-4 whitespace-nowrap">{transfer.fundraiser}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      ${transfer.amount.toFixed(2)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">{transfer.date}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}
      >
        {transfer.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button
        className="text-blue-600 hover:text-blue-900 mr-4 mb-2"
        aria-label="Mark as delivered"
      >
        Mark Delivered
      </button>
      <button
        className="text-red-600 hover:text-red-900 mr-4 mb-2"
        aria-label="Cancel transfer"
      >
        Cancel
      </button>
      <button
        className="text-gray-600 hover:text-gray-900 mb-2"
        aria-label="View transfer details"
        onClick={() => onView(transfer)}
      >
        View
      </button>
    </td>
  </tr>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TransferDetailsPopup = ({
  transfer,
  onClose,
}: {
  transfer: Transfer;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-lg p-8 max-w-lg w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-2xl font-bold mb-4">Transfer Details</h3>
      <div className="space-y-2">
        <p>
          <strong>ID:</strong> {transfer.id}
        </p>
        <p>
          <strong>Fundraiser:</strong> {transfer.fundraiser}
        </p>
        <p>
          <strong>Amount:</strong> ${transfer.amount.toFixed(2)}
        </p>
        <p>
          <strong>Date:</strong> {transfer.date}
        </p>
        <p>
          <strong>Status:</strong> {transfer.status}
        </p>
        <p>
          <strong>Payment Method:</strong> {transfer.paymentMethod}
        </p>
        <p>
          <strong>Transfer Time:</strong> {transfer.transferTime}
        </p>
        <p>
          <strong>Recipient Details:</strong> {transfer.recipientDetails}
        </p>
        <p>
          <strong>Additional Notes:</strong> {transfer.additionalNotes}
        </p>
      </div>
      <button
        className="w-1/2 mt-6 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600 transition-colors"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </motion.div>
);

const TransfersManager = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(
    null,
  );
  const [transfers] = useState([
    {
      id: 'TRF001',
      fundraiser: 'Save the Whales',
      amount: 1000,
      date: '2023-06-01',
      status: 'Pending',
      paymentMethod: 'Credit Card',
      transferTime: '10:30 AM',
      recipientDetails: 'John Doe, Account: 1234567890',
      additionalNotes: 'Urgent transfer for whale conservation project',
    },
    {
      id: 'TRF002',
      fundraiser: 'Local Food Bank',
      amount: 1500,
      date: '2023-06-02',
      status: 'In Progress',
      paymentMethod: 'Bank Transfer',
      transferTime: '2:15 PM',
      recipientDetails: 'Food Bank Inc., Account: 0987654321',
      additionalNotes: 'Monthly donation for community support',
    },
    {
      id: 'TRF003',
      fundraiser: "Children's Hospital",
      amount: 2000,
      date: '2023-06-03',
      status: 'Delivered',
      paymentMethod: 'PayPal',
      transferTime: '11:45 AM',
      recipientDetails:
        "Children's Hospital Foundation, Email: donations@childrenshospital.org",
      additionalNotes: 'Equipment fund for pediatric ward',
    },
  ]);

  const filteredTransfers = transfers.filter((transfer) => {
    const statusMatch = transfer.status === activeTab;
    const dateMatch = selectedDate
      ? transfer.date === selectedDate.toISOString().split('T')[0]
      : true;
    return statusMatch && dateMatch;
  });

  const handleViewTransfer = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
  };

  return (
    <div className="shadow p-3 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Transfers Management</h2>
      <div className="mb-6" role="tablist">
        <TabButton
          label="Pending"
          active={activeTab === 'Pending'}
          onClick={() => setActiveTab('Pending')}
        />
        <TabButton
          label="In Progress"
          active={activeTab === 'In Progress'}
          onClick={() => setActiveTab('In Progress')}
        />
        <TabButton
          label="Delivered"
          active={activeTab === 'Delivered'}
          onClick={() => setActiveTab('Delivered')}
        />
      </div>
      <div className="flex justify-between flex-col md:flex-row items-center gap-2 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transfers..."
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search transfers"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select date"
            />
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Sort transfers"
          >
            <FaSort className="mr-2" /> Sort
          </button>
          <button
            className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Filter transfers"
          >
            <FaFilter className="mr-2" /> Filter
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fundraiser
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransfers.map((transfer) => (
              <TransferRow
                key={transfer.id}
                transfer={transfer}
                onView={handleViewTransfer}
              />
            ))}
          </tbody>
        </table>
      </div>
      {filteredTransfers.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No transfers found for this status and date.
        </p>
      )}
      <AnimatePresence>
        {selectedTransfer && (
          <TransferDetailsPopup
            transfer={selectedTransfer}
            onClose={() => setSelectedTransfer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransfersManager;
