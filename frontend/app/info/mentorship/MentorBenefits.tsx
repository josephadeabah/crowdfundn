// components/mentorship/MentorBenefits.tsx
export default function MentorBenefits() {
  const founderBenefits = [
    {
      title: 'Pitch Refinement',
      description:
        "Get feedback on your investor pitch from those who've been there",
      icon: '🎯',
    },
    {
      title: 'Investor Introductions',
      description: 'Access to mentor networks and warm introductions',
      icon: '🤝',
    },
    {
      title: 'Strategy Validation',
      description: 'Validate your business model and go-to-market strategy',
      icon: '📈',
    },
    {
      title: 'Fundraising Timeline',
      description: 'Create a realistic fundraising timeline and milestones',
      icon: '⏱️',
    },
    {
      title: 'Term Sheet Guidance',
      description: 'Understand and negotiate term sheets effectively',
      icon: '📄',
    },
    {
      title: 'Avoid Common Pitfalls',
      description:
        "Learn from others' mistakes and avoid common fundraising errors",
      icon: '🚧',
    },
  ];

  const mentorBenefits = [
    {
      title: 'Give Back',
      description: 'Share your knowledge and help the next generation',
      icon: '❤️',
    },
    {
      title: 'Deal Flow',
      description: 'Early access to promising startups and founders',
      icon: '🔍',
    },
    {
      title: 'Network Expansion',
      description: 'Connect with other mentors and investors',
      icon: '🌐',
    },
    {
      title: 'Personal Brand',
      description: 'Build your reputation as an industry expert',
      icon: '🌟',
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
            Benefits of Our Mentorship Program
          </h2>
          <p className="text-xl text-gray-600">
            Value for both founders seeking guidance and mentors looking to give
            back
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Founder Benefits */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-100 p-4 rounded-xl">
                <div className="text-3xl">🚀</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  For Founders
                </h3>
                <p className="text-gray-600">
                  Accelerate your fundraising success
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {founderBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-colors duration-300"
                >
                  <div className="text-2xl mb-3">{benefit.icon}</div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mentor Benefits */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-green-100 p-4 rounded-xl">
                <div className="text-3xl">👨‍🏫</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  For Mentors
                </h3>
                <p className="text-gray-600">
                  Share your expertise and grow your network
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentorBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-green-50 rounded-xl p-6 transition-colors duration-300"
                >
                  <div className="text-2xl mb-3">{benefit.icon}</div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h4 className="font-bold text-xl mb-3 text-green-900">
                Ready to become a mentor?
              </h4>
              <p className="text-green-800 mb-4">
                Verified users can apply to become mentors via{' '}
                <span className="font-bold">Account → Settings → KYC</span>
              </p>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Capacity: Up to 5 ventures simultaneously</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
