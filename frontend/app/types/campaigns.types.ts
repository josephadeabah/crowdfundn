export interface Reward {
  id: number;
  title: string;
  description: string;
  amount: number;
  image: string;
}

export interface Update {
  id: number;
  created_at: string;
  content: string;
}

export interface Comment {
  id: number;
  user: string;
  content: string;
}

export interface CampaignResponseDataType {
  id: number;
  title: string;
  message: string;
  description: {
    id: number;
    name: string;
    body: string;
    record_type: string;
    record_id: number;
    created_at: string;
    updated_at: string;
  };
  goal_amount: string;
  current_amount: string;
  transferred_amount: string;
  start_date: string;
  end_date: string;
  remaining_days: string;
  category: string;
  location: string;
  currency: string;
  currency_code: string;
  currency_symbol: string;
  status: string;
  total_donors: number;
  fundraiser_id: number;
  created_at: string;
  updated_at: string;
  media: string;
  media_filename: string;
  favorited: boolean;
  permissions: {
    accept_donations: boolean;
    leave_words_of_support: boolean;
    appear_in_search_results: boolean;
    suggested_fundraiser_lists: boolean;
    receive_donation_email: boolean;
    receive_daily_summary: boolean;
    is_public: boolean;
  };
  promotions: {
    enable_promotions: boolean;
    schedule_promotion: boolean;
    promotion_frequency: string;
    promotion_duration: number;
  };
  rewards: Reward[];
  updates: Update[];
  comments: Comment[];
  fundraiser: FundraiserDetailsType;
}

export interface CampaignState {
  campaigns: CampaignResponseDataType[];
  currentCampaign: SingleCampaignResponseDataType | null;
  statistics: CampaignStatisticsDataType | null;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  addCampaign: (campaign: FormData) => Promise<CampaignResponseDataType>;
  cancelCampaign(id: string): Promise<void>;
  fetchCampaigns: () => Promise<void>;
  fetchAllCampaigns: (
    sortBy: string,
    sortOrder: string,
    page: number,
    pageSize: number,
    dateRange?: string,
    goalRange?: string,
    location?: string,
    title?: string,
  ) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  editCampaign: (
    id: string | string[] | undefined,
    campaign: FormData,
  ) => Promise<SingleCampaignResponseDataType>;
  fetchCampaignById: (id: string) => Promise<SingleCampaignResponseDataType>;
  fetchCampaignStatistics: () => Promise<void>;
  updateCampaignSettings: (
    campaignId: string,
    settings: Record<string, any>,
  ) => Promise<void>;
  favoriteCampaign: (campaignId: string) => Promise<void>;
  unfavoriteCampaign: (campaignId: string) => Promise<void>;
  fetchFavoritedCampaigns: () => Promise<void>
}

export interface CampaignDescription {
  id: number;
  name: string;
  body: string;
  record_type: string;
  record_id: number;
  created_at: string;
  updated_at: string;
}

export interface FundraiserProfileType {
  id: number;
  name: string;
  description: string;
  status?: string;
  created_at: string;
  updated_at: string;
}
export interface FundraiserDetailsType {
  id: number;
  name: string;
  currency: string;
  currency_symbol: string;
  created_at: string;
  updated_at: string;
  profile: FundraiserProfileType;
}

export interface CampaignPermissions {
  accept_donations: boolean;
  leave_words_of_support: boolean;
  appear_in_search_results: boolean;
  suggested_fundraiser_lists: boolean;
  receive_donation_email: boolean;
  receive_daily_summary: boolean;
  is_public: boolean;
}

export interface CampaignPromotions {
  enable_promotions: boolean;
  schedule_promotion: boolean;
  promotion_frequency: string;
  promotion_duration: number;
}

export interface SingleCampaignResponseDataType {
  id: number;
  title: string;
  goal_amount: string;
  current_amount: string;
  transferred_amount: string;
  start_date: string;
  end_date: string;
  category: string;
  location: string;
  currency: string;
  currency_code: string | null;
  currency_symbol: string | null;
  status: string | null;
  remaining_days: string;
  total_donors: number;
  fundraiser_id: number;
  created_at: string;
  updated_at: string;
  media: string;
  media_filename: string;
  description: CampaignDescription;
  permissions: CampaignPermissions;
  promotions: CampaignPromotions;
  rewards: Reward[];
  updates: Update[];
  comments: Comment[];
  fundraiser: FundraiserDetailsType;
}

export interface CampaignPerformance {
  id: number;
  title: string;
  performance_percentage: string;
  total_days: number;
  remaining_days: number;
}

export interface CampaignStatisticsDataType {
  total_donations_received: string;
  total_fundraising_goal: string;
  total_backers: number;
  total_active_campaigns: number;
  total_donated_amount: string;
  campaign_performance: CampaignPerformance[];
  new_donations_this_week: Record<string, unknown>; // Adjust the type as necessary, based on your backend response
  campaigns_by_category: Record<string, number>; // Adjust based on the structure of your categories
  top_campaigns: CampaignPerformance[];
  average_donation_amount: number;
}
