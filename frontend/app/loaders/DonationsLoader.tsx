import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Button } from '../components/button/Button';
import { DotsVerticalIcon } from '@radix-ui/react-icons';

export default function DonationsLoader() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Backer List
          <p className="text-gray-500 text-xs font-medium">
            Send Thank You to your Backers
          </p>
        </h2>
        <Button size="icon" variant="outline" className="rounded-full">
          <DotsVerticalIcon />
        </Button>
      </div>

      {/* Table Loading Skeleton */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left bg-gray-200 text-gray-800">
              <th className="py-3 px-4">Select</th>
              <th className="py-3 px-4">Donor Name</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Campaign Title</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="py-3 px-4">
                    <Skeleton height={20} width={20} />
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    <Skeleton width={100} />
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <Skeleton width={50} />
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    <Skeleton width={80} />
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    <Skeleton width={150} />
                  </td>
                  <td className="py-3 px-4 text-green-500">
                    <Skeleton width={70} />
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="outline"
                      className="px-3 py-1 text-sm rounded-full hover:bg-gray-100 transition duration-200"
                    >
                      <Skeleton width={60} />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Thank You Button Skeleton */}
      <div className="mt-4">
        <Skeleton height={40} width="100%" />
      </div>
    </div>
  );
}
