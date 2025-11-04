// BantuHive Investment Clubs Dashboard (TypeScript version)
// Copy and paste into e.g. components/InvestmentClubsDashboard.tsx
// Requires Tailwind CSS and React 18+

import React, { useState } from 'react';

interface Club {
  name: string;
  description: string;
  members: number;
  minContributionLabel: string;
  balanceLabel: string;
}

interface Member {
  initials: string;
  name: string;
  role: string;
  contributionLabel: string;
}

interface Vote {
  title: string;
  description: string;
  dealScore: number;
}

const ClubCard: React.FC<{ club: Club }> = ({ club }) => (
  <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm flex justify-between items-start">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl">🍃</div>
      <div>
        <h3 className="text-lg font-semibold text-emerald-900">{club.name}</h3>
        <p className="text-sm text-gray-600">{club.description}</p>
        <p className="text-sm text-gray-500 mt-2">{club.members} members • Min. contribution {club.minContributionLabel}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-2xl font-bold">{club.balanceLabel}</div>
      <div className="text-sm text-gray-500">Club Balance</div>
    </div>
  </div>
);

const MemberRow: React.FC<{ member: Member }> = ({ member }) => (
  <div className="flex items-center justify-between p-3 border-b last:border-b-0">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">{member.initials}</div>
      <div>
        <div className="font-medium">{member.name}</div>
        <div className="text-xs text-gray-500">{member.role}</div>
      </div>
    </div>
    <div className="text-sm font-medium">{member.contributionLabel}</div>
  </div>
);

const VoteCard: React.FC<{ vote: Vote; onVote: (choice: string) => void }> = ({ vote, onVote }) => (
  <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
    <h4 className="text-sm font-semibold text-gray-600">Current Vote</h4>
    <h3 className="mt-2 text-lg font-semibold">{vote.title}</h3>
    <p className="mt-3 text-sm text-gray-600">{vote.description}</p>

    <div className="mt-4 flex items-center gap-3">
      <button onClick={() => onVote('invest')} className="px-5 py-2 rounded-md bg-emerald-700 text-white font-medium">Invest</button>
      <button onClick={() => onVote('pass')} className="px-5 py-2 rounded-md border border-gray-200">Pass</button>
    </div>

    <div className="mt-4 text-sm text-gray-500">Deal Score: <span className="font-semibold text-gray-800">{vote.dealScore}</span></div>
  </div>
);

const InvestmentClubsDashboard: React.FC = () => {
  const [club] = useState<Club>({
    name: 'Green Impact Club',
    description: 'Invest in climate initiatives',
    members: 10,
    minContributionLabel: '$50',
    balanceLabel: '$5,000'
  });

  const [members] = useState<Member[]>([
    { initials: 'A', name: 'Ama', role: 'Founder', contributionLabel: '$500' },
    { initials: 'K', name: 'Kofi', role: 'Member', contributionLabel: '$300' },
    { initials: 'Y', name: 'Yaa', role: 'Member', contributionLabel: '$200' }
  ]);

  const [vote] = useState<Vote>({
    title: 'Invest in AgriTech Campaign',
    description: 'The campaign focuses on equitable distribution of agricultural resources in rural communities.',
    dealScore: 85
  });

  const onVote = (choice: string) => {
    alert(`You voted: ${choice}. (Hook this to your API)`);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Investment Clubs</h1>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 rounded-md bg-emerald-700 text-white">Create Club</button>
              <div className="text-sm text-gray-600">Ama</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">Your Clubs</h2>
              <ClubCard club={club} />

              <h3 className="text-lg font-semibold">Members</h3>
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
                {members.map((m, idx) => <MemberRow key={idx} member={m} />)}
              </div>
            </div>

            <div className="space-y-6">
              <VoteCard vote={vote} onVote={onVote} />

              <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-600">Club Wallet</h4>
                <div className="mt-3 text-2xl font-bold">{club.balanceLabel}</div>
                <div className="text-sm text-gray-500 mt-1">Available balance for investments</div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default InvestmentClubsDashboard;
