import React from 'react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  Building,
  Coins,
  Gift,
  Globe,
  Handshake,
  Heart,
  Rocket,
  Users,
} from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-fundify-primary/10 to-white pt-16 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fundify-primary to-fundify-accent">
              How Bantu Hive Works
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            We've simplified the fundraising process to help you bring your
            ideas to life and make a positive impact in your community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="bg-fundify-primary hover:bg-fundify-primary/90 text-white px-8">
                Start a Campaign
              </Button>
            </Link>
            <Link href="/partner-program">
              <Button
                variant="outline"
                className="border-fundify-primary text-fundify-primary"
              >
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">
              The Bantu Hive Journey
            </h2>

            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-fundify-primary to-fundify-accent"></div>

              {/* Timeline Items */}
              <div className="space-y-24">
                {/* Step 1 */}
                <div className="relative">
                  <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-fundify-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      1
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
                      <h3 className="text-xl font-bold mb-3">
                        Create Your Campaign
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Share your story, set your funding goal, and customize
                        your campaign page with compelling images and videos.
                      </p>
                      <div className="flex md:justify-end">
                        <div className="bg-fundify-muted p-3 rounded-full">
                          <Rocket className="h-6 w-6 text-fundify-primary" />
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0 order-1 md:order-2">
                      <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
                        alt="Person creating a campaign on laptop"
                        className="rounded-lg shadow-lg object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-fundify-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      2
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0">
                      <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
                        alt="Business partners shaking hands"
                        className="rounded-lg shadow-lg object-cover w-full h-full"
                      />
                    </div>

                    <div className="md:w-1/2 md:pl-12">
                      <h3 className="text-xl font-bold mb-3">
                        Connect with Partners
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Match with our verified partners who can help amplify
                        your campaign and reach a wider audience of potential
                        backers.
                      </p>
                      <div className="flex">
                        <div className="bg-fundify-muted p-3 rounded-full">
                          <Handshake className="h-6 w-6 text-fundify-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-fundify-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      3
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
                      <h3 className="text-xl font-bold mb-3">
                        Engage Your Community
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Utilize our powerful tools to share your campaign with
                        friends, family, and social networks to build momentum.
                      </p>
                      <div className="flex md:justify-end">
                        <div className="bg-fundify-muted p-3 rounded-full">
                          <Users className="h-6 w-6 text-fundify-primary" />
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0 order-1 md:order-2">
                      <img
                        src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
                        alt="People gathered at community event"
                        className="rounded-lg shadow-lg object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-fundify-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      4
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0">
                      <img
                        src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
                        alt="Hand holding money and credit card"
                        className="rounded-lg shadow-lg object-cover w-full h-full"
                      />
                    </div>

                    <div className="md:w-1/2 md:pl-12">
                      <h3 className="text-xl font-bold mb-3">
                        Track & Receive Funds
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Monitor your campaign progress in real-time and receive
                        funds directly to your account with our secure payment
                        processing.
                      </p>
                      <div className="flex">
                        <div className="bg-fundify-muted p-3 rounded-full">
                          <Coins className="h-6 w-6 text-fundify-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-fundify-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      5
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
                      <h3 className="text-xl font-bold mb-3">Make an Impact</h3>
                      <p className="text-gray-600 mb-4">
                        Implement your project and share updates with backers as
                        you bring your vision to life and create positive
                        change.
                      </p>
                      <div className="flex md:justify-end">
                        <div className="bg-fundify-muted p-3 rounded-full">
                          <Globe className="h-6 w-6 text-fundify-primary" />
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0 order-1 md:order-2">
                      <img
                        src="https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
                        alt="Volunteers planting trees in community"
                        className="rounded-lg shadow-lg object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Types */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Flexible Funding Options
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the funding model that works best for your project and
              goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="bg-fundify-muted w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Gift className="h-7 w-7 text-fundify-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Reward-Based</h3>
              <p className="text-gray-600 mb-4">
                Offer tangible rewards or experiences to backers based on their
                contribution level.
              </p>
              <div className="text-sm text-fundify-primary font-medium">
                Ideal for: Products, Creative Projects, Innovations
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="bg-fundify-muted w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-fundify-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Donation-Based</h3>
              <p className="text-gray-600 mb-4">
                Collect donations for charitable causes, community projects, or
                personal needs.
              </p>
              <div className="text-sm text-fundify-primary font-medium">
                Ideal for: Nonprofits, Community Projects, Personal Causes
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="bg-fundify-muted w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Building className="h-7 w-7 text-fundify-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 relative">
                Equity-Based
                <span className="ml-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-medium align-middle">
                coming soon
              </span>
              </h3>
              <p className="text-gray-600 mb-4">
                Offer equity shares in your business to investors who believe in
                your vision.
              </p>
              <div className="text-sm text-fundify-primary font-medium">
                Ideal for: Startups, Business Expansion, Real Estate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about creating and managing your
              campaign on Bantu Hive.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'How much does it cost to launch a campaign?',
                answer:
                  'Bantu Hive charges a 5% platform fee on the total amount raised for successful campaigns, plus payment processing fees of 2.9% + $0.30 per transaction. There are no upfront costs to launch your campaign.',
              },
              {
                question: "What happens if I don't reach my funding goal?",
                answer:
                  'It depends on your funding type. With flexible funding, you keep whatever funds you raise, minus our fees. With all-or-nothing funding, funds are only collected if you reach or exceed your goal.',
              },
              {
                question: 'How long can my campaign run?',
                answer:
                  'Campaigns can run anywhere from 1 to 60 days, but our data shows that 30-40 day campaigns tend to be most successful.',
              },
              {
                question: 'When do I receive the funds raised?',
                answer:
                  'For successful campaigns, funds are typically disbursed 14 business days after your campaign ends, allowing time for payment processing and any potential refunds.',
              },
              {
                question: 'Can I edit my campaign after launching?',
                answer:
                  'Yes, you can edit most aspects of your campaign after it launches, including your description, images, and updates. However, your funding goal and type can be changed once your campaign is live.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border shadow-sm"
              >
                <h3 className="text-lg font-medium mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-fundify-primary to-fundify-accent py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Join thousands of change-makers who are using Bantu Hive to bring
            their ideas to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="bg-white text-fundify-primary hover:bg-white/90 px-8 py-6 h-auto text-lg">
                Start Your Campaign
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
