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
import { useAuth } from '@/app/context/auth/AuthContext';
import Link from 'next/link';

export const DeclarationStep: React.FC = () => {
  const form = useFormContext();
  const { user } = useAuth();

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

      {/* Optional field - no validation */}
      <FormField
        control={form.control}
        name="accreditedInvestor"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value || false} // Ensure it's always a boolean
                onCheckedChange={(checked) => {
                  field.onChange(checked === true); // Convert to boolean
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I am an accredited investor (optional: Check this box if you
                meet the criteria for an accredited investor as defined by
                securities regulations.)
              </FormLabel>
              <FormDescription>
                I, {user?.full_name}, hereby declare that: I am a qualified
                investor because I am a (a) government, or an institution which
                performs the functions of a central bank, or a multilateral
                agency; (b) authorised, approved or licensed securities
                exchange; (c) licensed market operator, or any other person
                carrying on the business of providing investment services and
                regulated under the law of any foreign jurisdiction; (d)
                authorized or licensed financial institution, or any bank which
                is not an authorized or licensed institution but is regulated
                under the law of any foreign jurisdiction; (e) insurer licensed
                under the Insurance Act 2006 (Act 724), or any other person
                carrying on insurance business and regulated under the law of
                any foreign jurisdiction; (f) licensed unit trust, mutual fund
                or other licensed collective investment scheme, and any
                authorised collective investment scheme regulated under the law
                of any foreign jurisdiction; (g) individual, either alone or
                with any of his associates on a joint account, having proven
                liquid assets of not less than 500,000 Ghana cedis or its
                equivalent in any foreign currency; (h) company or partnership
                having proven liquid assets of not less than 5 million Ghana
                cedis or its equivalent in any foreign currency; (i) person
                declared by the Commission to be a qualified investor; and (j)
                similarly, defined investor in any other securities legislation
                of any foreign jurisdiction. (Delete that which does not apply)
                and that I recognise that: some the protections afforded to
                clients by the Securities Industry (Conduct of Business)
                Guidelines 2020 will not apply; and I may be advised to engage
                in transactions that may not be regarded as suitable for the
                generality of investment clients.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {/* Optional Nominee Agreement */}
      <FormField
        control={form.control}
        name="nomineeAgreement"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value || false}
                onCheckedChange={(checked) => {
                  field.onChange(checked === true);
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I have read, and that I agree and accept the Nominee Agreement
                (optional)
              </FormLabel>
              <FormDescription>
                I acknowledge that I have read and understood the{' '}
                <Link
                  href="/info/nominee_agreement"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Nominee Agreement
                </Link>{' '}
                which governs how BantuHive Crowdfunding Nominee Ltd. will hold
                legal title to my securities while I retain beneficial
                ownership.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {/* Required fields with validation */}
      <FormField
        control={form.control}
        name="riskAcknowledgment"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked === true);
                }}
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
                onCheckedChange={(checked) => {
                  field.onChange(checked === true);
                }}
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
                onCheckedChange={(checked) => {
                  field.onChange(checked === true);
                }}
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
