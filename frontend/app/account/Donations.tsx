import React, { useState, useEffect } from 'react';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import DonationsLoader from '../loaders/DonationsLoader';
import ErrorPage from '../components/errorpage/ErrorPage';
import { Button } from '../components/button/Button';

export default function Donations() {
  const { donations, loading, error, fetchDonations, pagination } =
    useDonationsContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // Fetch donations whenever the page changes
  useEffect(() => {
    fetchDonations(currentPage, perPage);
  }, [currentPage, perPage, fetchDonations]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.total_pages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <DonationsLoader />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Donations
        </h2>
      </div>

      {/* Donation Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <thead>
            <tr className="text-left bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white">
              <th className="py-3 px-4">Donor Name</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Campaign Title</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <DonationRow
                key={donation.id}
                id={donation.id}
                donorName={donation.full_name || 'Anonymous'}
                amount={parseFloat(donation.amount)}
                currency={
                  donation.metadata.campaign.currency ||
                  donation.metadata.campaign.currency_symbol
                }
                date={new Date(donation.created_at).toLocaleDateString()}
                campaignTitle={donation.metadata.campaign?.title || 'No Title'}
                status={donation.status}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <div className="text-gray-600">
          Page {currentPage} of {pagination.total_pages}
        </div>
        <Button
          disabled={currentPage === pagination.total_pages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

interface DonationRowProps {
  id: number;
  donorName: string;
  amount: number;
  currency: string | null;
  date: string;
  campaignTitle: string;
  status: string;
}

const DonationRow: React.FC<DonationRowProps> = ({
  id,
  donorName,
  amount,
  currency,
  date,
  campaignTitle,
  status,
}) => {
  return (
    <tr className="border-b hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200">
      <td className="py-3 px-4 text-gray-800 dark:text-white">{donorName}</td>
      <td className="py-3 px-4 text-gray-600 dark:text-neutral-300">
        {currency} {amount.toFixed(2)}
      </td>
      <td className="py-3 px-4 text-gray-500 dark:text-neutral-400">{date}</td>
      <td className="py-3 px-4 text-gray-500 dark:text-neutral-400">
        {campaignTitle}
      </td>
      <td className="py-3 px-4 text-green-500 dark:text-green-400">{status}</td>
      <td className="py-3 px-4">
        <Button variant="outline" className="px-3 py-1 text-sm rounded-full">
          Thank You
        </Button>
      </td>
    </tr>
  );
};
