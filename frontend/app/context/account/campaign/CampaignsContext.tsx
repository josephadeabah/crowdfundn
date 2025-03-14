import {
  CampaignResponseDataType,
  CampaignState,
  SingleCampaignResponseDataType,
  CampaignStatisticsDataType,
  CampaignShareType, // Add the type for statistics data
} from '@/app/types/campaigns.types';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../../auth/AuthContext';

const CampaignContext = createContext<CampaignState | undefined>(undefined);

// Custom wrapper for Next.js fetch
const nextFetch = async (
  url: string,
  options: RequestInit & { cache?: RequestCache } = {},
) => {
  return fetch(url, { ...options, next: { revalidate: 10 } });
};

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<CampaignResponseDataType[]>([]);
  const [campaignShares, setCampaignShares] =
    useState<CampaignShareType | null>(null); // Or a more complex structure if needed
  const [currentCampaign, setCurrentCampaign] =
    useState<SingleCampaignResponseDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] =
    useState<CampaignStatisticsDataType | null>(null); // Add state for statistics
  const { token, user } = useAuth();
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
  }>({
    currentPage: 1,
    totalPages: 1,
  });

  const handleApiError = (errorText: string) => {
    setError(errorText);
  };

  const cancelCampaign = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${id}/cancel`,
          {
            method: 'PATCH', // Assuming the cancel endpoint requires a POST request
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store', // No caching for cancel action
          },
        );

        if (!response.ok) {
          handleApiError('Failed to cancel the campaign. Please try again.');
          return;
        }

        // Optional: Update the state to reflect the campaign cancellation
        setCampaigns((prevCampaigns) =>
          prevCampaigns.filter((campaign) => campaign.id !== Number(id)),
        );

        const updatedCampaign = await response.json();
        setCurrentCampaign((current) =>
          current && current.id === Number(id) ? updatedCampaign : current,
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error canceling the campaign',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const addCampaign = useCallback(
    async (campaign: FormData) => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: campaign,
          },
        );

        if (!response.ok) {
          handleApiError("Couldn't create campaign. Please try again.");
          return;
        }

        const createdCampaign = await response.json();
        setCampaigns((prevRewards) => [...prevRewards, createdCampaign]);
        return createdCampaign;
      } catch (err) {
        setError('Error creating campaign');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const fetchCampaigns = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await nextFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/my_campaigns`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        handleApiError("Couldn't fetch campaigns. Please refresh the page.");
        return;
      }

      const fetchedCampaigns = await response.json();
      setCampaigns(fetchedCampaigns?.campaigns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCampaignStatistics = useCallback(
    async (month?: number, year?: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        // Construct the URL with optional month and year query parameters
        let url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/statistics`;
        if (month !== undefined && year !== undefined) {
          url += `?month=${month}&year=${year}`;
        }

        const response = await nextFetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          handleApiError("Couldn't fetch statistics. Please try again.");
          return;
        }

        const stats = await response.json();
        setStatistics(stats); // Store statistics in state
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error fetching statistics',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const fetchAllCampaigns = useCallback(
    async (
      sortBy: string = 'created_at',
      sortOrder: string = 'desc',
      page: number = 1,
      pageSize: number = 20,
      dateRange = 'all_time',
      goalRange = 'all',
      location = 'all',
      title = '',
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Check if user is authenticated
        if (user) {
          headers.Authorization = `Bearer ${token}`;
        }

        const queryParams = new URLSearchParams({
          sortBy,
          sortOrder,
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        // Add the new parameters to the query string if they're provided
        if (dateRange) queryParams.append('dateRange', dateRange);
        if (goalRange) queryParams.append('goalRange', goalRange);
        if (location) queryParams.append('location', location);
        if (title) queryParams.append('title', title);

        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns?${queryParams.toString()}`,
          { method: 'GET', headers },
        );

        if (!response.ok) {
          handleApiError("Couldn't fetch campaigns. Please refresh the page.");
          return;
        }

        const allCampaigns = await response.json();

        // Update the campaigns and pagination data
        setCampaigns(allCampaigns?.campaigns);
        setPagination({
          currentPage: allCampaigns?.current_page || 1,
          totalPages: allCampaigns?.total_pages || 1,
        });
      } catch (err) {
        setError('Error fetching campaigns. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const fetchCampaignById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${id}`,
          { method: 'GET' },
        );

        if (!response.ok) {
          handleApiError('Failed to fetch campaign. Please try again.');
          return null;
        }

        const fetchedCampaign = await response.json();
        setCurrentCampaign(fetchedCampaign);
        return fetchedCampaign;
      } catch (err) {
        setError('Error fetching campaign. Please refresh the page.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const deleteCampaign = useCallback(
    async (id: string) => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${id}/`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store', // No caching for DELETE
          },
        );

        if (!response.ok) {
          handleApiError('Failed to delete campaign. Please try again.');
          return;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error deleting campaign',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const editCampaign = useCallback(
    async (
      id: string | string[] | undefined,
      updatedCampaignData: FormData,
    ) => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: updatedCampaignData,
            cache: 'no-store', // No caching for PUT
          },
        );

        if (!response.ok) {
          handleApiError('Failed to update campaign. Please try again.');
          return;
        }

        const updatedCampaign = await response.json();

        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === Number(id) ? updatedCampaign : campaign,
          ),
        );
        setCurrentCampaign(updatedCampaign);
        return updatedCampaign;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error editing campaign');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Add the updateCampaignSettings method
  const updateCampaignSettings = useCallback(
    async (campaignId: string, settings: Record<string, any>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ campaign: settings }),
          },
        );

        if (!response.ok) {
          handleApiError(
            'Failed to update campaign settings. Please try again.',
          );
          return;
        }

        const updatedCampaign = await response.json();

        // Update the current campaign in state
        setCurrentCampaign((current) =>
          current && current.id === Number(campaignId)
            ? updatedCampaign
            : current,
        );

        // Update the campaigns list if needed
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === Number(campaignId) ? updatedCampaign : campaign,
          ),
        );

        return updatedCampaign;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error updating campaign settings',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const favoriteCampaign = useCallback(
    async (campaignId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/favorite`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          handleApiError('Failed to favorite the campaign. Please try again.');
          return;
        }

        // Update the current campaign's favorited status
        setCurrentCampaign((current) =>
          current && current.id === Number(campaignId)
            ? { ...current, favorited: true }
            : current,
        );

        // Update the campaigns list if needed
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === Number(campaignId)
              ? { ...campaign, favorited: true }
              : campaign,
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error favoriting the campaign',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const unfavoriteCampaign = useCallback(
    async (campaignId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/unfavorite`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          handleApiError(
            'Failed to unfavorite the campaign. Please try again.',
          );
          return;
        }

        // Update the current campaign's favorited status
        setCurrentCampaign((current) =>
          current && current.id === Number(campaignId)
            ? { ...current, favorited: false }
            : current,
        );

        // Update the campaigns list if needed
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === Number(campaignId)
              ? { ...campaign, favorited: false }
              : campaign,
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error unfavoriting the campaign',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // In your CampaignContext file
  const fetchFavoritedCampaigns = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/favorites`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch favorited campaigns');
      }

      const data = await response.json();
      setCampaigns(data?.campaigns);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error fetching favorited campaigns',
      );
      return;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const shareCampaign = useCallback(
    async (campaignId?: string) => {
      setLoading(true);
      setError(null);
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        // Include the token in the headers only if it is available
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/campaign_shares`,
          {
            method: 'POST',
            headers: headers,
          },
        );

        if (!response.ok) {
          handleApiError(
            "Couldn't record the campaign share. Please try again.",
          );
          return;
        }
        // Update the campaign share count or state if needed
        const updatedShares = await response.json();
        setCampaignShares(updatedShares);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error sharing campaign');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const contextValue = useMemo(
    () => ({
      campaigns,
      currentCampaign,
      loading,
      error,
      statistics,
      pagination,
      campaignShares,
      addCampaign,
      fetchCampaigns,
      fetchCampaignStatistics,
      fetchAllCampaigns,
      fetchCampaignById,
      deleteCampaign,
      editCampaign,
      cancelCampaign,
      shareCampaign,
      updateCampaignSettings,
      favoriteCampaign, // Add favoriteCampaign to context
      unfavoriteCampaign, // Add unfavoriteCampaign to context
      fetchFavoritedCampaigns, // Add fetchFavoritedCampaigns to context
    }),
    [
      campaigns,
      currentCampaign,
      loading,
      error,
      statistics,
      pagination,
      campaignShares,
      addCampaign,
      fetchCampaigns,
      fetchCampaignStatistics,
      fetchAllCampaigns,
      fetchCampaignById,
      deleteCampaign,
      editCampaign,
      cancelCampaign,
      shareCampaign,
      updateCampaignSettings,
      favoriteCampaign, // Include favoriteCampaign in memoization
      unfavoriteCampaign, // Include unfavoriteCampaign in memoization
      fetchFavoritedCampaigns, // Include fetchFavoritedCampaigns in memoization
    ],
  );

  return (
    <CampaignContext.Provider value={contextValue}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error(
      'useCampaignContext must be used within a CampaignProvider',
    );
  }
  return context;
};
