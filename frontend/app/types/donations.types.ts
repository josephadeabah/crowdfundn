import { SingleCampaignResponseDataType } from './campaigns.types';

export interface Pagination {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_count: number;
}
// Refactored Donation interface
export interface Donation {
  id: number; // Donation ID
  amount: string;
  campaign_id: number;
  user_id: number | null;
  full_name: string;
  email: string;
  phone: string;
  date: string;
  transaction_reference: string;
  status: 'successful';
  transaction_status: string;
  gross_amount: string;
  net_amount: number;
  created_at: string;
  updated_at: string;
  metadata: {
    session_token: string;
    custom_data: string;
    campaign: SingleCampaignResponseDataType;
  };
  donation: {
    message: string;
    status: 'successful'; // Donation status as a fixed string
    amount: string; // Amount as string (if received as a string, otherwise change to number)
    campaign_id: number; // Campaign ID that the donation is for
    id: number; // Donation ID (duplicate, may be removed if redundant)
    user_id: number | null; // User ID who made the donation, nullable
    transaction_reference: string; // Unique reference for the transaction
    total_donations: number; // Total donations received
    metadata: {
      custom_data: string; // Additional custom data for the donation
    };
    created_at: string; // Donation creation timestamp
    updated_at: string; // Donation last updated timestamp
  };
  campaign: SingleCampaignResponseDataType; // Campaign details associated with the donation
  reference: string; // Reference string (either `reference` or `trxref`)
}

export interface DonationsState {
  donations: Donation[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  createDonationTransaction: (
    email: string,
    fullName: string,
    phoneNumber: string,
    amount: number,
    campaignId: string,
    campaignTitle: string,
    billingFrequency: string,
  ) => Promise<void>;
  fetchDonations: (currentPage: number, perPage: number) => Promise<void>;
  fetchPublicDonations: (
    campaignId: string,
    currentPage: number,
    perPage: number,
  ) => Promise<void>;
}
