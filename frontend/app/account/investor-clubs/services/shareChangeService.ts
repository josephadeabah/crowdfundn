// app/account/investor-clubs/services/shareChangeService.ts

import { ShareChangesResponse } from '../clubTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

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

export const shareChangeService = {
  // Get all share changes for a club (admin only)
  getShareChanges: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<ShareChangesResponse> => {
    const endpoint = `/investment_clubs/${clubId}/share_changes?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },

  // Get my share changes
  getMyShareChanges: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<ShareChangesResponse> => {
    const endpoint = `/investment_clubs/${clubId}/share_changes/my_changes?page=${page}&per_page=${perPage}`;
    return apiCall(endpoint, token);
  },
};
