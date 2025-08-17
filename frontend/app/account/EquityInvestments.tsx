// app/account/EquityInvestments.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { useEquityCampaignContext } from '../context/account/campaign/EquityCampaignContext';
import { useAuth } from '../context/auth/AuthContext';
import {
  EquityInvestment,
  InvestmentPortfolio,
} from '../types/equityCampaigns.types';

const EquityInvestments = () => {
  const [activeView, setActiveView] = useState<'portfolio' | 'my_investments'>(
    'portfolio',
  );
  const {
    fetchPortfolio,
    fetchMyInvestments,
    portfolio,
    investments,
    loading,
    error,
    generateCertificate,
    downloadCertificate,
    checkCertificateStatus,
    certificateLoading,
    certificateError,
  } = useEquityCampaignContext();
  const { user } = useAuth();

  useEffect(() => {
    if (activeView === 'portfolio') {
      fetchPortfolio();
    } else {
      fetchMyInvestments();
    }
  }, [activeView, fetchPortfolio, fetchMyInvestments]);

  const handleDownloadCertificate = async (investmentId: string) => {
    try {
      // First check if certificate exists
      const status = await checkCertificateStatus(investmentId);
      if (status.exists && status.url) {
        await downloadCertificate(investmentId);
      } else {
        // If certificate doesn't exist, generate it first
        const genResult = await generateCertificate(investmentId);
        if (genResult.success && genResult.url) {
          await downloadCertificate(investmentId);
        }
      }
    } catch (err) {
      console.error('Error downloading certificate:', err);
    }
  };

  if (loading) {
    return (
      <div className="px-2 py-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-2 py-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Equity Investments
        </h1>
        <div className="flex space-x-4">
          <Link href="/invest">
            <Button
              variant="outline"
              className="text-gray-700 rounded-full shadow-sm"
            >
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

      {activeView === 'portfolio' ? (
        <PortfolioView
          portfolio={portfolio}
          user={user}
          onDownloadCertificate={handleDownloadCertificate}
          certificateLoading={certificateLoading}
        />
      ) : (
        <MyInvestmentsView
          investments={investments}
          onDownloadCertificate={handleDownloadCertificate}
          certificateLoading={certificateLoading}
        />
      )}
    </div>
  );
};

interface PortfolioViewProps {
  portfolio: InvestmentPortfolio | null;
  user: any;
  onDownloadCertificate: (investmentId: string) => Promise<void>;
  certificateLoading: boolean;
}

const PortfolioView = ({
  portfolio,
  user,
  onDownloadCertificate,
  certificateLoading,
}: PortfolioViewProps) => {
  if (!portfolio) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300">
          No portfolio data available
        </p>
      </div>
    );
  }

  // Calculate totals if not provided by API
  const totalValue =
    portfolio?.total_value ||
    portfolio?.investments?.reduce(
      (sum, inv) => sum + (inv.current_value || inv.amount),
      0,
    ) ||
    0;

  const totalInvested =
    portfolio?.total_invested ||
    portfolio?.investments?.reduce((sum, inv) => sum + inv.amount, 0) ||
    0;

  const totalReturn = totalValue - totalInvested;
  const returnPercentage =
    totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">
            Total Portfolio Value
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">
            Total Invested
          </h3>
          <p className="text-3xl font-bold">
            ${totalInvested.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">
            Total Return
          </h3>
          <p
            className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            ${totalReturn.toLocaleString()} ({returnPercentage.toFixed(2)}%)
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
                {portfolio?.investments?.map((investment) => {
                  const investmentReturn =
                    (investment.current_value || investment.amount) -
                    investment.amount;
                  const returnPercentage =
                    investment.amount > 0
                      ? (investmentReturn / investment.amount) * 100
                      : 0;

                  return (
                    <tr key={investment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {investment.campaign?.title || investment.campaign_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${investment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {investment.shares?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        $
                        {(
                          investment.current_value || investment.amount
                        ).toLocaleString()}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${investmentReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                      >
                        ${investmentReturn.toLocaleString()} (
                        {returnPercentage.toFixed(2)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${investment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                        >
                          {investment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/campaign/${investment.campaign?.slug || investment.campaign_id}`}
                        >
                          <button className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 mr-4">
                            View
                          </button>
                        </Link>
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                          onClick={() =>
                            onDownloadCertificate(investment.id.toString())
                          }
                          disabled={certificateLoading}
                        >
                          {certificateLoading ? 'Loading...' : 'Certificate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
            {portfolio?.investments?.slice(0, 3).map((investment) => (
              <div
                key={investment.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invested ${investment.amount} in{' '}
                  {investment.campaign?.title || investment.campaign_id}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {format(new Date(investment.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MyInvestmentsViewProps {
  investments: EquityInvestment[];
  onDownloadCertificate: (investmentId: string) => Promise<void>;
  certificateLoading: boolean;
}

const MyInvestmentsView = ({
  investments,
  onDownloadCertificate,
  certificateLoading,
}: MyInvestmentsViewProps) => {
  if (!investments || investments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300">
          You haven't made any investments yet
        </p>
      </div>
    );
  }

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
                      {investment.campaign?.title || investment.campaign_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${investment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {investment.shares?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(investment.created_at), 'MMM dd, yyyy')}
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
                        investment.campaign?.status === 'live'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {investment.campaign?.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {investment.status === 'completed' && (
                      <>
                        <Link
                          href={`/campaign/${investment.campaign?.slug || investment.campaign_id}`}
                        >
                          <button className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 mr-4">
                            View
                          </button>
                        </Link>
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                          onClick={() =>
                            onDownloadCertificate(investment.id.toString())
                          }
                          disabled={certificateLoading}
                        >
                          {certificateLoading ? 'Loading...' : 'Certificate'}
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
