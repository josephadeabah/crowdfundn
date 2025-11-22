// app/account/investor-clubs/clubTypes.ts
export interface Club {
  id: string;
  slug: string;
  name: string;
  mission: string;
  description?: string;
  investment_focus: string;
  club_type: 'public' | 'private';
  minimum_monthly_contribution: number;
  total_contributions: number;
  total_invested: number;
  current_balance: number;
  currency_symbol: string;
  status: 'active' | 'inactive' | 'suspended';
  access_type: 'open' | 'restricted' | 'certified';
  max_members: number;
  current_members_count: number;
  currency: string;
  financials: {
    total_contributions: number;
    total_invested: number;
    current_balance: number;
    total_return?: number;
    roi_percentage?: number;
  };
  creator: {
    id: string;
    name: string;
  };
  is_member: boolean;
  is_admin: boolean;
  is_creator?: boolean;
  membership_status?: 'active' | 'pending' | 'none';
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
  role: 'creator' | 'admin' | 'member';
  status: 'pending' | 'active' | 'inactive';
  total_contributed: number;
  contributed_share: number;
  joined_at: string;
  can_manage?: boolean;
  can_vote?: boolean;
  can_contribute?: boolean;
}

export interface Membership {
  id: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
  role: 'creator' | 'admin' | 'member';
  status: 'pending' | 'active' | 'inactive';
  total_contributed: number;
  contributed_share: number;
  joined_at: string;
  can_manage: boolean;
  can_vote: boolean;
  can_contribute: boolean;
}

export interface ClubContribution {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  user: {
    id: string;
    full_name: string;
  };
  transaction_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface ContributionsResponse {
  contributions: ClubContribution[];
  pagination: PaginationData;
}

// UPDATED: Enhanced Club Investment Types with cancellation support
export interface ClubInvestment {
  id: string;
  investment_amount: number;
  shares?: number;
  percentage?: number;
  status:
    | 'pending'
    | 'initialized'
    | 'successful'
    | 'failed'
    | 'committed'
    | 'canceled';
  certificate_url?: string;
  certificate_number?: string;
  investment_date?: string;
  current_value?: number;
  total_returns?: number;
  roi?: number;
  currency: string;
  currency_symbol: string;
  campaign: {
    id: string;
    title: string;
    company_name: string;
    valuation: number;
    equity_offered: number;
    currency: string;
    currency_symbol: string;
    category?: string;
    goal_amount?: number;
    current_amount?: number;
    company_info?: {
      name: string;
    };
  };
  created_by?: {
    id: string;
    full_name: string;
  };
  created_at: string;
  updated_at: string;
  is_equity_investment: boolean;
  transaction_reference?: string;
  equity_investment_id?: number;

  // ADDED: Missing properties from API response
  company?: string;
  description?: string;
  amount?: string; // Formatted amount like "50.0K", "2.2K"
  sector?: string;
  club_investment_id?: number;
  campaign_id?: number;
  campaign_slug?: string;
  proposed_amount?: string;

