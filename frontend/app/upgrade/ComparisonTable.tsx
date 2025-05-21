import React from 'react';
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

const ComparisonTable = () => {
  const features = [
    {
      name: 'Communication Channels',
      starter: 'Email only',
      growth: 'Email & Google Hangout',
      pro: 'Email, Google Hangout & Customer Preferred',
    },
    {
      name: 'Response Time',
      starter: '1 day',
      growth: 'Within 5 hours',
      pro: 'Within 30 mins',
    },
    {
      name: 'Support Agents',
      starter: 'General staff',
      growth: 'Technical & Marketing experts',
      pro: 'Dedicated professionals',
    },
    {
      name: 'Marketing & Analytics Toolkit',
      starter: true,
      growth: true,
      pro: true,
    },
    {
      name: 'Influencer Marketing',
      starter: false,
      growth: false,
      pro: true,
    },
    {
      name: 'Campaign Strategy Review',
      starter: false,
      growth: true,
      pro: true,
    },
    {
      name: 'Priority Support',
      starter: false,
      growth: false,
      pro: true,
    },
  ];

  const renderCheck = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-bantu-purple mx-auto" />
      ) : (
        <X className="h-5 w-5 text-gray-400 mx-auto" />
      );
    }
    return value;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        Compare Support Plans
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>
            Comprehensive plan comparison for campaign support.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Feature</TableHead>
              <TableHead className="text-center">Starter ($15/mo)</TableHead>
              <TableHead className="text-center">Growth ($30/mo)</TableHead>
              <TableHead className="text-center">Pro+ ($75/mo)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.name}>
                <TableCell className="font-medium">{feature.name}</TableCell>
                <TableCell className="text-center">
                  {renderCheck(feature.starter)}
                </TableCell>
                <TableCell className="text-center">
                  {renderCheck(feature.growth)}
                </TableCell>
                <TableCell className="text-center">
                  {renderCheck(feature.pro)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ComparisonTable;
