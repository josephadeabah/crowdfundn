import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import moment from 'moment';
import Pagination from '@/app/components/pagination/Pagination';
import { Investment } from '@/app/types/equityCampaigns.types';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';

interface InvestmentListProps {
  currencySymbol?: string;
  campaignId: string;
}

const InvestmentList: React.FC<InvestmentListProps> = ({
  currencySymbol = 'GHS',
  campaignId,
}) => {
  const { fetchPublicInvestments } = useEquityCampaignContext();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    per_page: 10,
    total_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvestments = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublicInvestments(
        campaignId,
        page,
        pagination.per_page,
      );
      setInvestments(data.investments);
      setPagination(data.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load investments',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments(1);
  }, [campaignId]);

  const handlePageChange = (page: number) => {
    loadInvestments(page);
  };

  if (loading && investments.length === 0) {
    return <div className="text-center py-8">Loading investments...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error}
        <button
          onClick={() => loadInvestments(1)}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Investments</h3>

      {investments.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {investments.map((investment, index) => (
            <div
              key={`${investment.investor_name}-${index}`}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 dark:bg-gray-600 h-10 w-10 flex items-center justify-center rounded-full">
                  <FaUser className="text-blue-500 text-lg" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {investment.investor_name || 'Anonymous Investor'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {moment(investment.date).format('MMM D, YYYY [at] h:mm A')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 dark:text-blue-400">
                  {currencySymbol}
                  {investment.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                {investment.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                    {investment.email}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No investments yet</p>
        </div>
      )}

      {pagination.total_pages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default InvestmentList;
