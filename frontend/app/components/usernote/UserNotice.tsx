'use client';

import React from 'react';

const UserNotice = () => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Card Header */}
      <h2 className="text-2xl font-semibold mb-4">User Notice</h2>

      {/* Card Content */}
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">
          Bantu Hive is not an e-commerce website
        </span>
        . You are backing a project to contribute to its success.{' '}
        <span className="font-semibold">
          Bantu Hive doesn't guarantee that the creator will succeed
        </span>{' '}
        and isn't responsible for the creator's engagements towards its backers.
      </p>

      <p className="text-gray-700 mb-4">
        This project is set in <span className="font-semibold">GHS</span>. If
        you choose to pay in <span className="font-semibold">USD</span>, a
        conversion rate and possible additional fees will be applied by your
        card issuer.
      </p>

      {/* Learn More Link */}
      <a href="#" className="text-blue-500 hover:underline">
        Learn More
      </a>
    </div>
  );
};

export default UserNotice;
