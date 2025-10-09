'use client';
import React, { useEffect } from 'react';
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
import { usePremium } from '@/app/context/premium/PremiumContext';

const ComparisonTable = () => {
  const { plans, plansLoading, fetchPlans } = usePremium();

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  if (plansLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const features = [
    'Communication Channels',
    'Response Time',
    'Support Agents',
    'Marketing & Analytics Toolkit',
    'Influencer Marketing',
    'Campaign Strategy Review',
    'Priority Support',
    'Legal Support', // 👈 Added Legal Support feature
  ];

  const renderCheck = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-bantu-purple mx-auto" />
      ) : (
        <X className="h-5 w-5 text-gray-400 mx-auto" />
      );
    }
    return <span className="text-sm">{value}</span>;
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
              {plans.map((plan) => (
                <TableHead key={plan.id} className="text-center">
                  {plan.name} ({plan.currency} {plan.price}/{plan.interval})
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature}>
                <TableCell className="font-medium">{feature}</TableCell>
                {plans.map((plan) => (
                  <TableCell key={plan.id} className="text-center">
                    {renderCheck(plan.features[feature] || false)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ComparisonTable;