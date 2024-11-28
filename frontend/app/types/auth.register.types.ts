// Define the data structure for user registration
export interface UserRegistrationData {
  email: string;
  password: string;
  password_confirmation: string;
  full_name: string;
  phone_number: string;
  country: string;
  payment_method: string;
  mobile_money_provider: string;
  currency: string;
  currency_symbol: string;
  phone_code: string;
  birth_date: string;
  category: string | null;
  target_amount: number;
  duration_in_days: number;
  national_id: string;
}

interface Role {
  id: number;
  name: string;
  description: string | null;
  created_at: string; // ISO 8601 string format for dates
  updated_at: string; // ISO 8601 string format for dates
}

interface User {
  id: number;
  email: string;
  password_digest: string;
  admin: string | null; // Can be null or a string depending on your data model
  created_at: string;
  updated_at: string;
  full_name: string;
  phone_number: string;
  country: string;
  payment_method: string;
  mobile_money_provider: string;
  currency: string;
  birth_date: string; // ISO 8601 string format for dates
  category: string;
  target_amount: string; // Assuming it's a string that can be parsed into a number
  duration_in_days: number;
  national_id: string;
  currency_symbol: string;
  phone_code: string;
  email_confirmed: boolean;
  confirmation_token: string;
  confirmed_at: string | null; // Can be null if not confirmed yet
  confirmation_sent_at: string;
  roles: Role[]; // Array of roles associated with the user
}

// Adjusted ApiResponse type
export interface ApiResponse {
  token: string; // JWT token or similar
  user: User;
  success: boolean;
  error?: string; // For error messages
  message?: string;
  errors: string[];
}
