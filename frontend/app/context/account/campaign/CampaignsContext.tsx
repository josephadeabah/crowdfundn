import {
  CampaignResponseDataType,
  CampaignState,
  SingleCampaignResponseDataType,
  CampaignStatisticsDataType, // Add the type for statistics data
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
  const [currentCampaign, setCurrentCampaign] =
    useState<SingleCampaignResponseDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] =
    useState<CampaignStatisticsDataType | null>(null); // Add state for statistics
  const { token } = useAuth();
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

  const fetchCampaignStatistics = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await nextFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/statistics`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
  }, [token]);

  const fetchAllCampaigns = useCallback(
    async (
      sortBy: string = 'created_at',
      sortOrder: string = 'desc',
      page: number = 1,
      pageSize: number = 12,
      dateRange = 'all_time',
      goalRange = 'all',
      location = 'all',
      title = '',
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
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
          { method: 'GET' },
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
            body: JSON.stringify({ settings }),
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

  const contextValue = useMemo(
    () => ({
      campaigns,
      currentCampaign,
      loading,
      error,
      statistics, // Add statistics to context
      pagination,
      addCampaign,
      fetchCampaigns,
      fetchCampaignStatistics, // Add fetchStatistics to context
      fetchAllCampaigns,
      fetchCampaignById,
      deleteCampaign,
      editCampaign,
      cancelCampaign,
      updateCampaignSettings,
    }),
    [
      campaigns,
      currentCampaign,
      loading,
      error,
      statistics, // Include statistics in memoization
      pagination,
      addCampaign,
      fetchCampaigns,
      fetchCampaignStatistics, // Include fetchStatistics in memoization
      fetchAllCampaigns,
      fetchCampaignById,
      deleteCampaign,
      editCampaign,
      cancelCampaign,
      updateCampaignSettings,
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
