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
  const {
    fetchPortfolio,
    portfolio,
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
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleDownloadCertificate = async (investmentId: string) => {
    try {
      const status = await checkCertificateStatus(investmentId);
      if (status.exists && status.url) {
        await downloadCertificate(investmentId);
      } else {
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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!portfolio) {
    return <NoPortfolioData />;
  }

  console.log('Portfolio data:', portfolio); // Debugging line

  const parseNumber = (value: string | number | undefined, fallback = 0): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || fallback;
    return fallback;
  };

  const totalValue = parseNumber(portfolio.total_value);
  const totalInvested = parseNumber(portfolio.total_invested);
  const totalReturn = parseNumber(portfolio.total_return);
  const returnPercentage = parseNumber(portfolio.return_percentage);

  return (
    <div className="px-2 py-4">
      <Header />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PortfolioCard 
          title="Total Portfolio Value" 
          value={totalValue} 
          isPositive 
        />
        <PortfolioCard 
          title="Total Invested" 
          value={totalInvested} 
        />
        <PortfolioCard 
          title="Total Return" 
          value={totalReturn} 
          isPositive={totalReturn >= 0} 
          percentage={returnPercentage}
        />
      </div>

      <InvestmentsTable 
        investments={portfolio.investments}
        handleDownloadCertificate={handleDownloadCertificate}
        certificateLoading={certificateLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlaceholderChart />
        <RecentActivity investments={portfolio.investments} />
      </div>
    </div>
  );
};

// Sub-components for better organization
const LoadingSpinner = () => (
  <div className="px-2 py-4">
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  </div>
);

const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="px-2 py-4">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  </div>
);

const NoPortfolioData = () => (
  <div className="px-2 py-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <p className="text-gray-600 dark:text-gray-300">
        No portfolio data available
      </p>
    </div>
  </div>
);

const Header = () => (
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
);

const PortfolioCard = ({ 
  title, 
  value, 
  isPositive, 
  percentage 
}: {
  title: string;
  value: number;
  isPositive?: boolean;
  percentage?: number;
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h3 className="text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
    <p className={`text-3xl font-bold ${
      isPositive ? 'text-green-600 dark:text-green-400' : 
      (isPositive === false ? 'text-red-600 dark:text-red-400' : '')
    }`}>
      ${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      {percentage !== undefined && ` (${percentage.toFixed(2)}%)`}
    </p>
  </div>
);

const InvestmentsTable = ({
  investments,
  handleDownloadCertificate,
  certificateLoading
}: {
  investments: EquityInvestment[];
  handleDownloadCertificate: (id: string) => Promise<void>;
  certificateLoading: boolean;
}) => {
  const parseNumber = (value: string | number | undefined, fallback = 0): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || fallback;
    return fallback;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
      <div className="px-2 py-4">
        <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
        {investments?.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              You haven't made any investments yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              {/* Table headers */}
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
              {/* Table body */}
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {investments?.map((investment) => {
                  const investmentAmount = parseNumber(investment.amount);
                  const currentValue = parseNumber(investment.current_value, investmentAmount);
                  const investmentReturn = currentValue - investmentAmount;
                  const returnPct = investmentAmount > 0 
                    ? (investmentReturn / investmentAmount) * 100 
                    : 0;

                  return (
                    <tr key={investment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {investment.campaign?.title || `Campaign ${investment.campaign_id}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${investmentAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {parseNumber(investment.shares).toLocaleString()} (
                        {parseNumber(investment.percentage).toFixed(2)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${currentValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        investmentReturn >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        ${investmentReturn.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} ({returnPct.toFixed(2)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={investment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/campaign/${investment.campaign?.slug || investment.campaign_id}`}>
                          <button className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 mr-4">
                            View
                          </button>
                        </Link>
                        {investment.certificate_exists && (
                          <button
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                            onClick={() => handleDownloadCertificate(investment.id.toString())}
                            disabled={certificateLoading}
                          >
                            {certificateLoading ? 'Loading...' : 'Certificate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusClasses = {
    successful: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      statusClasses[status as keyof typeof statusClasses] || statusClasses.pending
    }`}>
      {status}
    </span>
  );
};

const PlaceholderChart = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Performance Chart</h3>
    <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">
        Chart visualization would appear here
      </p>
    </div>
  </div>
);

const RecentActivity = ({ investments }: { investments: EquityInvestment[] }) => {
  const parseNumber = (value: string | number | undefined, fallback = 0): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || fallback;
    return fallback;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {investments?.slice(0, 3).map((investment) => (
          <div key={investment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Invested ${parseNumber(investment.amount).toLocaleString()} in{' '}
              {investment.campaign?.title || `Campaign ${investment.campaign_id}`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {format(new Date(investment.created_at), 'MMM dd, yyyy')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquityInvestments;