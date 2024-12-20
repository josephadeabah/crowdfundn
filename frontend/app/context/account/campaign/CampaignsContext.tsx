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

  const handleApiError = (errorText: string) => {
    setError(errorText);
  };

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

  const fetchAllCampaigns = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await nextFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns`,
        { method: 'GET' },
      );

      if (!response.ok) {
        handleApiError("Couldn't fetch campaigns. Please refresh the page.");
        return;
      }

      const allCampaigns = await response.json();
      setCampaigns(allCampaigns?.campaigns);
    } catch (err) {
      setError('Error fetching campaigns. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [token]);

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

  const contextValue = useMemo(
    () => ({
      campaigns,
      currentCampaign,
      loading,
      error,
      statistics, // Add statistics to context
      addCampaign,
      fetchCampaigns,
      fetchCampaignStatistics, // Add fetchStatistics to context
      fetchAllCampaigns,
      fetchCampaignById,
      deleteCampaign,
      editCampaign,
    }),
    [
      campaigns,
      currentCampaign,
      loading,
      error,
      statistics, // Include statistics in memoization
      addCampaign,
      fetchCampaigns,
      fetchCampaignStatistics, // Include fetchStatistics in memoization
      fetchAllCampaigns,
      fetchCampaignById,
      deleteCampaign,
      editCampaign,
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
