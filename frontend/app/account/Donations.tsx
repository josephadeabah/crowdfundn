'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import DonationsLoader from '../loaders/DonationsLoader';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../components/popover/Popover';
import { RadioGroup, RadioGroupItem } from '../components/radio/RadioGroup';
import { Checkbox } from '../components/checkbox/Checkbox';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Button } from '../components/button/Button';
import ErrorPage from '../components/errorpage/ErrorPage';
import Pagination from '../components/pagination/Pagination';
import { useAuth } from '../context/auth/AuthContext';
import { FaCheckCircle } from 'react-icons/fa';
import ToastComponent from '../components/toast/Toast';

export default function Donations() {
  const { donations, loading, error, fetchDonations, pagination } =
    useDonationsContext();
  const [filter, setFilter] = useState<'all' | 'specific'>('all');
  const [selectedDonors, setSelectedDonors] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const { token } = useAuth();

  // Toast State
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastDescription, setToastDescription] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>(
    'success',
  );

  const toggleDonorSelection = (id: number) => {
    if (filter === 'specific') {
      if (selectedDonors.includes(id)) {
        setSelectedDonors(selectedDonors.filter((donorId) => donorId !== id));
      } else {
        setSelectedDonors([...selectedDonors, id]);
      }
    }
  };

  const isThankYouButtonEnabled = filter === 'all' || selectedDonors.length > 0;

  // Fetch donations whenever the page changes
  useEffect(() => {
    fetchDonations(currentPage, perPage);
  }, [currentPage, perPage, fetchDonations]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSendThankYou = async (donationId: number) => {
    try {
      const donation = donations.find((d) => d.id === donationId);
      if (!donation) {
        throw new Error('Donation not found');
      }

      const campaignId =
        donation.campaign_id || donation.metadata?.campaign_metadata?.id;
      if (!campaignId) {
        throw new Error('Campaign ID not found');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/donations/send_thank_you_emails`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            campaign_id: campaignId,
            filter: 'specific',
            donor_ids: [donationId],
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send thank-you email');
      }

      // Show success toast
      setToastTitle('Success');
      setToastDescription('Thank-you email sent successfully!');
      setToastType('success');
      setToastOpen(true);
    } catch (error) {
      console.error('Error sending thank-you email:', error);

      // Show error toast
      setToastTitle('Error');
      setToastDescription('Failed to send thank-you email.');
      setToastType('error');
      setToastOpen(true);
    }
  };

  const handleSendThankYouEmails = async () => {
    try {
      // Get the selected donations
      const selectedDonations =
        filter === 'all'
          ? donations
          : donations.filter((donation) =>
              selectedDonors.includes(donation.id),
            );

      // Extract campaign IDs from the selected donations
      const campaignIds = selectedDonations.map(
        (donation) =>
          donation.campaign_id || donation.metadata?.campaign_metadata?.id,
      );

      // Check if all selected donations belong to the same campaign
      const uniqueCampaignIds = [...new Set(campaignIds)];
      if (uniqueCampaignIds.length > 1) {
        setToastTitle('Error');
        setToastDescription('Selected donations belong to multiple campaigns.');
        setToastType('error');
        setToastOpen(true);
        return;
      }

      const resolvedCampaignId = uniqueCampaignIds[0];
      if (!resolvedCampaignId) {
        setToastTitle('Error');
        setToastDescription('Campaign ID not found for selected donations.');
        setToastType('error');
        setToastOpen(true);
        return;
      }

      // Send thank-you emails
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/donations/send_thank_you_emails`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            campaign_id: resolvedCampaignId,
            filter: filter,
            donor_ids: filter === 'specific' ? selectedDonors : undefined,
          }),
        },
      );

      if (response.ok) {
        setToastTitle('Success');
        setToastDescription('Thank you emails sent successfully!');
        setToastType('success');
        setToastOpen(true);
      } else {
        const errorData = await response.json();
        setToastTitle('Error');
        setToastDescription('Failed to send thank you emails.');
        setToastType('error');
        setToastOpen(true);
      }
    } catch (error) {
      console.error('Error sending thank you emails:', error);
      setToastTitle('Error');
      setToastDescription('An error occurred while sending thank you emails.');
      setToastType('error');
      setToastOpen(true);
    }
  };

  if (loading) {
    return <DonationsLoader />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="px-2 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Donations
          <p className="text-gray-500 dark:text-neutral-400 text-xs font-medium">
            {' '}
            Send Thank You to your Donors{' '}
          </p>
        </h2>
        <Popover>
          <PopoverTrigger>
            <Button size="icon" variant="outline" className="rounded-full">
              <DotsVerticalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="p-4">
              <p className="mb-2 font-semibold">Filter Donors:</p>
              <RadioGroup
                className="flex flex-col gap-2"
                value={filter}
                onValueChange={(value) =>
                  setFilter(value as 'all' | 'specific')
                }
              >
                <label className="flex items-center space-x-2">
                  <RadioGroupItem value="all" />
                  <span>All</span>
                </label>
                <label className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" />
                  <span>Specific People</span>
                </label>
              </RadioGroup>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Check if donations is empty */}
      {donations.length === 0 ? (
        <div className="text-center text-lg text-gray-600 dark:text-neutral-400">
          You have not received any donations yet.
        </div>
      ) : (
        <>
          {/* Donation Table */}
          <div className="overflow-x-auto [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
            <table className="min-w-full bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <thead>
                <tr className="text-left bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white">
                  {filter === 'specific' && (
                    <th className="py-3 px-4">Select</th>
                  )}
                  <th className="py-3 px-4">Donor Name</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Campaign Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => {
                  const campaign = donation.metadata?.campaign_metadata || {};
                  return (
                    <DonationRow
                      key={donation.id}
                      id={donation.id}
                      donorName={donation.full_name || 'Anonymous'}
                      amount={parseFloat(donation.gross_amount)}
                      currency={campaign.currency || campaign.currency_symbol}
                      date={new Date(donation.created_at).toLocaleDateString()}
                      campaignTitle={campaign.title || 'No Title'}
                      status={donation.status}
                      filter={filter}
                      isSelected={selectedDonors.includes(donation.id)}
                      onToggle={() => toggleDonorSelection(donation.id)}
                      onSendThankYou={handleSendThankYou} // Pass the function
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Thank You Button */}
          <div className="mt-6">
            <Button
              onClick={handleSendThankYouEmails}
              disabled={!isThankYouButtonEnabled}
              className="w-full"
              variant="outline"
            >
              {filter === 'all' ? 'Send Thank You to All' : 'Send Thank You'}
            </Button>
          </div>
          {/* Pagination Controls */}
          {pagination.total_pages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Toast Component */}
      <ToastComponent
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        title={toastTitle}
        description={toastDescription}
        type={toastType}
      />
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
  filter: 'all' | 'specific';
  isSelected: boolean;
  onToggle: () => void;
  onSendThankYou: (donationId: number) => Promise<void>; // Add this prop
}

const DonationRow: React.FC<DonationRowProps> = ({
  id,
  donorName,
  amount,
  currency,
  date,
  campaignTitle,
  status,
  filter,
  isSelected,
  onToggle,
  onSendThankYou, // Pass the function to send thank-you emails
}) => {
  const [isSending, setIsSending] = useState(false); // Track loading state
  const [isSent, setIsSent] = useState(false); // Track success state

  const formattedCurrency = currency ? currency.toLocaleUpperCase() : '';
  const formattedAmount = amount.toFixed(2);

  const handleSendThankYou = async () => {
    setIsSending(true); // Set loading state
    try {
      await onSendThankYou(id); // Call the function to send the email
      setIsSent(true); // Set success state
      setTimeout(() => setIsSent(false), 2000); // Reset success state after 2 seconds
    } catch (error) {
      console.error('Error sending thank-you email:', error);
    } finally {
      setIsSending(false); // Reset loading state
    }
  };

  return (
    <tr className="border-b hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200">
      {filter === 'specific' && (
        <td className="py-3 px-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            className="h-5 w-5"
          />
        </td>
      )}
      <td className="py-3 px-4 text-gray-800 dark:text-white whitespace-nowrap">
        {donorName}
      </td>
      <td className="py-3 px-4 text-gray-600 dark:text-neutral-300 whitespace-nowrap">
        {formattedCurrency} {formattedAmount}
      </td>
      <td className="py-3 px-4 text-gray-500 dark:text-neutral-400 whitespace-nowrap">
        {date}
      </td>
      <td className="py-3 px-4 text-gray-500 dark:text-neutral-400 whitespace-nowrap">
        {campaignTitle || 'No Title'}
      </td>
      <td className="py-3 px-4 text-green-500 dark:text-green-400 whitespace-nowrap">
        {status}
      </td>
      <td className="py-3 px-4">
        <Button
          variant="outline"
          className="px-3 py-1 text-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-100 transition duration-200 flex items-center gap-2"
          onClick={handleSendThankYou} // Add onClick handler
          disabled={isSending || isSent} // Disable button while sending or after success
        >
          {isSending ? (
            'Sending...'
          ) : isSent ? (
            <>
              <FaCheckCircle className="text-green-500" /> Thank You
            </>
          ) : (
            'Say Thank You'
          )}
        </Button>
      </td>
    </tr>
  );
};
