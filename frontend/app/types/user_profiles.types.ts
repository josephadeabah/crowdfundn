import { FormattedTransferLockInfo } from './auth.login.types';
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
  currency: string;
  avatar: { record: { avatar: string | File | null } };
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
  phone_code: string;
  country: string;
  payment_method: string;
  mobile_money_provider: string;
  currency: string;
  currency_symbol: string;
  birth_date: string;
  category: string;
  target_amount: string;
  national_id: string;
  profile: Profile;
  roles: Role[];
  transfer_locked?: boolean;
  transfer_locked_reason?: string | null;
  transfer_lock_info?: FormattedTransferLockInfo | null;
  can_make_transfers?: boolean;
}

export interface UserProfileState {
  userAccountData: UserProfile | null;
  profileData: Profile | null;
  loading: boolean;
  error: string | null;
  updateUserAccountData: (data: Partial<UserProfile>) => void;
  updateProfileData: (data: Partial<Profile> | FormData) => void;
  fetchUserProfile: () => void;
  hasRole: (role: string) => boolean;
  fetchAllUsers: (
    page: number,
    perPage: number,
    searchTerm: string,
  ) => Promise<{ users: any; meta: any }>;
  deleteUser: (userId: number) => Promise<void>;
  assignRoleToUser: (userId: number, role: string) => Promise<void>;
  removeRoleFromUser: (userId: number, role: string) => Promise<void>;
  blockUser: (userId: number) => Promise<void>;
  activateUser: (userId: number) => Promise<void>;
  makeUserAdmin: (userId: number, isAdmin: boolean) => Promise<void>;
}
