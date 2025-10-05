// types/auth.login.types.ts

export interface TransferLockInfo {
    reason?: string;
    locked_by?: string;
    locked_at?: string;
}

export interface FormattedTransferLockInfo {
    locked: boolean;
    reason: string;
    lockedBy: string;
    lockedAt: Date | null;
} 

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface KYCStatusInfo {
  verified: boolean;
  has_kyc: boolean;
  status: string;
  kyc_type: string;
  verified_at: string | null;
  expires_at: string | null;
  is_expired: boolean;
}

export interface LoginUserType {
  id: number;
  email: string;
  password_digest: string;
  admin: boolean | null;
  created_at: string;
  updated_at: string;
  full_name: string;
  phone_number: string;
  country: string;
  payment_method: string;
  mobile_money_provider: string | null;
  currency: string;
  currency_symbol?: string;
  status: string;
  birth_date: string;
  category: string;
  target_amount: string;
  duration_in_days: number;
  national_id: string;
  subscription?: {
    isActive: boolean;
    // add other subscription properties if needed
  };
  kyc_status_info?: KYCStatusInfo;
  can_invest?: boolean; // Add can_invest property
  can_create_campaign?: boolean; // Add can_create_campaign property
  transfer_locked?: boolean;
  transfer_lock_info?: FormattedTransferLockInfo | null;
  can_make_transfers?: boolean;
}

export interface LoginUserResponseSuccess {
  token: string;
  user: LoginUserType;
}

export interface LoginUserResponseError {
  error: string;
}

export type LoginUserResponse =
  | LoginUserResponseSuccess
  | LoginUserResponseError;
