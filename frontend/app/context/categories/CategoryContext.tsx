import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';

interface CategoryState {
  campaignsGroupedByCategory: Record<string, CampaignResponseDataType[]>;
  loading: boolean;
  error: string | null;
  fetchGroupedCampaigns: () => void;
}

const CategoryContext = createContext<CategoryState | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [campaignsGroupedByCategory, setCampaignsGroupedByCategory] = useState<
    Record<string, CampaignResponseDataType[]>
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupedCampaigns = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/group_by_category`,
      ); // Replace with actual grouped campaigns API
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      const data = await response.json();
      console.log('Fetched campaigns data:', data); // Debugging: log the data
      setCampaignsGroupedByCategory(data.grouped_campaigns);
    } catch (err: any) {
      console.error('Error fetching campaigns:', err); // Debugging: log the error
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      campaignsGroupedByCategory,
      loading,
      error,
      fetchGroupedCampaigns,
    }),
    [campaignsGroupedByCategory, loading, error],
  );

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      'useCategoryContext must be used within a CategoryProvider',
    );
  }
  return context;
};
