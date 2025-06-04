import React from 'react';
import {
  Award,
  Check,
  Gift,
  Lightbulb,
  TrendingUp,
  Trophy,
  DollarSign,
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

export const GameElements = () => {
  const steps = [
    {
      step: '1',
      title: 'Choose Your Campaign Type',
      description:
        'Select from donation-based, reward-based, or equity crowdfunding depending on your project goals and what you can offer supporters.',
      icon: '🎯',
    },
    {
      step: '2',
      title: 'Create Your Campaign',
      description:
        'Build a compelling campaign page with your story, funding goal, timeline, and rewards or equity terms for backers.',
      icon: '📝',
    },
    {
      step: '3',
      title: 'Launch & Promote',
      description:
        'Go live with your campaign and leverage our marketing tools to reach your target audience across all funding types.',
      icon: '🚀',
    },
    {
      step: '4',
      title: 'Fulfill & Deliver',
      description:
        "Once funded, fulfill your promises - whether that's delivering rewards, providing donation updates, or managing equity relationships.",
      icon: '✅',
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Bantu Hive Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our unified platform makes it easy to launch any type of
            crowdfunding campaign. Follow these simple steps to bring your
            vision to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-green-600 to-orange-600"></div>
                  <div className="w-0 h-0 border-l-4 border-l-orange-600 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-8 -mt-0.5"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of successful campaigners who have raised over $5K
              across all funding types
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">$3K</div>
                <div className="text-sm text-gray-600">Donations Raised</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$1K</div>
                <div className="text-sm text-gray-600">Rewards Funded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">$0.1K</div>
                <div className="text-sm text-gray-600">Equity Invested</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
