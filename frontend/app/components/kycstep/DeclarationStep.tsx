// components/DeclarationStep.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/app/components/ui/form';
import { Checkbox } from '@/app/components/ui/checkbox';

export const DeclarationStep: React.FC = () => {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">
          Important Declarations
        </h3>
        <p className="text-yellow-700 text-sm">
          Please read and acknowledge the following statements before
          proceeding.
        </p>
      </div>

      <FormField
        control={form.control}
        name="accreditedInvestor"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>I am an accredited investor (optional)</FormLabel>
              <FormDescription>
                Check this box if you meet the criteria for an accredited
                investor as defined by securities regulations.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="riskAcknowledgment"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Risk Acknowledgment *</FormLabel>
              <FormDescription>
                I understand that all investments carry risk, including the
                potential loss of principal. I acknowledge that past performance
                does not guarantee future results.
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="termsAcceptance"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Terms and Conditions *</FormLabel>
              <FormDescription>
                I have read, understood, and agree to the Terms of Service and
                Privacy Policy.
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dataConsent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Data Processing Consent *</FormLabel>
              <FormDescription>
                I consent to the processing of my personal data for verification
                and compliance purposes.
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
