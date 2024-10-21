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
  birth_date: string;
  category: string | null;
  target_amount: number;
  duration_in_days: number;
  national_id: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any; // Adjust this based on the expected response structure
}
