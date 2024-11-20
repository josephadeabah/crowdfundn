// utils/api.login.ts
import {
  LoginUserRequest,
  LoginUserResponse,
} from '@/app/types/auth.login.types';

export async function loginUser(
  user: LoginUserRequest,
): Promise<LoginUserResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/auth/login`,
    {
      method: 'POST',
      body: JSON.stringify(user),
    },
  );

  const data: LoginUserResponse = await response.json();
  return data;
}
