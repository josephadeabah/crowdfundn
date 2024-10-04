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
import Modal from '@/app/components/modal/Modal'; // Importing the Modal component

const TransferManager = () => {
  interface Transaction {
    id: string;
    amount: string;
    timestamp: string;
    fundraiserName: string;
    status: string;
    paymentMethod: string;
    donorName: string;
    receiverName: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortColumn, setSortColumn] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      const newTransaction = generateRandomTransaction();
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        newTransaction,
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomTransaction = () => {
    const id = Math.random().toString(36).substring(2, 11);
    const amount = (Math.random() * 1000).toFixed(2);
    const timestamp = new Date().toISOString();
    const fundraiserName = `Fundraiser${Math.floor(Math.random() * 1000)}`;
    const status = 'pending';
    const paymentMethod = Math.random() > 0.5 ? 'Credit Card' : 'PayPal';
    const donorName = `Donor${Math.floor(Math.random() * 1000)}`;
    const receiverName = `Receiver${Math.floor(Math.random() * 1000)}`;

    return {
      id,
      amount,
      timestamp,
      fundraiserName,
      status,
      paymentMethod,
      donorName,
      receiverName,
    };
  };

  const handleSort = (column: keyof Transaction) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortColumn as keyof Transaction] < b[sortColumn as keyof Transaction])
      return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn as keyof Transaction] > b[sortColumn as keyof Transaction])
      return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };

  const handleMarkInProgress = (id: string) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, status: 'inprogress' } : t,
      ),
    );
  };

  const handleMarkDelivered = (id: string) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, status: 'delivered' } : t,
      ),
    );
  };

  const handleCancel = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const getSortIcon = (column: keyof Transaction) => {
    if (column === sortColumn) {
      return sortDirection === 'asc' ? (
        <FaSortUp className="inline ml-1" />
      ) : (
        <FaSortDown className="inline ml-1" />
      );
    }
    return <FaSort className="inline ml-1" />;
  };

  const filteredTransactions = sortedTransactions
    .filter((t) => t.status === activeTab)
    .filter((t) => {
      if (filterDate) {
        const transactionDate = new Date(t.timestamp);
        return (
          transactionDate.getDate() === filterDate.getDate() &&
          transactionDate.getMonth() === filterDate.getMonth() &&
          transactionDate.getFullYear() === filterDate.getFullYear()
        );
      }
      return true;
    })
    .filter(
      (t) =>
        t.fundraiserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.donorName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <div className="mx-auto px-2 py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction Scheduler</h1>
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
              activeTab === 'inprogress'
                ? 'border-b-2 border-gray-500 text-black'
                : 'text-gray-500 hover:text-gray-500'
            }`}
            onClick={() => setActiveTab('inprogress')}
          >
            In Progress
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'delivered'
                ? 'border-b-2 border-gray-500 text-black'
                : 'text-gray-500 hover:text-gray-500'
            }`}
            onClick={() => setActiveTab('delivered')}
          >
            Delivered
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
                onClick={() => handleSort('id')}
              >
                Transaction ID {getSortIcon('id')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                Amount {getSortIcon('amount')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('timestamp')}
              >
                Timestamp {getSortIcon('timestamp')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('fundraiserName')}
              >
                Fundraiser {getSortIcon('fundraiserName')}
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort('donorName')}
              >
                Donor {getSortIcon('donorName')}
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
              {filteredTransactions.map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="px-4 py-2">{transaction.id}</td>
                  <td className="px-4 py-2">{transaction.amount}</td>
                  <td className="px-4 py-2">{transaction.timestamp}</td>
                  <td className="px-4 py-2">{transaction.fundraiserName}</td>
                  <td className="px-4 py-2">{transaction.donorName}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : transaction.status === 'inprogress'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-4 py-2 flex space-x-2">
                    {transaction.status === 'pending' && (
                      <button
                        className="text-blue-500"
                        onClick={() => handleMarkInProgress(transaction.id)}
                      >
                        <FaPlayCircle />
                      </button>
                    )}
                    {transaction.status === 'inprogress' && (
                      <button
                        className="text-green-500"
                        onClick={() => handleMarkDelivered(transaction.id)}
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    <button
                      className="text-red-500"
                      onClick={() => handleCancel(transaction.id)}
                    >
                      <FaBan />
                    </button>
                    <button
                      className="text-gray-500"
                      onClick={() => handleView(transaction)}
                    >
                      <FaEye />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Modal for viewing transaction details */}
      {selectedTransaction && (
        <Modal
          isOpen={!!selectedTransaction}
          onClose={handleCloseModal}
          closeOnBackdropClick={false}
        >
          <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
          <p>
            <strong>Transaction ID:</strong> {selectedTransaction.id}
          </p>
          <p>
            <strong>Amount:</strong> {selectedTransaction.amount}
          </p>
          <p>
            <strong>Timestamp:</strong> {selectedTransaction.timestamp}
          </p>
          <p>
            <strong>Fundraiser:</strong> {selectedTransaction.fundraiserName}
          </p>
          <p>
            <strong>Donor:</strong> {selectedTransaction.donorName}
          </p>
          <p>
            <strong>Status:</strong> {selectedTransaction.status}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default TransferManager;
