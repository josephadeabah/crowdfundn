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
      {/* Hero div */}
      <div className="bg-gradient-to-b from-fundify-primary/10 to-white pt-16 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fundify-primary to-fundify-accent">
              How BantuHive Works
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            We've simplified the fundraising process to help you bring your
            ideas to life and make a positive impact in the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="bg-fundify-primary hover:bg-fundify-primary/90 text-white px-8">
                Start a Campaign
              </Button>
            </Link>
            <Link href="/faqs">
              <Button
                variant="outline"
                className="border-fundify-primary text-fundify-primary"
              >
                FAQ
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Timeline div */}
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
                        Choose Your Campaign Type
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Select from donation-based, reward-based, or equity
                        crowdfunding depending on your project goals and what
                        you can offer supporters.
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
                        Create Your Campaign
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Build a compelling campaign page with your story,
                        funding goal, timeline, and rewards or equity terms for
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
                        Undergo Our Due Diligence Process
                      </h3>
                      <p className="text-gray-600 mb-4">
                        If you're raising capital for investment into your
                        startup or business, you'll first undergo our due
                        diligence process to verify your project’s credibility,
                        integrity, and potential impact.
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
                        Launch & Promote
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Go live with your campaign and leverage our marketing
                        tools & support to reach your target audience across all
                        funding types.
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
                      <h3 className="text-xl font-bold mb-3">
                        Fulfill & Deliver
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Once funded, fulfill your promises - whether that's
                        delivering rewards, providing donation updates, or
                        managing equity relationships.
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
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-12 text-foreground">
                <div className="text-center">
                  <p className="text-xl leading-relaxed text-muted-foreground">
                    BantuHive simplifies the fundraising and investment process
                    through our innovative three-tier platform designed
                    specifically for the Ghanaian market.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-green-600">
                    Three Ways to Fund Your Future
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-card p-6 rounded-lg border text-center">
                      <div className="text-4xl mb-4">🎁</div>
                      <h3 className="text-xl font-semibold mb-3 text-trust">
                        Donation & Grant-Based
                      </h3>
                      <p className="text-sm leading-relaxed mb-4">
                        Perfect for social impact projects, community
                        initiatives, and early-stage innovations that focus on
                        solving local problems.
                      </p>
                      <ul className="text-xs space-y-1 text-left">
                        <li>• No equity given up</li>
                        <li>• Focus on social impact</li>
                        <li>• Community-driven support</li>
                        <li>• Transparent fund usage</li>
                      </ul>
                    </div>

                    <div className="bg-card p-6 rounded-lg border text-center">
                      <div className="text-4xl mb-4">🎁</div>
                      <h3 className="text-xl font-semibold mb-3 text-growth">
                        Reward-Based
                      </h3>
                      <p className="text-sm leading-relaxed mb-4">
                        Support creative projects and product launches while
                        receiving exclusive rewards, early access, or limited
                        edition items.
                      </p>
                      <ul className="text-xs space-y-1 text-left">
                        <li>• Pre-order products</li>
                        <li>• Exclusive rewards</li>
                        <li>• Creative project support</li>
                        <li>• Community building</li>
                      </ul>
                    </div>

                    <div className="bg-card p-6 rounded-lg border text-center">
                      <div className="text-4xl mb-4">📈</div>
                      <h3 className="text-xl font-semibold mb-3 text-growth">
                        Equity Investment
                      </h3>
                      <p className="text-sm leading-relaxed mb-4">
                        Invest in high-growth startups and become a co-owner
                        with potential for financial returns as the company
                        grows.
                      </p>
                      <ul className="text-xs space-y-1 text-left">
                        <li>• Ownership stakes</li>
                        <li>• Potential returns</li>
                        <li>• Professional due diligence</li>
                        <li>• Investor protections</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-green-600">
                    For Entrepreneurs
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          1
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Create Your Campaign
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Tell your story, set your funding goal, and choose
                            your funding type. Our team helps you craft a
                            compelling campaign.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          2
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Get Verified</h3>
                          <p className="text-sm text-muted-foreground">
                            Complete our comprehensive verification process
                            including business registration, financial
                            documents, and background checks.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          3
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Launch & Promote
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Go live on our platform and leverage our marketing
                            tools, investor network, and community to reach your
                            funding goals.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-secondary text-green-600-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          4
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Raise Funds</h3>
                          <p className="text-sm text-muted-foreground">
                            Watch your funding grow through our gamified
                            platform that encourages investor engagement and
                            viral sharing.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-secondary text-green-600-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          5
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Deliver Results
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Execute your business plan with regular updates to
                            your investor community and transparent reporting.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-secondary text-green-600-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          6
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Scale & Grow</h3>
                          <p className="text-sm text-muted-foreground">
                            Access follow-on funding rounds, mentorship
                            programs, and our network of successful
                            entrepreneurs and investors.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-green-600">
                    For Investors
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-trust text-trust-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          1
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Sign Up & Verify
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Create your account and complete our KYC process to
                            ensure platform security and regulatory compliance.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-trust text-trust-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          2
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Discover Opportunities
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Browse vetted investment opportunities across
                            various sectors, from tech startups to agricultural
                            innovations.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-trust text-trust-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          3
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Conduct Due Diligence
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Access detailed financials, business plans,
                            management information, and risk assessments for
                            informed decision-making.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-growth text-growth-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          4
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Invest Securely
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Make investments starting from GHS 50 through our
                            secure payment system with full legal documentation.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-growth text-growth-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          5
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Track Performance
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Monitor your investments through our dashboard with
                            real-time updates, financial reports, and company
                            milestones.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-growth text-growth-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                          6
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Realize Returns
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Benefit from dividends, capital appreciation, or
                            rewards based on your investment type and company
                            performance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-8 rounded-lg border">
                  <h2 className="text-2xl font-semibold mb-4 text-center text-green-600">
                    Why Choose BantuHive?
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-2xl mb-2">🛡️</div>
                      <h3 className="font-semibold mb-2">Fully Regulated</h3>
                      <p className="text-xs text-muted-foreground">
                        Licensed by SEC Ghana with comprehensive investor
                        protections
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl mb-2">🎮</div>
                      <h3 className="font-semibold mb-2">
                        Gamified Experience
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Engaging platform that makes investing and fundraising
                        fun
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl mb-2">🌍</div>
                      <h3 className="font-semibold mb-2">Diaspora-Friendly</h3>
                      <p className="text-xs text-muted-foreground">
                        Designed for Ghanaians worldwide to invest back home
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl mb-2">📊</div>
                      <h3 className="font-semibold mb-2">
                        Transparent Reporting
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Real-time updates and comprehensive performance tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA div */}
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
