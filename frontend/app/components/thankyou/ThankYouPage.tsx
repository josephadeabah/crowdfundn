'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import ThankyouLoader from '@/app/loaders/ThankyouLoader';
import ToastComponent from '../toast/Toast';

const ThankYouPage = () => {
  const { donations, verifyTransaction, loading, error } =
    useDonationsContext();
  const [showToast, setShowToast] = useState(false);

  // Trigger toast visibility when error changes
  useEffect(() => {
    if (error) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [error]);

  // Get query parameters using useSearchParams
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  // Effect to handle transaction verification once reference is found
  useEffect(() => {
    if (reference) {
      verifyTransaction(reference);
    }
  }, [reference]);

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

  // Extracting donation details
  const donationDetails = donations[0]?.donation || {};
  const campaignDetails = donations[0]?.campaign || {};

  if (loading) {
    return <ThankyouLoader />;
  }

  return (
    <>
      {showToast && error && (
        <ToastComponent
          type="error"
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          description={error}
        />
      )}
      <div className="min-h-screen bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-700">
            Your generosity is helping us get closer to our goal!
          </p>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-blue-600">
              Donation Summary
            </h2>

            <div className="mt-4 text-left">
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {donationDetails.status}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong>{' '}
                {campaignDetails.currency.toLocaleUpperCase()}
                {donationDetails.amount}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Transaction Reference:</strong>{' '}
                {donationDetails.transaction_reference}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Created At:</strong>{' '}
                {new Date(donationDetails.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Updated At:</strong>{' '}
                {new Date(donationDetails.updated_at).toLocaleString()}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-600">
                Campaign Details
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Title:</strong> {campaignDetails.title}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Goal Amount:</strong>{' '}
                {campaignDetails.currency.toLocaleUpperCase()}
                {campaignDetails.goal_amount}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Current Amount:</strong>{' '}
                {campaignDetails.currency.toLocaleUpperCase()}
                {campaignDetails.current_amount}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-600">
                Fundraiser Details
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Fundraiser Name:</strong>{' '}
                {campaignDetails.fundraiser.profile.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Funding Goal:</strong>{' '}
                {campaignDetails.currency.toLocaleUpperCase()}
                {campaignDetails.goal_amount}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amount Raised:</strong>{' '}
                {campaignDetails.currency.toLocaleUpperCase()}
                {campaignDetails.current_amount}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong>{' '}
                {campaignDetails.fundraiser.profile?.status}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Fundraiser Created At:</strong>{' '}
                {new Date(
                  campaignDetails.fundraiser.profile?.created_at,
                ).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={handleShare}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Share This Campaign
            </button>
            <a
              href="/"
              className="w-full inline-block text-center bg-gray-600 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-700 transition"
            >
              Go Back to Home
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
    </>
  );
};

export default ThankYouPage;
