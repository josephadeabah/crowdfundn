import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
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

  const fetchCampaigns = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Mock API call - replace this with your actual API call
      const response = await fetch('/api/campaigns'); // Replace with your actual endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();
      setCampaigns(data.campaigns); // Assuming response contains a `campaigns` field
    } catch (err: any) {
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({ campaigns, loading, error, fetchCampaigns }),
    [campaigns, loading, error],
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
