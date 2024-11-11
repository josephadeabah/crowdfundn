'use client';  // Make sure the page runs on the client side

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';  // Import useRouter to handle client-side navigation
import { useSearchParams } from 'next/navigation';  // For capturing query params
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';  // Custom context for donations

const ThankYouPage = () => {
  const router = useRouter();  // Access the router to handle navigation
  const { donations, verifyTransaction } = useDonationsContext();  // Get donations and verifyTransaction from context

  // Get query parameters using useSearchParams
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');  // Capture reference or trxref from URL

  // Effect to handle transaction verification once reference is found
  useEffect(() => {
    if (reference) {
      verifyTransaction(reference);  // Verify the transaction when reference is available
    }
  }, [reference, verifyTransaction]);

  // Share functionality for social sharing
  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.share
      ? navigator.share({
          title: 'Support This Campaign',
          text: 'I just donated! Join me in supporting this cause!',
          url: shareUrl,
        })
      : alert("Sharing isn't supported on your device.");
  };

  // Navigate back to home or explore other campaigns
  const handleExplore = () => {
    router.push('/');  // Adjust this route to go to your homepage or campaign listing
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-700">
          Your generosity is helping us get closer to our goal!
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-600">Donation Summary</h2>
          <p className="text-gray-600 mt-2">
            <pre>
              {donations.map((donation, index) => (
                <div key={index}>{JSON.stringify(donation, null, 2)}</div>
              ))}
            </pre>
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleShare}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Share This Campaign
          </button>
          <button
            onClick={handleExplore}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700 transition"
          >
            Explore Other Campaigns
          </button>
          <a
            href="/subscribe"
            className="w-full inline-block text-center bg-gray-600 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-700 transition"
          >
            Subscribe for Updates
          </a>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          Need help?{' '}
          <a href="/contact" className="text-blue-600 underline">
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
