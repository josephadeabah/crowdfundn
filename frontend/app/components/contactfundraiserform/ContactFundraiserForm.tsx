'use client';

import { useAuth } from '@/app/context/auth/AuthContext';
import { useState, useEffect } from 'react';

interface ContactFundraiserFormProps {
  campaignId: string;
}

const ContactFundraiserForm = ({ campaignId }: ContactFundraiserFormProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();

  // Set the fullName if the user is logged in
  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: fullName,
            email: email,
            message: message,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Clear success message after 3 seconds
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || 'An error occurred while sending your message.',
        );
      } else {
        setErrorMessage('An error occurred while sending your message.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold py-1">Contact Fundraiser</h2>
        <label className="block text-sm font-medium text-gray-700">
          Full Name:
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
          disabled={!!user?.full_name} // Disable the input if the user is logged in
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message:
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
          rows={4}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      {successMessage && (
        <p className="text-green-600 text-sm mt-2">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </form>
  );
};

export default ContactFundraiserForm;
