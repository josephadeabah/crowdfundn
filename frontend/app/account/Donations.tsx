import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../components/popover/Popover';
import { RadioGroup, RadioGroupItem } from '../components/radio/RadioGroup';
import { Checkbox } from '../components/checkbox/Checkbox';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Button } from '../components/button/Button';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import DonationsLoader from '../loaders/DonationsLoader';
import { Donation } from '../types/donations.types';

export default function Donations() {
  const { donations, loading, error, fetchDonations } = useDonationsContext();
  const [filter, setFilter] = useState<'all' | 'specific'>('all');
  const [selectedDonors, setSelectedDonors] = useState<number[]>([]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

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

  if (loading) {
    return <DonationsLoader />;
  }

  return (
    <div className="container mx-auto p-4">
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

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <thead>
            <tr className="text-left bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white">
              {filter === 'specific' && <th className="py-3 px-4">Select</th>}
              <th className="py-3 px-4">Donor Name</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Campaign Title</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation: Donation) => (
              <DonationRow
                key={donation.id}
                id={donation.id}
                donorName={donation.full_name || 'Anonymous'}
                amount={parseFloat(donation.amount)}
                date={new Date(donation.created_at).toLocaleDateString()}
                campaignTitle={donation.metadata.campaign?.title || 'No Title'}
                currency={
                  donation?.metadata?.campaign.currency ||
                  donation?.metadata?.campaign.currency_symbol
                }
                status={donation.status}
                filter={filter}
                isSelected={selectedDonors.includes(donation.id)}
                onToggle={() => toggleDonorSelection(donation.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Thank You Button */}
      <div className="mt-4">
        <Button
          onClick={() => console.log('Sending Thank You emails')}
          disabled={!isThankYouButtonEnabled}
          className="w-full"
        >
          {filter === 'all' ? 'Send Thank You to All' : 'Send Thank You'}
        </Button>
      </div>
    </div>
  );
}

// Donation Row Component for reusability
const DonationRow = ({
  id,
  donorName,
  amount,
  date,
  campaignTitle,
  currency,
  status,
  filter,
  isSelected,
  onToggle,
}: {
  id: number;
  donorName: string;
  amount: number;
  date: string;
  campaignTitle: string;
  currency: string | null;
  status: string;
  filter: 'all' | 'specific';
  isSelected: boolean;
  onToggle: () => void;
}) => {
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
      <td className="py-3 px-4 text-gray-800 dark:text-white">{donorName}</td>
      <td className="py-3 px-4 text-gray-600 dark:text-neutral-300">
        {currency?.toLocaleUpperCase()} {amount.toFixed(2)}
      </td>
      <td className="py-3 px-4 text-gray-500 dark:text-neutral-400">{date}</td>
      <td className="py-3 px-4 text-gray-500 dark:text-neutral-400">
        {campaignTitle}
      </td>
      <td className="py-3 px-4 text-green-500 dark:text-green-400">{status}</td>
      <td className="py-3 px-4">
        <Button
          variant="outline"
          className="px-3 py-1 text-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-100 transition duration-200"
        >
          Thank You
        </Button>
      </td>
    </tr>
  );
};
