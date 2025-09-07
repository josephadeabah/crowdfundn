import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  CheckCircle,
  Shield,
  Users,
  TrendingUp,
  Globe,
  Lock,
  FileCheck,
  UserCheck,
  Wallet,
  Star,
  ArrowRight,
  Target,
  Gift,
  Heart,
  Building2,
  Briefcase,
  User,
} from 'lucide-react';
import Link from 'next/link';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero div */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/investors-hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>

        <div className="relative z-10 text-center space-y-8 px-6 max-w-5xl">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              BantuHive
            </h1>
            <p className="text-2xl md:text-4xl text-white/90 font-light">
              Ghana's Premier Crowdfunding Platform
            </p>
            <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Connecting visionary entrepreneurs with global investors through
              secure, regulated crowdfunding solutions. From donation campaigns
              to equity investments, we're building Africa's financial future.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Badge
              variant="secondary"
              className="px-6 py-3 text-lg bg-bantu-green text-white"
            >
              💝 Donation Crowdfunding
            </Badge>
            <Badge
              variant="secondary"
              className="px-6 py-3 text-lg bg-trust text-white"
            >
              🎁 Reward-Based
            </Badge>
            <Badge
              variant="secondary"
              className="px-6 py-3 text-lg bg-growth text-white"
            >
              📈 Equity Investment
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              asChild
              size="lg"
              className="bg-bantu-green text-white px-8 py-6 text-lg font-semibold hover:bg-bantu-green/90 transition-colors shadow-sm hover:shadow-xl"
            >
              <Link href="/auth/register">Start Investing Today</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold border-2 hover:bg-accent transition-colors"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Types of Crowdfunding */}
      <div className="py-20 bg-gradient-to-b from-background to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Three Ways to Fund Your Vision
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              BantuHive offers comprehensive crowdfunding solutions tailored to
              different business needs and investor preferences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden group hover:shadow-strong transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-bantu-green to-bantu-green-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-bantu-green">
                  Donation Crowdfunding
                </CardTitle>
                <CardDescription className="text-base">
                  Support causes and projects without expecting financial
                  returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-bantu-green mt-0.5 flex-shrink-0" />
                    <span>
                      Perfect for charitable causes, community projects, and
                      social impact initiatives
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-bantu-green mt-0.5 flex-shrink-0" />
                    <span>
                      No financial returns expected - pure philanthropy
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-bantu-green mt-0.5 flex-shrink-0" />
                    <span>Tax-deductible donations (where applicable)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-bantu-green mt-0.5 flex-shrink-0" />
                    <span>Transparent fund allocation and impact tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-strong transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-trust to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-trust">
                  Reward-Based Crowdfunding
                </CardTitle>
                <CardDescription className="text-base">
                  Pre-order products and receive exclusive rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-trust mt-0.5 flex-shrink-0" />
                    <span>
                      Early access to innovative products and services
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-trust mt-0.5 flex-shrink-0" />
                    <span>Exclusive rewards and limited edition items</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-trust mt-0.5 flex-shrink-0" />
                    <span>
                      Support innovation while getting tangible benefits
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-trust mt-0.5 flex-shrink-0" />
                    <span>Lower risk compared to equity investment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-strong transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-growth to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-growth">
                  Equity Investment
                </CardTitle>
                <CardDescription className="text-base">
                  Own shares in promising startups and earn returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-growth mt-0.5 flex-shrink-0" />
                    <span>Actual ownership stakes in growing companies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-growth mt-0.5 flex-shrink-0" />
                    <span>Potential for significant financial returns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-growth mt-0.5 flex-shrink-0" />
                    <span>Voting rights and stakeholder benefits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-growth mt-0.5 flex-shrink-0" />
                    <span>Access to exclusive investor updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Investor Types div */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Welcome All Types of Investors
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're a first-time investor or managing institutional
              funds, BantuHive provides tailored investment opportunities for
              every investor profile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-bantu-green to-bantu-green-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-bantu-green">
                  Retail Investors
                </CardTitle>
                <CardDescription>
                  Individual investors building personal wealth
                </CardDescription>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-bantu-green mt-1 flex-shrink-0" />
                    <span>
                      <strong>Low minimum investments:</strong> Start with as
                      little as GHS 100
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-bantu-green mt-1 flex-shrink-0" />
                    <span>
                      <strong>Educational resources:</strong> Investment guides
                      and market insights
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-bantu-green mt-1 flex-shrink-0" />
                    <span>
                      <strong>Portfolio tracking:</strong> Real-time investment
                      monitoring
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-bantu-green mt-1 flex-shrink-0" />
                    <span>
                      <strong>Community access:</strong> Connect with other
                      investors
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-trust to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-trust">
                  Accredited Investors
                </CardTitle>
                <CardDescription>
                  High-net-worth individuals with verified credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-trust mt-1 flex-shrink-0" />
                    <span>
                      <strong>Premium deals:</strong> Access to exclusive
                      investment opportunities
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-trust mt-1 flex-shrink-0" />
                    <span>
                      <strong>Higher investment limits:</strong> Invest up to
                      GHS 2M per campaign
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-trust mt-1 flex-shrink-0" />
                    <span>
                      <strong>Direct founder access:</strong> Private investor
                      calls and updates
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-trust mt-1 flex-shrink-0" />
                    <span>
                      <strong>Enhanced due diligence:</strong> Detailed
                      financial reports and projections
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-growth to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-growth">
                  Institutional Investors
                </CardTitle>
                <CardDescription>
                  Funds, corporations, and large-scale investors
                </CardDescription>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-growth mt-1 flex-shrink-0" />
                    <span>
                      <strong>Bulk investment options:</strong> Invest across
                      multiple campaigns
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-growth mt-1 flex-shrink-0" />
                    <span>
                      <strong>Custom reporting:</strong> Tailored analytics and
                      performance metrics
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-growth mt-1 flex-shrink-0" />
                    <span>
                      <strong>Strategic partnerships:</strong> Co-investment
                      opportunities
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-growth mt-1 flex-shrink-0" />
                    <span>
                      <strong>White-label solutions:</strong> Branded investment
                      platforms
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-8">
              <strong>Qualification Requirements:</strong> Accredited status
              verified through income, net worth, and professional credentials.
              Institutional investors undergo additional compliance checks.
            </p>
          </div>
        </div>
      </div>

      {/* KYC & Security div */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
                Comprehensive KYC & Security
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our multi-layered verification system ensures the highest
                standards of security and compliance, protecting both investors
                and fundraisers in every transaction.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bantu-green rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Identity Verification
                    </h3>
                    <p className="text-muted-foreground">
                      Government-issued ID verification, biometric scanning, and
                      address confirmation using advanced AI technology.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-trust rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Document Authentication
                    </h3>
                    <p className="text-muted-foreground">
                      Bank statements, proof of income, and business
                      registration documents verified through secure digital
                      channels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-growth rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Risk Assessment
                    </h3>
                    <p className="text-muted-foreground">
                      Continuous monitoring and risk scoring using machine
                      learning algorithms to detect suspicious activities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Regulatory Compliance
                    </h3>
                    <p className="text-muted-foreground">
                      Full compliance with SEC Ghana regulations, anti-money
                      laundering (AML), and counter-terrorism financing (CTF)
                      laws.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/kyc-security.jpg"
                alt="KYC Security System"
                className="rounded-2xl shadow-strong w-full"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-bantu-green to-bantu-green-light rounded-2xl flex items-center justify-center">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works div */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Connecting Dreams with Capital
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              BantuHive creates a seamless bridge between visionary founders and
              passionate investors, fostering innovation and growth across
              Africa.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src="/founders-pitching.jpg"
                alt="Founders Pitching to Investors"
                className="rounded-2xl shadow-medium w-full"
              />
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-bantu-green rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Founders Apply & Get Vetted
                  </h3>
                  <p className="text-muted-foreground">
                    Entrepreneurs submit detailed business plans, undergo
                    rigorous due diligence, and receive expert guidance to
                    prepare compelling investment cases.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-trust rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Campaigns Go Live
                  </h3>
                  <p className="text-muted-foreground">
                    Approved projects launch on our platform with comprehensive
                    documentation, video pitches, financial projections, and
                    transparent funding goals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-growth rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Investors Discover & Invest
                  </h3>
                  <p className="text-muted-foreground">
                    Verified investors browse opportunities, conduct due
                    diligence, and make secure investments with full
                    transparency and legal protection.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Ongoing Partnership
                  </h3>
                  <p className="text-muted-foreground">
                    Regular updates, performance tracking, and milestone
                    celebrations keep investors engaged while founders receive
                    ongoing support and mentorship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits div */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Why Choose BantuHive?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of investment with our cutting-edge platform
              designed for African innovation and global success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-medium transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-bantu-green to-bantu-green-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-bantu-green">
                  High-Quality Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Curated investment opportunities with thorough vetting and
                  expert analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-medium transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-trust to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-trust">
                  Community Driven
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join a vibrant community of entrepreneurs, investors, and
                  industry experts.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-medium transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-growth to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-growth">Low Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Transparent pricing with competitive rates that maximize your
                  investment returns.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-medium transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-warning">
                  Global Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access to international markets and diaspora investment
                  opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/platform-interface.jpg"
                alt="BantuHive Platform Interface"
                className="rounded-2xl shadow-strong w-full"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
                Intuitive & Secure Platform
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our user-friendly platform combines powerful features with
                bank-level security, making investing accessible to everyone
                while maintaining the highest standards.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-bantu-green" />
                  <span className="text-lg">
                    Real-time portfolio tracking and analytics
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-bantu-green" />
                  <span className="text-lg">
                    Mobile-optimized interface for investing on-the-go
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-bantu-green" />
                  <span className="text-lg">
                    Automated investment options and recurring funding
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-bantu-green" />
                  <span className="text-lg">
                    Comprehensive investor education resources
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-bantu-green" />
                  <span className="text-lg">
                    24/7 customer support and expert guidance
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-bantu-green" />
                  <span className="text-lg">
                    Multi-currency support and flexible payment options
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-bantu-green hover:bg-bantu-green-dark text-white px-8 py-4 text-lg shadow-medium"
                >
                  <Link href="/info/platform-features">
                    Explore Platform Features
                  </Link>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Compliance */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Trusted & Regulated
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              BantuHive operates under strict regulatory oversight, ensuring
              investor protection and market integrity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-bantu-green to-bantu-green-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">SEC Licensed</h3>
              <p className="text-sm text-muted-foreground">
                Fully regulated by the Securities and Exchange Commission Ghana
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-trust to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Banking</h3>
              <p className="text-sm text-muted-foreground">
                Client funds protected through segregated bank accounts
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-growth to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent</h3>
              <p className="text-sm text-muted-foreground">
                Real-time reporting and comprehensive disclosure
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-warning to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Diaspora Friendly</h3>
              <p className="text-sm text-muted-foreground">
                Easy participation for Ghanaians worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA div */}
      <div className="py-20 bg-gradient-to-r from-bantu-green to-bantu-green-light">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are already building wealth and
            supporting Africa's most promising entrepreneurs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-bantu-green hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-medium"
            >
              Create Investor Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-bantu-green hover:bg-white hover:text-bantu-green px-8 py-6 text-lg font-semibold"
            >
              Schedule a Demo
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-white/80">Active Investors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">GHS 10K+</div>
              <div className="text-white/80">Funds Raised</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">15+</div>
              <div className="text-white/80">Successful Campaigns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
