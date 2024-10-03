import React, { useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  FaDollarSign,
  FaHandHoldingHeart,
  FaExchangeAlt,
  FaUsers,
} from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  LineElement,
  PointElement, // Registering PointElement for Line charts
  Title,
  Tooltip,
  Legend,
);

const GeneralDashboard = () => {
  const [filter, setFilter] = useState('daily');
  const [searchTerm, setSearchTerm] = useState('');

  const cardData = [
    { title: 'Total Donations', value: '$1,234,567', icon: <FaDollarSign /> },
    { title: 'Fundraising', value: '$987,654', icon: <FaHandHoldingHeart /> },
    { title: 'Transfers', value: '$456,789', icon: <FaExchangeAlt /> },
    { title: 'Total Users', value: '10,234', icon: <FaUsers /> },
  ];

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Donations',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieChartData = {
    labels: ['Education', 'Healthcare', 'Environment', 'Others'],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      },
    ],
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'User Growth',
        data: [100, 200, 300, 400, 500, 600],
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const userFeedback = [
    {
      id: 1,
      name: 'John Doe',
      comment: 'Great platform for making a difference!',
    },
    { id: 2, name: 'Jane Smith', comment: 'Easy to use and transparent.' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Crowdfunding Dashboard</h1>

      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <label htmlFor="filter" className="mr-2">
            Filter by:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative mx-4 lg:mx-0">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FiSearch className="w-5 h-5 text-gray-500" />
            </span>
            <input
              className="w-32 sm:w-64 rounded-md pl-10 pr-4 py-2 border border-gray-200 text-sm text-gray-300 focus:outline-none focus:border-gray-500"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <span className="text-3xl text-blue-500">{card.icon}</span>
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Donations Overview</h2>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Fundraising Categories</h2>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">User Growth</h2>
        <Line data={lineChartData} options={{ responsive: true }} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Transfers</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">From</th>
              <th className="text-left p-2">To</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((_, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-2">2023-06-{index + 1}</td>
                <td className="p-2">${Math.floor(Math.random() * 10000)}</td>
                <td className="p-2">User {Math.floor(Math.random() * 100)}</td>
                <td className="p-2">
                  Charity {Math.floor(Math.random() * 50)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Engagement */}
      <section aria-label="User Engagement">
        <h2 className="text-2xl font-semibold mb-4">User Engagement</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">User Feedback</h3>
          <div className="space-y-4">
            {userFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className="border-l-4 border-blue-500 pl-4"
              >
                <p className="italic">"{feedback.comment}"</p>
                <p className="text-gray-600 mt-1">- {feedback.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeneralDashboard;
