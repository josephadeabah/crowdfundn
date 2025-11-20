// components/campaigns/InvestmentList.tsx
'use client';
import React, { useEffect } from 'react';
import { FaChartLine, FaUsers } from 'react-icons/fa';
import moment from 'moment';
import Pagination from '@/app/components/pagination/Pagination';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';
import CommentLoader from '@/app/loaders/CommentLoader';
import { Investment } from '@/app/types/equityCampaigns.types'; // Import the type

interface InvestmentListProps {
  currencySymbol?: string;
  campaignId: string;
}

const InvestmentList: React.FC<InvestmentListProps> = ({
  currencySymbol = 'GHS',
  campaignId,
}) => {
  const { pagination, investments, loading, fetchPublicInvestments } =
    useEquityCampaignContext();

  // Initial load
  useEffect(() => {
    fetchPublicInvestments(campaignId, 1, 10);
  }, [campaignId]);

  // Handle page changes
  const handlePageChange = async (page: number) => {
    await fetchPublicInvestments(campaignId, page, pagination?.per_page || 10);
  };

  // FIXED: Use proper typing for investment parameter
  const getInvestmentIcon = (investment: Investment) => {
    if (investment.investment_type === 'club') {
      return <FaUsers className="text-blue-500 text-lg" />;
    }
    return <FaChartLine className="text-orange-500 text-lg" />;
  };

  // FIXED: Use proper typing for investment parameter
  const getInvestmentBadge = (investment: Investment) => {
    if (investment.investment_type === 'club') {
      return (
        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          Club
        </span>
      );
    }
    return null;
  };

  // Show loader while loading
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <CommentLoader key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Investment List */}
      <div className="space-y-4">
        {investments.length > 0 ? (
          investments.map((investment, index) => (
            <div
              key={`${investment.investor_name}-${investment.date}-${index}`}
              className="flex items-center justify-between border-b border-gray-200 py-4"
            >
              {/* Investor Info */}
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 h-10 w-10 flex items-center justify-center rounded-full">
                  {getInvestmentIcon(investment)}
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {investment.investor_name}
                    </p>
                    {getInvestmentBadge(investment)}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {moment(investment.date).format('MMM DD, YYYY, hh:mm:ss A')}
                  </p>
                  {/* Show club info if available */}
                  {investment.club_info && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {investment.club_info.name}
                    </p>
                  )}
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
                  {investment.investment_type === 'club' 
                    ? 'Club Investment' 
                    : 'Thank you for investing!'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No investors yet. Be the first to invest!
          </p>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="mt-6">
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