import { Reward } from './campaigns.types';

// app/types/donations.types.ts
export interface Donation {
  id: string;
  amount: number;
  gross_amount: number;
  currency: string;
  currency_symbol: string;
  date: string;
  email: string;
  full_name: string;
  phone?: string;
  status: 'pending' | 'successful' | 'failed' | 'initialized';
  created_at: string;
  transaction_reference?: string;
  subscription_code?: string;
  user_id?: string;
  campaign_id: string;
  metadata?: Record<string, any>;
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_count: number;
}

export interface DonationsState {
  donations: Donation[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchDonations: (page?: number, perPage?: number) => Promise<void>;
  fetchPublicDonations: (
    campaignId: string,
    page?: number,
    perPage?: number,
  ) => Promise<void>;
  createDonationTransaction: (
    transactionData: DonationTransactionData,
  ) => Promise<void>;
  clearError: () => void;
}

export type BillingFrequency =
  | 'once'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export interface ShippingData {
  firstName: string;
  lastName: string;
  shippingAddress: string;
  entityType: string;
}

export interface DonationMetadata {
  shippingData?: ShippingData;
  selectedRewards?: Reward[];
  deliveryOption?: 'home' | 'pickup' | null;
  anonymousToken?: string;
}

export interface DonationTransactionData {
  email: string;
  fullName: string;
  phoneNumber: string;
  amount: number;
  campaignId: string;
  campaignTitle: string;
  billingFrequency: BillingFrequency | null;
  metadata?: DonationMetadata;
  anonymous: boolean;
}
