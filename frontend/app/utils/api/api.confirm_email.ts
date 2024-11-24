export const confirmEmail = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/confirm_email/${token}`,
      {
        method: 'GET',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to confirm email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error confirming email:', error);
    throw error;
  }
};
