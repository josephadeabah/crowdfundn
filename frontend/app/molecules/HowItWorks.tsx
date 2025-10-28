import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  Rocket,
  Handshake,
  Users,
  Coins,
  Globe,
  Gift,
  TrendingUp,
  Shield,
  Sparkles,
  Target,
  FileText,
  Building,
  ChartBar,
  CheckCircle,
  Banknote,
  ClipboardList,
} from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-fundify-primary/5 via-gray-50 to-accent/5"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent text-fundify-primary">
              How BantuHive Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Simplified fundraising to bring your ideas to life to create
              positive impact
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="bg-fundify-primary hover:bg-green-700 shadow-medium hover:shadow-large transition-all"
                >
                  Start a Campaign
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/info/faqs">
                <Button size="lg" variant="outline" className="shadow-soft">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Capital Raising Process */}
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Raise Capital in 5 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground">
              Complete process from application to funding disbursement
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1: Issuer Onboarding */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-slide-up">
              <div className="flex-1">
                <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all border-l-4 border-fundify-primary">
                  <div className="w-12 h-12 bg-gradient-to-br from-fundify-primary to-fundify-primary/70 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-soft">
                    1
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Issuer Onboarding
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Our support team will assist you to complete all required
                    forms to ensure that you are ready for due diligence.
                  </p>

                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <ClipboardList className="w-5 h-5 mr-2" />
                      Required Documents (8 Sets)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Issuer Information</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Directors Details</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Financial Reports</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Compliance Documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Project Details</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Investment Instrument</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Funding Amount & Guarantees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Investment Terms and Accounts</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Start the application process to raise funds with priority support (optional).
                  </p>

                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-full">
                    <FileText className="h-7 w-7 text-fundify-primary" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="rounded-2xl overflow-hidden shadow-large">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                    alt="Document preparation"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Onsite Due Diligence */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-slide-up">
              <div className="flex-1 order-2 md:order-1">
                <div className="rounded-2xl overflow-hidden shadow-large">
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                    alt="Site visit and due diligence"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all border-l-4 border-orange-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-soft">
                    2
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Onsite Due Diligence
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Will visit your project site to ensure that the information
                    you have submitted matches what is on the ground.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 mb-2">
                        Site Visit Purpose
                      </h4>
                      <p className="text-sm text-orange-800">
                        The physical visit ensures investors are putting their
                        money into a real business, and not a fake one that only
                        exists on paper.
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">
                        Additional Support
                      </h4>
                      <p className="text-sm text-green-800">
                        Our investment advisory partners will be available to
                        help you build a stronger business case to raise funds
                        through BantuHive if the need arises.
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-full mt-6">
                    <Building className="h-7 w-7 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Prospectus Approval */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-slide-up">
              <div className="flex-1">
                <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all border-l-4 border-purple-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-soft">
                    3
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Prospectus Approval
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Will ensure your application is duly submitted to the
                    Security and Exchange Commission, Ghana for approval and
                    filing.
                  </p>

                  <div className="bg-purple-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-purple-900 mb-3">
                      Complete Prospectus Submission
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span>Complete Issuer Information</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span>Complete Directors Details</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span>Complete Financial Report</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span>Complete Compliance Documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span>Complete Project Details</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span>Complete Investment Instrument</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span>Complete Funding Amount & Guarantees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span>Complete Investment Terms and Accounts</span>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-full">
                    <Shield className="h-7 w-7 text-purple-500" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="rounded-2xl overflow-hidden shadow-large">
                  <img
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop"
                    alt="Regulatory compliance"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Start Raising Funds */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-slide-up">
              <div className="flex-1 order-2 md:order-1">
                <div className="rounded-2xl overflow-hidden shadow-large">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
                    alt="Fundraising campaign"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all border-l-4 border-blue-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-soft">
                    4
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Start Raising Funds
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Your investment campaign will go live on www.bantuhive.com
                  </p>

                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Expert Guidance
                      </h4>
                      <p className="text-sm text-blue-800">
                        You will receive expert guidance and support throughout
                        your investment crowdfunding journey on BantuHive. Our
                        team will assist you in every step of the setup process.
                      </p>
                    </div>

                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4 className="font-semibold text-indigo-900 mb-2">
                        Investor Relations
                      </h4>
                      <p className="text-sm text-indigo-800">
                        Our fundraising consultants will help explain your
                        capital raise to retail investors. They will answer
                        questions about your business, the investment returns,
                        duration and why they should consider investing in your
                        business.
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-full mt-6">
                    <TrendingUp className="h-7 w-7 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Money In Your Bank */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-slide-up">
              <div className="flex-1">
                <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all border-l-4 border-green-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-soft">
                    5
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Money In Your Bank
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Project Funding Disbursed into your bank account.
                  </p>

                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Funding Success
                    </h4>
                    <p className="text-sm text-green-800">
                      After successfully raising the capital required, you will
                      receive your funding directly into your bank account.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                    <Banknote className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">
                        Direct Bank Transfer
                      </p>
                      <p className="text-sm text-green-700">
                        Fast and secure fund disbursement
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-full mt-6">
                    <Coins className="h-7 w-7 text-green-500" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="rounded-2xl overflow-hidden shadow-large">
                  <img
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop"
                    alt="Funding success"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Types */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Three Ways to Fund</h2>
            <p className="text-xl text-muted-foreground">
              Choose the right path for your vision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-all border border-border">
              <div className="text-5xl mb-6">💝</div>
              <h3 className="text-2xl font-bold mb-4">Donation</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Social impact projects and community initiatives focused on
                solving local problems.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  No equity given up
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Community-driven
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Transparent reporting
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-all border border-border">
              <div className="text-5xl mb-6">🎁</div>
              <h3 className="text-2xl font-bold mb-4">Rewards</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Creative projects with exclusive rewards, early access, or
                limited edition items.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Pre-order products
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Exclusive perks
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Creative support
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-all border border-border">
              <div className="text-5xl mb-6">📈</div>
              <h3 className="text-2xl font-bold mb-4">Equity</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                High-growth startups offering ownership stakes with potential
                financial returns.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Ownership stakes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Growth potential
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Due diligence
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose */}
      <div className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why BantuHive?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Fully Regulated',
                desc: 'SEC licensed with investor protections',
              },
              {
                icon: Sparkles,
                title: 'Engaging Platform',
                desc: 'Gamified experience that makes funding fun',
              },
              {
                icon: Globe,
                title: 'Diaspora-Friendly',
                desc: 'Invest from anywhere in the world',
              },
              {
                icon: TrendingUp,
                title: 'Transparent',
                desc: 'Real-time updates and tracking',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <item.icon className="h-8 w-8 text-fundify-primary" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="py-24 bg-gradient-to-br from-fundify-primary via-fundify-primary to-fundify-primary/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Raise Capital?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join the platform trusted by businesses to access funding and grow
          </p>
          <Link href="/auth/register">
            <Button
              size="lg"
              variant="secondary"
              className="shadow-large hover:scale-105 transition-transform"
            >
              Start Raising Funds
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