  // NEW: Cancellation properties
  cancel_window_expires_at?: string | null;
  can_be_cancelled?: boolean;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  committed_at?: string | null;
  time_remaining_for_cancellation?: string;
}

// NEW: Cancellation request and response types
export interface CancelInvestmentRequest {
  reason?: string;
}

export interface CancelInvestmentResponse {
  success: boolean;
  message?: string;
  investment?: ClubInvestment;
  error?: string;
}

export interface ClubInvestmentCreateRequest {
  campaign_id: string;
  investment_amount: number;
}

export interface ClubInvestmentCertificateStatus {
  exists: boolean;
  url?: string;
  certificate_number?: string;
}

export interface ClubInvestmentExecutionResult {
  success: boolean;
  investment: ClubInvestment;
  authorization_url?: string;
  error?: string;
}

// NEW: Cancellation request and response types
export interface CancelInvestmentRequest {
  reason?: string;
}

export interface CancelInvestmentResponse {
  success: boolean;
  message?: string;
  investment?: ClubInvestment;
  error?: string;
}

// UPDATED: Portfolio API Response Types
export interface PortfolioInvestment {
  id: number;
  investment_amount: string | number;
  current_value: string | number;
  shares: string | number | null;
  percentage: string | number | null;
  status: string;
  investment_date: string | null;
  roi: string | number;
  campaign: {
    id: number;
    title: string;
    company_name: string;
    valuation: string | number;
    currency: string;
    currency_symbol: string | null;
    category?: string;
  };
  // NEW: Cancellation properties for portfolio investments
  cancel_window_expires_at?: string | null;
  can_be_cancelled?: boolean;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  committed_at?: string | null;
}

export interface ClubInvestmentPortfolio {
  total_invested: number;
  total_value: number;
  total_return: number;
  return_percentage: number;
  active_investments: number;
  investments: PortfolioInvestment[];
  campaigns_invested?: number;
  successful_count?: number;
}

export interface PortfolioApiResponse {
  success: boolean;
  portfolio: {
    total_invested: number | string;
    total_value: string | number;
    total_return: string | number;
    return_percentage: string | number;
    active_investments: number;
    investments: PortfolioInvestment[];
    campaigns_invested?: number;
    successful_count?: number;
  };
}

export interface JoinClubResponse {
  success: boolean;
  membership?: Membership;
  message: string;
  is_member?: boolean;
}

export interface MembershipStatusResponse {
  success: boolean;
  membership?: Membership;
  is_member?: boolean;
  message?: string;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface LeaveClubResponse {
  success: boolean;
  message?: string;
  error?: string;
  error_type?: string;
  requires_transfer?: boolean;
  available_members?: Array<{ id: string; name: string }>;
  portfolio_summary?: any;
}

export interface RejectMemberResponse extends BaseResponse {}

export interface CancelRequestResponse extends BaseResponse {}

export interface ApproveMemberResponse extends BaseResponse {
  membership?: Member;
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationData;
}

export interface ClubsResponse {
  success: boolean;
  clubs: Club[];
  pagination: PaginationData;
}

export interface MyClubsResponse {
  success: boolean;
  clubs: Club[];
  pagination: PaginationData;
}

export interface DiscoverClubsResponse {
  success: boolean;
  clubs: Club[];
  pagination: PaginationData;
}

export interface VerifyContributionResponse {
  success: boolean;
  contribution: ClubContribution;
  transaction_status?: string;
  paystack_error?: string;
  membership?: {
    total_contributed: number;
    contributed_share: number;
  };
  already_processed?: boolean;
  processed_by_webhook?: boolean;
}

export interface ShareChange {
  id: string;
  previous_share?: number;
  new_share?: number;
  change_amount?: number;
  change_percentage?: number;
  change_reason?: string;
  total_contributions_at_time?: number;
  created_at: string;
  updated_at: string;
  contribution?: {
    id: string;
    amount?: number;
    currency?: string;
    created_at: string;
  };
  membership?: {
    id: string;
    user: {
      id: string;
      full_name: string;
    };
    club: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface ShareChangesResponse {
  share_changes: ShareChange[];
  pagination: PaginationData;
  summary?: {
    total_changes?: number;
    current_share?: number;
    total_contributed?: number;
  };
}

export interface ApprovedCampaign {
  id: string;
  campaign: {
    id: string;
    title: string;
    description: {
      id: number;
      name: string;
      body: string;
      record_type: string;
      record_id: number;
      created_at: string;
      updated_at: string;
    };
    category: string;
    goal_amount: number;
    current_amount: number;
    currency: string;
    currency_symbol: string;
    slug: string;
    fundraiser: {
      id: string;
      name: string;
    };
  };
  club_investment: {
    id: string;
    proposed_amount: number;
    proposed_share_percentage: number;
    voting_stats: {
      total_votes: number;
      yes_votes: number;
      no_votes: number;
      approval_percentage: number;
      total_members?: number;
      all_members_voted?: boolean;
      threshold_met?: boolean;
    };
  };
  approved_at: string;
  voting_stats?: {
    total_votes: number;
    yes_votes: number;
    no_votes: number;
    approval_percentage: number;
    total_members?: number;
    all_members_voted?: boolean;
    threshold_met?: boolean;
  };
}

// API Investment Response Type (for the raw API data)
export interface ApiInvestmentResponse {
  id: string;
  company: string;
  description: string;
  amount: string; // "50.0K", "2.2K", etc.
  sector: string;
  status: string;
  club_investment_id: number;
  campaign_id: number;
  campaign_slug: string;
  proposed_amount: string;
  currency_symbol: string | null;
  is_equity_investment: boolean;
  shares: string | null;
  percentage: string | null;
  certificate_url: string | null;
  certificate_number: string | null;
  current_value: string;
  total_returns: string;
  roi: string;
  investment_date: string | null;
  // NEW: Cancellation properties for API response
  cancel_window_expires_at?: string | null;
  can_be_cancelled?: boolean;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  committed_at?: string | null;
}

// Investment Details Modal specific types
export interface InvestmentDetailsData {
  id: string;
  investment_amount: number;
  shares?: number;
  percentage?: number;
  status: string;
  certificate_url?: string;
  certificate_number?: string;
  investment_date?: string;
  current_value?: number;
  total_returns?: number;
  roi?: number;
  currency: string;
  currency_symbol: string;
  campaign: {
    id: string;
    title: string;
    company_name: string;
    valuation: number;
    equity_offered: number;
    currency: string;
    currency_symbol: string;
    category?: string;
    goal_amount?: number;
    current_amount?: number;
    company_info?: {
      name: string;
    };
  };
  created_at: string;
  updated_at: string;
  is_equity_investment: boolean;
  transaction_reference?: string;
  equity_investment_id?: number;
  company?: string;
  description?: string;
  amount?: string;
  sector?: string;
  club_investment_id?: number;
  campaign_id?: number;
  campaign_slug?: string;
  proposed_amount?: string;
  // NEW: Cancellation properties for details modal
  cancel_window_expires_at?: string | null;
  can_be_cancelled?: boolean;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  committed_at?: string | null;
}

// NEW: Enhanced types for cancellation functionality
export interface CancellableInvestment {
  id: string;
  status: 'committed';
  cancel_window_expires_at: string;
  can_be_cancelled: boolean;
  investment_amount: number;
  campaign: {
    company_name: string;
  };
}

export interface InvestmentCancellationInfo {
  can_be_cancelled: boolean;
  time_remaining?: string;
  expires_at?: string;
  reason?: string;
}

// NEW: Fee calculation types for investment preview
export interface InvestmentFeeBreakdown {
  investment_amount: number;
  processing_fee: number; // 7%
  platform_fee: number; // 3%
  total_fees: number;
  net_to_campaign: number;
  total_deduction: number;
  currency_symbol: string;
}

// NEW: Investment creation with fee preview
export interface InvestmentCreationData {
  campaign_id: string;
  investment_amount: number;
  notes?: string;
  fee_breakdown?: InvestmentFeeBreakdown;
}

// Add these new interfaces for analytics
export interface PortfolioInsights {
  performance_insights: any;
  risk_analysis: any;
  diversification_metrics: any;
  liquidity_analysis: any;
  member_engagement_insights: any;
  investment_trends: any;
}

export interface FinancialHealthMetrics {
  liquidity_ratios: any;
  contribution_health: any;
  investment_efficiency: any;
  growth_metrics: any;
  stability_indicators: any;
}

export interface PredictiveAnalytics {
  growth_projections: any;
  risk_scenarios: any;
  opportunity_analysis: any;
  cash_flow_forecast: any;
}

export interface ComprehensiveAnalytics {
  portfolio_overview: ClubInvestmentPortfolio;
  performance_analytics: any;
  portfolio_insights: PortfolioInsights;
  financial_health: FinancialHealthMetrics;
  predictive_analytics: PredictiveAnalytics;
  member_portfolio: any;
  generated_at: string;
}
