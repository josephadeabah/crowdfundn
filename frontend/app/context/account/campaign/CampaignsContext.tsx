import {
  CampaignResponseDataType,
  CampaignState,
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

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<CampaignResponseDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const addCampaign = useCallback(
    async (campaign: FormData) => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
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
          const errorText = await response.text();
          throw new Error(`Failed to create campaign: ${errorText}`);
        }

        const createdCampaign = await response.json();
        setError(null);
        return createdCampaign;
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'Error creating campaign');
        } else {
          setError('Unknown error occurred while creating campaign');
        }
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
      const response = await fetch(
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
        const errorText = await response.text();
        throw new Error(`Failed to fetch campaigns: ${errorText}`);
      }

      const fetchedCampaigns = await response.json();
      setCampaigns(fetchedCampaigns);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCampaignById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch campaign: ${errorText}`);
        }

        const fetchedCampaign = await response.json();
        return fetchedCampaign;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Error fetching campaign by ID');
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${id}/`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete campaign: ${errorText}`);
        }

        setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Error deleting campaign');
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${id}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: updatedCampaignData,
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to edit campaign: ${errorText}`);
        }

        const updatedCampaign = await response.json();
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === Number(id) ? updatedCampaign : campaign,
          ),
        );
        setError(null);
        return updatedCampaign;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Error editing campaign');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const contextValue = useMemo(
    () => ({
      campaigns,
      loading,
      error,
      addCampaign,
      fetchCampaigns,
      fetchCampaignById, // Add the fetchCampaignById function
      deleteCampaign,
      editCampaign,
    }),
    [
      campaigns,
      loading,
      error,
      addCampaign,
      fetchCampaigns,
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
