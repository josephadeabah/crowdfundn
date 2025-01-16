import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';

interface CategoryState {
  campaignsGroupedByCategory: Record<
    string,
    {
      campaigns: CampaignResponseDataType[];
      current_page: number;
      total_pages: number;
    }
  >;
  loading: boolean;
  error: string | null;
  fetchGroupedCampaigns: (page?: number, pageSize?: number) => void;
  fetchCampaignsForCategory: (category: string, page: number) => void;
}

const CategoryContext = createContext<CategoryState | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [campaignsGroupedByCategory, setCampaignsGroupedByCategory] = useState<
    Record<
      string,
      {
        campaigns: CampaignResponseDataType[];
        current_page: number;
        total_pages: number;
      }
    >
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupedCampaigns = async (
    page = 1,
    pageSize = 4,
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/group_by_category?page=${page}&page_size=${pageSize}`,
      );
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      const data = await response.json();
      setCampaignsGroupedByCategory(data.grouped_campaigns);
    } catch (err: any) {
      console.error('Error fetching campaigns:', err);
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignsForCategory = async (category: string, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/group_by_category?page=${page}&page_size=4`,
      );
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      const data = await response.json();
      const categoryData = data.grouped_campaigns[category];

      if (categoryData) {
        setCampaignsGroupedByCategory((prev) => ({
          ...prev,
          [category]: {
            campaigns: categoryData.campaigns,
            current_page: categoryData.current_page,
            total_pages: categoryData.total_pages,
          },
        }));
      }
    } catch (err: any) {
      console.error('Error fetching campaigns for category:', err);
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
      fetchCampaignsForCategory,
    }),
    [
      campaignsGroupedByCategory,
      loading,
      error,
      fetchGroupedCampaigns,
      fetchCampaignsForCategory,
    ],
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
