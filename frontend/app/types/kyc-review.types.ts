// app/types/kyc-review.types.ts
export interface KycReview {
  id: number;
  reference: string;
  user_id: number;
  user_name: string;
  user_email: string;
  kyc_type: 'investor' | 'issuer' | 'both';
  status: 'pending' | 'in_review' | 'verified' | 'rejected' | 'expired';
  verification_type:
    | 'national_id'
    | 'passport'
    | 'drivers_license'
    | 'voter_id';
  id_number: string;
  id_expiry_date: string;
  date_of_birth?: string;
  nationality?: string;
  occupation?: string;
  source_of_funds?: string;
  business_name?: string;
  business_registration_number?: string;
  business_tax_id?: string;
  business_industry?: string;
  business_established_date?: string;
  created_at: string;
  updated_at: string;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
}

export interface KycReviewFilters {
  status?: string;
  kyc_type?: string;
  verification_type?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface KycReviewStats {
  total: number;
  pending: number;
  in_review: number;
  verified: number;
  rejected: number;
  expired: number;
}

export interface KycReviewAction {
  action: 'verify' | 'reject' | 'request_info';
  notes?: string;
  rejection_reason?: string;
}

// Add this if you want the object syntax
export interface KycReviewActionParams {
  id: number;
  action: 'verify' | 'reject' | 'request_info';
  notes?: string;
  rejection_reason?: string;
}
