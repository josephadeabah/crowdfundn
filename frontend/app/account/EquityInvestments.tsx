// app/account/EquityInvestments.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';

const EquityInvestments = () => {
  const [activeView, setActiveView] = useState<'portfolio' | 'my_investments'>(
    'portfolio',
  );

  return (
    <div className="px-2 py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Equity Investments
        </h1>
        <div className="flex space-x-4">
          <Link href="/invest">
            <Button variant="outline" className="text-gray-700 rounded-full shadow-sm">
              Browse Founders
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeView === 'portfolio' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveView('portfolio')}
        >
          Portfolio Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeView === 'my_investments' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveView('my_investments')}
        >
          My Investments
        </button>
      </div>

      {activeView === 'portfolio' ? <PortfolioView /> : <MyInvestmentsView />}
    </div>
  );
};

const PortfolioView = () => {
  // Mock data - replace with real data from your API
  const portfolioData = {
    totalValue: 12500,
    totalInvested: 8500,
    totalReturn: 4000,
    returnPercentage: 47.06,
    investments: [
      {
        id: 1,
        campaign: 'Solar Tech Startup',
        amount: 5000,
        shares: 1000,
        currentValue: 7500,
        return: 2500,
        returnPercentage: 50,
        status: 'active',
      },
      {
        id: 2,
        campaign: 'AI Healthcare',
        amount: 3500,
        shares: 700,
        currentValue: 5000,
        return: 1500,
        returnPercentage: 42.86,
        status: 'active',
      },
    ],
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">
            Total Portfolio Value
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${portfolioData.totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">
            Total Invested
          </h3>
          <p className="text-3xl font-bold">
            ${portfolioData.totalInvested.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">
            Total Return
          </h3>
          <p
            className={`text-3xl font-bold ${portfolioData.totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            ${portfolioData.totalReturn.toLocaleString()} (
            {portfolioData.returnPercentage}%)
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
        <div className="px-2 py-4">
          <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Invested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Return
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {portfolioData.investments.map((investment) => (
                  <tr key={investment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {investment.campaign}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${investment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {investment.shares.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${investment.currentValue.toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${investment.return >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                    >
                      ${investment.return.toLocaleString()} (
                      {investment.returnPercentage}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${investment.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                      >
                        {investment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 mr-4">
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                        Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Performance Chart</h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Chart visualization would appear here
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invested $500 in Solar Tech Startup
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  2 days ago
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MyInvestmentsView = () => {
  // Mock data - replace with real data from your API
  const investments = [
    {
      id: 1,
      campaign: 'Solar Tech Startup',
      amount: 5000,
      shares: 1000,
      date: '2023-06-15',
      status: 'completed',
      campaignStatus: 'live',
    },
    {
      id: 2,
      campaign: 'AI Healthcare',
      amount: 3500,
      shares: 700,
      date: '2023-05-20',
      status: 'completed',
      campaignStatus: 'live',
    },
    {
      id: 3,
      campaign: 'Eco Fashion',
      amount: 2000,
      shares: 500,
      date: '2023-04-10',
      status: 'pending',
      campaignStatus: 'closed',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Investments</h2>
          <div className="flex space-x-2">
            <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-sm">
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
            <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-sm">
              <option>Sort by Date</option>
              <option>Sort by Amount</option>
              <option>Sort by Campaign</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Shares
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Campaign Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {investments.map((investment) => (
                <tr key={investment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {investment.campaign}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${investment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {investment.shares.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {investment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        investment.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : investment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {investment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        investment.campaignStatus === 'live'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {investment.campaignStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {investment.status === 'completed' && (
                      <>
                        <button className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 mr-4">
                          View
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                          Certificate
                        </button>
                      </>
                    )}
                    {investment.status === 'pending' && (
                      <button className="text-green-600 hover:text-green-900 dark:hover:text-green-400">
                        Complete Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquityInvestments;
