'use client';
import React, { useEffect } from 'react';
import { FaChartLine } from 'react-icons/fa';
import moment from 'moment';
import Pagination from '@/app/components/pagination/Pagination';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';

interface InvestmentListProps {
  currencySymbol?: string;
  campaignId: string;
}

const InvestmentList: React.FC<InvestmentListProps> = ({
  currencySymbol = 'GHS',
  campaignId,
}) => {
  const { pagination, investments, fetchPublicInvestments } =
    useEquityCampaignContext();

  // Initial load
  useEffect(() => {
    fetchPublicInvestments(campaignId, 1, 10);
  }, [campaignId]);

  // Handle page changes
  const handlePageChange = async (page: number) => {
    await fetchPublicInvestments(campaignId, page, pagination?.per_page || 10);
  };

  return (
    <div className="space-y-8">
      {/* Investment List */}
      <div className="space-y-4">
        {investments.length > 0 ? (
          investments.map((investment) => (
            <div
              key={investment.investor_name}
              className="flex items-center justify-between border-b border-gray-200 py-4"
            >
              {/* Investor Info */}
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 h-10 w-10 flex items-center justify-center rounded-full">
                  <FaChartLine className="text-orange-500 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {investment.investor_name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {moment(investment.date).format('MMM DD, YYYY, hh:mm:ss A')}
                  </p>
                </div>
              </div>

              {/* Investment Amount */}
              <div className="text-right">
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {currencySymbol}
                  {parseFloat(
                    investment.amount.toString() || '0.0',
                  ).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Thank you for investing!
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No investors yet. Be the first to invest!
          </p>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default InvestmentList;
