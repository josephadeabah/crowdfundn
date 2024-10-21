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
  birth_date: string;
  category: string | null;
  target_amount: number;
  duration_in_days: number;
  national_id: string;
}

// Define the response structure for a successful registration
export interface RegisterUserResponseSuccess {
  token: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    phone_number: string;
    country: string;
    payment_method: string;
    mobile_money_provider: string;
    currency: string;
    birth_date: string;
    category: string;
    target_amount: number;
    duration_in_days: number;
    national_id: string;
    roles: {
      id: number;
      name: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    }[];
    created_at: string;
    updated_at: string;
  };
}

// Define the response structure for a failed registration
export interface RegisterUserResponseError {
  errors: string[];
}

// Union type for registration response
export type RegisterUserResponse =
  | RegisterUserResponseSuccess
  | RegisterUserResponseError;

// Adjusted ApiResponse type
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: RegisterUserResponse;
}
