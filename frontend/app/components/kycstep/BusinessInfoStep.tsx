// components/BusinessInfoStep.tsx
'use client';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { useKyc } from '@/app/context/kyc/KycContext';

// Common business industries
const BUSINESS_INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Entertainment',
  'Food & Beverage',
  'Transportation',
  'Energy',
  'Agriculture',
  'Other',
];

// Business types
const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company (LLC)',
  'Corporation',
  'Non-Profit Organization',
  'Other',
];

export const BusinessInfoStep: React.FC = () => {
  const form = useFormContext();
  const { errors: kycErrors } = useKyc();

  useEffect(() => {
    // Set field-specific errors from KYC context
    kycErrors.forEach((error) => {
      if (error.field) {
        form.setError(error.field as any, {
          type: 'server',
          message: error.message,
        });
      }
    });
  }, [kycErrors, form]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="businessName"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your business name"
                {...field}
                className={fieldState.error ? 'border-red-500' : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="businessType"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={fieldState.error ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessIndustry"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Business Industry</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={fieldState.error ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select business industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BUSINESS_INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="businessDescription"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Business Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your business, products, or services"
                className={`resize-none ${fieldState.error ? 'border-red-500' : ''}`}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Briefly explain what your business does.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="businessRegistration"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Business Registration Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter registration number"
                  {...field}
                  className={fieldState.error ? 'border-red-500' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taxId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Tax ID Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter tax ID number"
                  {...field}
                  className={fieldState.error ? 'border-red-500' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="businessEstablishedDate"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Business Established Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                value={
                  field.value instanceof Date
                    ? field.value.toISOString().split('T')[0]
                    : field.value
                }
                onChange={(e) => field.onChange(new Date(e.target.value))}
                className={fieldState.error ? 'border-red-500' : ''}
              />
            </FormControl>
            <FormDescription>
              When was your business officially established?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
