import {
  CampaignResponseDataType,
  ExtendedCampaignState,
  SingleCampaignResponseDataType,
  CampaignStatisticsDataType,
  CampaignShareType,
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

const CampaignContext = createContext<ExtendedCampaignState | undefined>(
  undefined,
);

// Custom wrapper for Next.js fetch
const nextFetch = async (
  url: string,
  options: RequestInit & { cache?: RequestCache } = {},
) => {
  return fetch(url, { ...options, next: { revalidate: 10 } });
};

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<CampaignResponseDataType[]>([]);
  const [userCampaigns, setUserCampaigns] = useState<
    CampaignResponseDataType[] | null
  >(null);
  const [campaignShares, setCampaignShares] =
    useState<CampaignShareType | null>(null);
  const [currentCampaign, setCurrentCampaign] =
    useState<SingleCampaignResponseDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] =
    useState<CampaignStatisticsDataType | null>(null);
  const { token, user } = useAuth();
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
  }>({
    currentPage: 1,
    totalPages: 1,
  });
  const [favoritedCampaigns, setFavoritedCampaigns] = useState<
    CampaignResponseDataType[]
  >([]);
  const [archivedCampaigns, setArchivedCampaigns] = useState<
    CampaignResponseDataType[]
  >([]);

  const resetCurrentCampaign = useCallback(() => {
    setCurrentCampaign(null);
    setLoading(true);
  }, []);

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
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
          },
        );

        if (!response.ok) {
          handleApiError('Failed to cancel the campaign. Please try again.');
          return;
        }

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

  // Fetch campaigns for the logged-in user
  const fetchUserCampaigns = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/my_campaigns`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        },
      );

      if (!response.ok) throw new Error("Couldn't fetch user campaigns");

      const { campaigns } = await response.json();
      setUserCampaigns(campaigns || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error fetching user campaigns',
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch archived campaigns for the logged-in user
  const fetchArchivedCampaigns = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/archived_campaigns`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Couldn't fetch archived campaigns");

      const data = await response.json();
      setArchivedCampaigns(data.archived_campaigns || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error fetching archived campaigns',
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Archive a campaign
  // Archive a campaign
  const archiveCampaign = useCallback(
    async (campaignId: string, reason?: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/archive`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reason }),
          },
        );

        if (!response.ok) throw new Error('Failed to archive campaign');

        const data = await response.json();

        // Update campaigns list - properly type the return value
        setCampaigns(
          (prevCampaigns) =>
            prevCampaigns.map((campaign) =>
              campaign.id === Number(campaignId)
                ? {
                    ...campaign,
                    archived_by_current_user: true,
                    archive_info: data.campaign.archive_info,
                    is_public: false,
                    appear_in_search_results: false,
                  }
                : campaign,
            ) as CampaignResponseDataType[],
        );

        // Update current campaign if it's the one being archived
        setCurrentCampaign((current) => {
          if (current && current.id === Number(campaignId)) {
            return {
              ...current,
              archived_by_current_user: true,
              archive_info: data.campaign.archive_info,
              is_public: false,
              appear_in_search_results: false,
            } as SingleCampaignResponseDataType;
          }
          return current;
        });

        // Remove from user campaigns
        setUserCampaigns(
          (prev) => prev?.filter((c) => c.id !== Number(campaignId)) || null,
        );

        // Refresh archived campaigns list
        await fetchArchivedCampaigns();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error archiving campaign',
        );
      } finally {
        setLoading(false);
      }
    },
    [token, fetchArchivedCampaigns],
  );

  // Unarchive a campaign
  const unarchiveCampaign = useCallback(
    async (campaignId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/archive`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error('Failed to unarchive campaign');

        const data = await response.json();

        // Update campaigns list - properly type the return value
        setCampaigns(
          (prevCampaigns) =>
            prevCampaigns.map((campaign) =>
              campaign.id === Number(campaignId)
                ? {
                    ...campaign,
                    archived_by_current_user: false,
                    archive_info: null,
                    is_public: true,
                    appear_in_search_results: true,
                  }
                : campaign,
            ) as CampaignResponseDataType[],
        );

        // Update current campaign if it's the one being unarchived
        setCurrentCampaign((current) => {
          if (current && current.id === Number(campaignId)) {
            return {
              ...current,
              archived_by_current_user: false,
              archive_info: null,
              is_public: true,
              appear_in_search_results: true,
            } as SingleCampaignResponseDataType;
          }
          return current;
        });

        // Remove from archived campaigns list
        setArchivedCampaigns((prev) =>
          prev.filter((campaign) => campaign.id !== Number(campaignId)),
        );

        // Refresh user campaigns
        await fetchUserCampaigns();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error unarchiving campaign',
        );
      } finally {
        setLoading(false);
      }
    },
    [token, fetchUserCampaigns],
  );

  const fetchCampaignStatistics = useCallback(
    async (month?: number, year?: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
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
        setStatistics(stats);
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
        const queryParams = new URLSearchParams({
          sortBy,
          sortOrder,
          page: page.toString(),
          pageSize: pageSize.toString(),
          dateRange,
          goalRange,
          location,
          title,
        });

        const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns?${queryParams.toString()}`;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

        if (user) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers,
          mode: 'cors',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allCampaigns = await response.json();
        setCampaigns(allCampaigns?.campaigns || []);
        setPagination({
          currentPage: allCampaigns?.current_page || 1,
          totalPages: allCampaigns?.total_pages || 1,
        });
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error fetching campaigns. Please refresh the page.',
        );
      } finally {
        setLoading(false);
      }
    },
    [token, user],
  );

  const fetchCampaignById = useCallback(
    async (identifier: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${identifier}`,
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
            cache: 'no-store',
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
            cache: 'no-store',
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

        setCurrentCampaign((current) =>
          current && current.id === Number(campaignId)
            ? updatedCampaign
            : current,
        );

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
      const campaignsWithFavoriteFlag =
        data?.campaigns?.map((campaign: CampaignResponseDataType) => ({
          ...campaign,
          favorited: true,
        })) || [];

      setFavoritedCampaigns(campaignsWithFavoriteFlag);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error fetching favorited campaigns',
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const favoriteCampaign = useCallback(
    async (campaignId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/favorite`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error('Failed to favorite campaign');

        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === Number(campaignId)
              ? { ...campaign, favorited: true }
              : campaign,
          ),
        );

        setCurrentCampaign((current) =>
          current && current.id === Number(campaignId)
            ? { ...current, favorited: true }
            : current,
        );

        setFavoritedCampaigns((prev) => {
          const campaignToAdd = campaigns.find(
            (c) => c.id === Number(campaignId),
          );
          return campaignToAdd
            ? [...prev, { ...campaignToAdd, favorited: true }]
            : prev;
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error favoriting campaign',
        );
      } finally {
        setLoading(false);
      }
    },
    [token, campaigns],
  );

  const unfavoriteCampaign = useCallback(
    async (campaignId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/unfavorite`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error('Failed to unfavorite campaign');

        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === Number(campaignId)
              ? { ...campaign, favorited: false }
              : campaign,
          ),
        );

        setCurrentCampaign((current) =>
          current && current.id === Number(campaignId)
            ? { ...current, favorited: false }
            : current,
        );

        setFavoritedCampaigns((prev) =>
          prev.filter((c) => c.id !== Number(campaignId)),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error unfavoriting campaign',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const shareCampaign = useCallback(
    async (campaignId?: string) => {
      setLoading(true);
      setError(null);
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
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
      userCampaigns,
      currentCampaign,
      loading,
      error,
      statistics,
      pagination,
      campaignShares,
      favoritedCampaigns,
      archivedCampaigns,
      addCampaign,
      fetchUserCampaigns,
      fetchCampaignStatistics,
      fetchAllCampaigns,
      fetchCampaignById,
      deleteCampaign,
      editCampaign,
      cancelCampaign,
      shareCampaign,
      updateCampaignSettings,
      favoriteCampaign,
      unfavoriteCampaign,
      fetchFavoritedCampaigns,
      fetchArchivedCampaigns,
      archiveCampaign,
      unarchiveCampaign,
      resetCurrentCampaign,
    }),
    [
      campaigns,
      userCampaigns,
      currentCampaign,
      favoritedCampaigns,
      archivedCampaigns,
      loading,
      error,
      statistics,
      pagination,
      campaignShares,
      addCampaign,
      fetchUserCampaigns,
      fetchCampaignStatistics,
      fetchAllCampaigns,
      fetchCampaignById,
      deleteCampaign,
      editCampaign,
      cancelCampaign,
      shareCampaign,
      updateCampaignSettings,
      favoriteCampaign,
      unfavoriteCampaign,
      fetchFavoritedCampaigns,
      fetchArchivedCampaigns,
      archiveCampaign,
      unarchiveCampaign,
      resetCurrentCampaign,
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
