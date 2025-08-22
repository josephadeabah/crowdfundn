export interface KycReview {
  id: number;
  reference: string;
  kyc_type: 'investor' | 'issuer' | 'both';
  status: 'pending' | 'in_review' | 'verified' | 'rejected' | 'expired';
  verification_type: string;
  id_number: string;
  user_name: string;
  user_email: string;
  date_of_birth?: string;
  id_expiry_date: string;
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
  addresses: any[];
  documents: any[];
  user?:{
    email: string;
    full_name: string;
    profile: {
      full_name: string;
      phone: string;
    };
    fundraiser_info?: {
      has_campaigns?: boolean;
      active_campaigns?: number;
    }
  }
}

export interface KycReviewFilters {
  status?: string;
  kyc_type?: string;
  search?: string;
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
  rejection_reason?: string;
  notes?: string;
}
