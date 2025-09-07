// app/info/upgrade/page.tsx
import React from 'react';
import PricingHeader from '@/app/info/upgrade/PricingHeader';
import FAQ from '@/app/info/upgrade/FAQ';
import Testimonials from '@/app/info/upgrade/Testimonials';
import CTASection from '@/app/info/upgrade/CTASection';


const UpgradePage = () => {

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-grow">
        <div className="py-16 md:py-24">
          <PricingHeader />
        </div>

        {/* Value Proposition Section */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Support Plans?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional support designed to maximize your campaign's success and help you reach your funding goals faster.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Campaign Strategy</h3>
                <p className="text-gray-600">
                  Get personalized guidance from crowdfunding experts who understand what makes campaigns successful in the African market.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Excellence</h3>
                <p className="text-gray-600">
                  24/7 technical support ensuring your campaign runs smoothly with instant resolution of any platform issues.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Power</h3>
                <p className="text-gray-600">
                  Advanced marketing tools and expert guidance to amplify your reach and attract more backers to your campaign.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Compare Support Features
              </h2>
              <p className="text-xl text-gray-600">
                Choose the level of support that matches your campaign needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Starter Plan</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Email support with 24-hour response time
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic campaign setup guidance
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Access to fundraising templates
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-gray-400 mr-2">✗</span>
                    Priority technical support
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-gray-400 mr-2">✗</span>
                    Marketing strategy sessions
                  </li>
                </ul>
              </div>

              <div className="p-6 border border-orange-300 rounded-lg bg-orange-50">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  Most Popular
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Plan</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Email & chat support (5-hour response)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced campaign optimization
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Marketing analytics dashboard
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Monthly strategy review calls
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="text-gray-400 mr-2">✗</span>
                    Dedicated account manager
                  </li>
                </ul>
              </div>

              <div className="p-6 border border-purple-300 rounded-lg bg-purple-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pro+ Plan</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    24/7 priority support (30-min response)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Dedicated campaign strategist
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced marketing automation
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Weekly performance reviews
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Influencer marketing support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Success Metrics Section */}
        <div className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-8">Proven Results</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">73%</div>
                <p className="text-gray-300">Higher success rate for supported campaigns</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">2.4x</div>
                <p className="text-gray-300">Average increase in funds raised</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">89%</div>
                <p className="text-gray-300">Faster campaign funding goals reached</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">500+</div>
                <p className="text-gray-300">Campaigns successfully supported</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Testimonials />
        </div>

        {/* How It Works Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Support Works</h2>
              <p className="text-xl text-gray-600">Simple process to get the support you need</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">1</div>
                <h3 className="font-semibold mb-2">Choose Your Plan</h3>
                <p className="text-gray-600 text-sm">Select the support level that matches your campaign goals</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">2</div>
                <h3 className="font-semibold mb-2">Onboarding Session</h3>
                <p className="text-gray-600 text-sm">Meet your support team and plan your strategy</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600">3</div>
                <h3 className="font-semibold mb-2">Receive Support</h3>
                <p className="text-gray-600 text-sm">Get ongoing guidance and technical assistance</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-orange-600">4</div>
                <h3 className="font-semibold mb-2">Achieve Success</h3>
                <p className="text-gray-600 text-sm">Reach your funding goals with expert support</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <FAQ />
        </div>

        <div>
          <CTASection />
        </div>
      </main>
    </div>
  );
};

export default UpgradePage;