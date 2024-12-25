import React from 'react';
import { FaHeart } from 'react-icons/fa';
import moment from 'moment';
import Pagination from '@/app/components/pagination/Pagination';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';

interface Donation {
  id: number;
  full_name: string | null;
  amount: string;
  date: string;
}

interface DonationListProps {
  donations: Donation[];
  fundraiserCurrency?: string;
}

const DonationList: React.FC<DonationListProps> = ({
  donations,
  fundraiserCurrency,
}) => {
  const { pagination, fetchPublicDonations } = useDonationsContext();

  // Handle page changes
  const handlePageChange = async (page: number) => {
    await fetchPublicDonations('campaignId', page, pagination.per_page);
  };

  return (
    <div className="space-y-8">
      {/* Donation List */}
      <div className="space-y-4">
        {donations.map((donation) => (
          <div
            key={donation.id}
            className="flex items-center justify-between border-b border-gray-200 py-4"
          >
            {/* Donor Info */}
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 h-10 w-10 flex items-center justify-center rounded-full">
                <FaHeart className="text-pink-500 text-lg" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {donation.full_name || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">
                  {moment(donation.date).format('MMM DD, YYYY, hh:mm:ss A')}
                </p>
              </div>
            </div>

            {/* Donation Amount */}
            <div className="text-right">
              <p className="text-sm font-bold text-green-600">
                {fundraiserCurrency}
                {parseFloat(donation.amount || '0.0').toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Thank you!</p>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default DonationList;
