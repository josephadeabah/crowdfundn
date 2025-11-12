// app/account/investor-clubs/clubTypes.ts
export interface Club {
  id: string;
  slug: string;
  name: string;
  mission: string;
  description?: string;
  investment_focus: string;
  club_type: 'public' | 'private';
  status: 'active' | 'inactive';
  minimum_monthly_contribution: number;
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
  contributed_share: number; // CHANGED: current_share → contributed_share
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
  contributed_share: number; // CHANGED: current_share → contributed_share
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

export interface ClubInvestment {
  id: string;
  campaign: {
    id: string;
    title: string;
    category: string;
    goal_amount: number;
    current_amount: number;
  };
  investment_amount: number;
  status:
    | 'pending'
    | 'voting'
    | 'approved'
    | 'rejected'
    | 'executed'
    | 'failed';
  shares_acquired: number | null;
  percentage_acquired: number | null;
  voting_session_id: string;
  created_at: string;
  executed_at: string | null;
}

export interface Vote {
  id: string;
  vote_type: 'invest' | 'pass' | 'yes' | 'no';
  reason: string | null;
  user: {
    id: string;
    full_name: string;
  };
  created_at: string;
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

// Add new response interfaces for service methods
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

// Pagination interfaces
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
