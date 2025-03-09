'use client';
import React, { useState } from 'react';
import { Star, Gift, Trophy, ArrowRight } from 'lucide-react';

// Sample rewards data
const rewards = [
  {
    id: 1,
    name: 'Early Bird',
    points: 100,
    benefits: ['10% discount on next backing', 'Access to exclusive updates'],
    icon: <Gift className="h-6 w-6" />,
    level: 'Bronze',
    color: 'from-amber-500/20 to-amber-700/20',
    textColor: 'text-amber-600',
  },
  {
    id: 2,
    name: 'Strategic Backer',
    points: 500,
    benefits: [
      '15% discount on next backing',
      'Monthly community calls',
      'Early access to new campaigns',
    ],
    icon: <Star className="h-6 w-6" />,
    level: 'Silver',
    color: 'from-slate-400/20 to-slate-600/20',
    textColor: 'text-slate-500',
  },
  {
    id: 3,
    name: 'Super Supporter',
    points: 1000,
    benefits: [
      '25% discount on next backing',
      'Voting rights on platform features',
      'Exclusive merchandise',
      'VIP events access',
    ],
    icon: <Trophy className="h-6 w-6" />,
    level: 'Gold',
    color: 'from-amber-300/20 to-amber-500/20',
    textColor: 'text-amber-500',
  },
];

const RewardsSection = () => {
  const [selectedReward, setSelectedReward] = useState(rewards[1].id);

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-4">
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
                  ? 'border-2 border-primary shadow-lg transform -translate-y-1'
                  : 'border border-border hover:border-primary/30'
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
                        className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
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
          <button className="group inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors">
            View All Rewards
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
