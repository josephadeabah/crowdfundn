import {
  ApiResponse,
  UserRegistrationData,
} from '@/app/types/auth.register.types';

// Function to register users
export async function registerUser(
  user: UserRegistrationData,
): Promise<ApiResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/auth/signup`,
    {
      method: 'POST',
      body: JSON.stringify({ user }),
    },
  );

  const data: ApiResponse = await response.json();
  return data;
}
