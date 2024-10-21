import {
  ApiResponse,
  UserRegistrationData,
} from '@/app/types/user.registration.types';

//register users
export async function registerUser(
  userData: UserRegistrationData,
): Promise<ApiResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/members/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userData }),
    },
  );

  if (!response.ok) {
    const errorData: ApiResponse = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return await response.json();
}
