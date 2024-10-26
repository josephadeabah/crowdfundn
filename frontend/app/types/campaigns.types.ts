export interface CampaignDataType {
  title: string;
  description: string;
  goal_amount: string;
  current_amount: string;
  start_date: string;
  end_date: string;
  category: string;
  location: string;
  currency: string;
  is_public: boolean;
  accept_donations: boolean;
  leave_words_of_support: boolean;
  appear_in_search_results: boolean;
  suggested_fundraiser_lists: boolean;
  receive_donation_email: boolean;
  receive_daily_summary: boolean;
  enable_promotions: boolean;
  schedule_promotion: boolean;
  promotion_frequency: string;
  promotion_duration: string;
  media?: FormData;
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
}

export interface CampaignState {
  campaigns: CampaignResponseDataType[];
  loading: boolean;
  error: string | null;
  addCampaign: (campaign: FormData) => Promise<CampaignResponseDataType>;
  fetchCampaigns: () => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
}
