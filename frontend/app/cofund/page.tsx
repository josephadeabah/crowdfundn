import React from 'react';

const CoFundPage: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <header className="relative bg-green-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Introducing Co-fund</h1>
        <p className="mt-4 text-lg md:text-xl">
          Co-invest in small and medium-sized businesses for real returns.
        </p>
      </header>

      {/* Problem & Solution Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center">Why Co-fund?</h2>
        <div className="mt-8 space-y-8">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold text-red-600">
              Problem –{' '}
              <span className="text-base font-semibold text-gray-800">
                Raised by some of our users
              </span>
            </h3>
            <p className="mt-2 text-gray-700">
              Africans in the diaspora and home are excluded from high-value
              wealth creation opportunities both abroad and back home due to
              limited access to structured investments, weak local networks, and
              poor investment management, leading to financial losses and missed
              opportunities.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold text-green-600">Solution</h3>
            <p className="mt-2 text-gray-700">
              We'll soon roll this out as part of Bantu Hive's Crowdfunding
              model to connect diaspora and home investors with vetted, scalable
              SME business opportunities in Africa through co-investment
              syndicates, blockchain-based investment tracking, and structured
              wealth creation vehicles to ensure transparency, risk mitigation,
              and long-term financial growth.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold">
            Why Should You Care About Co-fund?
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Empower businesses, diversify your investments, and grow your wealth
            while making an impact.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold">How It Works</h2>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border rounded-lg shadow">
              <h3 className="text-xl font-medium">1. Find a Business</h3>
              <p className="mt-2 text-gray-600">
                Explore vetted SMEs looking for investment.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow">
              <h3 className="text-xl font-medium">
                2. Go through our simplified Legal procedure
              </h3>
              <p className="mt-2 text-gray-600">
                Ensure compliance and security before investing.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow">
              <h3 className="text-xl font-medium">3. Co-Invest</h3>
              <p className="mt-2 text-gray-600">
                Join other individual investors in funding a promising business.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow">
              <h3 className="text-xl font-medium">4. Earn ROI</h3>
              <p className="mt-2 text-gray-600">
                Receive returns as the business grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold">Be the First to Know</h2>
        <p className="mt-4 text-lg text-gray-700">
          Sign up to stay updated when we roll this out. Cheers! 🎨🚀
        </p>
      </section>
    </div>
  );
};

export default CoFundPage;
