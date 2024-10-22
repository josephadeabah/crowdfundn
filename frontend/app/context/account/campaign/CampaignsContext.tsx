import { CampaignDataType, CampaignResponseDataType, CampaignState } from '@/app/types/campaigns.types';
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

  const addCampaign = useCallback(async (campaign: CampaignDataType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(campaign),
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }
  
      const createdCampaign = await response.json();
      return createdCampaign;
    } catch (err: any) {
      setError(err.message || 'Error creating campaign');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCampaigns = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
    
      const createdCampaign = await response.json();
      setCampaigns(createdCampaign);
    } catch (err: any) {
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({ campaigns, loading, error, addCampaign, fetchCampaigns }),
    [campaigns, loading, error, addCampaign, fetchCampaigns]
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
    throw new Error('useCampaignContext must be used within a CampaignProvider');
  }
  return context;
};
