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
  start_date: string;
  end_date: string;
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
}

export interface CampaignState {
  campaigns: CampaignResponseDataType[];
  currentCampaign: SingleCampaignResponseDataType | null;
  loading: boolean;
  error: string | null;
  addCampaign: (campaign: FormData) => Promise<CampaignResponseDataType>;
  fetchCampaigns: () => Promise<void>;
  fetchAllCampaigns: () => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  editCampaign: (
    id: string | string[] | undefined,
    campaign: FormData,
  ) => Promise<SingleCampaignResponseDataType>;
  fetchCampaignById: (id: string) => Promise<SingleCampaignResponseDataType>;
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
  start_date: string;
  end_date: string;
  category: string;
  location: string;
  currency: string;
  currency_code: string | null;
  currency_symbol: string | null;
  status: string | null;
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
