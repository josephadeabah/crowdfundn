export const confirmEmail = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/auth/confirm_email/${token}`);

    if (!response.ok) {
      throw new Error('Failed to confirm email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error confirming email:', error);
    throw error;
  }
};

export const resendConfirmationEmail = async (email: string) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/auth/resend_confirmation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    },
  );
};
