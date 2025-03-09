'use client';
import React, { useState } from 'react';
import { Star, Gift, Trophy, ArrowRight } from 'lucide-react';
import { HandIcon } from '@radix-ui/react-icons';

// Sample rewards data
const rewards = [
  {
    id: 1,
    name: 'Early Bird',
    points: 100,
    benefits: [
      '10% discount on next backing',
      'Get featured on the leaderboard',
      'Silver Certificates of Honour',
    ],
    icon: <Gift className="h-6 w-6" />,
    level: 'Silver',
    color: 'from-slate-400/20 to-slate-600/20',
    textColor: 'text-slate-600',
  },
  {
    id: 2,
    name: 'Strategic Backer',
    points: 500,
    benefits: [
      '25% discount on next backing', // Moved from Diamond
      'Voting rights on platform features', // Moved from Diamond
      'Exclusive merchandise', // Moved from Diamond
      'Get featured on the leaderboard', // Moved from Diamond
      'Gold Certificates of Honour', // Existing benefit
    ],
    icon: <Star className="h-6 w-6" />,
    level: 'Gold',
    color: 'from-amber-500/20 to-amber-700/20',
    textColor: 'text-amber-500',
  },
  {
    id: 3,
    name: 'Super Supporter',
    points: 1000,
    benefits: [
      'Featured in our newsletters',
      '$1000 cash prize',
      'Get featured on the leaderboard',
      'Personalized thank-you video from the team',
      'Diamond Certificates of Honour',
    ],
    icon: <Trophy className="h-6 w-6" />,
    level: 'Diamond',
    color: 'from-cyan-500/20 to-cyan-700/20', // Changed to blue
    textColor: 'text-cyan-500', // Changed to blue
  },
];

const RewardsSection = () => {
  const [selectedReward, setSelectedReward] = useState(rewards[1].id);

  return (
    <div className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/10 text-green-500 rounded-full mb-4">
            Earn While You Back
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Rewards & Recognition
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Back projects, earn points, and unlock exclusive rewards. The more
            you participate, the more perks you unlock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              onClick={() => setSelectedReward(reward.id)}
              className={`p-6 rounded-xl cursor-pointer transition-all duration-300 animate-on-scroll relative overflow-hidden ${
                selectedReward === reward.id
                  ? 'shadow-lg transform -translate-y-1' // Removed border-2
                  : 'hover:shadow-lg' // Removed border and hover:border
              }`}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${reward.color} opacity-60 z-0`}
              ></div>

              <div className="relative z-10">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${reward.textColor} bg-background`}
                >
                  {reward.icon}
                </div>

                <h3 className="text-xl font-semibold mb-1">{reward.name}</h3>
                <p className={`text-sm font-medium mb-4 ${reward.textColor}`}>
                  {reward.level} Tier
                </p>

                <div className="mb-4">
                  <span className="text-2xl font-bold">{reward.points}</span>
                  <span className="text-muted-foreground ml-1">points</span>
                </div>

                <ul className="space-y-2">
                  {reward.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <svg
                        className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center animate-on-scroll">
          <button className="group inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-md transition-colors">
            Make Impact Now
            <HandIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardsSection;
