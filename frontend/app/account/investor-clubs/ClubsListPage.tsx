'use client';
import React, { useState } from 'react';
import ClubDetailsModal, { Club, Member } from './ClubDetailsModal';

const ClubsListPage: React.FC = () => {
  const [clubs] = useState<Club[]>([
    {
      name: 'Green Impact Club',
      description: 'Invest in climate and renewable energy initiatives across Africa.',
      members: 10,
      minContributionLabel: '$50',
      balanceLabel: '$5,000',
    },
    {
      name: 'AgriWealth Club',
      description: 'Focused on sustainable agriculture and food security startups.',
      members: 8,
      minContributionLabel: '$30',
      balanceLabel: '$3,500',
    },
    {
      name: 'TechForGood Alliance',
      description: 'Invest in early-stage African tech ventures solving real problems.',
      members: 15,
      minContributionLabel: '$100',
      balanceLabel: '$12,000',
    },
  ]);

  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const members: Member[] = [
    { initials: 'A', name: 'Ama', role: 'Founder', contributionLabel: '$500' },
    { initials: 'K', name: 'Kofi', role: 'Member', contributionLabel: '$300' },
    { initials: 'Y', name: 'Yaa', role: 'Member', contributionLabel: '$200' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Discover Investment Clubs</h1>
            <p className="text-gray-600 mt-1">
              Join a club that matches your investment interests and values.
            </p>
          </div>
          <button className="px-4 py-2 rounded-md bg-emerald-700 text-white font-medium hover:bg-emerald-800">
            Create New Club
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl mb-3">
                  🌿
                </div>
                <h3 className="text-lg font-semibold text-emerald-900">{club.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{club.description}</p>
                <p className="text-sm text-gray-500 mt-3">
                  {club.members} members • Min. contribution {club.minContributionLabel}
                </p>
              </div>
              <div className="mt-5 flex justify-between items-center">
                <div>
                  <div className="text-base font-semibold">{club.balanceLabel}</div>
                  <div className="text-xs text-gray-500">Club Balance</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedClub(club);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-md text-sm bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedClub && (
        <ClubDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          club={selectedClub}
          members={members}
        />
      )}
    </div>
  );
};

export default ClubsListPage;
