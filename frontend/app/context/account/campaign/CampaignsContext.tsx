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
        console.log('createdCampaign', createdCampaign);
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
    } catch (err: any) {
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({ campaigns, loading, error, addCampaign, fetchCampaigns }),
    [campaigns, loading, error, addCampaign, fetchCampaigns],
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
