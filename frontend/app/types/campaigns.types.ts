// types/campaigns.types.ts
import { CampaignTeamMember, InvestorDocument } from './equityCampaigns.types';

export interface Reward {
  id: number;
  message: string;
  campaign_id?: number;
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
  slug: string;
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
  fundraiser_kyc_verified: boolean;
  fundraiser_kyc_status: string;
  fundraiser_kyc_type: string;
  fundraiser_kyc_expired: boolean;
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
  total_shares: string;
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
  team_members?: CampaignTeamMember[];
  documents?: InvestorDocument[];
  type?: 'Campaign' | 'EquityCampaign';
  company_info?: {
    name: string;
    description: string;
    headquarters: string;
    website: string;
    contract_term: string;
  };
  valuation?: number;
  equity_offered?: number;
  minimum_investment?: number;
  maximum_investment?: number;
  equity_status?: string;
  shares_available?: number;
  percentage_raised?: number;
  total_investors?: number;
  investor_documents?: {
    id: string;
    document_type: string;
    display_name: string;
    files: {
      filename: string;
      human_size: string;
      content_type: string;
      url: string;
    }[];
  }[];
}

export interface CampaignShareType {
  total_shares: number;
  total_social_media_shares?: number;
  user_points: number;
}

export interface CampaignState {
  campaigns: CampaignResponseDataType[];
  favoritedCampaigns: CampaignResponseDataType[];
  userCampaigns: CampaignResponseDataType[] | null;
  currentCampaign: SingleCampaignResponseDataType | null;
  campaignShares: CampaignShareType | null;
  statistics: CampaignStatisticsDataType | null;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  addCampaign: (campaign: FormData) => Promise<CampaignResponseDataType>;
  cancelCampaign(id: string): Promise<void>;
  fetchUserCampaigns: () => Promise<void>;
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
  fetchCampaignById: (slug: string) => Promise<SingleCampaignResponseDataType>;
  fetchCampaignStatistics: (month?: number, year?: number) => Promise<void>;
  updateCampaignSettings: (
    campaignId: string,
    settings: Record<string, any>,
  ) => Promise<void>;
  favoriteCampaign: (campaignId: string) => Promise<void>;
  unfavoriteCampaign: (campaignId: string) => Promise<void>;
  fetchFavoritedCampaigns: () => Promise<void>;
  shareCampaign: (campaignId?: string) => Promise<void>;
  resetCurrentCampaign: () => void;
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
  avatar?: string;
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
  kyc_verified: boolean;
  kyc_status: string;
  kyc_type: string;
  kyc_verified_at: string | null;
  kyc_expired: boolean;
  investor_kyc_verified: boolean;
  issuer_kyc_verified: boolean;
  both_kyc_verified: boolean;
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
  slug: string;
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
  donations_over_time: {};
  remaining_days: string;
  total_donors: number;
  fundraiser_id: number;
  created_at: string;
  updated_at: string;
  media: string;
  media_filename: string;
  favorited: boolean;
  total_shares: string;
  total_social_media_shares: string; // social sharing total count
  total_equity_shares: string;
  shares_issued: string;
  fundraiser_kyc_verified: boolean;
  fundraiser_kyc_status: string;
  fundraiser_kyc_type: string;
  fundraiser_kyc_expired: boolean;
  description: CampaignDescription;
  permissions: CampaignPermissions;
  promotions: CampaignPromotions;
  rewards: Reward[];
  updates: Update[];
  comments: Comment[];
  fundraiser: FundraiserDetailsType;
  team_members?: CampaignTeamMember[];
  documents?: InvestorDocument[];
  type?: 'Campaign' | 'EquityCampaign';
  equity_offering_details?: EquityOfferingDetails;
  company_info?: {
    name: string;
    description: string;
    headquarters: string;
    website: string;
    contract_term: string;
  };
  valuation?: number;
  equity_offered?: number;
  minimum_investment?: number;
  maximum_investment?: number;
  equity_status?: string;
  shares_available?: number;
  percentage_raised?: number;
  total_investors?: number;
  investor_documents?: {
    id: string;
    document_type: string;
    display_name: string;
    files: {
      filename: string;
      human_size: string;
      content_type: string;
      url: string;
    }[];
  }[];
}

// types/campaigns.types.ts
interface EquityOfferingDetails {
  minimum_target?: number;
  price_per_share?: number;
  min_shares?: number;
  max_shares?: number;
  shares_offered?: number;
  stock_type?: string;
  stock_type_display?: string;
  funding_round?: string;
  funding_round_display?: string;
  sec_filing_url?: string;
  offering_circular_url?: string;
  offering_memorandum?: string;
  offering_documents: {
    sec_filing: {
      present: boolean;
      url?: string;
    };
    offering_circular: {
      present: boolean;
      url?: string;
    };
    offering_memorandum_document: {
      attached: boolean;
      url?: string;
      filename?: string;
    };
  };
}

export interface CampaignPerformance {
  id: number;
  title: string;
  performance_percentage: string;
  total_days: number;
  remaining_days: number;
  total_raised?: number; // Added for new structure
}

export interface CampaignStatisticsDataType {
  // Combined metrics (donations + investments)
  total_funds_raised: number;
  total_fundraising_goal: number;
  total_backers: number;
  total_active_campaigns: number;
  total_donated_amount: number;
  total_transferred_amount: number;
  campaign_performance: CampaignPerformance[];
  new_funding_this_week: Record<string, number>;
  campaigns_by_category: Record<string, number>;
  top_campaigns: CampaignPerformance[];
  average_funding_amount: number;
  total_rewards_claimed: number;
  total_campaign_shares: number;
  total_comments: number;
  total_updates: number;
  total_favorites: number;
  funding_over_time: Record<string, number>;
  funding_by_country: Record<string, number>;
  total_performance_percentage: number;

  // Separate breakdowns
  donations: {
    total_amount: number;
    count: number;
    average_amount: number;
  };
  investments: {
    total_amount: number;
    count: number;
    average_amount: number;
  };

  // New equity and investment metrics
  equity_campaigns?: {
    total: number;
    active: number;
    total_valuation: number;
    total_equity_offered: number;
    total_funds_raised: number;
    average_valuation: number;
    average_equity_offered: number;
    status_distribution: Record<string, number>;
    top_performing: Array<{
      id: number;
      name: string;
      company_name: string;
      valuation: number;
      equity_offered: number;
      total_raised: number;
      percentage_raised: number;
      status: string;
    }>;
  };

  investments_detail?: {
    total_investments: number;
    successful_investments: number;
    total_investment_amount: number;
    average_investment: number;
    investments_over_time: Record<string, number>;
    status_distribution: Record<string, number>;
    top_investors: Array<{
      id: number;
      name: string;
      investment_count: number;
      total_invested: number;
    }>;
    investment_size_distribution: {
      small: number;
      medium: number;
      large: number;
    };
    monthly_performance: {
      total_amount: number;
      investment_count: number;
      average_investment: number;
    };
  };

  // Legacy fields for backward compatibility (optional)
  total_donations_received?: number;
  new_donations_this_week?: Record<string, unknown>;
  donations_over_time?: Record<string, number>;
  donations_by_country?: Record<string, number>;
}
