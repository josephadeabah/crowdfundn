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
                <SelectItem value="sole_proprietorship">
                  Sole Proprietorship
                </SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="llc">
                  Limited Liability Company (LLC)
                </SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
                <SelectItem value="nonprofit">
                  Non-Profit Organization
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
  );
};
