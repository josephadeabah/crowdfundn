import { Role } from './user.types';

export interface Profile {
  id: number;
  user_id: number;
  name: string;
  description: string;
  funding_goal: string;
  amount_raised: string;
  end_date: string;
  category: string;
  location: string;
  avatar: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: number;
  email: string;
  admin: boolean;
  full_name: string;
  phone_number: string;
  country: string;
  payment_method: string;
  mobile_money_provider: string;
  currency: string;
  currency_symbol: string;
  birth_date: string;
  category: string;
  target_amount: string;
  duration_in_days: number;
  national_id: string;
  profile: Profile;
  roles: Role[];
}

export interface UserProfileState {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: () => void;
  hasRole: (role: string) => boolean;
}
