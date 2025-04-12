import React from 'react';
import {
  Award,
  Check,
  Gift,
  Lightbulb,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';

export const AIFeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border-0 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
    <div className="mb-4 bg-fundify-muted p-3 w-14 h-14 flex items-center justify-center rounded-full">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export const GameElements = () => (
  <div className="relative py-16 bg-gradient-to-br from-fundify-muted to-white w-full">
    <div className="absolute inset-0 bg-grid-white/10 opacity-20"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-fundify-accent/10 text-fundify-accent text-sm font-medium">
          Our Philosophy
        </div>
        <h2 className="text-3xl font-bold mb-4">
          We're a Community-Driven Growth Engine
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-fundify-primary/10 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-fundify-primary" />
            </div>
            <h3 className="font-bold text-xl">Our Funding Principle</h3>
          </div>
          <p className="text-gray-600 mb-4">
            We believe funding is not charity — it's collaborative power
          </p>
          <div className="flex space-x-2 mt-4">
            {['Impact Maker', 'Founding Supporter', 'Hive Builder'].map(
              (badge, i) => (
                <div
                  key={i}
                  className="bg-gray-100 text-xs font-medium rounded-full px-3 py-1"
                >
                  {badge}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-fundify-accent/10 p-3 rounded-full">
              <Award className="h-6 w-6 text-fundify-accent" />
            </div>
            <h3 className="font-bold text-xl">Our Reward Ethos</h3>
          </div>
          <p className="text-gray-600 mb-4">
            We believe rewards are not transactions — they're thank-you legacies
          </p>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
            <div className="bg-fundify-accent h-2 rounded-full w-full"></div>
          </div>
          <div className="text-right text-sm mt-1">Legacy Building (100%)</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-fundify-primary/10 p-3 rounded-full">
              <Gift className="h-6 w-6 text-fundify-primary" />
            </div>
            <h3 className="font-bold text-xl">Our Community Vision</h3>
          </div>
          <p className="text-gray-600 mb-4">
            We believe community is not just support — it's co-creation
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">From Accra to Nairobi</span>
              <Check className="h-4 w-4 text-fundify-primary" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">London to Atlanta</span>
              <Check className="h-4 w-4 text-fundify-primary" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">We are the Hive</span>
              <Check className="h-4 w-4 text-fundify-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AIPoweredSection = () => (
  <div className="py-16 bg-white w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-fundify-primary/10 text-fundify-primary text-sm font-medium">
          AI Powered
        </div>
        <h2 className="text-3xl font-bold mb-4">Smart Fundraising with AI</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our intelligent platform uses AI to optimize your campaigns and
          maximize your funding success
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AIFeatureCard
          icon={<Lightbulb className="h-6 w-6 text-fundify-primary" />}
          title="Smart Recommendations"
          description="Get personalized suggestions to improve your campaign based on successful projects in similar categories."
        />
        <AIFeatureCard
          icon={<TrendingUp className="h-6 w-6 text-fundify-primary" />}
          title="Trend Predictions"
          description="Leverage AI-powered analytics to identify optimal launch timing and trending topics in your niche."
        />
        <AIFeatureCard
          icon={<Users className="h-6 w-6 text-fundify-primary" />}
          title="Audience Matching"
          description="Our AI connects your project with the perfect backers who are most likely to support your vision."
        />
      </div>
    </div>
  </div>
);
