import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
}

interface CampaignState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: () => void;
}

const CampaignContext = createContext<CampaignState | undefined>(undefined);

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();
      // Only set the first three campaigns
      setCampaigns(data.slice(0, 2));
    } catch (err: any) {
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const contextValue = useMemo(
    () => ({ campaigns, loading, error, fetchCampaigns }),
    [campaigns, loading, error, fetchCampaigns],
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
