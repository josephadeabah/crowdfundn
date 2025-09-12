'use client';
import React, { useState, useEffect } from 'react';
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
import { EquityInvestment } from '../types/equityCampaigns.types';
import { Badge } from '../components/ui/badge';

interface InvestmentResponse {
  investments: EquityInvestment[];
  pagination: {
    current_page: number;
    total_pages: number;
    per_page: number;
    total_count: number;
  };
}

// Status color mapping
const STATUS_COLORS = {
  successful: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800',
  processing: 'bg-purple-100 text-purple-800',
  default: 'bg-gray-100 text-gray-800',
};

const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  return (
    STATUS_COLORS[normalizedStatus as keyof typeof STATUS_COLORS] ||
    STATUS_COLORS.default
  );
};

export default function Donations() {
  const { donations, loading, error, fetchDonations, pagination } =
    useDonationsContext();
  const [filter, setFilter] = useState<'all' | 'specific'>('all');
  const [selectedBackers, setSelectedBackers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [backerType, setBackerType] = useState<
    'donation' | 'equity_investment'
  >('donation');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [investments, setInvestments] = useState<EquityInvestment[]>([]);
  const [investmentsPagination, setInvestmentsPagination] = useState({
    current_page: 1,
    total_pages: 1,
    per_page: 10,
    total_count: 0,
  });
  const [investmentsLoading, setInvestmentsLoading] = useState(false);
  const { token } = useAuth();

  // Toast State
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastDescription, setToastDescription] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>(
    'success',
  );

  const toggleBackerSelection = (backerId: string) => {
    if (filter === 'specific') {
      if (selectedBackers.includes(backerId)) {
        setSelectedBackers(selectedBackers.filter((id) => id !== backerId));
      } else {
        setSelectedBackers([...selectedBackers, backerId]);
      }
    }
  };

  const isThankYouButtonEnabled =
    filter === 'all' || selectedBackers.length > 0;

  // Fetch data whenever the page, type, or status filter changes
  useEffect(() => {
    if (backerType === 'donation') {
      fetchDonations(currentPage, perPage);
    } else {
      fetchInvestments(currentPage, perPage);
    }
  }, [currentPage, perPage, backerType, fetchDonations]);

  const fetchInvestments = async (page: number = 1, perPage: number = 10) => {
    if (!token) {
      handleApiError('You need to log in to access investments.');
      return;
    }

    setInvestmentsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_investments/my_investments?page=${page}&per_page=${perPage}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        handleApiError(errorText);
        return;
      }

      const data: InvestmentResponse = await response.json();
      setInvestments(data.investments || []);
      setInvestmentsPagination(
        data.pagination || {
          current_page: 1,
          total_pages: 1,
          per_page: 10,
          total_count: 0,
        },
      );
    } catch (err) {
      handleApiError('Error fetching investments. Please try again later.');
    } finally {
      setInvestmentsLoading(false);
    }
  };

  const handleApiError = (errorText: string) => {
    setToastTitle('Error');
    setToastDescription(errorText);
    setToastType('error');
    setToastOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedBackers([]);
  };

  const handleSendThankYou = async (backerId: string) => {
    try {
      const [type, id] = backerId.split('_');
      const numericId = parseInt(id);

      let email: string;
      let fullName: string;
      let amount: number;
      let campaignTitle: string;
      let currency: string;

      if (type === 'donation') {
        const donation = donations.find((d) => Number(d.id) === numericId);
        if (!donation) {
          throw new Error('Donation not found');
        }
        email = donation.email;
        fullName = donation.full_name || 'Anonymous';
        amount = parseFloat(donation.gross_amount.toString());
        campaignTitle =
          donation.metadata?.campaign_metadata?.title || 'Unknown Campaign';
        currency = donation.metadata?.campaign_metadata?.currency || 'GHS';
      } else {
        const investment = investments.find((i) => i.id === numericId);
        if (!investment) {
          throw new Error('Investment not found');
        }
        email = investment.email;
        fullName = investment.full_name || 'Anonymous';
        amount = parseFloat(investment.amount.toString());
        campaignTitle = investment.campaign?.title || 'Unknown Campaign';
        currency =
          investment.campaign?.currency ||
          investment.campaign?.currency_symbol ||
          investment.currency ||
          investment.currency_symbol ||
          'GHS';
      }

      // Only send thank you for successful transactions
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/send_thank_you_email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            full_name: fullName,
            amount,
            campaign_title: campaignTitle,
            currency,
            type,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send thank-you email');
      }

      setToastTitle('Success');
      setToastDescription('Thank-you email sent successfully!');
      setToastType('success');
      setToastOpen(true);
    } catch (error) {
      console.error('Error sending thank-you email:', error);
      setToastTitle('Error');
      setToastDescription('Failed to send thank-you email.');
      setToastType('error');
      setToastOpen(true);
    }
  };

  const handleSendThankYouEmails = async () => {
    try {
      const backersToEmail: Array<{
        email: string;
        full_name: string;
        amount: number;
        campaign_title: string;
        currency: string;
        type: 'donation' | 'equity_investment';
      }> = [];

      if (filter === 'all') {
        // Add all successful donations
        donations.forEach((donation) => {
          if (donation.status === 'successful') {
            backersToEmail.push({
              email: donation.email,
              full_name: donation.full_name || 'Anonymous',
              amount: parseFloat(donation.gross_amount.toString()),
              campaign_title:
                donation.metadata?.campaign_metadata?.title ||
                'Unknown Campaign',
              currency: donation.metadata?.campaign_metadata?.currency || 'GHS',
              type: 'donation',
            });
          }
        });

        // Add all successful investments
        investments.forEach((investment) => {
          if (investment.status === 'successful') {
            backersToEmail.push({
              email: investment.email,
              full_name: investment.full_name || 'Anonymous',
              amount: parseFloat(investment.amount.toString()),
              campaign_title: investment.campaign?.title || 'Unknown Campaign',
              currency:
                investment.campaign?.currency ||
                investment.campaign?.currency_symbol ||
                investment.currency ||
                investment.currency_symbol ||
                'GHS',
              type: 'equity_investment',
            });
          }
        });
      } else {
        // Add selected backers (only successful ones)
        selectedBackers.forEach((backerId) => {
          const [type, id] = backerId.split('_');
          const numericId = parseInt(id);

          if (type === 'donation') {
            const donation = donations.find((d) => Number(d.id) === numericId);
            if (donation && donation.status === 'successful') {
              backersToEmail.push({
                email: donation.email,
                full_name: donation.full_name || 'Anonymous',
                amount: parseFloat(donation.gross_amount.toString()),
                campaign_title:
                  donation.metadata?.campaign_metadata?.title ||
                  'Unknown Campaign',
                currency:
                  donation.metadata?.campaign_metadata?.currency || 'GHS',
                type: 'donation',
              });
            }
          } else {
            const investment = investments.find((i) => i.id === numericId);
            if (investment && investment.status === 'successful') {
              backersToEmail.push({
                email: investment.email,
                full_name: investment.full_name || 'Anonymous',
                amount: parseFloat(investment.amount.toString()),
                campaign_title:
                  investment.campaign?.title || 'Unknown Campaign',
                currency:
                  investment.campaign?.currency ||
                  investment.campaign?.currency_symbol ||
                  investment.currency ||
                  investment.currency_symbol ||
                  'GHS',
                type: 'equity_investment',
              });
            }
          }
        });
      }

      if (backersToEmail.length === 0) {
        setToastTitle('Warning');
        setToastDescription(
          'No successful transactions to send thank you emails to.',
        );
        setToastType('warning');
        setToastOpen(true);
        return;
      }

      // Send bulk thank you emails
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/send_bulk_thank_you_emails`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ backers: backersToEmail }),
        },
      );

      if (response.ok) {
        setToastTitle('Success');
        setToastDescription('Thank you emails sent successfully!');
        setToastType('success');
        setToastOpen(true);
        setSelectedBackers([]);
      } else {
        const errorData = await response.json();
        setToastTitle('Error');
        setToastDescription(
          errorData.error || 'Failed to send thank you emails.',
        );
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

  const currentPagination =
    backerType === 'donation' ? pagination : investmentsPagination;
  const totalItems =
    backerType === 'donation' ? donations.length : investments.length;
  const isLoading = loading || investmentsLoading;

  if (isLoading) {
    return <DonationsLoader />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="px-2 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Backer List
          <p className="text-gray-500 text-xs font-medium">
            Send Thank You to your Backers
          </p>
        </h2>
        <div className="flex gap-2">
          <select
            value={backerType}
            onChange={(e) => {
              setBackerType(e.target.value as 'donation' | 'equity_investment');
              setCurrentPage(1);
              setSelectedBackers([]);
            }}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="donation">Donations</option>
            <option value="equity_investment">Investments</option>
          </select>

          {backerType === 'donation' && (
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
                setSelectedBackers([]);
              }}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
              <option value="processing">Processing</option>
            </select>
          )}

          <Popover>
            <PopoverTrigger>
              <Button size="icon" variant="outline" className="rounded-full">
                <DotsVerticalIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <div className="p-4">
                <p className="mb-2 font-semibold">Filter Backers:</p>
                <RadioGroup
                  className="flex flex-col gap-2"
                  value={filter}
                  onValueChange={(value) => {
                    setFilter(value as 'all' | 'specific');
                    setSelectedBackers([]);
                  }}
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
      </div>

      {totalItems === 0 ? (
        <div className="text-center text-lg text-gray-600">
          You have not received any{' '}
          {backerType === 'donation' ? 'donations' : 'investments'} yet.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="text-left bg-gray-200 text-gray-800">
                  {filter === 'specific' && (
                    <th className="py-3 px-4">Select</th>
                  )}
                  <th className="py-3 px-4">Backer Name</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Campaign Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {backerType === 'donation'
                  ? donations.map((donation) => {
                      const campaign =
                        donation.metadata?.campaign_metadata || {};
                      const backerId = `donation_${donation.id}`;
                      const canSendThankYou = donation.status === 'successful';

                      return (
                        <BackerRow
                          key={backerId}
                          backerId={backerId}
                          type="donation"
                          backerName={donation.full_name || 'Anonymous'}
                          amount={parseFloat(donation.gross_amount.toString())}
                          currency={
                            campaign.currency ||
                            campaign.currency_symbol ||
                            'GHS'
                          }
                          date={new Date(
                            donation.created_at,
                          ).toLocaleDateString()}
                          campaignTitle={campaign.title || 'No Title'}
                          status={donation.status}
                          filter={filter}
                          isSelected={selectedBackers.includes(backerId)}
                          onToggle={() => toggleBackerSelection(backerId)}
                          onSendThankYou={handleSendThankYou}
                          canSendThankYou={canSendThankYou}
                        />
                      );
                    })
                  : investments.map((investment) => {
                      const campaign = investment.campaign || {};
                      const backerId = `investment_${investment.id}`;
                      const canSendThankYou =
                        investment.status === 'successful';

                      return (
                        <BackerRow
                          key={backerId}
                          backerId={backerId}
                          type="equity_investment"
                          backerName={investment.full_name || 'Anonymous'}
                          amount={parseFloat(investment.amount.toString())}
                          currency={
                            campaign.currency ||
                            campaign.currency_symbol ||
                            investment.currency ||
                            investment.currency_symbol ||
                            'GHS'
                          }
                          date={new Date(
                            investment.created_at,
                          ).toLocaleDateString()}
                          campaignTitle={campaign.title || 'No Title'}
                          status={investment.status}
                          filter={filter}
                          isSelected={selectedBackers.includes(backerId)}
                          onToggle={() => toggleBackerSelection(backerId)}
                          onSendThankYou={handleSendThankYou}
                          canSendThankYou={canSendThankYou}
                        />
                      );
                    })}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleSendThankYouEmails}
              disabled={!isThankYouButtonEnabled}
              className="w-full"
              variant="outline"
            >
              {filter === 'all'
                ? `Send Thank You to All Successful ${backerType === 'donation' ? 'Donations' : 'Investments'}`
                : 'Send Thank You to Selected'}
            </Button>
          </div>
          {currentPagination.total_pages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={currentPagination.total_pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

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

interface BackerRowProps {
  backerId: string;
  type: 'donation' | 'equity_investment';
  backerName: string;
  amount: number;
  currency: string;
  date: string;
  campaignTitle: string;
  status: string;
  filter: 'all' | 'specific';
  isSelected: boolean;
  onToggle: () => void;
  onSendThankYou: (backerId: string) => Promise<void>;
  canSendThankYou: boolean;
}

const BackerRow: React.FC<BackerRowProps> = ({
  backerId,
  type,
  backerName,
  amount,
  currency,
  date,
  campaignTitle,
  status,
  filter,
  isSelected,
  onToggle,
  onSendThankYou,
  canSendThankYou,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const formattedCurrency = currency ? currency.toLocaleUpperCase() : '';
  const formattedAmount = amount.toFixed(2);

  // Truncate campaign title to prevent horizontal scrolling
  const truncatedTitle =
    campaignTitle.length > 30
      ? `${campaignTitle.substring(0, 30)}...`
      : campaignTitle;

  const handleSendThankYou = async () => {
    if (!canSendThankYou) return;

    setIsSending(true);
    try {
      await onSendThankYou(backerId);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 2000);
    } catch (error) {
      console.error('Error sending thank-you email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <tr className="border-b hover:bg-gray-100 transition-colors duration-200">
      {filter === 'specific' && (
        <td className="py-3 px-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            className="h-5 w-5"
            disabled={!canSendThankYou}
          />
        </td>
      )}
      <td className="py-3 px-4 text-gray-800 whitespace-nowrap">
        {backerName}
      </td>
      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
        {formattedCurrency} {formattedAmount}
      </td>
      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{date}</td>
      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
        <span
          className="cursor-help"
          title={campaignTitle.length > 20 ? campaignTitle : undefined}
        >
          {truncatedTitle}
        </span>
      </td>
      <td className="py-3 px-4 text-blue-500 whitespace-nowrap">
        {type === 'donation' ? 'Donation' : 'Investment'}
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <Button
          variant="outline"
          className="px-3 py-1 text-sm rounded-full hover:bg-gray-100 transition duration-200 flex items-center gap-2"
          onClick={handleSendThankYou}
          disabled={isSending || isSent || !canSendThankYou}
        >
          {isSending ? (
            'Sending...'
          ) : isSent ? (
            <>
              <FaCheckCircle className="text-green-500" /> Thank You
            </>
          ) : canSendThankYou ? (
            'Say Thank You'
          ) : (
            'Not Available'
          )}
        </Button>
      </td>
    </tr>
  );
};
