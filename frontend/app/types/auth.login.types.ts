// types/auth.login.types.ts

export interface LoginUserRequest {
  email: string;
  password: string;
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
  birth_date: string;
  category: string;
  target_amount: string;
  duration_in_days: number;
  national_id: string;
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
