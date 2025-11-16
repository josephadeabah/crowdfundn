import { BaseResponse, PaginationData } from '../clubTypes';
import {
  AccountResolutionResponse,
  BankListResponse,
  ClubTransfer,
  ClubTransfersResponse,
  CreateTransferRecipientResponse,
  InitiateTransferResponse,
  SettlementStatusResponse,
} from '../types/club.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Generic API call function
const apiCall = async (
  endpoint: string,
  token: string,
  options: RequestInit = {},
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return await response.json();
};

// Club Transfers API calls
export const clubTransferService = {
  // Get club transfers with pagination
  getClubTransfers: async (
    token: string,
    clubSlug: string,
    page: number = 1,
    perPage: number = 8,
  ): Promise<ClubTransfersResponse> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/fetch_club_transfers?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Fetch transfers from Paystack
  fetchTransfersFromPaystack: async (
    token: string,
    clubSlug: string,
  ): Promise<BaseResponse> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/fetch_transfers_from_paystack`;
    return apiCall(endpoint, token);
  },

  // Create transfer recipient
  createTransferRecipient: async (
    token: string,
    clubSlug: string,
  ): Promise<CreateTransferRecipientResponse> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/create_transfer_recipient`;
    return apiCall(endpoint, token, {
      method: 'POST',
    });
  },

  // Initialize transfer
  initiateTransfer: async (
    token: string,
    clubSlug: string,
    recipientCode: string,
    amount: number,
  ): Promise<InitiateTransferResponse> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/initialize_transfer`;
    return apiCall(endpoint, token, {
      method: 'POST',
      body: JSON.stringify({
        recipient_code: recipientCode,
        transfer_amount: amount,
      }),
    });
  },

  // Get bank list
  getBankList: async (
    token: string,
    clubSlug: string,
    country?: string,
    currency?: string,
  ): Promise<BankListResponse> => {
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (currency) params.append('currency', currency);

    const endpoint = `/investment_clubs/${clubSlug}/transfers/get_bank_list?${params.toString()}`;
    return apiCall(endpoint, token);
  },

  // Resolve account details
  resolveAccountDetails: async (
    token: string,
    clubSlug: string,
    accountNumber: string,
    bankCode: string,
  ): Promise<AccountResolutionResponse> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/resolve_account_details`;
    return apiCall(endpoint, token, {
      method: 'POST',
      body: JSON.stringify({
        account_number: accountNumber,
        bank_code: bankCode,
      }),
    });
  },

  // Get supported countries
  getSupportedCountries: async (
    token: string,
    clubSlug: string,
  ): Promise<any> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/get_supported_countries`;
    return apiCall(endpoint, token);
  },

  // Fetch settlement status
  fetchSettlementStatus: async (
    token: string,
    clubSlug: string,
  ): Promise<SettlementStatusResponse> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/fetch_settlement_status`;
    return apiCall(endpoint, token);
  },

  // Finalize transfer (OTP confirmation)
  finalizeTransfer: async (
    token: string,
    clubSlug: string,
    transferCode: string,
    otp: string,
  ): Promise<BaseResponse> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/finalize_transfer`;
    return apiCall(endpoint, token, {
      method: 'POST',
      body: JSON.stringify({
        transfer_code: transferCode,
        otp: otp,
      }),
    });
  },

  // Verify transfer
  verifyTransfer: async (
    token: string,
    clubSlug: string,
    reference: string,
  ): Promise<any> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/verify_transfer`;
    return apiCall(endpoint, token, {
      method: 'POST',
      body: JSON.stringify({ reference }),
    });
  },

  // Update transfer recipient
  updateTransferRecipient: async (
    token: string,
    clubSlug: string,
    recipientCode: string,
    updateData: {
      name?: string;
      email?: string;
    },
  ): Promise<BaseResponse> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/update_transfer_recipient`;
    return apiCall(endpoint, token, {
      method: 'PUT',
      body: JSON.stringify({
        recipient_code: recipientCode,
        ...updateData,
      }),
    });
  },

  // List transfer recipients
  listTransferRecipients: async (
    token: string,
    clubSlug: string,
    page: number = 1,
    perPage: number = 50,
  ): Promise<any> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/list_transfer_recipients?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Fetch transfer recipient details
  fetchTransferRecipient: async (
    token: string,
    clubSlug: string,
    recipientCode: string,
  ): Promise<any> => {
    const endpoint = `/investment_clubs/${clubSlug}/transfers/fetch_transfer_recipient`;
    return apiCall(endpoint, token, {
      method: 'POST',
      body: JSON.stringify({ recipient_code: recipientCode }),
    });
  },
};
