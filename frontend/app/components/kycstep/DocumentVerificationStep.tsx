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
import { Input } from '@/app/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';

export const DocumentVerificationStep: React.FC = () => {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="idType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="passport" id="passport" />
                  <label htmlFor="passport">Passport</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="national-id" id="national-id" />
                  <label htmlFor="national-id">National ID</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="drivers-license"
                    id="drivers-license"
                  />
                  <label htmlFor="drivers-license">Driver's License</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="idNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter your ID number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="idDocument"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload ID Document</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*,.pdf" {...field} />
            </FormControl>
            <FormDescription>
              Upload a clear photo or scan of your ID document
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="proofOfAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Proof of Address</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*,.pdf" {...field} />
            </FormControl>
            <FormDescription>
              Upload a utility bill, bank statement, or other proof of address
              (not older than 3 months)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
