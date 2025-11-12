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

// Helper function to validate and sanitize share change data
const sanitizeShareChange = (change: any) => {
  return {
    ...change,
    id: change.id?.toString() || `temp-${Date.now()}-${Math.random()}`,
    previous_share: change.previous_share ? Number(change.previous_share) : 0,
    new_share: change.new_share ? Number(change.new_share) : 0,
    change_amount: change.change_amount ? Number(change.change_amount) : 0,
    change_percentage: change.change_percentage
      ? Number(change.change_percentage)
      : 0,
    total_contributions_at_time: change.total_contributions_at_time
      ? Number(change.total_contributions_at_time)
      : 0,
    change_reason: change.change_reason || 'recalculation',
    created_at: change.created_at || new Date().toISOString(),
    updated_at: change.updated_at || new Date().toISOString(),
    contribution: change.contribution
      ? {
          id: change.contribution.id?.toString(),
          amount: change.contribution.amount
            ? Number(change.contribution.amount)
            : 0,
          currency: change.contribution.currency || 'GHS',
          created_at:
            change.contribution.created_at || new Date().toISOString(),
        }
      : undefined,
    membership: change.membership || {
      id: 'unknown',
      user: {
        id: 'unknown',
        full_name: 'Unknown User',
      },
      club: {
        id: 'unknown',
        name: 'Unknown Club',
        slug: 'unknown',
      },
    },
  };
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
    const response = await apiCall(endpoint, token);

    // Sanitize the response data
    return {
      share_changes: response.share_changes?.map(sanitizeShareChange) || [],
      pagination: response.pagination || {
        current_page: page,
        total_pages: 1,
        per_page: perPage,
        total_count: 0,
      },
      summary: response.summary || null,
    };
  },

  // Get my share changes
  getMyShareChanges: async (
    token: string,
    clubId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<ShareChangesResponse> => {
    const endpoint = `/investment_clubs/${clubId}/share_changes/my_changes?page=${page}&per_page=${perPage}`;
    const response = await apiCall(endpoint, token);

    // Sanitize the response data
    return {
      share_changes: response.share_changes?.map(sanitizeShareChange) || [],
      pagination: response.pagination || {
        current_page: page,
        total_pages: 1,
        per_page: perPage,
        total_count: 0,
      },
      summary: response.summary || null,
    };
  },
};
